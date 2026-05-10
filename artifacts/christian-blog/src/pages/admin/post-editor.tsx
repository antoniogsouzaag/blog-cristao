import { useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { 
  useGetPost, 
  useCreatePost, 
  useUpdatePost, 
  useListCategories,
  getGetPostQueryKey,
  getListPostsQueryKey,
  getListFeaturedPostsQueryKey,
  getListRecentPostsQueryKey
} from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const postSchema = z.object({
  title: z.string().min(3, "Título obrigatório"),
  slug: z.string().min(3, "Slug obrigatório"),
  content: z.string().min(10, "Conteúdo obrigatório"),
  excerpt: z.string().min(5, "Resumo obrigatório"),
  authorName: z.string().min(2, "Autor obrigatório"),
  imageUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  bibleVerse: z.string().optional().or(z.literal("")),
  bibleReference: z.string().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  categoryId: z.coerce.number().min(1, "Categoria obrigatória"),
});

export default function AdminPostEditor() {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id && id !== "novo-artigo";
  const postId = isEditing ? Number(id) : undefined;
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: post, isLoading: isLoadingPost } = useGetPost(postId as number, { 
    query: { enabled: isEditing } 
  });
  const { data: categories, isLoading: isLoadingCategories } = useListCategories();

  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      authorName: "",
      imageUrl: "",
      bibleVerse: "",
      bibleReference: "",
      featured: false,
      categoryId: 0,
    },
  });

  const initializedForId = useRef<number | null>(null);

  useEffect(() => {
    if (isEditing && post && initializedForId.current !== post.id) {
      initializedForId.current = post.id;
      form.reset({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        authorName: post.authorName,
        imageUrl: post.imageUrl || "",
        bibleVerse: post.bibleVerse || "",
        bibleReference: post.bibleReference || "",
        featured: post.featured,
        categoryId: post.categoryId,
      });
    }
  }, [post, isEditing, form]);

  const onSubmit = (values: z.infer<typeof postSchema>) => {
    if (isEditing && postId) {
      updatePost.mutate(
        { id: postId, data: values },
        {
          onSuccess: () => {
            toast({ title: "Artigo atualizado com sucesso!" });
            queryClient.invalidateQueries({ queryKey: getGetPostQueryKey(postId) });
            queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getListFeaturedPostsQueryKey() });
            setLocation("/admin");
          },
          onError: () => toast({ variant: "destructive", title: "Erro ao atualizar." })
        }
      );
    } else {
      createPost.mutate(
        { data: values },
        {
          onSuccess: () => {
            toast({ title: "Artigo criado com sucesso!" });
            queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getListRecentPostsQueryKey() });
            setLocation("/admin");
          },
          onError: () => toast({ variant: "destructive", title: "Erro ao criar." })
        }
      );
    }
  };

  if (isEditing && isLoadingPost) {
    return <div className="p-12 text-center">Carregando dados do artigo...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar para o Painel
      </Link>
      
      <h1 className="font-serif text-3xl font-bold mb-8">
        {isEditing ? "Editar Artigo" : "Novo Artigo"}
      </h1>

      <div className="bg-card border border-border rounded-xl p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl><Input placeholder="O poder da graça" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (URL)</FormLabel>
                    <FormControl><Input placeholder="o-poder-da-graca" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select 
                      onValueChange={(val) => field.onChange(parseInt(val))} 
                      value={field.value ? field.value.toString() : ""}
                      disabled={isLoadingCategories}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map(c => (
                          <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Autor</FormLabel>
                    <FormControl><Input placeholder="Seu nome" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumo (aparece nos cards)</FormLabel>
                  <FormControl><Textarea placeholder="Um breve resumo do artigo..." className="h-20" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 border border-border rounded-lg p-4 bg-muted/30">
              <h3 className="font-medium text-sm">Destaque Bíblico (Opcional)</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="bibleVerse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Versículo</FormLabel>
                      <FormControl><Textarea placeholder="No princípio criou Deus..." className="h-20" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bibleReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referência</FormLabel>
                      <FormControl><Input placeholder="Gênesis 1:1" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo Completo (Suporta HTML)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Escreva seu artigo aqui..." className="min-h-[300px] font-mono text-sm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem de Capa (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="/images/sua-imagem.png ou https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Destacar Artigo</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Este artigo aparecerá na seção de destaques da página inicial.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4 border-t border-border">
              <Link href="/admin">
                <Button variant="outline" type="button">Cancelar</Button>
              </Link>
              <Button type="submit" disabled={createPost.isPending || updatePost.isPending}>
                {isEditing ? "Salvar Alterações" : "Publicar Artigo"}
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}
