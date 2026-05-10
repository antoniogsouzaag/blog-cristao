interface VerseBlockProps {
  verse: string;
  reference: string;
}

export function VerseBlock({ verse, reference }: VerseBlockProps) {
  return (
    <figure className="relative my-12 md:my-16 pl-8 md:pl-12 border-l border-primary/20 py-2">
      <blockquote className="font-serif text-2xl md:text-3xl leading-relaxed text-foreground italic font-light">
        "{verse}"
      </blockquote>
      <figcaption className="mt-6 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase flex items-center gap-4">
        <span className="w-6 h-px bg-primary/30" />
        {reference}
      </figcaption>
    </figure>
  );
}
