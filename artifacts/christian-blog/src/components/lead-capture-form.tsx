import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { customFetch } from "@workspace/api-client-react";

const leadSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  whatsapp: z.string().optional().or(z.literal("")),
});

export function LeadCaptureForm({ postId }: { postId?: number }) {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", email: "", whatsapp: "" },
  });

  const onSubmit = async (values: z.infer<typeof leadSchema>) => {
    setPending(true);
    try {
      await customFetch("/api/leads", {
        method: "POST",
        body: JSON.stringify({ ...values, ...(postId ? { postId } : {}) }),
      });
      setSent(true);
      toast({ title: "Cadastro realizado!", description: "Você receberá nossas publicações em breve." });
    } catch {
      toast({ variant: "destructive", title: "Erro ao cadastrar", description: "Por favor, tente novamente." });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="border border-border/50 bg-[#f5f0e8] dark:bg-card/60 p-8 md:p-12 relative">
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/20" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/20" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/20" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/20" />

      {sent ? (
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Nome</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Seu nome"
                          className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-2 font-serif italic"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="font-mono text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-2 font-serif italic"
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
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      WhatsApp <span className="opacity-50 normal-case">(opcional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(11) 99999-9999"
                        className="bg-transparent border-0 border-b border-border/50 rounded-none focus-visible:ring-0 focus-visible:border-primary px-2 font-serif italic"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-mono text-[10px]" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={pending}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-[10px] uppercase tracking-widest px-8 rounded-none h-11"
              >
                {pending ? "Cadastrando..." : "Quero receber"}
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}
