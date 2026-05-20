import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Component, type ReactNode, type ErrorInfo, useEffect } from "react";
import { useLocation } from "wouter";
import { AuthProvider } from "@/contexts/auth-context";
import { useAuth } from "@/contexts/auth-context";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("App error:", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "2rem", fontFamily: "monospace" }}>
          <h2>Erro ao renderizar</h2>
          <pre style={{ whiteSpace: "pre-wrap", color: "red" }}>{(this.state.error as Error).message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

import Home from "@/pages/home";
import Articles from "@/pages/articles";
import Article from "@/pages/article";
import Categories from "@/pages/categories";
import About from "@/pages/about";
import Admin from "@/pages/admin";
import AdminPostEditor from "@/pages/admin/post-editor";
import AdminEbookEditor from "@/pages/admin/ebook-editor";
import AdminLogin from "@/pages/admin/login";
import Store from "@/pages/store";
import EbookDetail from "@/pages/ebook-detail";
import PurchaseSuccess from "@/pages/purchase-success";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !session) navigate("/admin/login");
  }, [loading, session, navigate]);

  if (loading) return (
    <div className="py-32 text-center font-serif italic text-muted-foreground animate-pulse">
      Verificando acesso...
    </div>
  );
  if (!session) return null;
  return <>{children}</>;
}

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/artigos" component={Articles} />
        <Route path="/artigos/:id" component={Article} />
        <Route path="/categorias" component={Categories} />
        <Route path="/sobre" component={About} />
        <Route path="/loja" component={Store} />
        <Route path="/loja/sucesso" component={PurchaseSuccess} />
        <Route path="/loja/:id" component={EbookDetail} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin">
          {() => <ProtectedRoute><Admin /></ProtectedRoute>}
        </Route>
        <Route path="/admin/novo-artigo">
          {() => <ProtectedRoute><AdminPostEditor /></ProtectedRoute>}
        </Route>
        <Route path="/admin/editar-artigo/:id">
          {(params) => <ProtectedRoute><AdminPostEditor /></ProtectedRoute>}
        </Route>
        <Route path="/admin/ebook-editor">
          {() => <ProtectedRoute><AdminEbookEditor /></ProtectedRoute>}
        </Route>
        <Route path="/admin/editar-ebook/:id">
          {(params) => <ProtectedRoute><AdminEbookEditor /></ProtectedRoute>}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
