/**
 * Wymaga verify_jwt=false na bramie Edge (config.toml / panel Supabase), bo tokeny
 * podpisane ES256 daja 401 UNAUTHORIZED_UNSUPPORTED_TOKEN_ALGORITHM przy verify_jwt=true.
 * Uwierzytelnianie: naglowek Authorization + supabase.auth.getUser(jwt) ponizej.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GEMINI_MODEL = "gemini-2.0-flash";
const FETCH_TIMEOUT_MS = 15_000;
const MAX_RESPONSE_BYTES = 500_000;
/** Mniejsze limity = mniejsze ryzyko szybkiego wyczerpania darmowego limitu tokenow Gemini. */
const MAX_CHARS_PER_SOURCE = 45_000;
const MAX_TOTAL_INPUT_CHARS = 120_000;

type OkBody = {
  ok: true;
  contentMarkdown: string;
  sourceCount: number;
  failedUrls: string[];
};

type ErrBody = { ok: false; error: string };

/** Wszystkie odpowiedzi JSON z POST sa 200, zeby `functions.invoke` zawsze zwracal `data`. */
function jsonResponse(body: OkBody | ErrBody) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );
}

function isUrlSafeToFetch(urlStr: string): boolean {
  let u: URL;
  try {
    u = new URL(urlStr);
  } catch {
    return false;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return false;
  const host = u.hostname.toLowerCase();
  if (host === "localhost" || host === "0.0.0.0") return false;
  if (host.endsWith(".localhost")) return false;
  if (host === "127.0.0.1" || host === "::1") return false;
  if (host === "169.254.169.254" || host.startsWith("169.254.")) return false;

  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const m = host.match(ipv4);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    const c = Number(m[3]);
    const d = Number(m[4]);
    if ([a, b, c, d].some((n) => n > 255)) return false;
    if (a === 10) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
    if (a === 127) return false;
    if (a === 0) return false;
    if (a === 100 && b >= 64 && b <= 127) return false;
  }
  return true;
}

function htmlToPlainText(html: string): string {
  let s = html.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
  s = s.replace(/<[^>]+>/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

async function fetchUrlBody(url: string): Promise<{ text: string; ok: true } | { ok: false; reason: string }> {
  if (!isUrlSafeToFetch(url)) {
    return { ok: false, reason: "URL niedozwolony lub niebezpieczny." };
  }
  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "LerniNotebookBot/1.0 (+https://github.com/) Mozilla/5.0 compatible",
        Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
      },
    });
    if (!res.ok) {
      return { ok: false, reason: `HTTP ${res.status}` };
    }
    const reader = res.body?.getReader();
    if (!reader) {
      return { ok: false, reason: "Brak tresci odpowiedzi." };
    }
    const chunks: Uint8Array[] = [];
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        total += value.byteLength;
        if (total > MAX_RESPONSE_BYTES) {
          reader.cancel().catch(() => {});
          break;
        }
        chunks.push(value);
      }
    }
    const buf = new Uint8Array(
      chunks.reduce((acc, c) => acc + c.byteLength, 0),
    );
    let off = 0;
    for (const c of chunks) {
      buf.set(c, off);
      off += c.byteLength;
    }
    const ct = res.headers.get("content-type")?.toLowerCase() ?? "";
    let text: string;
    try {
      text = new TextDecoder("utf-8", { fatal: false }).decode(buf);
    } catch {
      return { ok: false, reason: "Niepoprawne kodowanie." };
    }
    if (ct.includes("text/html") || ct.includes("application/xhtml")) {
      text = htmlToPlainText(text);
    }
    if (text.length > MAX_CHARS_PER_SOURCE) {
      text = text.slice(0, MAX_CHARS_PER_SOURCE) + "\n[…obcięto…]";
    }
    return { text, ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("abort")) {
      return { ok: false, reason: "Timeout pobierania." };
    }
    return { ok: false, reason: msg };
  } finally {
    clearTimeout(tid);
  }
}

async function callGemini(
  apiKey: string,
  userPrompt: string,
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 4096,
      },
    }),
  });
  const raw = await res.text();
  if (!res.ok) {
    if (res.status === 429) {
      return {
        ok: false,
        error:
          "Limit Gemini (plan darmowy): za duzo tokenow albo za duzo zadan w krotkim czasie. Sprobuj pozniej, ogranicz liczbe zaznaczonych stron / krotsze artykuly, albo sprawdz rozliczenia i limity: https://ai.google.dev/gemini-api/docs/rate-limits",
      };
    }
    let detail = raw.slice(0, 400);
    try {
      const j = JSON.parse(raw) as { error?: { message?: string } };
      if (j.error?.message) detail = j.error.message;
    } catch {
      /* raw nie-JSON */
    }
    return { ok: false, error: `Gemini API: ${res.status} ${detail}` };
  }
  let parsed: {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
    error?: { message?: string };
  };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: "Gemini: niepoprawna odpowiedz JSON." };
  }
  if (parsed.error?.message) {
    return { ok: false, error: parsed.error.message };
  }
  const text =
    parsed.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ??
    "";
  if (!text.trim()) {
    return { ok: false, error: "Gemini zwrocil pusty tekst." };
  }
  return { ok: true, text: text.trim() };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const geminiKey = Deno.env.get("GEMINI_API_KEY");
  if (!geminiKey?.trim()) {
    return jsonResponse({
      ok: false,
      error:
        "Brak GEMINI_API_KEY (ustaw sekret: supabase secrets set GEMINI_API_KEY=...).",
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return jsonResponse({
      ok: false,
      error: "Brak konfiguracji Supabase po stronie funkcji.",
    });
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  const jwt = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!jwt) {
    return jsonResponse({ ok: false, error: "Brak autoryzacji." });
  }

  let body: { notebookId?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ ok: false, error: "Niepoprawne JSON body." });
  }

  const notebookId = body.notebookId?.trim();
  if (!notebookId || !isUuid(notebookId)) {
    return jsonResponse({ ok: false, error: "Niepoprawny notebookId." });
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
  if (userErr || !userData.user) {
    return jsonResponse({ ok: false, error: "Sesja wygasla lub jest niepoprawna." });
  }
  const userId = userData.user.id;

  const { data: notebook, error: nbErr } = await admin
    .from("notebooks")
    .select("id, user_id")
    .eq("id", notebookId)
    .maybeSingle();

  if (nbErr) {
    return jsonResponse({ ok: false, error: nbErr.message });
  }
  if (!notebook) {
    return jsonResponse({ ok: false, error: "Notatnik nie istnieje." });
  }
  if (notebook.user_id !== userId) {
    return jsonResponse({ ok: false, error: "Brak dostepu." });
  }

  const { data: sources, error: srcErr } = await admin
    .from("notebook_sources")
    .select("url")
    .eq("notebook_id", notebookId)
    .eq("is_selected", true);

  if (srcErr) {
    return jsonResponse({ ok: false, error: srcErr.message });
  }
  const urls = (sources ?? [])
    .map((r: { url: string }) => r.url?.trim())
    .filter(Boolean) as string[];
  if (urls.length === 0) {
    return jsonResponse({
      ok: false,
      error: "Zaznacz co najmniej jedno zrodlo URL.",
    });
  }

  const failedUrls: string[] = [];
  const parts: string[] = [];
  let totalChars = 0;

  for (const u of urls) {
    const fetched = await fetchUrlBody(u);
    if (!fetched.ok) {
      failedUrls.push(u);
      continue;
    }
    const block = `### Zrodlo: ${u}\n\n${fetched.text}\n\n`;
    if (totalChars + block.length > MAX_TOTAL_INPUT_CHARS) {
      parts.push(block.slice(0, MAX_TOTAL_INPUT_CHARS - totalChars));
      totalChars = MAX_TOTAL_INPUT_CHARS;
      break;
    }
    parts.push(block);
    totalChars += block.length;
  }

  if (parts.length === 0) {
    return jsonResponse({
      ok: false,
      error:
        "Nie udalo sie pobrac tresci z zadnego zrodla. Sprawdz adresy URL.",
    });
  }

  const bundle = parts.join("");
  const userPrompt =
    `Na podstawie ponizszych fragmentow stron (pobranych z podanych URL) napisz zwiezle podsumowanie po polsku w formacie Markdown.\n` +
    `- Uzyj naglowkow ## i ### tam gdzie ma to sens.\n` +
    `- Nie wymyslaj faktow spoza tresci.\n` +
    `- Jesli tresc jest niepelna, zaznacz to w podsumowaniu.\n\n` +
    `---\n\n` +
    bundle;

  const gemini = await callGemini(geminiKey, userPrompt);
  if (!gemini.ok) {
    return jsonResponse({ ok: false, error: gemini.error });
  }

  const sourceCount = urls.length - failedUrls.length;

  const { error: upErr } = await admin.from("notebook_summaries").upsert(
    {
      notebook_id: notebookId,
      content_markdown: gemini.text,
      source_count: sourceCount,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "notebook_id" },
  );

  if (upErr) {
    return jsonResponse({ ok: false, error: upErr.message });
  }

  const payload: OkBody = {
    ok: true,
    contentMarkdown: gemini.text,
    sourceCount,
    failedUrls,
  };
  return jsonResponse(payload);
});
