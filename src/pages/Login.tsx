import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Bot, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const introListContent = `⚡️ Capture materials from different sources
⚡️ Generate short, practical summaries
⚡️ Build better learning habits every day

Start today: read less, understand more.`;
  const [typedIntroList, setTypedIntroList] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let index = 0;
    const typingInterval = window.setInterval(() => {
      index += 1;
      setTypedIntroList(introListContent.slice(0, index));

      if (index >= introListContent.length) {
        window.clearInterval(typingInterval);
      }
    }, 14);

    return () => window.clearInterval(typingInterval);
  }, [introListContent]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const toggleAuthMode = () => {
    setIsRegisterMode((prevMode) => !prevMode);
  };

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-xl gap-8 px-4 py-10 md:grid-cols-1 md:items-center">
      <aside className="relative overflow-hidden rounded-2xl p-0 sm:p-6  text-slate-200 md:p-8">
        <div className="relative mx-auto mb-8 flex w-fit items-center justify-center grayscale-50">
          <div className="relative h-28 w-28 rounded-2xl border-2 border-slate-600 bg-linear-to-br from-fuchsia-400/80 via-sky-400/80 to-emerald-400/80 p-3 shadow-lg shadow-slate-950/40">
            <div className="absolute left-1/2 top-0 h-3 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-300" />
            <div className="absolute -left-2 top-4 h-3 w-3 rounded-full bg-amber-300" />
            <div className="absolute -right-2 top-8 h-3 w-3 rounded-full bg-violet-300" />
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-950/80">
              <Bot className="h-12 w-12 text-cyan-300" />
            </div>
          </div>
          <Sparkles className="absolute -right-5 -top-3 h-6 w-6 text-fuchsia-300" />
          <Sparkles className="absolute -bottom-3 -left-5 h-5 w-5 text-emerald-300" />
        </div>

        <div className="text-sm sm:text-base max-w-none space-y-4 font-mono text-slate-200">
          <p className="font-semibold text-primary"># Welcome to Lerni</p>
          <p>Learn faster with AI-assisted notes:</p>
          <div className="relative">
            <pre className="invisible whitespace-pre-wrap leading-relaxed">
              {introListContent}
            </pre>
            <pre className="absolute inset-0 whitespace-pre-wrap leading-relaxed">
              {typedIntroList}
              {typedIntroList.length < introListContent.length && (
                <span className="animate-pulse text-cyan-200">|</span>
              )}
            </pre>
          </div>
          {/* <p>
            <code>Start today: read less, understand more.</code>
          </p> */}
        </div>
        <div className="pt-10">
          <header className="mb-6 space-y-2">
            <h2 className="flex gap-4 text-3xl font-semibold tracking-tight text-foreground">
              {isRegisterMode ? "Register" : "Log In"}
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              {isRegisterMode
                ? "Załóż konto, aby rozpocząć pracę."
                : "Zaloguj się, aby kontynuować."}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="twoj@email.com"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Hasło</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </Field>

            <Button
              type="submit"
              className="mt-3 w-full"
              onClick={() => navigate("/")}
            >
              {isRegisterMode ? "Register" : "Log In"}
            </Button>
          </form>

          <Button
            type="button"
            variant="ghost"
            className="mt-4 w-full"
            onClick={toggleAuthMode}
          >
            {isRegisterMode ? "Create new account" : "Already have an account?"}
          </Button>
        </div>
      </aside>
    </main>
  );
}
