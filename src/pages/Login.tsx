import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Bot, NotebookIcon, Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const toggleAuthMode = () => {
    setIsRegisterMode((prevMode) => !prevMode);
  };

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 md:items-center">
      <section className="mx-auto w-full max-w-md">
        <header className="mb-8 space-y-2">
          <h1 className="flex gap-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            <NotebookIcon className="h-10 w-10" />
            Lerni
          </h1>
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

          <Button type="submit" className="mt-4 w-full">
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
      </section>

      <aside className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-200 shadow-xl md:p-8">
        <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-fuchsia-500/25 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-cyan-500/25 blur-2xl" />

        <div className="relative mx-auto mb-8 flex w-fit items-center justify-center">
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

        <div className="prose prose-invert prose-sm max-w-none text-slate-200 prose-headings:text-white prose-strong:text-white prose-code:text-cyan-200 prose-blockquote:border-fuchsia-400/50 prose-blockquote:text-slate-300">
          <h2># Welcome to Lerni</h2>
          <p>
            Learn faster with AI-assisted notes, compact summaries, and a studio
            that helps you stay focused on understanding.
          </p>
          <blockquote>
            One place for your sources, summaries, and study workflow.
          </blockquote>
          <ul>
            <li>Capture materials from different sources</li>
            <li>Generate short, practical summaries</li>
            <li>Build better learning habits every day</li>
          </ul>
          <p>
            <code>Start today: read less, understand more.</code>
          </p>
        </div>
      </aside>
    </main>
  );
}
