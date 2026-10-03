import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getBlogs,
  getBlogBySlug,
  getCategories,
  getConditions,
  getSiteSettings,
  getChambers,
} from '@/lib/content/service';
import { SingleBlogClient } from '@/components/blogs/SingleBlogClient';

interface SingleBlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SingleBlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) return { title: 'Article Not Found' };

  return {
    title: `${blog.title_en} — Dr. Fahim Foysal Kollol`,
    description: blog.excerpt_en,
    openGraph: {
      title: blog.title_en,
      description: blog.excerpt_en,
      type: 'article',
      publishedTime: blog.published_at,
      authors: ['Dr. Fahim Foysal Kollol'],
    },
  };
}

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map((b) => ({ slug: b.slug }));
}

export const revalidate = 60;

export default async function SingleBlogPage({ params }: SingleBlogPageProps) {
  const { slug } = await params;
  const [blog, categories, allBlogs, conditions, settings, chambers] = await Promise.all([
    getBlogBySlug(slug),
    getCategories(),
    getBlogs(),
    getConditions(),
    getSiteSettings(),
    getChambers(),
  ]);

  if (!blog) notFound();

  const category = categories.find((c) => c.slug === blog.category_slug) || categories[0];
  const relatedBlogs = allBlogs.filter((b) => b.slug !== slug && b.category_slug === blog.category_slug);

  return (
    <SingleBlogClient
      blog={blog}
      category={category}
      categories={categories}
      relatedBlogs={relatedBlogs}
      conditions={conditions}
      settings={settings}
      chambers={chambers}
    />
  );
}
