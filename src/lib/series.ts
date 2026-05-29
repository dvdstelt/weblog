import { getCollection, type CollectionEntry } from 'astro:content';

export interface SeriesSummary {
  slug: string;
  title: string;
  description: string;
  order: number;
  posts: CollectionEntry<'posts'>[];
  latestPubDate: Date;
}

let cached: SeriesSummary[] | null = null;

/**
 * Return every registered series that has at least one post, sorted by the
 * `order:` field on each series file (lower first, ties broken by title).
 * Posts inside each series are sorted by pubDate ascending so Part 1 is the
 * first item the reader sees.
 *
 * Fails loudly at build time if any post sets a `topic:` that doesn't match a
 * file in src/content/series/.
 */
export async function getAllSeries(): Promise<SeriesSummary[]> {
  if (cached) return cached;

  const [seriesEntries, allPosts] = await Promise.all([
    getCollection('series'),
    getCollection('posts'),
  ]);

  const knownSlugs = new Set(seriesEntries.map((s) => s.id.replace(/\.md$/, '')));
  const grouped = new Map<string, CollectionEntry<'posts'>[]>();

  for (const post of allPosts) {
    const topic = post.data.topic;
    if (!topic) continue;
    if (!knownSlugs.has(topic)) {
      throw new Error(
        `Post "${post.id}" has topic="${topic}" but no matching file in src/content/series/. ` +
          `Either fix the typo, or create src/content/series/${topic}.md.`,
      );
    }
    const bucket = grouped.get(topic) ?? [];
    bucket.push(post);
    grouped.set(topic, bucket);
  }

  const result: SeriesSummary[] = [];
  for (const entry of seriesEntries) {
    const slug = entry.id.replace(/\.md$/, '');
    const posts = grouped.get(slug);
    if (!posts || posts.length === 0) continue;
    posts.sort((a, b) => a.data.pubDate.getTime() - b.data.pubDate.getTime());
    const latest = posts.reduce(
      (max, p) => (p.data.pubDate.getTime() > max.getTime() ? p.data.pubDate : max),
      posts[0].data.pubDate,
    );
    result.push({
      slug,
      title: entry.data.title,
      description: entry.data.description,
      order: entry.data.order,
      posts,
      latestPubDate: latest,
    });
  }

  result.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  cached = result;
  return result;
}

export async function getSeriesBySlug(slug: string): Promise<SeriesSummary | null> {
  const all = await getAllSeries();
  return all.find((s) => s.slug === slug) ?? null;
}
