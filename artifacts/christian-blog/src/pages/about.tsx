export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-primary mb-6">
          Sobre o Blog Cristão
        </h1>
      </div>

      <div className="prose prose-lg dark:prose-invert prose-headings:font-serif prose-headings:text-primary mx-auto max-w-none prose-p:leading-relaxed">
        <p className="lead text-xl italic text-muted-foreground text-center mb-12">
          "Pois onde dois ou três estiverem reunidos em meu nome, ali estou eu no meio deles."
        </p>

        <p>
          O Blog Cristão nasceu do desejo de criar um refúgio digital para crentes de todo o Brasil. 
          Em um mundo cada vez mais acelerado e ruidoso, acreditamos na importância de pausar, 
          refletir e nos conectarmos com a Palavra.
        </p>

        <h2>Nossa Missão</h2>
        <p>
          Queremos fornecer conteúdo bíblicamente fundamentado que não apenas informe a mente, mas 
          também aqueça o coração. Nossos artigos, devocionais e estudos são escritos com o 
          propósito de encorajar, consolar e desafiar nossos leitores a viverem uma fé autêntica.
        </p>

        <h2>Nossa Visão</h2>
        <p>
          Enxergamos uma comunidade onde a graça e a verdade se encontram. Onde dúvidas sinceras 
          são acolhidas com amor e onde o crescimento espiritual é nutrido por meio da 
          compartilhamento de histórias e do aprofundamento nas Escrituras.
        </p>

        <div className="my-12 p-8 bg-card border border-border rounded-2xl text-center">
          <h3 className="mt-0 text-2xl mb-4 font-serif">Junte-se a nós</h3>
          <p className="mb-0">
            Acompanhe nossos artigos semanais, deixe suas reflexões nos comentários e 
            caminhe conosco nesta jornada de fé.
          </p>
        </div>
      </div>
    </div>
  );
}
