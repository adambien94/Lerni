import { supabase } from "@/lib/supabase";
import type {
  GenerateNotebookSummaryResponse,
  NotebookListItemDto,
  NotebookSourceDto,
  NotebookSummaryDto,
} from "@/types/notebook";

type NotebookRow = {
  id: string;
  title: string;
  status: "draft" | "ready" | "archived";
  created_at: string;
  updated_at: string;
};

type NotebookSourceRow = {
  id: string;
  url: string;
  title: string | null;
  custom_title: string | null;
  is_selected: boolean;
  order_index: number;
  created_at: string;
};

export async function listNotebooks(): Promise<NotebookListItemDto[]> {
  const { data: notebookRows, error } = await supabase
    .from("notebooks")
    .select("id, title, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const ids = (notebookRows ?? []).map((row) => row.id);
  if (ids.length === 0) {
    return [];
  }

  const { data: sourceRows, error: sourceError } = await supabase
    .from("notebook_sources")
    .select("notebook_id")
    .in("notebook_id", ids);

  if (sourceError) {
    throw new Error(sourceError.message);
  }

  const sourceCountByNotebook = (sourceRows ?? []).reduce<
    Record<string, number>
  >((acc, row) => {
    acc[row.notebook_id] = (acc[row.notebook_id] ?? 0) + 1;
    return acc;
  }, {});

  return (notebookRows ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sourceCount: sourceCountByNotebook[row.id] ?? 0,
  }));
}

export async function createNotebook(title: string): Promise<NotebookRow> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(authError.message);
  }
  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const { data, error } = await supabase
    .from("notebooks")
    .insert({ title: title.trim(), user_id: user.id })
    .select("id, title, status, created_at, updated_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function getNotebookById(id: string): Promise<NotebookRow | null> {
  const { data, error } = await supabase
    .from("notebooks")
    .select("id, title, status, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function renameNotebook(notebookId: string, title: string) {
  const value = title.trim();
  const { error } = await supabase
    .from("notebooks")
    .update({ title: value })
    .eq("id", notebookId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteNotebook(notebookId: string) {
  const { error } = await supabase
    .from("notebooks")
    .delete()
    .eq("id", notebookId);
  if (error) {
    throw new Error(error.message);
  }
}

export async function listNotebookSources(
  notebookId: string,
): Promise<NotebookSourceDto[]> {
  const { data, error } = await supabase
    .from("notebook_sources")
    .select(
      "id, url, title, custom_title, is_selected, order_index, created_at",
    )
    .eq("notebook_id", notebookId)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data as NotebookSourceRow[]).map((row) => ({
    id: row.id,
    url: row.url,
    checked: row.is_selected,
    customTitle: row.custom_title ?? undefined,
    title: row.title ?? undefined,
  }));
}

export async function addNotebookSource(notebookId: string, url: string) {
  const { data, error } = await supabase
    .from("notebook_sources")
    .insert({
      notebook_id: notebookId,
      url: url.trim(),
      is_selected: true,
    })
    .select("id, url, title, custom_title, is_selected")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    url: data.url,
    checked: data.is_selected,
    customTitle: data.custom_title ?? undefined,
    title: data.title ?? undefined,
  } as NotebookSourceDto;
}

export async function updateNotebookSourceSelection(
  sourceId: string,
  checked: boolean,
) {
  const { error } = await supabase
    .from("notebook_sources")
    .update({ is_selected: checked })
    .eq("id", sourceId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function renameNotebookSource(
  sourceId: string,
  customTitle: string,
) {
  const value = customTitle.trim();
  const { error } = await supabase
    .from("notebook_sources")
    .update({ custom_title: value.length > 0 ? value : null })
    .eq("id", sourceId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteNotebookSource(sourceId: string) {
  const { error } = await supabase
    .from("notebook_sources")
    .delete()
    .eq("id", sourceId);
  if (error) {
    throw new Error(error.message);
  }
}

export async function getNotebookSummary(
  notebookId: string,
): Promise<NotebookSummaryDto | null> {
  const { data, error } = await supabase
    .from("notebook_summaries")
    .select("content_markdown, source_count")
    .eq("notebook_id", notebookId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    return null;
  }
  return {
    contentMarkdown: data.content_markdown as string,
    sourceCount: data.source_count as number,
  };
}

export async function generateNotebookSummary(notebookId: string): Promise<{
  summary: NotebookSummaryDto;
  failedUrls: string[];
}> {
  const { data, error } = await supabase.functions.invoke<
    GenerateNotebookSummaryResponse
  >("generate-notebook-summary", {
    body: { notebookId },
  });

  if (error) {
    throw new Error(error.message);
  }
  if (!data || data.ok !== true) {
    const msg =
      data && data.ok === false ? data.error : "Generowanie nie powiodlo sie.";
    throw new Error(msg);
  }

  return {
    summary: {
      contentMarkdown: data.contentMarkdown,
      sourceCount: data.sourceCount,
    },
    failedUrls: data.failedUrls,
  };
}
