import type { MetadataRoute } from 'next';
import { getCategories, getConditions, getBlogs } from '@/lib/content/service';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://drkollol.com';
  const now = new Date();

  // Core static pages with SEO priorities
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/conditions-treatments`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  try {
    const [categories, conditions, blogs] = await Promise.all([
      getCategories(),
      getConditions(),
      getBlogs(),
    ]);

    // Category Hub URLs
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${baseUrl}/conditions-treatments/${cat.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Condition Treatment URLs (Clinical landing pages - High conversion & search intent)
    const conditionRoutes: MetadataRoute.Sitemap = conditions
      .filter((cond) => !cond.is_hidden)
      .map((cond) => ({
        url: `${baseUrl}/conditions-treatments/${cond.category_slug}/${cond.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.85,
      }));

    // Blog Article URLs (Health Guides & Educational Content)
    const blogRoutes: MetadataRoute.Sitemap = blogs
      .filter((blog) => blog.is_published)
      .map((blog) => {
        let publishedDate = now;
        if (blog.published_at) {
          const parsed = new Date(blog.published_at);
          if (!isNaN(parsed.getTime())) {
            publishedDate = parsed;
          }
        }
        return {
          url: `${baseUrl}/blogs/${blog.slug}`,
          lastModified: publishedDate,
          changeFrequency: 'weekly',
          priority: 0.8,
        };
      });

    return [...staticRoutes, ...categoryRoutes, ...conditionRoutes, ...blogRoutes];
  } catch (err) {
    console.error('Error generating sitemap:', err);
    return staticRoutes;
  }
}
