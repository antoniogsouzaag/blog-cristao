import { useGetEbook } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function EbookDetail() {
  const { id } = useParams<{ id: string }>();
  const ebookId = parseInt(id ?? "0", 10);
  const { data: ebook, isLoading, isError } = useGetEbook(ebookId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 md:px-12 py-20 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <Skeleton className="aspect-[2/3] w-full max-w-[320px]" />
          <div className="space-y-4">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !ebook) {
    return (
      <div className="container mx-auto px-6 md:px-12 py-20 text-center">
        <p className="font-serif text-2xl italic text-foreground/50">Ebook nao encontrado.</p>
        <Link href="/loja" className="font-mono text-xs uppercase tracking-widest text-primary mt-8 inline-block border-b border-primary pb-0.5">
          Voltar a Loja
        </Link>
      </div>
    );
  }

  const price = parseFloat(ebook.price);
  const originalPrice = ebook.originalPrice ? parseFloat(ebook.originalPrice) : null;
  const isFree = price === 0;
  const discountPct =
    originalPrice && originalPrice > price
      ? Math.round((1 - price / originalPrice) * 100)
      : null;

  return (
    <div className="animate-in fade-in duration-1000">
      {/* Breadcrumb */}
      <div className="border-b border-border/60">
        <div className="container mx-auto px-6 md:px-12 py-4">
          <nav className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <span className="opacity-40">/</span>
            <Link href="/loja" className="hover:text-primary transition-colors">Loja</Link>
            <span className="opacity-40">/</span>
            <span className="text-foreground/70 truncate max-w-[200px]">{ebook.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16 md:py-24 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-16">
          {/* Cover */}
          <div className="flex flex-col items-start gap-6">
            <div className="relative w-full max-w-[300px] aspect-[2/3] border border-border/50 overflow-hidden shadow-md bg-card">
              {ebook.coverUrl ? (
                <img
                  src={ebook.coverUrl}
                  alt={ebook.title}
                  className="w-full h-full object-cover"
                  style={{ filter: "saturate(0.85) contrast(0.95)" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#c8b89a] to-[#8c7355] p-8">
                  <p className="font-serif text-white text-center text-sm leading-snug opacity-90">{ebook.title}</p>
                </div>
              )}
              {ebook.onSale && discountPct && (
                <div className="absolute top-3 left-3">
                  <span className="font-mono text-[9px] uppercase tracking-widest bg-primary text-background px-2 py-1">
                    -{discountPct}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Mobile price + CTA (shown below cover on mobile) */}
            <div className="w-full md:hidden">
              <PriceCTA price={price} originalPrice={originalPrice} isFree={isFree} />
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-3">
              <span>{ebook.category}</span>
              {ebook.pageCount && (
                <>
                  <span className="opacity-30">/</span>
                  <span>{ebook.pageCount} paginas</span>
                </>
              )}
              {ebook.onSale && (
                <>
                  <span className="opacity-30">/</span>
                  <span className="text-primary">Promocao</span>
                </>
              )}
            </div>

            <h1 className="font-serif text-3xl md:text-5xl font-normal text-foreground leading-tight mb-3">
              {ebook.title}
            </h1>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-8">
              por {ebook.authorName}
            </p>

            <div className="w-12 h-px bg-border mb-8" />

            <p className="font-sans font-light text-foreground/70 leading-relaxed text-base mb-8">
              {ebook.description}
            </p>

            {/* Metadata table */}
            <div className="border border-border/50 divide-y divide-border/50 mb-10">
              {ebook.pageCount && (
                <MetaRow label="Paginas" value={`${ebook.pageCount} paginas`} />
              )}
              <MetaRow label="Autor" value={ebook.authorName} />
              <MetaRow label="Categoria" value={ebook.category} />
              <MetaRow label="Formato" value="PDF Digital" />
              <MetaRow label="Idioma" value="Portugues (Brasil)" />
            </div>

            {/* Desktop price + CTA */}
            <div className="hidden md:block">
              <PriceCTA price={price} originalPrice={originalPrice} isFree={isFree} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center px-4 py-3 gap-4">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground w-24 shrink-0">{label}</span>
      <span className="font-sans text-sm text-foreground/80">{value}</span>
    </div>
  );
}

function PriceCTA({
  price,
  originalPrice,
  isFree,
}: {
  price: number;
  originalPrice: number | null;
  isFree: boolean;
}) {
  return (
    <div className="flex items-center gap-6">
      <div>
        {isFree ? (
          <span className="font-mono text-2xl tracking-wide text-foreground">Gratuito</span>
        ) : (
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-2xl tracking-wide text-foreground">
              R$ {price.toFixed(2).replace(".", ",")}
            </span>
            {originalPrice && (
              <span className="font-mono text-sm text-muted-foreground line-through">
                R$ {originalPrice.toFixed(2).replace(".", ",")}
              </span>
            )}
          </div>
        )}
      </div>
      <button className="font-mono text-[10px] uppercase tracking-widest bg-foreground text-background px-8 py-3 hover:bg-primary hover:text-background transition-all duration-200">
        {isFree ? "Baixar Gratis" : "Adquirir Agora"}
      </button>
    </div>
  );
}
