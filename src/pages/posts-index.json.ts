import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { CATEGORIES, formatDate, firstImageFromMarkdown } from '../lib/site';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);

  const index: Record<
    string,
    {
      title: string;
      description: string;
      category: string;
      categoryColor: string;
      date: string;
      cover: string | null;
    }
  > = {};

  for (const post of posts) {
    const category = CATEGORIES[post.data.category];
    index[post.id] = {
      title: post.data.title,
      description: post.data.description,
      category: category.label,
      categoryColor: category.color,
      date: formatDate(post.data.pubDate),
      cover: post.data.cover ?? firstImageFromMarkdown(post.body ?? ''),
    };
  }

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
