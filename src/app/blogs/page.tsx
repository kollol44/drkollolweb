import React from 'react';
import { Metadata } from 'next';
import {
  getBlogs,
  getCategories,
  getSiteSettings,
  getChambers,
} from '@/lib/content/service';
import { BlogsHubClient } from '@/components/blogs/BlogsHubClient';

export const metadata: Metadata = {
  title: 'Surgical Health Blogs — Dr. Fahim Foysal Kollol',
  description:
    'Evidence-based surgical guides, recovery timelines, and symptom awareness on piles, fistula, gallstones, hernia, and breast lumps written by Dr. Fahim Foysal Kollol.',
};

export const revalidate = 60;

export default async function BlogsPage() {
  const [blogs, categories, settings, chambers] = await Promise.all([
    getBlogs(),
    getCategories(),
    getSiteSettings(),
    getChambers(),
  ]);

  return (
    <BlogsHubClient
      blogs={blogs}
      categories={categories}
      settings={settings}
      chambers={chambers}
    />
  );
}
