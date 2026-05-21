import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const POST_FALLBACKS = [
  '/images/praying-hands.png',
  '/images/bible-candle.png',
  '/images/church-light.png',
  '/images/post-familia.png',
  '/images/post-oracao.png',
  '/images/post-paz.png',
  '/images/post-sermao.png',
  '/images/post-testemunho.png',
];

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function getPostFallbackImage(post: { id: number; category?: { name?: string | null } | null }): string {
  const cat = normalize(post.category?.name ?? '');
  if (cat.includes('familia')) return '/images/post-familia.png';
  if (cat.includes('oracao')) return '/images/post-oracao.png';
  if (cat.includes('paz')) return '/images/post-paz.png';
  if (cat.includes('sermao') || cat.includes('pregacao')) return '/images/post-sermao.png';
  if (cat.includes('testemunho')) return '/images/post-testemunho.png';
  return POST_FALLBACKS[post.id % POST_FALLBACKS.length];
}
