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
              <span>•</span>
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
    <article className={`group relative flex flex-col ${featured ? 'md:flex-row md:gap-12 md:items-center' : 'gap-6'} transition-all`}>
      {post.imageUrl && (
        <div className={`overflow-hidden border border-border ${featured ? 'md:w-1/2 aspect-[4/3]' : 'aspect-[4/3] w-full'}`}>
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter saturate-[0.85] contrast-[0.9]"
          />
        </div>
      )}
      <div className={`flex flex-col justify-center ${featured ? 'md:w-1/2' : 'flex-1'} ${!post.imageUrl && 'border-t border-border pt-6'}`}>
        <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-3">
          {post.category && (
            <span className="text-primary border-b border-primary/20 pb-0.5">{post.category.name}</span>
          )}
          <span className="opacity-50">/</span>
          <time dateTime={post.publishedAt}>
            {format(new Date(post.publishedAt), "dd MMMM yyyy", { locale: ptBR })}
          </time>
          {post.authorName && (
            <>
              <span className="opacity-50">/</span>
              <span>{post.authorName}</span>
            </>
          )}
        </div>
        
        <h3 className={`font-serif leading-tight text-foreground transition-colors group-hover:text-primary ${featured ? 'text-3xl md:text-5xl mb-6 font-normal' : 'text-2xl mb-4 font-normal'}`}>
          <Link href={`/artigos/${post.id}`}>
            <span className="absolute inset-0" />
            {post.title}
          </Link>
        </h3>
        
        <p className={`font-sans font-light text-foreground/70 ${featured ? 'text-lg line-clamp-4 leading-relaxed' : 'text-sm line-clamp-3 leading-relaxed'} mb-6`}>
          {post.excerpt}
        </p>
        
        <div className="mt-auto">
          <span className="font-mono text-[10px] uppercase tracking-widest text-primary border-b border-primary/20 pb-1 group-hover:border-primary transition-colors">
            Ler artigo completo
          </span>
        </div>
      </div>
    </article>
  );
}
