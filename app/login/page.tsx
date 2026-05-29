"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Working...");

    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(mode === "signup" ? "Account created. Check email if confirmation is enabled." : "Signed in.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-12">
      <section className="card w-full p-8">
        <h1 className="text-2xl font-bold">Supabase Authentication</h1>
        <p className="mt-2 text-sm text-slate-600">Use email/password to access the Smart Farming dashboard.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input className="input" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button className="btn w-full" type="submit">
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <button
          type="button"
          className="mt-3 text-sm text-brand-700 underline"
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
        >
          Switch to {mode === "signin" ? "Sign Up" : "Sign In"}
        </button>

        {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
      </section>
    </main>
  );
}
