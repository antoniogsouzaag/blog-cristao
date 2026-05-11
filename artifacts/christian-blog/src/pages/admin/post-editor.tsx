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
    query: { enabled: isEditing, queryKey: ["post", postId] } 
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
            toast({ title: "Manuscrito arquivado com as novas alterações." });
            queryClient.invalidateQueries({ queryKey: getGetPostQueryKey(postId) });
            queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getListFeaturedPostsQueryKey() });
            setLocation("/admin");
          },
          onError: () => toast({ variant: "destructive", title: "Falha ao registrar alterações." })
        }
      );
    } else {
      createPost.mutate(
        { data: values },
        {
          onSuccess: () => {
            toast({ title: "Manuscrito registrado no acervo com sucesso." });
            queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getListRecentPostsQueryKey() });
            setLocation("/admin");
          },
          onError: () => toast({ variant: "destructive", title: "Falha ao criar o manuscrito." })
        }
      );
    }
  };

  if (isEditing && isLoadingPost) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <p className="font-serif italic text-muted-foreground text-xl animate-pulse">
          Recuperando manuscrito dos arquivos...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl animate-in fade-in duration-1000">
      <div className="mb-12">
        <Link href="/admin" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors pb-1 border-b border-transparent hover:border-primary mb-8 inline-block">
          &larr; Retornar à Administração
        </Link>
        <h1 className="font-serif text-4xl md:text-6xl font-normal tracking-tight mb-2">
          {isEditing ? "Revisão de Texto" : "Novo Manuscrito"}
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Modo de Composição
        </p>
      </div>

      <div className="border border-border bg-background/50 p-8 md:p-12 relative">
        {/* Corner styling */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/20" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/20" />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            
            {/* Header info */}
            <div className="space-y-8 pb-10 border-b border-border/50">
              <div className="grid gap-8 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Título do Escrito</FormLabel>
                      <FormControl>
                        <Input placeholder="O título da sua obra..." className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-serif text-2xl" {...field} />
                      </FormControl>
                      <FormMessage className="font-mono text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Identificador (URL)</FormLabel>
                      <FormControl>
                        <Input placeholder="titulo-da-sua-obra" className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-mono text-sm" {...field} />
                      </FormControl>
                      <FormMessage className="font-mono text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Coleção Temática</FormLabel>
                      <Select 
                        onValueChange={(val) => field.onChange(parseInt(val))} 
                        value={field.value ? field.value.toString() : ""}
                        disabled={isLoadingCategories}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-transparent border-0 border-b border-border/50 rounded-none focus:ring-0 focus:border-primary px-0 font-serif text-lg h-10 shadow-none">
                            <SelectValue placeholder="Escolha um tema..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-none border-border bg-background">
                          {categories?.map(c => (
                            <SelectItem key={c.id} value={c.id.toString()} className="font-serif font-normal">{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-mono text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="authorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Assinatura</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-serif text-lg" {...field} />
                      </FormControl>
                      <FormMessage className="font-mono text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Prefácio (Exibido no Índice)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Um breve prelúdio do que trata este texto..." className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-sans font-light resize-y min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage className="font-mono text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Content Body */}
            <div className="space-y-8">
              <div className="bg-muted/10 border border-border/30 p-6 md:p-8">
                <h3 className="font-serif italic text-xl mb-6 text-foreground/80 text-center">Fundamento Bíblico</h3>
                <div className="grid gap-8 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="bibleVerse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Versículo Base</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Transcreva o versículo..." className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-serif italic text-lg resize-none h-20" {...field} />
                          </FormControl>
                          <FormMessage className="font-mono text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="bibleReference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Referência</FormLabel>
                          <FormControl>
                            <Input placeholder="Livro, Capítulo, Verso" className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-mono text-sm" {...field} />
                          </FormControl>
                          <FormMessage className="font-mono text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-end mb-4">
                      <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">O Manuscrito (Corpo Principal)</FormLabel>
                      <span className="font-mono text-[10px] text-muted-foreground/60">Suporta formatação HTML</span>
                    </div>
                    <FormControl>
                      <Textarea 
                        placeholder="Inicie sua composição aqui..." 
                        className="bg-background border border-border/50 focus-visible:ring-0 focus-visible:border-primary font-mono text-sm leading-relaxed p-6 min-h-[500px] resize-y" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="font-mono text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Extras */}
            <div className="space-y-8 pt-10 border-t border-border/50">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Ilustração Principal (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="URL da imagem (http://...)" className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-mono text-sm" {...field} />
                    </FormControl>
                    <FormMessage className="font-mono text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-4 border border-border/40 bg-muted/5 p-6 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1 border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                    </FormControl>
                    <div className="space-y-2 leading-none">
                      <FormLabel className="font-serif text-xl font-normal">Destacar Manuscrito</FormLabel>
                      <p className="font-sans font-light text-sm text-muted-foreground">
                        Permite que este texto seja a leitura principal apresentada na página inicial.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-6 pt-12">
              <Link href="/admin" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors self-center border-b border-transparent hover:border-foreground pb-1">
                Descartar Rascunho
              </Link>
              <Button 
                type="submit" 
                disabled={createPost.isPending || updatePost.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono text-[10px] uppercase tracking-widest px-8 rounded-none h-12"
              >
                {isEditing ? "Preservar Alterações" : "Selar e Publicar"}
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}
