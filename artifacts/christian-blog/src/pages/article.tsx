import { useParams } from "wouter";
import { useGetPost, useListComments, useCreateComment, getListCommentsQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { VerseBlock } from "@/components/verse-block";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";

const commentSchema = z.object({
  authorName: z.string().min(2, "Nome é muito curto"),
  authorEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  content: z.string().min(5, "O comentário deve ter pelo menos 5 caracteres"),
});

const leadSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  whatsapp: z.string().optional().or(z.literal("")),
});

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [leadSent, setLeadSent] = useState(false);
  const [leadPending, setLeadPending] = useState(false);

  const { data: post, isLoading: isLoadingPost, isError } = useGetPost(postId);
  const { data: comments, isLoading: isLoadingComments } = useListComments(postId);
  const createComment = useCreateComment();

  const commentForm = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { authorName: "", authorEmail: "", content: "" },
  });

  const leadForm = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", email: "", whatsapp: "" },
  });

  const onCommentSubmit = (values: z.infer<typeof commentSchema>) => {
    createComment.mutate(
      { data: values, postId },
      {
        onSuccess: () => {
          toast({ title: "Reflexão enviada", description: "Agradecemos por compartilhar seus pensamentos conosco." });
          commentForm.reset();
          queryClient.invalidateQueries({ queryKey: getListCommentsQueryKey(postId) });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Erro ao enviar reflexão", description: "Por favor, tente novamente mais tarde." });
        }
      }
    );
  };

  const onLeadSubmit = async (values: z.infer<typeof leadSchema>) => {
    setLeadPending(true);
    try {
      await customFetch("/api/leads", {
        method: "POST",
        body: JSON.stringify({ ...values, postId }),
      });
      setLeadSent(true);
      toast({ title: "Cadastro realizado!", description: "Você receberá nossas publicações em breve." });
    } catch {
      toast({ variant: "destructive", title: "Erro ao cadastrar", description: "Por favor, tente novamente." });
    } finally {
      setLeadPending(false);
    }
  };

  if (isError) {
    return (
      <div className="container mx-auto px-6 py-32 text-center max-w-2xl">
        <h1 className="font-serif text-5xl font-normal text-foreground mb-6">Página não encontrada</h1>
        <p className="font-sans font-light text-foreground/70 text-lg">O manuscrito que você procura pode ter sido movido ou não existe mais.</p>
      </div>
    );
  }

  if (isLoadingPost || !post) {
    return (
      <div className="container mx-auto px-6 py-20 max-w-3xl animate-pulse">
        <div className="aspect-[21/9] w-full bg-muted/20 mb-16 border border-border" />
        <div className="h-16 w-3/4 bg-muted/20 mx-auto mb-8" />
        <div className="space-y-6 mt-16">
          <div className="h-4 w-full bg-muted/20" />
          <div className="h-4 w-full bg-muted/20" />
          <div className="h-4 w-5/6 bg-muted/20" />
        </div>
      </div>
    );
  }

  return (
    <article className="pb-32 animate-in fade-in duration-1000">

      {/* Hero image — top of page */}
      {post.imageUrl && (
        <div className="w-full overflow-hidden border-b border-border" style={{ maxHeight: "520px" }}>
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover filter saturate-[0.85] contrast-[0.95]"
            style={{ maxHeight: "520px" }}
          />
        </div>
      )}

      {/* Title + excerpt */}
      <header className="container mx-auto px-6 pt-16 pb-12 max-w-4xl text-center">
        <h1 className="font-serif text-5xl md:text-7xl font-normal leading-[1.1] tracking-tight text-foreground mb-8">
          {post.title}
        </h1>
        <p className="font-sans font-light text-xl md:text-2xl text-foreground/60 mx-auto max-w-3xl leading-relaxed">
          {post.excerpt}
        </p>
      </header>

      {/* Article body */}
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="prose prose-lg dark:prose-invert max-w-none prose-p:font-sans prose-p:font-light prose-p:text-[1.1rem] prose-p:leading-[1.8] prose-p:text-foreground/80 prose-headings:font-serif prose-headings:font-normal prose-headings:text-foreground prose-a:text-primary prose-a:decoration-primary/30 prose-a:underline-offset-4 prose-blockquote:border-l-primary/30 prose-blockquote:font-serif prose-blockquote:text-foreground/70 prose-blockquote:font-light prose-blockquote:italic">
          {post.bibleVerse && post.bibleReference && (
            <VerseBlock verse={post.bibleVerse} reference={post.bibleReference} />
          )}
          <div
            className="mt-12 whitespace-pre-wrap first-letter:float-left first-letter:font-serif first-letter:text-7xl first-letter:pr-4 first-letter:pt-2 first-letter:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Meta — at the footer of the article */}
        <div className="mt-16 pt-8 border-t border-border/40 font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex flex-wrap items-center gap-4">
          {post.category && (
            <>
              <span className="text-primary/70">{post.category.name}</span>
              <span className="opacity-40">/</span>
            </>
          )}
          <time dateTime={post.publishedAt}>
            {format(new Date(post.publishedAt), "dd MMMM yyyy", { locale: ptBR })}
          </time>
          <span className="opacity-40">/</span>
          <span>Por {post.authorName}</span>
        </div>

        <div className="my-24 flex items-center justify-center">
          <div className="w-12 h-px bg-border/80" />
          <div className="w-2 h-2 rounded-full border border-border mx-4" />
          <div className="w-12 h-px bg-border/80" />
        </div>

        {/* Lead capture form */}
        <section className="mb-24 border border-border/50 bg-[#f5f0e8] dark:bg-card/60 p-8 md:p-12 relative">
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/20" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/20" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/20" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/20" />

          {leadSent ? (
            <div className="text-center py-6">
              <p className="font-serif text-2xl italic text-foreground mb-2">Que alegria ter você conosco!</p>
              <p className="font-sans font-light text-sm text-muted-foreground">
                Você receberá nossas próximas publicações por email.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">Publicações Exclusivas</span>
                <h3 className="font-serif text-2xl font-normal text-foreground">Receba novos artigos por email</h3>
              </div>
              <Form {...leadForm}>
                <form onSubmit={leadForm.handleSubmit(onLeadSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={leadForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Nome</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Seu nome"
                              className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-serif italic"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="font-mono text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={leadForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="seu@email.com"
                              className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-serif italic"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="font-mono text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={leadForm.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          WhatsApp <span className="opacity-50 normal-case">(opcional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(11) 99999-9999"
                            className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-serif italic"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="font-mono text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={leadPending}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-[10px] uppercase tracking-widest px-8 rounded-none h-11"
                  >
                    {leadPending ? "Cadastrando..." : "Quero receber"}
                  </Button>
                </form>
              </Form>
            </>
          )}
        </section>

        {/* Comments Section */}
        <section id="comments" className="max-w-2xl mx-auto">
          <div className="border-b border-border/60 pb-4 mb-12">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Anotações e Reflexões ({comments?.length || 0})
            </h2>
          </div>

          <div className="mb-16 border border-border/50 bg-background/50 p-8 md:p-12 relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/20" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/20" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/20" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/20" />

            <h3 className="font-serif italic text-2xl text-foreground mb-8">Adicionar nota à margem</h3>

            <Form {...commentForm}>
              <form onSubmit={commentForm.handleSubmit(onCommentSubmit)} className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <FormField
                    control={commentForm.control}
                    name="authorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Como deseja ser chamado?" className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-serif italic" {...field} />
                        </FormControl>
                        <FormMessage className="font-mono text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={commentForm.control}
                    name="authorEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email (Privado)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Apenas para nosso registro" className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-serif italic" {...field} />
                        </FormControl>
                        <FormMessage className="font-mono text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={commentForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Sua Reflexão</FormLabel>
                      <FormControl>
                        <Textarea placeholder="O que esta leitura despertou em seu espírito?" className="min-h-[150px] bg-transparent border border-border/50 focus-visible:ring-0 focus-visible:border-primary font-sans font-light p-4 resize-y" {...field} />
                      </FormControl>
                      <FormMessage className="font-mono text-[10px]" />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={createComment.isPending} className="bg-transparent text-foreground border border-border hover:bg-muted/50 hover:text-primary transition-colors font-mono text-xs uppercase tracking-widest px-8 rounded-none w-full md:w-auto">
                  {createComment.isPending ? "Registrando..." : "Registrar Reflexão"}
                </Button>
              </form>
            </Form>
          </div>

          {isLoadingComments ? (
            <div className="space-y-12">
              {[1, 2].map(i => (
                <div key={i} className="flex gap-6 animate-pulse">
                  <div className="flex-1 space-y-4">
                    <div className="h-4 w-32 bg-muted/20" />
                    <div className="h-20 w-full bg-muted/20" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-12">
              {comments.map(comment => (
                <div key={comment.id} className="border-b border-border/30 pb-12 last:border-0 last:pb-0">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-serif italic text-lg text-foreground">{comment.authorName}</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {format(new Date(comment.createdAt), "dd.MM.yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <p className="font-sans font-light text-foreground/80 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center font-serif italic text-muted-foreground py-12 border border-border/20">
              O silêncio preenche as margens deste texto. Seja o primeiro a deixar uma anotação.
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
