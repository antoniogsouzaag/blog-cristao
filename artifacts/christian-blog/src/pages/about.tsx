export default function About() {
  return (
    <div className="container mx-auto px-6 py-16 md:py-24 max-w-3xl animate-in fade-in duration-1000">
      <div className="text-center mb-20">
        <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-tight text-foreground mb-8">
          Nossa História
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Sobre o Fonte Viva
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none prose-p:font-sans prose-p:font-light prose-p:text-[1.1rem] prose-p:leading-[1.8] prose-p:text-foreground/80 prose-headings:font-serif prose-headings:font-normal prose-headings:text-foreground">
        <blockquote className="text-2xl md:text-3xl italic font-light font-serif text-center border-none text-foreground/70 my-16 px-0">
          "Pois onde dois ou três estiverem reunidos em meu nome, ali estou eu no meio deles."
        </blockquote>

        <p className="first-letter:float-left first-letter:font-serif first-letter:text-7xl first-letter:pr-4 first-letter:pt-2 first-letter:text-primary">
          O Fonte Viva nasceu do profundo desejo de criar um refúgio literário digital para crentes de todo o Brasil. Assim como a água viva prometida em João 4:14 jamais deixa o coração sedento, buscamos ser um espaço de pausa, silêncio e conexão atenta com a Palavra — em meio a um mundo acelerado, saturado de ruídos e distrações efêmeras.
        </p>

        <p>
          Como um pergaminho antigo encontrado em uma biblioteca esquecida, desejamos que cada texto aqui publicado carregue o peso da eternidade e a leveza da graça. Não buscamos apenas informar, mas transformar; não queremos apenas leitores, mas peregrinos caminhando juntos.
        </p>

        <div className="w-12 h-px bg-border my-16 mx-auto" />

        <h2 className="text-3xl mb-8 text-center">Nosso Propósito</h2>
        
        <p>
          Nosso objetivo é fornecer um conteúdo biblicamente fundamentado que alimente a mente e aqueça o coração. Nossos ensaios, devocionais e estudos não são produzidos para o consumo rápido, mas elaborados com o intuito de encorajar, consolar e provocar nossos irmãos a viverem uma fé mais autêntica e enraizada nas Escrituras.
        </p>

        <p>
          Valorizamos a beleza da linguagem porque acreditamos que servimos ao Autor de toda a beleza. Através da palavra escrita, procuramos refletir a glória do Verbo que se fez carne.
        </p>

        <div className="w-12 h-px bg-border my-16 mx-auto" />

        <h2 className="text-3xl mb-8 text-center">Nossa Visão</h2>
        
        <p>
          Enxergamos uma comunidade virtual onde a graça e a verdade convivem em perfeita harmonia. Um espaço onde dúvidas sinceras são recebidas com amor paciente, onde as feridas da alma encontram o bálsamo do evangelho, e onde o amadurecimento espiritual acontece na partilha de dores e esperanças.
        </p>

        <div className="my-24 p-12 border border-border/50 bg-background/50 relative text-center">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/30" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/30" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/30" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/30" />
          
          <h3 className="font-serif text-3xl mb-6 mt-0">O Convite</h3>
          <p className="font-light mb-0 text-foreground/70">
            Acompanhe nossas publicações, deixe suas reflexões nas margens de nossos textos e caminhe conosco nesta longa e maravilhosa jornada de fé. A porta está aberta.
          </p>
        </div>
      </div>
    </div>
  );
}
