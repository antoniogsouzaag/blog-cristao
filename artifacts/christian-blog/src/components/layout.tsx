import React from "react";
import { Link } from "wouter";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans text-foreground bg-background selection:bg-primary selection:text-primary-foreground">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-primary hover:text-primary/90 transition-colors">
            Blog Cristão
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Início</Link>
            <Link href="/artigos" className="text-sm font-medium hover:text-primary transition-colors">Artigos</Link>
            <Link href="/categorias" className="text-sm font-medium hover:text-primary transition-colors">Categorias</Link>
            <Link href="/sobre" className="text-sm font-medium hover:text-primary transition-colors">Sobre</Link>
            <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Admin</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border mt-24 py-12 bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="font-serif text-xl italic mb-4 text-foreground/80">"Lâmpada para os meus pés é tua palavra, e luz para o meu caminho."</p>
          <p className="text-sm">Salmos 119:105</p>
          <div className="mt-12 text-sm opacity-60">
            &copy; {new Date().getFullYear()} Blog Cristão. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
