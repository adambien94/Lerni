import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

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
    <main className="mx-auto grid min-h-screen w-full max-w-xl gap-8 px-4 py-10 md:grid-cols-1 md:items-center">
      <div className="relative overflow-hidden rounded-2xl p-0 sm:p-6  text-slate-200 md:p-8">
        <div className="bg-[#141414]  border border-border shadow-lg p-6 pt-8 rounded-3xl">
          <header className="mb-6 space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {isRegisterMode ? "Register" : "Log in"}
            </h2>
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

            <div className="flex mt-6 items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={toggleAuthMode}
                className=""
                disabled={isSubmitting}
              >
                {isRegisterMode
                  ? "Already have an account?"
                  : "Create new account"}
              </Button>

              <Button type="submit" className="" disabled={isSubmitting}>
                {isSubmitting
                  ? "Please wait..."
                  : isRegisterMode
                    ? "Register"
                    : "Log In"}
              </Button>
            </div>
          </form>

          {authError && (
            <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {authError}
            </p>
          )}

          {authMessage && (
            <p className="mt-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              {authMessage}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
