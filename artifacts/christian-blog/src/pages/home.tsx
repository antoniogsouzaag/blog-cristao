import { useListFeaturedPosts, useListRecentPosts } from "@workspace/api-client-react";
import { PostCard } from "@/components/post-card";
import { Link } from "wouter";

export default function Home() {
  const { data: featuredPosts, isLoading: isLoadingFeatured } = useListFeaturedPosts();
  const { data: recentPosts, isLoading: isLoadingRecent } = useListRecentPosts();

  const primaryFeatured = featuredPosts?.[0];
  const secondaryFeatured = featuredPosts?.slice(1, 4) || [];

  return (
    <div className="container mx-auto px-6 py-12 md:py-20 animate-in fade-in duration-1000">
      
      {/* Editorial Hero Grid */}
      <section className="mb-24">
        <div className="border-b border-border/60 pb-4 mb-12 flex justify-between items-end">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Em Destaque</h2>
          <span className="font-serif italic text-foreground/50 text-sm">Edição Atual</span>
        </div>
        
        {isLoadingFeatured ? (
          <div className="h-[600px] bg-muted/20 animate-pulse border border-border" />
        ) : primaryFeatured ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_400px] gap-12 lg:gap-16">
            <div className="lg:border-r lg:border-border/60 lg:pr-16">
              <PostCard post={primaryFeatured} featured />
            </div>
            
            {secondaryFeatured.length > 0 && (
              <div className="flex flex-col gap-0 border-t lg:border-t-0 border-border/60 pt-8 lg:pt-0">
                <h3 className="font-serif italic text-xl text-foreground mb-6">Leituras Selecionadas</h3>
                <div className="flex flex-col">
                  {secondaryFeatured.map((post) => (
                    <PostCard key={post.id} post={post} compact />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground font-serif italic">Nenhum artigo em destaque no momento.</p>
        )}
      </section>

      <div className="w-full h-px bg-border/60 mb-24" />

      {/* Recent Posts Section */}
      <section>
        <div className="border-b border-border/60 pb-4 mb-12 flex justify-between items-end">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Publicações Recentes</h2>
          <Link href="/artigos" className="font-mono text-[10px] uppercase tracking-widest text-primary border-b border-transparent hover:border-primary transition-colors">
            Ver Arquivo Completo
          </Link>
        </div>
        
        {isLoadingRecent ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-muted/20 animate-pulse border border-border" />
            ))}
          </div>
        ) : recentPosts && recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {recentPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground font-serif italic">Ainda não há publicações.</p>
        )}
      </section>
    </div>
  );
}
