import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import {
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
    defaultValues: { name: "", slug: "", description: "" },
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
          },
        }
      );
    }
  };

  const handleDeleteEbook = (id: number) => {
    if (confirm("Tem certeza que deseja remover este ebook? Esta ação é irreversível.")) {
      deleteEbook.mutate(
        { ebookId: id },
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
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-6 py-16 max-w-6xl animate-in fade-in duration-1000">

      {/* Header */}
      <div className="border-b border-border pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-foreground mb-2">
            Administração do Acervo
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Gestão de publicações e coleções
          </p>
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
              + Novo Artigo
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">

        {/* Posts List */}
        <section>
          <div className="border-b border-border pb-4 mb-6 flex justify-between items-baseline">
            <h2 className="font-serif italic text-2xl text-foreground">Artigos</h2>
            {!isLoadingPosts && posts && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {posts.length} {posts.length === 1 ? "publicação" : "publicações"}
              </span>
            )}
          </div>

          {isLoadingPosts ? (
            <div className="space-y-px">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-muted/10 animate-pulse border-b border-border/30" />
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <ul className="divide-y divide-border/40">
              {posts.map(post => (
                <li key={post.id} className="py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 group hover:bg-muted/5 transition-colors -mx-3 px-3 rounded">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {post.category && (
                        <span className="font-mono text-[9px] uppercase tracking-widest text-primary/70">
                          {post.category.name}
                        </span>
                      )}
                      {post.featured && (
                        <span className="font-mono text-[8px] uppercase tracking-widest bg-primary/10 text-primary px-1.5 py-0.5 border border-primary/20">
                          Destaque
                        </span>
                      )}
                      <span className="font-mono text-[9px] text-muted-foreground/60 ml-auto sm:ml-0">
                        {format(new Date(post.publishedAt), "dd MMM yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg leading-snug text-foreground truncate">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 font-mono text-[10px] uppercase tracking-widest pt-1">
                    <Link
                      href={`/artigos/${post.id}`}
                      className="text-muted-foreground/60 hover:text-foreground transition-colors"
                      target="_blank"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/admin/editar-artigo/${post.id}`}
                      className="text-foreground hover:text-primary transition-colors pb-0.5 border-b border-transparent hover:border-primary"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deletePost.isPending}
                      className="text-muted-foreground hover:text-destructive transition-colors pb-0.5 border-b border-transparent hover:border-destructive disabled:opacity-40"
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-16 text-center border border-border/40 border-dashed">
              <p className="font-serif italic text-muted-foreground text-sm">O arquivo está vazio no momento.</p>
            </div>
          )}
        </section>

        {/* Sidebar: Categories */}
        <aside>
          <div className="border-b border-border pb-4 mb-6 flex justify-between items-baseline">
            <h2 className="font-serif italic text-2xl text-foreground">Coleções</h2>
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <button className="font-mono text-[10px] uppercase tracking-widest text-primary pb-0.5 border-b border-transparent hover:border-primary transition-colors">
                  + Nova
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
                          <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Nome</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Devocionais"
                              className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-2 font-serif text-lg"
                              {...field}
                            />
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
                            <Input
                              placeholder="ex-devocionais"
                              className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-2 font-mono text-sm"
                              {...field}
                            />
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
                          <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Descrição</FormLabel>
                          <FormControl>
                            <Textarea
                              className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-2 font-sans font-light resize-y"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="font-mono text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-transparent text-foreground border border-border hover:bg-muted/50 hover:text-primary transition-colors font-mono text-xs uppercase tracking-widest rounded-none h-12 mt-4"
                      disabled={createCategory.isPending}
                    >
                      {createCategory.isPending ? "Registrando..." : "Registrar Coleção"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoadingCategories ? (
            <div className="space-y-px">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-muted/10 animate-pulse border-b border-border/30" />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <ul className="divide-y divide-border/40">
              {categories.map(category => (
                <li key={category.id} className="py-3.5 flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <p className="font-serif text-base text-foreground leading-tight truncate">{category.name}</p>
                    <p className="font-mono text-[9px] text-muted-foreground/50 mt-0.5">{category.slug}</p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground shrink-0 tabular-nums">
                    {category.postCount} {category.postCount === 1 ? "item" : "itens"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-10 text-center border border-border/40 border-dashed">
              <p className="font-serif italic text-muted-foreground text-sm">Nenhuma coleção criada.</p>
            </div>
          )}
        </aside>
      </div>

      {/* Ebooks Section */}
      <section className="mt-20 pt-12 border-t border-border">
        <div className="pb-6 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-normal tracking-tight text-foreground mb-1">
              Ebooks
            </h2>
            {!isLoadingEbooks && ebooks && (
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {ebooks.length} {ebooks.length === 1 ? "título no acervo" : "títulos no acervo"}
              </p>
            )}
          </div>
          <Link href="/admin/ebook-editor">
            <Button className="bg-transparent text-foreground border border-border hover:bg-primary/5 hover:text-primary hover:border-primary transition-colors font-mono text-[10px] uppercase tracking-widest px-6 rounded-none w-full md:w-auto h-12">
              + Novo Ebook
            </Button>
          </Link>
        </div>

        {isLoadingEbooks ? (
          <div className="space-y-px">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-muted/10 animate-pulse border-b border-border/30" />
            ))}
          </div>
        ) : ebooks && ebooks.length > 0 ? (
          <ul className="divide-y divide-border/40 border-t border-border">
            {ebooks.map(ebook => (
              <li key={ebook.id} className="py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 group hover:bg-muted/5 transition-colors -mx-3 px-3 rounded">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {ebook.category && (
                      <span className="font-mono text-[9px] uppercase tracking-widest text-primary/70">
                        {ebook.category}
                      </span>
                    )}
                    {ebook.featured && (
                      <span className="font-mono text-[8px] uppercase tracking-widest bg-primary/10 text-primary px-1.5 py-0.5 border border-primary/20">
                        Destaque
                      </span>
                    )}
                    {ebook.onSale && (
                      <span className="font-mono text-[8px] uppercase tracking-widest bg-amber-500/10 text-amber-600 px-1.5 py-0.5 border border-amber-500/20">
                        Promoção
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg leading-snug text-foreground truncate mb-1">
                    {ebook.title}
                  </h3>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    R$ {ebook.price ?? "0,00"}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0 font-mono text-[10px] uppercase tracking-widest pt-1">
                  <Link
                    href={`/loja/${ebook.id}`}
                    className="text-muted-foreground/60 hover:text-foreground transition-colors"
                    target="_blank"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/admin/editar-ebook/${ebook.id}`}
                    className="text-foreground hover:text-primary transition-colors pb-0.5 border-b border-transparent hover:border-primary"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDeleteEbook(ebook.id)}
                    disabled={deleteEbook.isPending}
                    className="text-muted-foreground hover:text-destructive transition-colors pb-0.5 border-b border-transparent hover:border-destructive disabled:opacity-40"
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-16 text-center border border-border/40 border-dashed">
            <p className="font-serif italic text-muted-foreground text-sm">O acervo de ebooks está vazio no momento.</p>
          </div>
        )}
      </section>
    </div>
  );
}
