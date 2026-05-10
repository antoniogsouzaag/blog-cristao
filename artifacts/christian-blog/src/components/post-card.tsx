import { Link } from "wouter";
import { Post } from "@workspace/api-client-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "./ui/badge";

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <article className={`group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover-elevate ${featured ? 'md:flex-row md:gap-8 md:p-6' : ''}`}>
      {post.imageUrl && (
        <div className={`overflow-hidden rounded-lg bg-muted ${featured ? 'md:w-1/2' : 'aspect-video'}`}>
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className={`flex flex-col justify-center ${featured ? 'md:w-1/2' : 'flex-1'}`}>
        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          {post.category && (
            <Badge variant="secondary" className="font-serif">
              {post.category.name}
            </Badge>
          )}
          <time dateTime={post.publishedAt}>
            {format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", { locale: ptBR })}
          </time>
        </div>
        <h3 className={`font-serif font-bold leading-tight text-foreground transition-colors group-hover:text-primary ${featured ? 'text-2xl md:text-3xl mb-4' : 'text-xl mb-2'}`}>
          <Link href={`/artigos/${post.id}`}>
            <span className="absolute inset-0" />
            {post.title}
          </Link>
        </h3>
        <p className="mb-4 text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">{post.authorName}</span>
          <span className="text-primary font-medium hover:underline">Ler mais &rarr;</span>
        </div>
      </div>
    </article>
  );
}
