import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

function LoginHeroPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex min-h-[220px] flex-col justify-end overflow-hidden bg-linear-to-br  from-zinc-400/30 to-zinc-800/50 p-8 text-foreground lg:min-h-0 lg:justify-center lg:items-center lg:p-12 xl:p-14",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
      >
        <div className="absolute left-16 top-3/4 h-94 w-94 rounded-full bg-zinc-400/20 blur-3xl" />
        <div className="absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -left-16 bottom-3/4 h-56 w-56 rounded-full bg-emerald-500/40 blur-3xl" />
      </div>

      <div className="relative z-1 mt-0 max-w-md space-y-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl xl:leading-tight">
          Notatniki, źródła i nauka w jednym spójnym miejscu.
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          Zbieraj materiały, porządkuj je w notatnikach i wracaj do nich, gdy
          uczysz się na serio — spokojny, ciemny interfejs bez rozpraszaczy.
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);
    setAuthMessage(null);
    setIsSubmitting(true);

    if (isRegisterMode) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setAuthError(error.message);
        setIsSubmitting(false);
        return;
      }

      setAuthMessage("Account created. You are now logged in.");
      setIsSubmitting(false);
      navigate("/");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setAuthError(error.message);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    navigate("/");
  };

  const toggleAuthMode = () => {
    setIsRegisterMode((prevMode) => !prevMode);
    setAuthError(null);
    setAuthMessage(null);
  };

  return (
    <div className="min-h-dvh w-full bg-background text-foreground lg:grid lg:grid-cols-2">
      <div className="flex min-h-dvh flex-col lg:min-h-0">
        <main className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-8 lg:px-12 xl:px-16">
          <div className="mx-auto w-full max-w-md">
            <header className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight">
                {isRegisterMode ? "Register" : "Log In"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isRegisterMode
                  ? "Register for an account."
                  : "Enter your login details."}
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="twoj@email.com"
                  required
                  autoComplete="email"
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
                  autoComplete={
                    isRegisterMode ? "new-password" : "current-password"
                  }
                />
              </Field>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={toggleAuthMode}
                  disabled={isSubmitting}
                >
                  {isRegisterMode
                    ? "Already have an account?"
                    : "Are you new here?"}
                </Button>

                <Button type="submit" disabled={isSubmitting} variant="outline">
                  {isSubmitting
                    ? "Proszę czekać…"
                    : isRegisterMode
                      ? "Zarejestruj"
                      : "Zaloguj"}
                </Button>
              </div>
            </form>

            {authError && (
              <p className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">
                {authError}
              </p>
            )}

            {authMessage && (
              <p className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                {authMessage}
              </p>
            )}
          </div>
        </main>
      </div>

      <LoginHeroPanel className="hidden lg:flex" />
    </div>
  );
}
