import React from "react";
import { Link } from "wouter";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans text-foreground bg-background selection:bg-primary/20 selection:text-primary relative">
      {/* Noise Overlay */}
      <div className="bg-noise mix-blend-multiply dark:mix-blend-screen" />
      
      <header className="border-b border-border relative z-40 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between py-6 md:py-8 gap-6 border-b border-border/50">
            <div className="text-center md:text-left">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Publicação Literária Diária</span>
              <Link href="/" className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-foreground hover:text-primary transition-colors block">
                Blog Cristão.
              </Link>
            </div>
            
            <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">Início</Link>
              <Link href="/artigos" className="hover:text-primary transition-colors">Artigos</Link>
              <Link href="/categorias" className="hover:text-primary transition-colors">Categorias</Link>
              <Link href="/loja" className="hover:text-primary transition-colors">Loja</Link>
              <Link href="/sobre" className="hover:text-primary transition-colors">Sobre</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10 w-full animate-in fade-in duration-1000">
        {children}
      </main>

      <footer className="border-t border-border mt-32 py-16 bg-background relative z-10">
        <div className="container mx-auto px-6 max-w-4xl text-center flex flex-col items-center">
          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          </div>
          <p className="font-serif text-2xl md:text-3xl italic mb-6 text-foreground/80 leading-relaxed font-light">
            "Lâmpada para os meus pés é tua palavra,<br/>e luz para o meu caminho."
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-16">
            Salmos 119:105
          </p>
          
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-12" />
          
          <div className="flex flex-col md:flex-row justify-between w-full font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
            <span>&copy; {new Date().getFullYear()} Blog Cristão</span>
            <span className="mt-4 md:mt-0">Todos os direitos reservados</span>
          </div>
        </div>
      </footer>

      {/* Fixed watermark cross */}
      <div className="fixed bottom-5 right-7 z-50 pointer-events-none select-none">
        <svg width="52" height="68" viewBox="0 0 52 68" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground/20">
          <rect x="21" y="0" width="10" height="68" fill="currentColor" />
          <rect x="0" y="18" width="52" height="10" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
