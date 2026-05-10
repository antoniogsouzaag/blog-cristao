import { useState } from "react";
import { Link } from "wouter";
import { 
  useGetBlogStats, 
  useListPosts, 
  useDeletePost, 
  getListPostsQueryKey,
  useListCategories,
  useCreateCategory,
  getListCategoriesQueryKey
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, Trash2, Plus, FileText, Layers, MessageCircle, Star } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  const { data: stats, isLoading: isLoadingStats } = useGetBlogStats();
  const { data: posts, isLoading: isLoadingPosts } = useListPosts();
  const { data: categories, isLoading: isLoadingCategories } = useListCategories();
  
  const deletePost = useDeletePost();
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
    if (confirm("Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.")) {
      deletePost.mutate(
        { id },
        {
          onSuccess: () => {
            toast({ title: "Artigo excluído com sucesso." });
            queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
          },
          onError: () => {
            toast({ variant: "destructive", title: "Erro ao excluir artigo." });
          }
        }
      );
    }
  };

  const onSubmitCategory = (values: z.infer<typeof categorySchema>) => {
    createCategory.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({ title: "Categoria criada com sucesso!" });
          queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
          setIsCategoryDialogOpen(false);
          categoryForm.reset();
        },
        onError: () => {
          toast({ variant: "destructive", title: "Erro ao criar categoria." });
        }
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">
          Painel Administrativo
        </h1>
        <div className="flex items-center gap-3">
          <Link href="/admin/novo-artigo">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Novo Artigo
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {isLoadingStats ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
        ) : stats ? (
          <>
            <StatCard icon={<FileText />} label="Total de Artigos" value={stats.totalPosts} />
            <StatCard icon={<Layers />} label="Categorias" value={stats.totalCategories} />
            <StatCard icon={<MessageCircle />} label="Comentários" value={stats.totalComments} />
            <StatCard icon={<Star />} label="Em Destaque" value={stats.featuredCount} />
          </>
        ) : null}
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Posts List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-serif text-2xl font-bold">Artigos Publicados</h2>
          
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {isLoadingPosts ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="divide-y divide-border">
                {posts.map(post => (
                  <div key={post.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-primary/80 uppercase tracking-wider">
                          {post.category?.name || "Sem categoria"}
                        </span>
                        {post.featured && (
                          <span className="bg-secondary/20 text-secondary-foreground text-[10px] px-2 py-0.5 rounded-full font-semibold">
                            Destaque
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-bold text-foreground">
                        <Link href={`/artigos/${post.id}`} className="hover:text-primary transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Publicado em {format(new Date(post.publishedAt), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/admin/editar-artigo/${post.id}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit className="h-4 w-4" /> Editar
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                        disabled={deletePost.isPending}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground italic">
                Nenhum artigo encontrado.
              </div>
            )}
          </div>
        </div>

        {/* Categories Manager */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold">Categorias</h2>
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" /> Nova
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Categoria</DialogTitle>
                </DialogHeader>
                <Form {...categoryForm}>
                  <form onSubmit={categoryForm.handleSubmit(onSubmitCategory)} className="space-y-4 pt-4">
                    <FormField
                      control={categoryForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl><Input placeholder="Ex: Devocionais" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={categoryForm.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug (URL)</FormLabel>
                          <FormControl><Input placeholder="ex-devocionais" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={categoryForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição (Opcional)</FormLabel>
                          <FormControl><Textarea {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={createCategory.isPending}>
                      {createCategory.isPending ? "Criando..." : "Criar Categoria"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-xl border border-border bg-card p-2">
            {isLoadingCategories ? (
              <div className="space-y-2 p-2">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : categories && categories.length > 0 ? (
              <ul className="divide-y divide-border/50">
                {categories.map(category => (
                  <li key={category.id} className="flex justify-between items-center p-3">
                    <span className="font-medium text-sm">{category.name}</span>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
                      {category.postCount} posts
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-muted-foreground italic p-4">
                Nenhuma categoria criada.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center">
      <div className="text-primary mb-3 h-8 w-8 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-3xl font-serif font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
