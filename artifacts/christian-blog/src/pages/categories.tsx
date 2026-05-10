import { useListCategories } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { BookMarked } from "lucide-react";

export default function Categories() {
  const { data: categories, isLoading } = useListCategories();

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-primary mb-6">
          Nossas Categorias
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore nossos temas e encontre reflexões, estudos e devocionais que 
          falam ao seu coração no seu momento atual de fé.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {categories.map(category => (
            <Link 
              key={category.id} 
              href={`/artigos?categoryId=${category.id}`}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-1"
            >
              <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <BookMarked className="h-6 w-6" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {category.name}
                  </h2>
                  <span className="rounded-full bg-secondary/20 px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                    {category.postCount || 0} {category.postCount === 1 ? 'artigo' : 'artigos'}
                  </span>
                </div>
                {category.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-xl border border-dashed border-border">
          <p className="text-muted-foreground italic">Ainda não há categorias cadastradas.</p>
        </div>
      )}
    </div>
  );
}
