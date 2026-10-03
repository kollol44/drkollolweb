'use client';

import React, { useState } from 'react';
import { BookOpen, Edit3, Plus, Save, CheckCircle, X, Eye, EyeOff, Calendar } from 'lucide-react';
import type { BlogPost, Category } from '@/types/database';

interface AdminBlogsProps {
  blogs: BlogPost[];
  categories: Category[];
  onSaveBlog: (blog: BlogPost) => Promise<void>;
}

export function AdminBlogs({ blogs, categories, onSaveBlog }: AdminBlogsProps) {
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog({ ...blog });
    setSaveSuccess(false);
  };

  const handleAddNew = () => {
    const nextId = Math.max(...blogs.map((b) => b.id), 0) + 1;
    const now = new Date().toISOString();
    setEditingBlog({
      id: nextId,
      slug: `new-medical-article-${nextId}`,
      title_en: 'New Medical Article Title',
      title_bn: 'নতুন স্বাস্থ্য প্রবন্ধের শিরোনাম',
      category_slug: categories[0]?.slug || 'gallbladder',
      excerpt_en: 'Short summary of the medical insights and surgery advice.',
      excerpt_bn: 'চিকিৎসা পরামর্শ ও অস্ত্রোপচার সংক্রান্ত সারসংক্ষেপ।',
      content_en: 'Write comprehensive medical article content here...',
      content_bn: 'এখানে সম্পূর্ণ বিস্তারিত বাংলা প্রবন্ধ লিখুন...',
      is_published: true,
      published_at: now,
      reading_time_en: '4 min read',
      reading_time_bn: '৪ মিনিট পঠন',
    });
    setSaveSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    setSaving(true);
    try {
      await onSaveBlog(editingBlog);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setEditingBlog(null);
      }, 1000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-[#062F31]">Medical Articles & Blog Hub</h2>
          <p className="text-xs text-[#062F31]/60">
            Publish educational surgical guides in natural Bangla and English to inform patients and families.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B6E73] hover:bg-[#084f53] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Blogs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogs.map((blog) => (
          <div
            key={blog.slug}
            className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-md ${
              blog.is_published ? 'border-[#0B6E73]/15 hover:border-[#2BB3B1]' : 'border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B6E73] bg-[#2BB3B1]/10 px-2 py-0.5 rounded-full">
                {blog.category_slug}
              </span>
              <button
                onClick={() => handleEdit(blog)}
                className="p-1.5 rounded-lg bg-gray-50 hover:bg-[#EEF7F6] text-[#0B6E73] hover:text-[#062F31] transition-colors cursor-pointer border border-gray-200"
                title="Edit Article"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-serif font-bold text-base text-[#062F31] line-clamp-1 mb-1">
              {blog.title_en}
            </h3>
            <h4 className="text-xs font-semibold text-gray-600 line-clamp-1 mb-2 font-serif">
              {blog.title_bn}
            </h4>

            <p className="text-xs text-gray-500 line-clamp-2 mb-4">
              {blog.excerpt_en}
            </p>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(blog.published_at).toLocaleDateString()}</span>
                </span>
                <span>•</span>
                <span>{blog.reading_time_en || '4 min read'}</span>
              </div>

              <div>
                {blog.is_published ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <Eye className="w-3 h-3" /> Published
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-gray-400">
                    <EyeOff className="w-3 h-3" /> Draft
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Blog Modal */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#EEF7F6]/50">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#062F31]">
                  Edit Article: {editingBlog.title_en}
                </h3>
                <p className="text-xs text-gray-500 font-mono">Slug: {editingBlog.slug}</p>
              </div>
              <button
                onClick={() => setEditingBlog(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={editingBlog.slug}
                    onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                    className="w-full p-2.5 font-mono rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={editingBlog.category_slug}
                    onChange={(e) => setEditingBlog({ ...editingBlog, category_slug: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name_en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Title (EN)</label>
                  <input
                    type="text"
                    value={editingBlog.title_en}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title_en: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">শিরোনাম (BN)</label>
                  <input
                    type="text"
                    value={editingBlog.title_bn}
                    onChange={(e) => setEditingBlog({ ...editingBlog, title_bn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Excerpt (EN)</label>
                  <textarea
                    rows={2}
                    value={editingBlog.excerpt_en}
                    onChange={(e) => setEditingBlog({ ...editingBlog, excerpt_en: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">সারসংক্ষেপ (BN)</label>
                  <textarea
                    rows={2}
                    value={editingBlog.excerpt_bn}
                    onChange={(e) => setEditingBlog({ ...editingBlog, excerpt_bn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Article Content (EN)</label>
                <textarea
                  rows={6}
                  value={editingBlog.content_en}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content_en: e.target.value })}
                  className="w-full p-3 font-sans rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">সম্পূর্ণ প্রবন্ধের বিবরণ (BN)</label>
                <textarea
                  rows={6}
                  value={editingBlog.content_bn}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content_bn: e.target.value })}
                  className="w-full p-3 font-sans rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Reading Time (EN)</label>
                  <input
                    type="text"
                    value={editingBlog.reading_time_en || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, reading_time_en: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">পঠনের সময় (BN)</label>
                  <input
                    type="text"
                    value={editingBlog.reading_time_bn || ''}
                    onChange={(e) => setEditingBlog({ ...editingBlog, reading_time_bn: e.target.value })}
                    placeholder="যেমন: ৫ মিনিট পঠন"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={editingBlog.is_published}
                    onChange={(e) => setEditingBlog({ ...editingBlog, is_published: e.target.checked })}
                    className="w-4 h-4 text-[#0B6E73] rounded"
                  />
                  <span>Published on Website</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0B6E73] hover:bg-[#084f53] text-white font-semibold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <span>Saving...</span>
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-300" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Article</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
