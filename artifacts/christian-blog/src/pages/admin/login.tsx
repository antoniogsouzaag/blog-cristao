import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLogin() {
  const { session, loading } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate("/admin");
  }, [session, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email ou senha inválidos.");
      setPending(false);
    } else {
      navigate("/admin");
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 animate-in fade-in duration-700">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-3">Área Restrita</span>
          <h1 className="font-serif text-4xl font-normal text-foreground">Acesso Administrativo</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 border border-border/50 p-8 relative bg-background/50">
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/20" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/20" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/20" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/20" />

          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-serif italic text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-serif text-lg"
            />
          </div>

          {error && (
            <p className="font-mono text-[10px] text-destructive uppercase tracking-widest">{error}</p>
          )}

          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-[10px] uppercase tracking-widest rounded-none h-11"
          >
            {pending ? "Verificando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
