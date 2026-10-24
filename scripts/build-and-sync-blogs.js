// scripts/build-and-sync-blogs.js
// Synchronizes 10 comprehensive medical articles (1,200 - 1,500+ words each)
// Covers all 7 surgical categories: colorectal, gallbladder, abdomen, breast, urinary, testis-veins, skin.
// Updates default-data.ts, Supabase blogs table, and schema.sql.

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function getEnv(key) {
  if (process.env[key]) return process.env[key];
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith(`${key}=`)) {
        return trimmed.slice(key.length + 1).replace(/^["']|["']$/g, '');
      }
    }
  }
  return '';
}

const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL') || 'https://pvnhymckyxnwiluvajlc.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY');

async function main() {
  console.log('Loading 10 comprehensive medical blog articles...');
  const blogs = [];
  for (let i = 1; i <= 10; i++) {
    const blog = require(`./blogs_data/blog${i}.js`);
    blogs.push(blog);
    const enWords = blog.content_en.trim().split(/\s+/).length;
    const bnWords = blog.content_bn.trim().split(/\s+/).length;
    console.log(`- Blog ${i} [${blog.category_slug}]: "${blog.title_en.slice(0, 40)}..." (EN: ${enWords} words, BN: ${bnWords} words)`);
  }

  // 1. Update src/lib/content/default-data.ts
  console.log('\n1. Updating src/lib/content/default-data.ts...');
  const defaultDataPath = path.resolve(__dirname, '../src/lib/content/default-data.ts');
  let defaultDataContent = fs.readFileSync(defaultDataPath, 'utf8');

  // Format the DEFAULT_BLOGS TypeScript array
  let blogsTsCode = 'export const DEFAULT_BLOGS: BlogPost[] = [\n';
  for (const b of blogs) {
    blogsTsCode += `  {\n`;
    blogsTsCode += `    id: ${b.id},\n`;
    blogsTsCode += `    slug: ${JSON.stringify(b.slug)},\n`;
    blogsTsCode += `    title_en: ${JSON.stringify(b.title_en)},\n`;
    blogsTsCode += `    title_bn: ${JSON.stringify(b.title_bn)},\n`;
    blogsTsCode += `    category_slug: ${JSON.stringify(b.category_slug)},\n`;
    blogsTsCode += `    excerpt_en: ${JSON.stringify(b.excerpt_en)},\n`;
    blogsTsCode += `    excerpt_bn: ${JSON.stringify(b.excerpt_bn)},\n`;
    blogsTsCode += `    content_en: \`${b.content_en.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`,\n`;
    blogsTsCode += `    content_bn: \`${b.content_bn.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`,\n`;
    blogsTsCode += `    cover_image: ${JSON.stringify(b.cover_image || '')},\n`;
    blogsTsCode += `    is_published: true,\n`;
    blogsTsCode += `    published_at: ${JSON.stringify(b.published_at)},\n`;
    blogsTsCode += `    reading_time_en: ${JSON.stringify(b.reading_time_en)},\n`;
    blogsTsCode += `    reading_time_bn: ${JSON.stringify(b.reading_time_bn)},\n`;
    blogsTsCode += `  },\n`;
  }
  blogsTsCode += '];';

  const blogStartIdx = defaultDataContent.indexOf('export const DEFAULT_BLOGS: BlogPost[] = [');
  const galleryPhotosIdx = defaultDataContent.indexOf('export const DEFAULT_GALLERY_PHOTOS: GalleryPhoto[] = [');

  if (blogStartIdx === -1 || galleryPhotosIdx === -1) {
    throw new Error('Could not find markers for DEFAULT_BLOGS in default-data.ts');
  }

  const beforeBlogs = defaultDataContent.slice(0, blogStartIdx);
  const afterBlogs = defaultDataContent.slice(galleryPhotosIdx);
  const newDefaultDataContent = beforeBlogs + blogsTsCode + '\n\n' + afterBlogs;

  fs.writeFileSync(defaultDataPath, newDefaultDataContent, 'utf8');
  console.log('Successfully updated src/lib/content/default-data.ts!');

  // 2. Update Supabase public.blogs table
  console.log('\n2. Updating Supabase database table `public.blogs`...');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });

  // Delete existing blogs
  console.log('Clearing existing old stub blogs from Supabase...');
  const { error: delError } = await supabase.from('blogs').delete().neq('id', 0);
  if (delError) {
    console.error('Error deleting old blogs:', delError);
  } else {
    console.log('Successfully cleared old blogs.');
  }

  // Insert 10 new blogs
  console.log('Inserting 10 new comprehensive blogs into Supabase...');
  const recordsToInsert = blogs.map(b => ({
    id: b.id,
    slug: b.slug,
    title_en: b.title_en,
    title_bn: b.title_bn,
    category_slug: b.category_slug,
    excerpt_en: b.excerpt_en,
    excerpt_bn: b.excerpt_bn,
    content_en: b.content_en,
    content_bn: b.content_bn,
    cover_image: b.cover_image || '',
    reading_time_en: b.reading_time_en,
    reading_time_bn: b.reading_time_bn,
    is_published: true,
    published_at: b.published_at,
    updated_at: new Date().toISOString()
  }));

  const { data: insertedData, error: insError } = await supabase.from('blogs').insert(recordsToInsert).select('id, slug, category_slug, title_en');
  if (insError) {
    console.error('Error inserting new blogs:', insError);
    throw insError;
  } else {
    console.log(`Successfully inserted ${insertedData.length} blogs into Supabase!`);
    insertedData.forEach(row => {
      console.log(`  [${row.id}] ${row.category_slug} -> ${row.slug}`);
    });
  }

  // 3. Update supabase/schema.sql
  console.log('\n3. Updating supabase/schema.sql seed data...');
  const schemaPath = path.resolve(__dirname, '../supabase/schema.sql');
  if (fs.existsSync(schemaPath)) {
    let schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const sqlBlogStart = schemaContent.indexOf('-- 7.10 Medical Articles & Blogs (10 Full Articles)');
    const sqlBlogEnd = schemaContent.indexOf('-- 7.11 Super Admin Credentials');

    if (sqlBlogStart !== -1 && sqlBlogEnd !== -1) {
      function escapeSql(str) {
        return (str || '').replace(/'/g, "''");
      }

      let sqlInserts = `-- 7.10 Medical Articles & Blogs (10 Full Articles)\nINSERT INTO public.blogs (\n    id, slug, title_en, title_bn, category_slug, excerpt_en, excerpt_bn,\n    content_en, content_bn, cover_image, reading_time_en, reading_time_bn,\n    is_published, published_at\n) VALUES\n`;

      const valueClauses = blogs.map(b => {
        return `(\n    ${b.id},\n    '${escapeSql(b.slug)}',\n    '${escapeSql(b.title_en)}',\n    '${escapeSql(b.title_bn)}',\n    '${escapeSql(b.category_slug)}',\n    '${escapeSql(b.excerpt_en)}',\n    '${escapeSql(b.excerpt_bn)}',\n    '${escapeSql(b.content_en)}',\n    '${escapeSql(b.content_bn)}',\n    '${escapeSql(b.cover_image || '')}',\n    '${escapeSql(b.reading_time_en)}',\n    '${escapeSql(b.reading_time_bn)}',\n    TRUE,\n    '${escapeSql(b.published_at)}'\n)`;
      });

      sqlInserts += valueClauses.join(',\n') + '\n';
      sqlInserts += `ON CONFLICT (id) DO UPDATE SET\n    slug = EXCLUDED.slug,\n    title_en = EXCLUDED.title_en,\n    title_bn = EXCLUDED.title_bn,\n    category_slug = EXCLUDED.category_slug,\n    excerpt_en = EXCLUDED.excerpt_en,\n    excerpt_bn = EXCLUDED.excerpt_bn,\n    content_en = EXCLUDED.content_en,\n    content_bn = EXCLUDED.content_bn,\n    cover_image = EXCLUDED.cover_image,\n    reading_time_en = EXCLUDED.reading_time_en,\n    reading_time_bn = EXCLUDED.reading_time_bn,\n    is_published = EXCLUDED.is_published,\n    published_at = EXCLUDED.published_at,\n    updated_at = NOW();\n\nSELECT setval(pg_get_serial_sequence('public.blogs', 'id'), COALESCE((SELECT MAX(id) FROM public.blogs), 1));\n\n`;

      const beforeSql = schemaContent.slice(0, sqlBlogStart);
      const afterSql = schemaContent.slice(sqlBlogEnd);
      const newSchema = beforeSql + sqlInserts + afterSql;
      fs.writeFileSync(schemaPath, newSchema, 'utf8');
      console.log('Successfully updated supabase/schema.sql seed data!');
    }
  }

  console.log('\n=== ALL BLOG SYNCHRONIZATION TASKS COMPLETED SUCCESSFULLY! ===');
}

main().catch(err => {
  console.error('Fatal error during blog synchronization:', err);
  process.exit(1);
});
