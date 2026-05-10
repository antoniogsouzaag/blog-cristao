import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";

import Home from "@/pages/home";
import Articles from "@/pages/articles";
import Article from "@/pages/article";
import Categories from "@/pages/categories";
import About from "@/pages/about";
import Admin from "@/pages/admin";
import AdminPostEditor from "@/pages/admin/post-editor";
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
