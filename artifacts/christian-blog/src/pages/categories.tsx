import { useListCategories } from "@workspace/api-client-react";
import { Link } from "wouter";

export default function Categories() {
  const { data: categories, isLoading } = useListCategories();

  return (
    <div className="container mx-auto px-6 py-16 md:py-24 max-w-5xl animate-in fade-in duration-1000">
      <div className="text-center mb-24 max-w-3xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-tight text-foreground mb-8">
          Índice Temático
        </h1>
        <p className="font-sans font-light text-foreground/70 md:text-xl leading-relaxed">
          Explore nossos escritos organizados por grandes temas espirituais. 
          Encontre reflexões, estudos e devocionais que falem ao seu momento atual.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-12 sm:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 border border-border bg-muted/10 animate-pulse" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2 relative">
          {/* Subtle connecting lines behind the grid */}
          <div className="absolute inset-0 pointer-events-none hidden sm:block">
            <div className="w-px h-full bg-border/30 absolute left-1/2 -translate-x-1/2" />
          </div>

          {categories.map((category, index) => (
            <Link 
              key={category.id} 
              href={`/artigos?categoryId=${category.id}`}
              className="group block border-t border-border/50 pt-8 transition-all hover:border-primary"
            >
              <div className="mb-4 flex items-baseline justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">Capítulo {String(index + 1).padStart(2, '0')}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary/50 group-hover:text-primary transition-colors">
                  {category.postCount || 0} {category.postCount === 1 ? 'Manuscrito' : 'Manuscritos'}
                </span>
              </div>
              
              <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-4 group-hover:text-primary transition-colors">
                {category.name}
              </h2>
              
              {category.description ? (
                <p className="font-sans font-light text-foreground/60 leading-relaxed line-clamp-3 mb-6">
                  {category.description}
                </p>
              ) : (
                <div className="h-4 mb-6" /> // spacer
              )}
              
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-4">
                <span className="w-8 h-px bg-current" />
                Explorar Coleção
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-border/30 bg-muted/5">
          <p className="font-serif text-2xl text-foreground/50 italic">O índice encontra-se vazio no momento.</p>
        </div>
      )}
    </div>
  );
}
