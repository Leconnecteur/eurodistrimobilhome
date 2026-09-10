"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Loader2, Lock } from "lucide-react";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";
import { useAuth } from "@/lib/firebase/auth-context";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace("/admin");
  }, [authLoading, user, router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!isFirebaseConfigured) {
      setError(
        "Firebase n'est pas encore configuré. Renseignez les variables NEXT_PUBLIC_FIREBASE_* pour activer la connexion."
      );
      return;
    }

    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      router.replace("/admin");
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-anthracite px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-anthracite text-brand-gold-light">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="font-heading text-xl font-bold text-brand-anthracite">
            Euro Distri Mobilhome
          </h1>
          <p className="text-sm text-muted-foreground">Espace administrateur</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Connexion impossible</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-1.5">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <Label htmlFor="password" className="mb-1.5">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-anthracite text-white hover:bg-brand-anthracite/90"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
