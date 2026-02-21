import type { CollectionEntry } from 'astro:content';

/**
 * Derive the public URL for a post from its collection slug.
 * Slug format: "YYYY-MM-DD-title-words" -> "/YYYY/MM/DD/title-words/"
 */
export function getPostUrl(post: CollectionEntry<'posts'>): string {
  const slug = post.id.replace(/\.md$/, '');
  const match = slug.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  if (!match) return `/${slug}/`;
  const [, year, month, day, title] = match;
  return `/${year}/${month}/${day}/${title}/`;
}

/**
 * Slugify a tag for use in URLs: lowercase, spaces to hyphens.
 */
export function tagSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Estimate reading time in minutes from raw markdown/html content.
 */
export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
