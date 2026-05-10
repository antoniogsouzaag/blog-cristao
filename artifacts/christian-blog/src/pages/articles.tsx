import { useState } from "react";
import { useListPosts, useListCategories } from "@workspace/api-client-react";
import { PostCard } from "@/components/post-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

export default function Articles() {
  const [searchParams] = new URLSearchParams(window.location.search);
  const initialCategoryId = searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : null;

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(initialCategoryId);

  const { data: posts, isLoading } = useListPosts({ 
    search: search || null, 
    categoryId: categoryId 
  });
  
  const { data: categories } = useListCategories();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-serif text-4xl md:text-5xl font-bold tracking-tight text-primary">Acervo de Artigos</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
          Explore nossas reflexões, devocionais e estudos bíblicos. 
          Encontre inspiração para a sua caminhada de fé.
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Buscar artigos..." 
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryId(null)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              categoryId === null 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card text-foreground hover:bg-muted border border-border'
            }`}
          >
            Todos
          </button>
          {categories?.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryId(cat.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                categoryId === cat.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card text-foreground hover:bg-muted border border-border'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-xl font-serif text-muted-foreground mb-2">Nenhum artigo encontrado.</p>
          <p className="text-sm text-muted-foreground/80">Tente ajustar seus termos de busca ou categoria.</p>
        </div>
      )}
    </div>
  );
}
