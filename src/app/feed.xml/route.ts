import { Feed } from 'feed';
import { getAllPosts } from '@/lib/markdown-posts';

export const dynamic = 'force-static';

export async function GET() {
  const { posts } = getAllPosts(1, 100);
  const baseUrl = 'https://preferred.ai';

  const feed = new Feed({
    title: 'Preferred.AI Blog',
    description: 'Latest posts from Preferred.AI - AI research and development',
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    image: `${baseUrl}/logo.png`,
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Preferred.AI`,
    feedLinks: {
      rss2: `${baseUrl}/feed.xml`,
      json: `${baseUrl}/feed.json`,
      atom: `${baseUrl}/atom.xml`,
    },
    author: {
      name: 'Preferred.AI',
      link: baseUrl,
    },
  });

  posts.forEach((post) => {
    // Convert relative image URLs to absolute
    let imageUrl = post.featuredImage;
    if (imageUrl && imageUrl.startsWith('/')) {
      imageUrl = `${baseUrl}${imageUrl}`;
    }

    feed.addItem({
      title: post.title,
      id: `${baseUrl}/blog/${post.slug}`,
      link: `${baseUrl}/blog/${post.slug}`,
      description: post.excerpt || '',
      author: [
        {
          name: post.author || 'Preferred.AI',
          link: baseUrl,
        },
      ],
      date: new Date(post.date),
      image: imageUrl || undefined,
      category: post.categories.map((cat) => ({
        name: cat,
      })),
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
