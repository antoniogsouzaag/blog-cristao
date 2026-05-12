import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { Component, type ReactNode, type ErrorInfo } from "react";

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
import Store from "@/pages/store";
import EbookDetail from "@/pages/ebook-detail";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/artigos" component={Articles} />
        <Route path="/artigos/:id" component={Article} />
        <Route path="/categorias" component={Categories} />
        <Route path="/sobre" component={About} />
        <Route path="/loja" component={Store} />
        <Route path="/loja/:id" component={EbookDetail} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/novo-artigo" component={AdminPostEditor} />
        <Route path="/admin/editar-artigo/:id" component={AdminPostEditor} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
