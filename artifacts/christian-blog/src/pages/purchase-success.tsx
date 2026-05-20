import { useListEbooks, useListFeaturedPosts } from "@workspace/api-client-react";
import { Link } from "wouter";
import { EbookCard } from "@/components/ebook-card";
import { PostCard } from "@/components/post-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PurchaseSuccess() {
  const { data: ebooks, isLoading: isLoadingEbooks } = useListEbooks({ featured: true });
  const { data: posts, isLoading: isLoadingPosts } = useListFeaturedPosts();

  const otherEbooks = ebooks?.slice(0, 3) ?? [];
  const featuredPosts = posts?.slice(0, 3) ?? [];

  return (
    <div className="animate-in fade-in duration-1000">
      {/* Success hero */}
      <section className="border-b border-border/60 bg-[#f5f0e8] dark:bg-card">
        <div className="container mx-auto px-6 md:px-12 py-20 md:py-28 text-center max-w-2xl">
          <div className="w-12 h-px bg-primary mx-auto mb-10" />

          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary block mb-6">
            Compra Confirmada
          </span>

          <h1 className="font-serif text-4xl md:text-6xl font-normal text-foreground leading-tight mb-6">
            Obrigado pela sua compra!
          </h1>

          <p className="font-sans font-light text-foreground/60 text-lg leading-relaxed mb-10">
            Que este material seja uma bencao em sua jornada de fe. Em breve voce
            recebera o acesso ao seu pedido pelo e-mail cadastrado.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/loja"
              className="font-mono text-[10px] uppercase tracking-widest bg-foreground text-background px-8 py-3 hover:bg-primary transition-all duration-200"
            >
              Voltar a Loja
            </Link>
            <Link
              href="/"
              className="font-mono text-[10px] uppercase tracking-widest text-foreground border border-border px-8 py-3 hover:bg-foreground hover:text-background transition-all duration-300"
            >
              Ir para o Blog
            </Link>
          </div>

          <div className="w-12 h-px bg-border mx-auto mt-10" />
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-12 py-16 md:py-24 space-y-20">
        {/* More products */}
        {(isLoadingEbooks || otherEbooks.length > 0) && (
          <section>
            <div className="border-b border-border/60 pb-5 mb-10">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                Acervo Fonte Viva
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground">
                Voce tambem pode gostar
              </h2>
            </div>

            {isLoadingEbooks ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-14">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[2/3] w-full max-w-[220px]" />
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-14">
                {otherEbooks.map((ebook) => (
                  <EbookCard key={ebook.id} ebook={ebook} />
                ))}
              </div>
            )}

            <div className="mt-12 text-center">
              <Link
                href="/loja"
                className="font-mono text-[10px] uppercase tracking-widest text-foreground border border-border px-8 py-3 hover:bg-foreground hover:text-background transition-all duration-300"
              >
                Ver Todos os Titulos
              </Link>
            </div>
          </section>
        )}

        {/* Featured posts */}
        {(isLoadingPosts || featuredPosts.length > 0) && (
          <section>
            <div className="border-b border-border/60 pb-5 mb-10">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">
                Leitura Gratuita
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground">
                Artigos em Destaque
              </h2>
            </div>

            {isLoadingPosts ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-14">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-14">
                {featuredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            <div className="mt-12 text-center">
              <Link
                href="/artigos"
                className="font-mono text-[10px] uppercase tracking-widest text-foreground border border-border px-8 py-3 hover:bg-foreground hover:text-background transition-all duration-300"
              >
                Ver Todos os Artigos
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* Bottom verse */}
      <section className="border-t border-border/60 bg-background">
        <div className="container mx-auto px-6 md:px-12 py-16 text-center">
          <div className="w-6 h-px bg-border mx-auto mb-8" />
          <p className="font-serif text-xl md:text-2xl italic text-foreground/60 leading-relaxed font-light max-w-xl mx-auto">
            "Bem-aventurado o homem que acha sabedoria, e o homem que adquire
            conhecimento."
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-6">
            Proverbios 3:13
          </p>
        </div>
      </section>
    </div>
  );
}
