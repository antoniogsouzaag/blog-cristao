import { useParams } from "wouter";
import { useGetPost, useListComments, useCreateComment, getListCommentsQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { VerseBlock } from "@/components/verse-block";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";

const commentSchema = z.object({
  authorName: z.string().min(2, "Nome é muito curto"),
  authorEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  content: z.string().min(5, "O comentário deve ter pelo menos 5 caracteres"),
});

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: post, isLoading: isLoadingPost, isError } = useGetPost(postId);
  const { data: comments, isLoading: isLoadingComments } = useListComments(postId);
  const createComment = useCreateComment();

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      authorName: "",
      authorEmail: "",
      content: "",
    },
  });

  const onSubmit = (values: z.infer<typeof commentSchema>) => {
    createComment.mutate(
      { data: values, postId },
      {
        onSuccess: () => {
          toast({
            title: "Comentário enviado!",
            description: "Agradecemos por compartilhar sua reflexão.",
          });
          form.reset();
          queryClient.invalidateQueries({ queryKey: getListCommentsQueryKey(postId) });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Erro ao enviar comentário",
            description: "Por favor, tente novamente.",
          });
        }
      }
    );
  };

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-destructive mb-4">Artigo não encontrado</h1>
        <p className="text-muted-foreground">O artigo que você procura pode ter sido movido ou excluído.</p>
      </div>
    );
  }

  if (isLoadingPost || !post) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Skeleton className="h-10 w-3/4 mx-auto mb-6" />
        <Skeleton className="h-6 w-1/2 mx-auto mb-12" />
        <Skeleton className="aspect-video w-full rounded-2xl mb-12" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  return (
    <article className="pb-20">
      <header className="container mx-auto px-4 pt-16 pb-12 max-w-4xl text-center">
        <div className="mb-6 flex items-center justify-center gap-3 text-sm text-muted-foreground">
          {post.category && (
            <Badge variant="secondary" className="font-serif text-xs">
              {post.category.name}
            </Badge>
          )}
          <span>•</span>
          <time dateTime={post.publishedAt}>
            {format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", { locale: ptBR })}
          </time>
          <span>•</span>
          <span>Por {post.authorName}</span>
        </div>
        
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-primary mb-6">
          {post.title}
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mx-auto max-w-2xl leading-relaxed">
          {post.excerpt}
        </p>
      </header>

      {post.imageUrl && (
        <div className="container mx-auto px-4 max-w-5xl mb-16">
          <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-xl">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-3xl">
        <div className="prose prose-lg dark:prose-invert prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-primary max-w-none">
          {post.bibleVerse && post.bibleReference && (
            <VerseBlock verse={post.bibleVerse} reference={post.bibleReference} />
          )}
          
          <div className="mt-8 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <hr className="my-16 border-border" />

        {/* Comments Section */}
        <section id="comments">
          <div className="mb-8 flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h2 className="font-serif text-2xl font-bold">Comentários ({comments?.length || 0})</h2>
          </div>

          <div className="mb-12 rounded-xl border border-border bg-card p-6 md:p-8">
            <h3 className="font-serif text-lg font-bold mb-6">Deixe sua reflexão</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="authorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="authorEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Opcional, não será publicado)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="seu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="O que esta leitura despertou em você?" 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={createComment.isPending} className="w-full md:w-auto">
                  {createComment.isPending ? "Enviando..." : "Publicar Comentário"}
                </Button>
              </form>
            </Form>
          </div>

          {isLoadingComments ? (
            <div className="space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-8">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-secondary-foreground font-serif font-bold text-lg">
                    {comment.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-bold font-serif">{comment.authorName}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.createdAt), "d 'de' MMM, yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground italic py-8">
              Seja o primeiro a compartilhar uma reflexão sobre este artigo.
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
