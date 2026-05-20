import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Series registry. Each key is the slug used in a post's `topic:` frontmatter
 * field and in the /series/<slug>/ URL. The title and description are what the
 * menu, the series index, and the per-series page display.
 *
 * Add a new series by adding an entry here, then setting `topic: <slug>` on
 * the posts that belong to it. A post with a topic that isn't in this map
 * fails the build with a clear error.
 */
export const SERIES = {
  'keycloak-oidc': {
    title: 'Authenticating ServicePulse with Keycloak',
    description: 'A four-part walkthrough of putting Keycloak in front of ServicePulse with OpenID Connect, end to end, in Docker.',
  },
} as const satisfies Record<string, { title: string; description: string }>;

export type SeriesSlug = keyof typeof SERIES;

export interface SeriesSummary {
  slug: SeriesSlug;
  title: string;
  description: string;
  posts: CollectionEntry<'posts'>[];
  latestPubDate: Date;
}

function isKnownSlug(slug: string): slug is SeriesSlug {
  return Object.prototype.hasOwnProperty.call(SERIES, slug);
}

let cached: SeriesSummary[] | null = null;

/**
 * Return every series that has at least one post, sorted so the most recently
 * updated series comes first. Posts inside each series are sorted by pubDate
 * ascending so Part 1 is the first item the reader sees.
 *
 * Fails loudly at build time if any post sets a topic that isn't registered.
 */
export async function getAllSeries(): Promise<SeriesSummary[]> {
  if (cached) return cached;

  const allPosts = await getCollection('posts');
  const grouped = new Map<SeriesSlug, CollectionEntry<'posts'>[]>();

  for (const post of allPosts) {
    const topic = post.data.topic;
    if (!topic) continue;
    if (!isKnownSlug(topic)) {
      throw new Error(
        `Post "${post.id}" has topic="${topic}" but no entry in SERIES (src/lib/series.ts). ` +
          `Either fix the typo, or register the new series.`,
      );
    }
    const bucket = grouped.get(topic) ?? [];
    bucket.push(post);
    grouped.set(topic, bucket);
  }

  const result: SeriesSummary[] = [];
  for (const [slug, posts] of grouped) {
    posts.sort((a, b) => a.data.pubDate.getTime() - b.data.pubDate.getTime());
    const latest = posts.reduce(
      (max, p) => (p.data.pubDate.getTime() > max.getTime() ? p.data.pubDate : max),
      posts[0].data.pubDate,
    );
    result.push({
      slug,
      title: SERIES[slug].title,
      description: SERIES[slug].description,
      posts,
      latestPubDate: latest,
    });
  }

  result.sort((a, b) => b.latestPubDate.getTime() - a.latestPubDate.getTime());
  cached = result;
  return result;
}

export async function getSeriesBySlug(slug: string): Promise<SeriesSummary | null> {
  if (!isKnownSlug(slug)) return null;
  const all = await getAllSeries();
  return all.find((s) => s.slug === slug) ?? null;
}
