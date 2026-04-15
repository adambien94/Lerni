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
      <Card>
        <CardHeader>
          <CardTitle>{isRegisterMode ? "Rejestracja" : "Logowanie"}</CardTitle>
          <CardDescription>
            {isRegisterMode
              ? "Załóż konto, aby rozpocząć pracę."
              : "Zaloguj się, aby kontynuować."}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {isRegisterMode ? "Zarejestruj się" : "Zaloguj się"}
            </Button>
          </form>

          <Button
            type="button"
            variant="ghost"
            className="mt-2 w-full"
            onClick={toggleAuthMode}
          >
            zarejestruj się
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
