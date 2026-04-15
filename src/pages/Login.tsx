import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

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
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10">
      <header className="space-y-2 mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {isRegisterMode ? "Rejestracja" : "Logowanie"}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {isRegisterMode
            ? "Załóż konto, aby rozpocząć pracę."
            : "Zaloguj się, aby kontynuować."}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-2">
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
    </main>
  );
}
