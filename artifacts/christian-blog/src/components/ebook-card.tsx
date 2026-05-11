import { Link } from "wouter";
import type { Ebook } from "@workspace/api-client-react";

interface EbookCardProps {
  ebook: Ebook;
  compact?: boolean;
}

export function EbookCard({ ebook, compact = false }: EbookCardProps) {
  const price = parseFloat(ebook.price);
  const originalPrice = ebook.originalPrice ? parseFloat(ebook.originalPrice) : null;
  const isFree = price === 0;
  const discountPct =
    originalPrice && originalPrice > price
      ? Math.round((1 - price / originalPrice) * 100)
      : null;

  return (
    <article className="group flex flex-col">
      {/* Cover */}
      <Link href={`/loja/${ebook.id}`} className="block mb-5">
        <div
          className={`relative overflow-hidden border border-border/50 bg-card shadow-sm group-hover:shadow-md transition-shadow duration-300 ${
            compact ? "aspect-[2/3] max-w-[160px]" : "aspect-[2/3] max-w-[220px]"
          }`}
        >
          {ebook.coverUrl ? (
            <img
              src={ebook.coverUrl}
              alt={ebook.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ filter: "saturate(0.85) contrast(0.95)" }}
            />
          ) : (
            <PlaceholderCover title={ebook.title} />
          )}

          {/* On sale badge */}
          {ebook.onSale && discountPct && (
            <div className="absolute top-3 left-3">
              <span className="font-mono text-[9px] uppercase tracking-widest bg-primary text-background px-2 py-1">
                -{discountPct}%
              </span>
            </div>
          )}

          {/* Free badge */}
          {isFree && (
            <div className="absolute top-3 left-3">
              <span className="font-mono text-[9px] uppercase tracking-widest bg-foreground text-background px-2 py-1">
                Gratuito
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Meta */}
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
        <span>{ebook.category}</span>
        {ebook.pageCount && (
          <>
            <span className="opacity-30">/</span>
            <span>{ebook.pageCount} pag.</span>
          </>
        )}
      </div>

      {/* Title */}
      <h3
        className={`font-serif leading-snug text-foreground group-hover:text-primary transition-colors mb-1 ${
          compact ? "text-base" : "text-xl"
        }`}
      >
        <Link href={`/loja/${ebook.id}`}>{ebook.title}</Link>
      </h3>

      {/* Author */}
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70 mb-3">
        {ebook.authorName}
      </p>

      {/* Excerpt */}
      {!compact && (
        <p className="font-sans text-sm font-light text-foreground/60 line-clamp-2 leading-relaxed mb-4">
          {ebook.excerpt}
        </p>
      )}

      {/* Price + CTA */}
      <div className="flex items-center gap-4 mt-auto">
        <div className="flex items-baseline gap-2">
          {isFree ? (
            <span className="font-mono text-sm tracking-wide text-foreground">
              Gratuito
            </span>
          ) : (
            <>
              <span className="font-mono text-base tracking-wide text-foreground">
                R$ {price.toFixed(2).replace(".", ",")}
              </span>
              {originalPrice && (
                <span className="font-mono text-[11px] text-muted-foreground line-through">
                  R$ {originalPrice.toFixed(2).replace(".", ",")}
                </span>
              )}
            </>
          )}
        </div>

        <Link
          href={`/loja/${ebook.id}`}
          className="ml-auto font-mono text-[9px] uppercase tracking-widest text-foreground border border-border px-4 py-2 hover:bg-foreground hover:text-background transition-all duration-200"
        >
          {isFree ? "Baixar" : "Adquirir"}
        </Link>
      </div>
    </article>
  );
}

function PlaceholderCover({ title }: { title: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#c8b89a] to-[#8c7355] p-6">
      <p className="font-serif text-white text-center text-sm leading-snug opacity-90">
        {title}
      </p>
    </div>
  );
}
