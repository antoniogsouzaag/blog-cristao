import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-32 text-center max-w-2xl">
      <h1 className="font-serif text-6xl md:text-8xl font-bold text-primary/20 mb-6">404</h1>
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
        Caminho não encontrado
      </h2>
      <p className="text-lg text-muted-foreground mb-12">
        A página que você procura parece ter sido movida ou não existe mais. 
        Que tal voltar ao início da nossa jornada?
      </p>
      <Link href="/">
        <Button size="lg" className="font-serif text-lg px-8">
          Voltar ao Início
        </Button>
      </Link>
    </div>
  );
}
