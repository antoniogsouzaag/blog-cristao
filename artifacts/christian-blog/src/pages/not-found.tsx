import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="container mx-auto px-6 py-40 text-center max-w-3xl animate-in fade-in duration-1000 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="mb-12 relative">
        <h1 className="font-serif text-8xl md:text-[10rem] font-normal text-foreground/5 tracking-tighter leading-none select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-px h-32 bg-primary/30" />
        </div>
      </div>
      
      <h2 className="font-serif text-4xl md:text-5xl font-normal text-foreground mb-8">
        A página encontra-se em branco
      </h2>
      
      <p className="font-sans font-light text-lg md:text-xl text-foreground/60 mb-12 max-w-xl mx-auto leading-relaxed">
        O manuscrito que você procura parece ter sido recolhido aos arquivos ou talvez nunca tenha sido escrito. 
      </p>

      <blockquote className="font-serif italic text-xl text-foreground/50 border-none mb-16 max-w-md mx-auto">
        "Os teus caminhos são no mar, as tuas veredas nas muitas águas, e os teus rastros não são conhecidos."
        <footer className="font-mono text-[10px] uppercase tracking-widest mt-4 text-primary/60 not-italic">Salmos 77:19</footer>
      </blockquote>
      
      <Link href="/" className="font-mono text-xs uppercase tracking-widest text-primary border-b border-primary/30 hover:border-primary pb-1 transition-colors">
        Retornar à Primeira Página
      </Link>
    </div>
  );
}
