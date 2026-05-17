import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import {
  useGetBlogStats,
  useListPosts,
  useDeletePost,
  getListPostsQueryKey,
  useListCategories,
  useCreateCategory,
  getListCategoriesQueryKey,
  useListEbooks,
  useDeleteEbook,
  getListEbooksQueryKey,
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const categorySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  slug: z.string().min(2, "Slug deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
});

export default function Admin() {
  const { signOut } = useAuth();
  const { data: stats, isLoading: isLoadingStats } = useGetBlogStats();
  const { data: posts, isLoading: isLoadingPosts } = useListPosts();
  const { data: categories, isLoading: isLoadingCategories } = useListCategories();
  const { data: ebooks, isLoading: isLoadingEbooks } = useListEbooks({});

  const deletePost = useDeletePost();
  const deleteEbook = useDeleteEbook();
  const createCategory = useCreateCategory();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  const categoryForm = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  const handleDeletePost = (id: number) => {
    if (confirm("Tem certeza que deseja arquivar este manuscrito? Esta ação é irreversível.")) {
      deletePost.mutate(
        { id },
        {
          onSuccess: () => {
            toast({ title: "Manuscrito removido do arquivo." });
            queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
          },
          onError: () => {
            toast({ variant: "destructive", title: "Erro ao processar remoção." });
          }
        }
      );
    }
  };

  const handleDeleteEbook = (id: number) => {
    if (confirm("Tem certeza que deseja remover este ebook? Esta ação é irreversível.")) {
      deleteEbook.mutate(
        { id },
        {
          onSuccess: () => {
            toast({ title: "Ebook removido do acervo." });
            queryClient.invalidateQueries({ queryKey: getListEbooksQueryKey() });
          },
          onError: () => {
            toast({ variant: "destructive", title: "Erro ao remover ebook." });
          },
        }
      );
    }
  };

  const onSubmitCategory = (values: z.infer<typeof categorySchema>) => {
    createCategory.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({ title: "Nova coleção criada com sucesso." });
          queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
          setIsCategoryDialogOpen(false);
          categoryForm.reset();
        },
        onError: () => {
          toast({ variant: "destructive", title: "Erro ao criar coleção." });
        }
      }
    );
  };

  return (
    <div className="container mx-auto px-6 py-16 max-w-6xl animate-in fade-in duration-1000">
      <div className="border-b border-border pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-foreground mb-2">
            Administração do Acervo
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Gestão de publicações e coleções</p>
        </div>
        
        <div className="flex items-center gap-6">
          <button
            onClick={() => signOut()}
            className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors pb-1 border-b border-transparent hover:border-destructive"
          >
            Sair
          </button>
          <Link href="/admin/novo-artigo">
            <Button className="bg-transparent text-foreground border border-border hover:bg-primary/5 hover:text-primary hover:border-primary transition-colors font-mono text-[10px] uppercase tracking-widest px-6 rounded-none w-full md:w-auto h-12">
              Escrever Novo Artigo
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Desk */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mb-16 border border-border">
        {isLoadingStats ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="h-32 bg-background animate-pulse" />)
        ) : stats ? (
          <>
            <StatCard label="Artigos" value={stats.totalPosts} />
            <StatCard label="Coleções" value={stats.totalCategories} />
            <StatCard label="Anotações" value={stats.totalComments} />
            <StatCard label="Em Destaque" value={stats.featuredCount} />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-16">
        {/* Posts Archive */}
        <div>
          <div className="border-b border-border pb-4 mb-8 flex justify-between items-end">
            <h2 className="font-serif italic text-2xl text-foreground">Registro de Manuscritos</h2>
          </div>
          
          <div className="border-t border-border">
            {isLoadingPosts ? (
              <div className="space-y-4 py-4">
                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted/10 animate-pulse border-b border-border/50" />)}
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="divide-y divide-border/50">
                {posts.map(post => (
                  <div key={post.id} className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:bg-muted/5 transition-colors -mx-4 px-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-primary/70">
                          {post.category?.name || "Sem coleção"}
                        </span>
                        {post.featured && (
                          <span className="font-mono text-[9px] uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 border border-primary/20">
                            Em Destaque
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-xl text-foreground mb-2">
                        {post.title}
                      </h3>
                      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                        Data de Registro: {format(new Date(post.publishedAt), "dd.MM.yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0 font-mono text-[10px] uppercase tracking-widest">
                      <Link href={`/admin/editar-artigo/${post.id}`} className="text-foreground hover:text-primary transition-colors pb-1 border-b border-transparent hover:border-primary">
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        disabled={deletePost.isPending}
                        className="text-muted-foreground hover:text-destructive transition-colors pb-1 border-b border-transparent hover:border-destructive"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="font-serif italic text-muted-foreground">O arquivo está vazio no momento.</p>
              </div>
            )}
          </div>
        </div>

        {/* Categories Manager */}
        <div>
          <div className="border-b border-border pb-4 mb-8 flex justify-between items-end">
            <h2 className="font-serif italic text-2xl text-foreground">Coleções</h2>
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <button className="font-mono text-[10px] uppercase tracking-widest text-primary pb-1 border-b border-transparent hover:border-primary transition-colors">
                  Nova Coleção
                </button>
              </DialogTrigger>
              <DialogContent className="rounded-none border-border bg-background p-8 max-w-md">
                <DialogHeader className="mb-6">
                  <DialogTitle className="font-serif text-2xl font-normal">Criar Nova Coleção</DialogTitle>
                </DialogHeader>
                <Form {...categoryForm}>
                  <form onSubmit={categoryForm.handleSubmit(onSubmitCategory)} className="space-y-6">
                    <FormField
                      control={categoryForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Nome da Coleção</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Devocionais" className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-serif text-lg" {...field} />
                          </FormControl>
                          <FormMessage className="font-mono text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={categoryForm.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Identificador (URL)</FormLabel>
                          <FormControl>
                            <Input placeholder="ex-devocionais" className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-mono text-sm" {...field} />
                          </FormControl>
                          <FormMessage className="font-mono text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={categoryForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Breve Descrição</FormLabel>
                          <FormControl>
                            <Textarea className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-sans font-light resize-y" {...field} />
                          </FormControl>
                          <FormMessage className="font-mono text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-transparent text-foreground border border-border hover:bg-muted/50 hover:text-primary transition-colors font-mono text-xs uppercase tracking-widest rounded-none h-12 mt-4" disabled={createCategory.isPending}>
                      {createCategory.isPending ? "Registrando..." : "Registrar Coleção"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border border-border p-6 bg-background">
            {isLoadingCategories ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-muted/10 animate-pulse border-b border-border/50" />)}
              </div>
            ) : categories && categories.length > 0 ? (
              <ul className="divide-y divide-border/50">
                {categories.map(category => (
                  <li key={category.id} className="flex justify-between items-baseline py-4 first:pt-0 last:pb-0">
                    <span className="font-serif text-lg text-foreground">{category.name}</span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {category.postCount} {category.postCount === 1 ? 'item' : 'itens'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center font-serif italic text-muted-foreground py-6">
                O arquivo de coleções está vazio.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Ebooks Section */}
      <div className="mt-20">
        <div className="border-b border-border pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl font-normal tracking-tight text-foreground mb-2">
              Acervo de Ebooks
            </h2>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Gestão de publicações digitais</p>
          </div>
          <Link href="/admin/ebook-editor">
            <Button className="bg-transparent text-foreground border border-border hover:bg-primary/5 hover:text-primary hover:border-primary transition-colors font-mono text-[10px] uppercase tracking-widest px-6 rounded-none w-full md:w-auto h-12">
              + Novo Ebook
            </Button>
          </Link>
        </div>

        <div className="border-t border-border">
          {isLoadingEbooks ? (
            <div className="space-y-4 py-4">
              {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted/10 animate-pulse border-b border-border/50" />)}
            </div>
          ) : ebooks && ebooks.length > 0 ? (
            <div className="divide-y divide-border/50">
              {ebooks.map(ebook => (
                <div key={ebook.id} className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:bg-muted/5 transition-colors -mx-4 px-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-primary/70">
                        {ebook.category}
                      </span>
                      {ebook.featured && (
                        <span className="font-mono text-[9px] uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 border border-primary/20">
                          Em Destaque
                        </span>
                      )}
                      {ebook.onSale && (
                        <span className="font-mono text-[9px] uppercase tracking-widest bg-amber-500/10 text-amber-600 px-2 py-0.5 border border-amber-500/20">
                          Promoção
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl text-foreground mb-2">
                      {ebook.title}
                    </h3>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                      R$ {ebook.price ?? "0"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono text-[10px] uppercase tracking-widest">
                    <Link href={`/admin/editar-ebook/${ebook.id}`} className="text-foreground hover:text-primary transition-colors pb-1 border-b border-transparent hover:border-primary">
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeleteEbook(ebook.id)}
                      disabled={deleteEbook.isPending}
                      className="text-muted-foreground hover:text-destructive transition-colors pb-1 border-b border-transparent hover:border-destructive"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="font-serif italic text-muted-foreground">O acervo de ebooks está vazio no momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: number }) {
  return (
    <div className="bg-background p-6 md:p-8 flex flex-col items-center justify-center text-center">
      <p className="text-4xl md:text-5xl font-serif text-foreground mb-3 font-normal">{value}</p>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
