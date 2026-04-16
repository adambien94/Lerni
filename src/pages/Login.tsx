import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const toggleAuthMode = () => {
    setIsRegisterMode((prevMode) => !prevMode);
  };

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-xl gap-8 px-4 py-10 md:grid-cols-1 md:items-center">
      <div className="relative overflow-hidden rounded-2xl p-0 sm:p-6  text-slate-200 md:p-8">
        {/* <div className="text-sm sm:text-base max-w-none space-y-4 font-mono text-slate-200">
          <p className="font-semibold text-primary"># Welcome to Lerni</p>
          <p>Learn faster with AI-assisted notes:</p>
          <div className="relative">
            <pre className="invisible whitespace-pre-wrap">
              {introListContent}
            </pre>
            <pre className="absolute inset-0 whitespace-pre-wrap">
              {typedIntroList}
              {typedIntroList.length < introListContent.length && (
                <span className="animate-pulse text-cyan-200">|</span>
              )}
            </pre>
          </div>
        </div> */}
        <div className="pt-10 ">
          <header className="mb-6 space-y-2 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
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

            <div className="w-full mt-6">
              <Button
                type="submit"
                onClick={() => navigate("/")}
                className="w-full"
              >
                {isRegisterMode ? "Register" : "Log In"}
              </Button>
            </div>
          </form>

          <div className="mt-4 w-full">
            <Button
              type="button"
              variant="ghost"
              onClick={toggleAuthMode}
              className="w-full"
            >
              {isRegisterMode
                ? "Create new account"
                : "Already have an account?"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
