import { useListFeaturedPosts, useListRecentPosts } from "@workspace/api-client-react";
import { PostCard } from "@/components/post-card";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featuredPosts, isLoading: isLoadingFeatured } = useListFeaturedPosts();
  const { data: recentPosts, isLoading: isLoadingRecent } = useListRecentPosts();

  const primaryFeatured = featuredPosts?.[0];
  const secondaryFeatured = featuredPosts?.slice(1, 4) || [];

  return (
    <div className="animate-in fade-in duration-1000">

      {/* Hero Banner Section */}
      <section className="relative w-full overflow-hidden" style={{ height: "70vh", minHeight: "480px", maxHeight: "700px" }}>
        <img
          src="/images/hero-banner.png"
          alt="Blog Cristão"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "saturate(0.7) brightness(0.55)" }}
        />
        {/* Gradient overlay bottom */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(10,8,6,0.85) 100%)" }} />

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col justify-end px-8 md:px-16 pb-14">
          {isLoadingFeatured ? (
            <div className="space-y-4 max-w-2xl">
              <Skeleton className="h-4 w-36 bg-white/20" />
              <Skeleton className="h-14 w-full bg-white/20" />
              <Skeleton className="h-4 w-2/3 bg-white/20" />
            </div>
          ) : primaryFeatured ? (
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                {primaryFeatured.category && (
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/60 border border-white/20 px-2 py-1">
                    {primaryFeatured.category.name}
                  </span>
                )}
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
                  Em Destaque
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-6xl font-normal text-white leading-tight mb-4 drop-shadow-lg">
                {primaryFeatured.title}
              </h2>
              <p className="font-sans font-light text-white/70 text-lg mb-8 max-w-xl leading-relaxed line-clamp-2">
                {primaryFeatured.excerpt}
              </p>
              <Link
                href={`/artigos/${primaryFeatured.id}`}
                className="inline-block font-mono text-[10px] uppercase tracking-widest text-white border border-white/40 px-6 py-3 hover:bg-white hover:text-foreground transition-all duration-300"
                data-testid="link-hero-featured"
              >
                Ler artigo completo
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      {/* Secondary Featured — below the banner */}
      {secondaryFeatured.length > 0 && (
        <section className="border-b border-border/60">
          <div className="container mx-auto px-6 md:px-12 py-0">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60">
              {secondaryFeatured.map((post) => (
                <article key={post.id} className="group relative py-8 md:py-10 md:px-8 first:pl-0 last:pr-0">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                    {post.category && (
                      <span className="text-primary/80">{post.category.name}</span>
                    )}
                    <span className="opacity-40">/</span>
                    <span>{new Date(post.publishedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </div>
                  {post.imageUrl && (
                    <div className="aspect-[3/2] w-full overflow-hidden mb-4 border border-border/50">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ filter: "saturate(0.8) contrast(0.92)" }}
                      />
                    </div>
                  )}
                  <h3 className="font-serif text-xl leading-snug text-foreground group-hover:text-primary transition-colors mb-2">
                    <Link href={`/artigos/${post.id}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="font-sans text-sm font-light text-foreground/60 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts Section */}
      <section className="container mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="border-b border-border/60 pb-4 mb-12 flex justify-between items-end">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Publicações Recentes</h2>
          <Link
            href="/artigos"
            className="font-mono text-[10px] uppercase tracking-widest text-primary border-b border-transparent hover:border-primary transition-colors"
            data-testid="link-ver-arquivo"
          >
            Ver Arquivo Completo
          </Link>
        </div>

        {isLoadingRecent ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] w-full" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : recentPosts && recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
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
