import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getPostUrl } from '../lib/posts';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: 'BloggingAbout.NET',
    description: 'Dennis van der Stelt on building distributed systems',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: getPostUrl(post),
    })),
    customData: '<language>en-us</language>',
  });
}
