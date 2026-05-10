import { Link } from "wouter";
import { Post } from "@workspace/api-client-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function PostCard({ post, featured = false, compact = false }: { post: Post; featured?: boolean; compact?: boolean }) {
  if (compact) {
    return (
      <article className="group py-4 border-b border-border/50 last:border-0 relative">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
          {post.category && (
            <>
              <span className="text-primary/70">{post.category.name}</span>
              <span className="opacity-40">•</span>
            </>
          )}
          <time dateTime={post.publishedAt}>
            {format(new Date(post.publishedAt), "dd.MM.yyyy", { locale: ptBR })}
          </time>
        </div>
        <h3 className="font-serif text-lg leading-snug text-foreground group-hover:text-primary transition-colors">
          <Link href={`/artigos/${post.id}`}>
            <span className="absolute inset-0" />
            {post.title}
          </Link>
        </h3>
      </article>
    );
  }

  return (
    <article className="group relative flex flex-col gap-0 transition-all" data-testid={`card-post-${post.id}`}>
      {/* Image */}
      <div className="aspect-[4/3] w-full overflow-hidden border border-border/60 mb-5 bg-muted/20">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ filter: "saturate(0.82) contrast(0.92)" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/30">
            <span className="font-serif text-4xl text-muted-foreground/30 italic">†</span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-3 flex-wrap">
        {post.category && (
          <span className="text-primary/80 border-b border-primary/20 pb-0.5">{post.category.name}</span>
        )}
        <span className="opacity-40">/</span>
        <time dateTime={post.publishedAt}>
          {format(new Date(post.publishedAt), "dd MMM yyyy", { locale: ptBR })}
        </time>
        {post.authorName && (
          <>
            <span className="opacity-40">/</span>
            <span className="opacity-70">{post.authorName}</span>
          </>
        )}
      </div>

      {/* Title */}
      <h3 className={`font-serif leading-tight text-foreground transition-colors group-hover:text-primary mb-3 font-normal ${featured ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
        <Link href={`/artigos/${post.id}`}>
          <span className="absolute inset-0" />
          {post.title}
        </Link>
      </h3>

      {/* Excerpt */}
      <p className="font-sans font-light text-foreground/65 text-sm line-clamp-3 leading-relaxed mb-4">
        {post.excerpt}
      </p>

      {/* Read link */}
      <div className="mt-auto">
        <span className="font-mono text-[10px] uppercase tracking-widest text-primary border-b border-primary/25 pb-1 group-hover:border-primary transition-colors">
          Ler artigo completo
        </span>
      </div>
    </article>
  );
}
