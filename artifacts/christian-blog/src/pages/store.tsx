import { useListEbooks } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { EbookCard } from "@/components/ebook-card";

export default function Store() {
  const { data: allEbooks, isLoading } = useListEbooks({});

  const featured = allEbooks?.filter((e) => e.featured) ?? [];
  const onSale = allEbooks?.filter((e) => e.onSale && !e.featured) ?? [];
  const rest = allEbooks?.filter((e) => !e.featured && !e.onSale) ?? [];

  return (
    <div className="animate-in fade-in duration-1000">
      {/* Page header */}
      <div className="border-b border-border/60 bg-background">
        <div className="container mx-auto px-6 md:px-12 py-16 md:py-20">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-4">
            Recursos Cristãos
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-normal text-foreground mb-4 leading-tight">
            Loja de Ebooks
          </h1>
          <p className="font-sans font-light text-foreground/60 text-lg max-w-xl leading-relaxed">
            Obras selecionadas para edificar sua fé, aprofundar seu estudo
            bíblico e fortalecer sua vida em Cristo.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16 md:py-24 space-y-20">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Featured ebooks */}
            {featured.length > 0 && (
              <section>
                <SectionHeader label="Destaques da Loja" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
                  {featured.map((ebook) => (
                    <EbookCard key={ebook.id} ebook={ebook} />
                  ))}
                </div>
              </section>
            )}

            {/* On sale */}
            {onSale.length > 0 && (
              <section>
                <SectionHeader label="Promocoes Especiais" badge="Oferta" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
                  {onSale.map((ebook) => (
                    <EbookCard key={ebook.id} ebook={ebook} />
                  ))}
                </div>
              </section>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <section>
                <SectionHeader label="Todos os Titulos" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
                  {rest.map((ebook) => (
                    <EbookCard key={ebook.id} ebook={ebook} />
                  ))}
                </div>
              </section>
            )}

            {allEbooks?.length === 0 && (
              <p className="font-serif italic text-foreground/50 text-center py-20">
                Nenhum ebook disponivel no momento.
              </p>
            )}
          </>
        )}
      </div>

      {/* Bottom CTA */}
      <section className="border-t border-border/60 bg-[#f5f0e8] dark:bg-card">
        <div className="container mx-auto px-6 md:px-12 py-16 text-center">
          <div className="w-6 h-px bg-border mx-auto mb-8" />
          <p className="font-serif text-2xl md:text-3xl italic text-foreground/70 mb-6 leading-relaxed font-light">
            "Toda a Escritura e divinamente inspirada e util<br className="hidden md:block" />
            para o ensino, a repreensao, a correcao e a instrucao na justica."
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-10">
            2 Timoteo 3:16
          </p>
          <Link
            href="/artigos"
            className="font-mono text-[10px] uppercase tracking-widest text-foreground border border-border px-8 py-3 hover:bg-foreground hover:text-background transition-all duration-300"
          >
            Ler Artigos Gratuitos
          </Link>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ label, badge }: { label: string; badge?: string }) {
  return (
    <div className="border-b border-border/60 pb-4 mb-10 flex items-end gap-4">
      <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </h2>
      {badge && (
        <span className="font-mono text-[9px] uppercase tracking-widest text-background bg-primary px-2 py-0.5">
          {badge}
        </span>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-[2/3] w-full max-w-[240px]" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
