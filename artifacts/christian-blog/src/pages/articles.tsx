import { useState } from "react";
import { useListPosts, useListCategories } from "@workspace/api-client-react";
import { PostCard } from "@/components/post-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLocation } from "wouter";

export default function Articles() {
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategoryId = searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : null;

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(initialCategoryId);

  const { data: posts, isLoading } = useListPosts({ 
    search: search || undefined, 
    categoryId: categoryId ?? undefined,
  });
  
  const { data: categories } = useListCategories();

  return (
    <div className="container mx-auto px-6 py-12 md:py-20 max-w-6xl animate-in fade-in duration-1000">
      <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-tight text-foreground mb-8">
          Acervo Literário
        </h1>
        <p className="font-sans font-light text-foreground/70 md:text-xl leading-relaxed">
          Explore nossas reflexões, devocionais e estudos bíblicos. 
          Encontre inspiração para a sua caminhada de fé através da palavra escrita.
        </p>
      </div>

      <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between border-b border-border/60 pb-8">
        <div className="w-full md:w-1/3">
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-3">Pesquisar</label>
          <div className="relative">
            <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Buscar por título ou conteúdo..." 
              className="pl-8 bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 text-foreground placeholder:text-muted-foreground/50 font-serif italic text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col w-full md:w-2/3 md:items-end">
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-3">Tópicos</label>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <button
              onClick={() => setCategoryId(null)}
              className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2 border transition-all ${
                categoryId === null 
                  ? 'border-primary text-primary bg-primary/5' 
                  : 'border-border/50 text-muted-foreground hover:border-primary/30'
              }`}
            >
              Todos
            </button>
            {categories?.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2 border transition-all ${
                  categoryId === cat.id 
                    ? 'border-primary text-primary bg-primary/5' 
                    : 'border-border/50 text-muted-foreground hover:border-primary/30'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/3] w-full bg-muted/20 animate-pulse border border-border" />
              <div className="h-4 w-1/4 bg-muted/20 animate-pulse mt-4" />
              <div className="h-8 w-3/4 bg-muted/20 animate-pulse" />
              <div className="h-4 w-full bg-muted/20 animate-pulse" />
              <div className="h-4 w-5/6 bg-muted/20 animate-pulse" />
            </div>
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center border border-border/30 bg-muted/5">
          <p className="font-serif text-2xl text-foreground/50 italic mb-4">Nenhum artigo encontrado.</p>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Tente ajustar seus termos de busca ou categoria.</p>
        </div>
      )}
    </div>
  );
}
