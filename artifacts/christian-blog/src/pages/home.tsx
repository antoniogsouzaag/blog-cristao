import { useListFeaturedPosts, useListRecentPosts, useListCategories } from "@workspace/api-client-react";
import { PostCard } from "@/components/post-card";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featuredPosts, isLoading: isLoadingFeatured } = useListFeaturedPosts();
  const { data: recentPosts, isLoading: isLoadingRecent } = useListRecentPosts();
  const { data: categories, isLoading: isLoadingCategories } = useListCategories();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-16">
      
      {/* Featured Section */}
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-3xl font-bold tracking-tight">Destaques</h2>
        </div>
        
        {isLoadingFeatured ? (
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        ) : featuredPosts && featuredPosts.length > 0 ? (
          <div className="grid gap-6">
            <PostCard post={featuredPosts[0]} featured />
            {featuredPosts.length > 1 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredPosts.slice(1).map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground italic">Nenhum artigo em destaque no momento.</p>
        )}
      </section>

      <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
        {/* Recent Posts Section */}
        <section>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif text-3xl font-bold tracking-tight">Últimos Artigos</h2>
            <Link href="/artigos" className="text-sm font-medium text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          
          {isLoadingRecent ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video w-full rounded-xl" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          ) : recentPosts && recentPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {recentPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">Ainda não há publicações.</p>
          )}
        </section>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-serif text-xl font-bold">Sobre o Blog</h3>
            <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
              Um espaço acolhedor e reverente onde a fé encontra a narrativa. 
              Criado para cristãos brasileiros que buscam aprofundar sua fé através 
              de artigos, devocionais e reflexões bíblicas.
            </p>
            <Link href="/sobre" className="text-sm font-medium text-primary hover:underline">
              Conheça nossa história
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-serif text-xl font-bold">Categorias</h3>
            {isLoadingCategories ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : categories && categories.length > 0 ? (
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.id}>
                    <Link 
                      href={`/artigos?categoryId=${category.id}`}
                      className="flex items-center justify-between rounded-lg p-2 text-sm transition-colors hover:bg-muted hover:text-primary"
                    >
                      <span className="font-medium">{category.name}</span>
                      <span className="rounded-full bg-secondary/20 px-2 py-0.5 text-xs text-secondary-foreground font-semibold">
                        {category.postCount || 0}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">Nenhuma categoria encontrada.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
