import { db, pool } from "./index.js";
import { eq } from "drizzle-orm";
import { categoriesTable, postsTable, ebooksTable } from "./schema/index.js";

const categories = [
  { name: "Fé e Espiritualidade", slug: "fe-e-espiritualidade", description: "Reflexões sobre a caminhada de fé e vida espiritual" },
  { name: "Oração e Louvor", slug: "oracao-e-louvor", description: "O poder da oração e da adoração na vida cristã" },
  { name: "Família Cristã", slug: "familia-crista", description: "Edificando o lar sobre os fundamentos bíblicos" },
  { name: "Estudo Bíblico", slug: "estudo-biblico", description: "Aprofundamento nas Escrituras Sagradas" },
  { name: "Devocionais", slug: "devocionais", description: "Meditações diárias para fortalecer a fé" },
];

const posts = [
  {
    title: "A Paz que Excede Todo Entendimento",
    slug: "a-paz-que-excede-todo-entendimento",
    excerpt: "Em meio às tempestades da vida, existe uma paz que só Deus pode oferecer — uma paz que vai além da nossa compreensão humana.",
    content: `Em Filipenses 4:7, o apóstolo Paulo nos diz: *"E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos pensamentos em Cristo Jesus."*

Vivemos em um mundo repleto de ansiedades, incertezas e pressões de todos os lados. O trabalho, a família, a saúde, as finanças — tudo parece competir pela nossa atenção e nos roubar a tranquilidade. Mas Deus, em Sua infinita misericórdia, nos oferece algo que o mundo não pode dar: uma paz que transcende qualquer lógica humana.

## O que é essa paz?

A paz bíblica não é a ausência de problemas. É a presença de Deus no meio dos problemas. O próprio Jesus disse: *"Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá"* (João 14:27).

Essa paz é:
- **Sobrenatural** — vem do próprio Deus, não das circunstâncias
- **Protetora** — guarda nossos corações e mentes
- **Constante** — não depende do ambiente ao redor

## Como alcançar essa paz?

Paulo nos dá a resposta nos versículos anteriores: *"Não andeis ansiosos por coisa alguma; antes, em tudo, pela oração e pela súplica, com ações de graças, os vossos pedidos sejam conhecidos diante de Deus"* (Fp 4:6).

O segredo está na oração com gratidão. Quando levamos nossas preocupações a Deus — não com reclamações, mas com ação de graças — Ele substitui a ansiedade pela Sua paz.

## Aplicando no dia a dia

Comece cada manhã entregando o dia ao Senhor. Quando a ansiedade bater, pare, respire e ore. Lembre-se que Deus já está no amanhã que te preocupa. Ele nunca chegou atrasado e não vai começar agora.

*"Porque eu sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal"* (Jeremias 29:11).`,
    authorName: "Equipe Blog Cristão",
    bibleVerse: "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos pensamentos em Cristo Jesus.",
    bibleReference: "Filipenses 4:7",
    featured: true,
    categorySlug: "fe-e-espiritualidade",
  },
  {
    title: "O Poder Transformador da Oração",
    slug: "o-poder-transformador-da-oracao",
    excerpt: "A oração não é um ritual religioso — é uma conversa viva com o Deus do universo que nos ouve e responde.",
    content: `Há algo extraordinário acontecendo toda vez que um cristão dobra os joelhos em oração. Não é apenas um exercício espiritual ou uma tradição religiosa. É uma conexão direta com o Criador do universo, que nos ouve, nos conhece pelo nome e responde às nossas súplicas.

## Por que orar?

Jesus não disse *"se vocês orarem"*, mas *"quando vocês orarem"* (Mateus 6:5-7), pressupondo que a oração é parte natural da vida do crente. A oração é o nosso canal de comunicação com o Pai.

Através da oração:
- Fortalecemos nossa fé e intimidade com Deus
- Encontramos direção para as decisões da vida
- Intercedemos pelos que amamos
- Agradecemos pelas bênçãos recebidas
- Buscamos força nas provações

## Tipos de oração

A Bíblia apresenta diferentes formas de oração:

**Adoração** — Reconhecer a grandeza de Deus antes de qualquer pedido. *"Digno és, Senhor e Deus nosso, de receber a glória, a honra e o poder"* (Apocalipse 4:11).

**Confissão** — Trazer nossos erros diante de Deus com um coração arrependido. *"Se confesssarmos os nossos pecados, ele é fiel e justo para nos perdoar"* (1 João 1:9).

**Intercessão** — Orar pelos outros. *"Orai uns pelos outros"* (Tiago 5:16).

**Petição** — Apresentar nossas necessidades ao Pai. *"Pedi, e dar-se-vos-á"* (Mateus 7:7).

## A oração que transforma

A oração não muda apenas as circunstâncias — ela nos transforma. Quando passamos tempo na presença de Deus, saímos diferentes. Mais pacientes, mais sábios, mais cheios de amor.

Elias era um homem com a mesma natureza que nós, e *"orou fervorosamente para que não chovesse, e não choveu sobre a terra por três anos e seis meses"* (Tiago 5:17). O poder não estava em Elias — estava em Deus que ouvia a oração.

Comece hoje. Não espere condições perfeitas. Deus nos encontra onde estamos.`,
    authorName: "Equipe Blog Cristão",
    bibleVerse: "A oração fervorosa do justo pode muito.",
    bibleReference: "Tiago 5:16",
    featured: false,
    categorySlug: "oracao-e-louvor",
  },
  {
    title: "Construindo Sua Família sobre a Rocha",
    slug: "construindo-sua-familia-sobre-a-rocha",
    excerpt: "Uma família edificada nos princípios bíblicos tem fundação sólida para enfrentar qualquer tempestade.",
    content: `Jesus encerrou o Sermão do Monte com uma parábola poderosa: dois construtores, duas casas, uma tempestade. A diferença não estava na tempestade — estava na fundação (Mateus 7:24-27).

O mesmo princípio se aplica às famílias. Toda família passa por tempestades: conflitos, dificuldades financeiras, problemas de saúde, crises nos relacionamentos. A pergunta não é *se* a tempestade virá, mas *sobre qual fundação* sua família está edificada.

## O marido como líder servo

Efésios 5:25 instrui: *"Maridos, amai vossas mulheres, como também Cristo amou a Igreja."* A liderança bíblica do homem não é dominação, mas serviço sacrificial. Cristo lavou os pés dos discípulos — o maior serviu os menores.

Um pai que lidera com amor, humildade e serviço cria um ambiente onde a família floresce.

## A mulher como coração do lar

*"Mulher virtuosa, quem a achará? O seu valor muito excede o de rubis"* (Provérbios 31:10). A mulher que teme ao Senhor não é diminuída pela Escritura — é exaltada. Seu papel no lar é de influência profunda e duradoura.

## Criando filhos com propósito

*"Instrui o menino no caminho em que deve andar, e até quando envelhecer não se desviará dele"* (Provérbios 22:6). Os filhos precisam mais de pais presentes do que de pais perfeitos.

Três práticas que fortalecem a família cristã:

1. **Altar familiar** — Momentos regulares de oração e leitura bíblica juntos
2. **Perdão rápido** — Não deixar o sol se pôr sobre a ira (Ef 4:26)
3. **Comunicação aberta** — Criar ambiente seguro para diálogo honesto

## A promessa

*"Quanto a mim e à minha casa, serviremos ao Senhor"* (Josué 24:15). Esta não é apenas uma declaração de Josué — pode ser a declaração da sua família hoje.

A família perfeita não existe. Mas a família que coloca Deus no centro e busca a Ele juntos tem uma fundação que nenhuma tempestade pode destruir.`,
    authorName: "Equipe Blog Cristão",
    bibleVerse: "Quanto a mim e à minha casa, serviremos ao Senhor.",
    bibleReference: "Josué 24:15",
    featured: true,
    categorySlug: "familia-crista",
  },
  {
    title: "Salmo 23: O Senhor é o Meu Pastor",
    slug: "salmo-23-o-senhor-e-o-meu-pastor",
    excerpt: "Uma das passagens mais amadas da Bíblia nos revela seis dimensões do cuidado de Deus sobre cada um de nós.",
    content: `*"O Senhor é o meu pastor; nada me faltará."* — Salmo 23:1

Poucas palavras da Escritura têm consolado tantos corações em tantas situações ao longo dos séculos. O Salmo 23, escrito por Davi, é um poema de confiança absoluta no cuidado de Deus.

## "Nada me faltará" — A promessa de provisão

Davi não escreveu isso em um momento de abundância. Era um homem que conheceu a perseguição, o deserto, a traição. Mas ele aprendeu que quando Deus é o seu pastor, a necessidade real nunca fica sem resposta.

Isso não significa ausência de dificuldades. Significa que, nas dificuldades, Deus provê o que é necessário.

## "Deitar-me em pastos verdejantes" — O descanso de Deus

As ovelhas só deitam quando estão em paz: sem fome, sem conflito, sem medo. O pastor garante essas condições. Deus nos convida a descansar — não pela ausência de problemas, mas pela certeza de Sua presença.

## "Pelo vale da sombra da morte" — Deus no lugar mais escuro

O versículo 4 é talvez o mais profundo: *"Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo."*

Davi não diz que Deus nos livra do vale. Diz que Deus nos acompanha nele. Quando você atravessa seu "vale" — doença, luto, crise — não está sozinho.

## "Certamente a bondade e a misericórdia me seguirão" — O que vem atrás

O Salmo termina com uma imagem linda: a bondade e a misericórdia de Deus nos "seguindo" todos os dias da vida. Não passando por nós — nos seguindo, perseguindo-nos com graça.

## Devocional para hoje

Leia o Salmo 23 devagar, em voz alta. Em qual parte você mais precisa confiar em Deus hoje? Ore especificamente sobre aquilo.

*"O Senhor é o meu pastor"* — não era. É. Presente. Agora. Hoje.`,
    authorName: "Equipe Blog Cristão",
    bibleVerse: "O Senhor é o meu pastor; nada me faltará.",
    bibleReference: "Salmo 23:1",
    featured: false,
    categorySlug: "devocionais",
  },
  {
    title: "Como Estudar a Bíblia de Forma Eficaz",
    slug: "como-estudar-a-biblia-de-forma-eficaz",
    excerpt: "A Palavra de Deus é viva e eficaz — mas precisamos aprender a nos aproximar dela com o coração e a mente preparados.",
    content: `*"A tua palavra é lâmpada que ilumina os meus passos e luz que clareia o meu caminho."* — Salmo 119:105

Muitos cristãos querem ler mais a Bíblia, mas não sabem por onde começar. Outros leem regularmente, mas sentem que a leitura não está produzindo transformação real. O problema muitas vezes não é a quantidade de leitura, mas a qualidade da abordagem.

## O método O-A-R

Uma das formas mais simples e eficazes de estudar a Bíblia é o método **O-A-R**:

### Observação — O que diz o texto?
Antes de interpretar, observe. Leia o trecho pelo menos duas vezes. Pergunte:
- Quem está falando? Para quem?
- Quando e onde acontece?
- Quais palavras se repetem?
- Que emoções o texto expressa?

### Aplicação — O que isso significa para mim?
Após entender o contexto histórico e literário, pergunte:
- Que verdade atemporal existe neste texto?
- Como isso se aplica à minha situação atual?
- Há um pecado para abandonar? Uma promessa para crer? Um exemplo para seguir?

### Resposta — Como vou agir?
O estudo bíblico que não gera ação é incompleto. *"Sede cumpridores da palavra e não somente ouvintes"* (Tiago 1:22). Defina uma ação concreta antes de fechar a Bíblia.

## Dicas práticas

**1. Consistência supera intensidade** — 15 minutos diários valem mais do que 3 horas uma vez por semana.

**2. Tenha um caderno de anotações** — Escrever ajuda a fixar e organizar o que aprendeu.

**3. Use uma versão de fácil compreensão** — NVI, NAA e ARC são boas opções para leitura e estudo.

**4. Ore antes de ler** — Peça ao Espírito Santo que abra sua mente. O mesmo Espírito que inspirou os escritores pode iluminar os leitores.

**5. Estude em comunidade** — Pequenos grupos e células enriquecem o estudo com perspectivas diferentes.

## Por onde começar?

Se você está começando, sugerimos:
- **Evangelho de João** — Uma introdução clara à vida e ensinos de Jesus
- **Salmos** — Para a vida devocional e emocional
- **Provérbios** — Sabedoria prática para o dia a dia
- **Efésios** — Uma panorâmica da vida cristã

A Bíblia não é apenas um livro sobre Deus. É o livro no qual Deus fala conosco. Abra-a com expectativa.`,
    authorName: "Equipe Blog Cristão",
    bibleVerse: "A tua palavra é lâmpada que ilumina os meus passos e luz que clareia o meu caminho.",
    bibleReference: "Salmo 119:105",
    featured: false,
    categorySlug: "estudo-biblico",
  },
];

async function seed() {
  console.log("Iniciando seed...");

  console.log("Inserindo categorias...");
  const insertedCategories = await db
    .insert(categoriesTable)
    .values(categories)
    .onConflictDoNothing()
    .returning();
  console.log(`  ${insertedCategories.length} categorias inseridas (ignorando duplicatas)`);

  const allCategories = await db.select().from(categoriesTable);
  const categoryMap = new Map(allCategories.map((c) => [c.slug, c.id]));

  console.log("Inserindo posts...");
  const postValues = posts.map(({ categorySlug, ...post }) => {
    const categoryId = categoryMap.get(categorySlug);
    if (!categoryId) throw new Error(`Categoria não encontrada: ${categorySlug}`);
    return { ...post, categoryId };
  });

  const insertedPosts = await db
    .insert(postsTable)
    .values(postValues)
    .onConflictDoNothing()
    .returning();
  console.log(`  ${insertedPosts.length} posts inseridos (ignorando duplicatas)`);

  // Update image URLs for existing posts
  const imageUpdates = [
    { slug: "a-paz-que-excede-todo-entendimento", imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&auto=format&fit=crop&q=80" },
    { slug: "o-poder-transformador-da-oracao", imageUrl: "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=800&auto=format&fit=crop&q=80" },
    { slug: "construindo-sua-familia-sobre-a-rocha", imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191011?w=800&auto=format&fit=crop&q=80" },
    { slug: "salmo-23-o-senhor-e-o-meu-pastor", imageUrl: "https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=800&auto=format&fit=crop&q=80" },
    { slug: "como-estudar-a-biblia-de-forma-eficaz", imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=80" },
  ];

  console.log("Atualizando imagens dos posts...");
  for (const { slug, imageUrl } of imageUpdates) {
    await db.update(postsTable).set({ imageUrl }).where(eq(postsTable.slug, slug));
  }
  console.log("  Imagens atualizadas.");

  const ebooks = [
    {
      title: "30 Dias de Orações que Transformam",
      slug: "30-dias-de-oracoes-que-transformam",
      description: "Um guia devocional de 30 dias com orações temáticas para cada área da vida: família, trabalho, saúde, propósito e fé. Cada dia traz um versículo âncora, uma oração guiada e uma reflexão para aprofundar seu diálogo com Deus.",
      excerpt: "Um devocional de 30 dias com orações transformadoras para cada área da sua vida.",
      authorName: "Equipe Blog Cristão",
      coverUrl: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=400&auto=format&fit=crop&q=80",
      price: "0",
      category: "devocional",
      featured: true,
      onSale: false,
      pageCount: 68,
    },
    {
      title: "Guia de Estudo Bíblico para Iniciantes",
      slug: "guia-de-estudo-biblico-para-iniciantes",
      description: "Um manual completo para quem deseja aprofundar-se nas Escrituras. Aborda métodos de estudo, contexto histórico, interpretação hermenêutica básica e como aplicar os ensinamentos bíblicos na vida cotidiana. Inclui plano de leitura anual e exercícios práticos.",
      excerpt: "O guia definitivo para iniciar uma jornada séria e consistente no estudo das Escrituras.",
      authorName: "Equipe Blog Cristão",
      coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&auto=format&fit=crop&q=80",
      price: "19.90",
      originalPrice: null,
      category: "estudo-biblico",
      featured: false,
      onSale: false,
      pageCount: 124,
    },
    {
      title: "A Família nos Fundamentos da Escritura",
      slug: "a-familia-nos-fundamentos-da-escritura",
      description: "Uma obra profunda sobre os princípios bíblicos para construir uma família saudável, amorosa e fundamentada em Cristo. Trata do papel do casal, da criação dos filhos, da resolução de conflitos e da importância do altar familiar. Baseado em mais de 200 passagens bíblicas.",
      excerpt: "Princípios bíblicos essenciais para edificar um lar sólido e glorioso a Deus.",
      authorName: "Equipe Blog Cristão",
      coverUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191011?w=400&auto=format&fit=crop&q=80",
      price: "24.90",
      originalPrice: "34.90",
      category: "familia",
      featured: true,
      onSale: true,
      pageCount: 156,
    },
  ];

  console.log("Inserindo ebooks...");
  const insertedEbooks = await db
    .insert(ebooksTable)
    .values(ebooks)
    .onConflictDoNothing()
    .returning();
  console.log(`  ${insertedEbooks.length} ebooks inseridos.`);

  console.log("Seed concluído com sucesso!");
  await pool.end();
}

seed().catch((err) => {
  console.error("Erro no seed:", err);
  pool.end().finally(() => process.exit(1));
});
