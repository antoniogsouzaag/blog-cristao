import { BookOpen } from "lucide-react";

interface VerseBlockProps {
  verse: string;
  reference: string;
}

export function VerseBlock({ verse, reference }: VerseBlockProps) {
  return (
    <div className="relative my-8 overflow-hidden rounded-xl border border-primary/20 bg-primary/5 px-6 py-8 md:px-12 md:py-10">
      <div className="absolute -right-4 -top-4 opacity-5">
        <BookOpen className="h-32 w-32" />
      </div>
      <div className="relative z-10 text-center">
        <p className="font-serif text-xl leading-relaxed text-foreground md:text-2xl italic">
          "{verse}"
        </p>
        <p className="mt-4 font-sans text-sm font-semibold tracking-widest text-primary uppercase">
          — {reference}
        </p>
      </div>
    </div>
  );
}
