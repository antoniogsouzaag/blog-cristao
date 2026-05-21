import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import {
  useListPosts,
  useDeletePost,
  getListPostsQueryKey,
  useListEbooks,
  useDeleteEbook,
  getListEbooksQueryKey,
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const POSTS_PER_PAGE = 10;
const EBOOKS_PER_PAGE = 10;

export default function Admin() {
  const { signOut } = useAuth();
  const { data: posts, isLoading: isLoadingPosts } = useListPosts();
  const { data: ebooks, isLoading: isLoadingEbooks } = useListEbooks({});

  const deletePost = useDeletePost();
  const deleteEbook = useDeleteEbook();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [postsPage, setPostsPage] = useState(1);
  const [ebooksPage, setEbooksPage] = useState(1);

  const totalPostPages = Math.ceil((posts?.length ?? 0) / POSTS_PER_PAGE);
  const paginatedPosts = posts?.slice((postsPage - 1) * POSTS_PER_PAGE, postsPage * POSTS_PER_PAGE);

  const totalEbookPages = Math.ceil((ebooks?.length ?? 0) / EBOOKS_PER_PAGE);
  const paginatedEbooks = ebooks?.slice((ebooksPage - 1) * EBOOKS_PER_PAGE, ebooksPage * EBOOKS_PER_PAGE);

  const handleDeletePost = (id: number) => {
    if (confirm("Tem certeza que deseja remover este manuscrito? Esta ação é irreversível.")) {
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
        ) : paginatedPosts && paginatedPosts.length > 0 ? (
          <>
            <ul className="divide-y divide-border/40">
              {paginatedPosts.map(post => (
                <li key={post.id} className="py-4 flex items-start gap-4 group hover:bg-muted/5 transition-colors -mx-3 px-3 rounded">
                  <div className="shrink-0 w-16 h-16 overflow-hidden border border-border/40 bg-muted/20 rounded-sm">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        style={{ filter: "saturate(0.8)" }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif text-xl text-muted-foreground/30">A</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
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
                      <span className="font-mono text-[9px] text-muted-foreground/50">
                        {format(new Date(post.publishedAt), "dd MMM yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <h3 className="font-serif text-base leading-snug text-foreground truncate">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 font-mono text-[10px] uppercase tracking-widest">
                      <Link
                        href={`/artigos/${post.id}`}
                        className="text-muted-foreground/50 hover:text-foreground transition-colors"
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
                  </div>
                </li>
              ))}
            </ul>
            <Pagination page={postsPage} total={totalPostPages} onChange={p => setPostsPage(p)} />
          </>
        ) : (
          <div className="py-16 text-center border border-border/40 border-dashed">
            <p className="font-serif italic text-muted-foreground text-sm">O arquivo está vazio no momento.</p>
          </div>
        )}
      </section>

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
        ) : paginatedEbooks && paginatedEbooks.length > 0 ? (
          <>
            <ul className="divide-y divide-border/40 border-t border-border">
              {paginatedEbooks.map(ebook => (
                <li key={ebook.id} className="py-4 flex items-start gap-4 group hover:bg-muted/5 transition-colors -mx-3 px-3 rounded">
                  <div className="shrink-0 w-11 h-16 overflow-hidden border border-border/40 bg-muted/20 rounded-sm">
                    {ebook.coverUrl ? (
                      <img src={ebook.coverUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif text-base text-muted-foreground/30">E</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
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
                      {ebook.fileUrl ? (
                        <span className="font-mono text-[8px] uppercase tracking-widest bg-green-500/10 text-green-600 px-1.5 py-0.5 border border-green-500/20">
                          Checkout
                        </span>
                      ) : (
                        <span className="font-mono text-[8px] uppercase tracking-widest bg-muted/40 text-muted-foreground/50 px-1.5 py-0.5 border border-border/30">
                          Sem link
                        </span>
                      )}
                      <span className="font-mono text-[9px] text-muted-foreground/50">
                        R$ {ebook.price ?? "0,00"}
                      </span>
                    </div>
                    <h3 className="font-serif text-base leading-snug text-foreground truncate">
                      {ebook.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 font-mono text-[10px] uppercase tracking-widest">
                      <Link
                        href={`/loja/${ebook.id}`}
                        className="text-muted-foreground/50 hover:text-foreground transition-colors"
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
                  </div>
                </li>
              ))}
            </ul>
            <Pagination page={ebooksPage} total={totalEbookPages} onChange={p => setEbooksPage(p)} />
          </>
        ) : (
          <div className="py-16 text-center border border-border/40 border-dashed">
            <p className="font-serif italic text-muted-foreground text-sm">O acervo de ebooks está vazio no momento.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-6 pt-5 border-t border-border/40 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed pb-0.5 border-b border-transparent hover:border-foreground"
      >
        ← Anterior
      </button>
      <span className="tabular-nums">
        {page} / {total}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= total}
        className="hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed pb-0.5 border-b border-transparent hover:border-foreground"
      >
        Próxima →
      </button>
    </div>
  );
}
