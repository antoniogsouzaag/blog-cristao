import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import {
  useGetEbook,
  useCreateEbook,
  useUpdateEbook,
  getListEbooksQueryKey,
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

const CATEGORY_OPTIONS = [
  { value: "geral", label: "Geral" },
  { value: "devocional", label: "Devocional" },
  { value: "oracao", label: "Oração" },
  { value: "familia", label: "Família" },
  { value: "estudo-biblico", label: "Estudo Bíblico" },
  { value: "lideranca", label: "Liderança" },
  { value: "evangelismo", label: "Evangelismo" },
];

const ebookSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  description: z.string().min(10, "Descrição obrigatória"),
  excerpt: z.string().min(5, "Resumo obrigatório"),
  authorName: z.string().min(2, "Autor obrigatório"),
  coverUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  price: z.string().default("0"),
  originalPrice: z.string().optional().or(z.literal("")),
  fileUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  category: z.string().min(1, "Categoria obrigatória"),
  featured: z.boolean().default(false),
  onSale: z.boolean().default(false),
  pageCount: z.coerce.number().optional(),
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function AdminEbookEditor() {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const ebookId = isEditing ? Number(id) : undefined;

  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ebook, isLoading: isLoadingEbook } = useGetEbook(ebookId as number, {
    query: { enabled: isEditing, queryKey: ["ebook", ebookId] },
  });

  const createEbook = useCreateEbook();
  const updateEbook = useUpdateEbook();

  const form = useForm<z.infer<typeof ebookSchema>>({
    resolver: zodResolver(ebookSchema),
    defaultValues: {
      title: "",
      description: "",
      excerpt: "",
      authorName: "",
      coverUrl: "",
      price: "0",
      originalPrice: "",
      fileUrl: "",
      category: "",
      featured: false,
      onSale: false,
      pageCount: undefined,
    },
  });

  useEffect(() => {
    if (isEditing && ebook) {
      form.reset({
        title: ebook.title,
        description: ebook.description,
        excerpt: ebook.excerpt,
        authorName: ebook.authorName,
        coverUrl: ebook.coverUrl || "",
        price: ebook.price ?? "0",
        originalPrice: ebook.originalPrice || "",
        fileUrl: ebook.fileUrl || "",
        category: ebook.category,
        featured: ebook.featured ?? false,
        onSale: ebook.onSale ?? false,
        pageCount: ebook.pageCount ?? undefined,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ebook?.id]);

  const onSubmit = (values: z.infer<typeof ebookSchema>) => {
    const slug = generateSlug(values.title);

    if (isEditing && ebookId) {
      updateEbook.mutate(
        { ebookId: ebookId, data: { ...values, slug: ebook?.slug ?? slug } },
        {
          onSuccess: () => {
            toast({ title: "Ebook atualizado com sucesso." });
            queryClient.invalidateQueries({ queryKey: getListEbooksQueryKey() });
            setLocation("/admin");
          },
          onError: () => toast({ variant: "destructive", title: "Falha ao atualizar o ebook." }),
        }
      );
    } else {
      createEbook.mutate(
        { data: { ...values, slug } },
        {
          onSuccess: () => {
            toast({ title: "Ebook registrado no acervo com sucesso." });
            queryClient.invalidateQueries({ queryKey: getListEbooksQueryKey() });
            setLocation("/admin");
          },
          onError: () => toast({ variant: "destructive", title: "Falha ao criar o ebook." }),
        }
      );
    }
  };

  if (isEditing && (isLoadingEbook || !ebook)) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <p className="font-serif italic text-muted-foreground text-xl animate-pulse">
          Recuperando ebook do acervo...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl animate-in fade-in duration-1000">
      <div className="mb-12">
        <Link
          href="/admin"
          className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors pb-1 border-b border-transparent hover:border-primary mb-8 inline-block"
        >
          &larr; Retornar à Administração
        </Link>
        <h1 className="font-serif text-4xl md:text-6xl font-normal tracking-tight mb-2">
          {isEditing ? "Editar Ebook" : "Novo Ebook"}
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Acervo Digital
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
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Título do Ebook</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="O título da obra..."
                        className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-2 font-serif text-2xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-mono text-[10px]" />
                  </FormItem>
                )}
              />

              <div className="grid gap-8 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Categoria</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-transparent border-0 border-b border-border/50 rounded-none focus:ring-0 focus:border-primary px-2 font-serif text-lg h-10 shadow-none">
                            <SelectValue placeholder="Escolha uma categoria..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-none border-border bg-background">
                          {CATEGORY_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="font-serif font-normal">
                              {opt.label}
                            </SelectItem>
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
                      <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Autor</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nome do autor"
                          className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-2 font-serif text-lg"
                          {...field}
                        />
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
                    <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Resumo (Exibido na Listagem)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Um breve resumo do que trata este ebook..."
                        className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-2 font-sans font-light resize-y min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-mono text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Pricing */}
            <div className="space-y-8 pb-10 border-b border-border/50">
              <h3 className="font-serif italic text-xl text-foreground/80">Precificação</h3>
              <div className="grid gap-8 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Preço (R$)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='0 ou "19.90"'
                          className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-2 font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="font-mono text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Preço Original (Opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='"34.90"'
                          className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-2 font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="font-mono text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pageCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Número de Páginas</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 120"
                          className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-2 font-mono text-sm"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.value)}
                        />
                      </FormControl>
                      <FormMessage className="font-mono text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-8 pb-10 border-b border-border/50">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-end mb-4">
                      <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Descrição Completa</FormLabel>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição detalhada do conteúdo do ebook..."
                        className="bg-background border border-border/50 focus-visible:ring-0 focus-visible:border-primary font-sans font-light text-sm leading-relaxed p-6 min-h-[200px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-mono text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* URLs */}
            <div className="space-y-8 pb-10 border-b border-border/50">
              <h3 className="font-serif italic text-xl text-foreground/80">Mídia e Arquivos</h3>

              <FormField
                control={form.control}
                name="coverUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">URL da Capa (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-2 font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-mono text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">URL de Download (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-2 font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-mono text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Options */}
            <div className="space-y-6 pt-2">
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
                      <FormLabel className="font-serif text-xl font-normal">Destacar Ebook</FormLabel>
                      <p className="font-sans font-light text-sm text-muted-foreground">
                        Exibe este ebook em posição de destaque na loja.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="onSale"
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
                      <FormLabel className="font-serif text-xl font-normal">Em Promoção</FormLabel>
                      <p className="font-sans font-light text-sm text-muted-foreground">
                        Marca o ebook como em promoção, exibindo o preço original riscado.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-6 pt-12">
              <Link
                href="/admin"
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors self-center border-b border-transparent hover:border-foreground pb-1"
              >
                Cancelar
              </Link>
              <Button
                type="submit"
                disabled={createEbook.isPending || updateEbook.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono text-[10px] uppercase tracking-widest px-8 rounded-none h-12"
              >
                {isEditing ? "Preservar Alterações" : "Publicar Ebook"}
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}
