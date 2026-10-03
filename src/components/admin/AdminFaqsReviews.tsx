'use client';

import React, { useState } from 'react';
import { HelpCircle, Star, Edit3, Plus, Save, CheckCircle, X } from 'lucide-react';
import type { FAQ, Review } from '@/types/database';

interface AdminFaqsReviewsProps {
  faqs: FAQ[];
  reviews: Review[];
  onSaveFaq: (faq: FAQ) => Promise<void>;
  onSaveReview: (review: Review) => Promise<void>;
}

export function AdminFaqsReviews({ faqs, reviews, onSaveFaq, onSaveReview }: AdminFaqsReviewsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'faqs' | 'reviews'>('faqs');
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // FAQ Handlers
  const handleAddNewFaq = () => {
    const nextId = Math.max(...faqs.map((f) => f.id), 0) + 1;
    setEditingFaq({
      id: nextId,
      question_en: 'New clinical question?',
      question_bn: 'নতুন চিকিৎসা সংক্রান্ত প্রশ্ন?',
      answer_en: 'Detailed medical answer with surgical guidance.',
      answer_bn: 'অস্ত্রোপচার ও চিকিৎসা সংক্রান্ত বিস্তারিত উত্তর।',
      sort_order: nextId,
    });
    setSaveSuccess(false);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    setSaving(true);
    try {
      await onSaveFaq(editingFaq);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setEditingFaq(null);
      }, 1000);
    } finally {
      setSaving(false);
    }
  };

  // Review Handlers
  const handleAddNewReview = () => {
    const nextId = Math.max(...reviews.map((r) => r.id), 0) + 1;
    setEditingReview({
      id: nextId,
      author_name_en: 'Patient Name',
      author_name_bn: 'রোগীর নাম',
      author_meta_en: 'Sherpur • Gallbladder Surgery',
      author_meta_bn: 'শেরপুর • পিত্তথলির পাথর অপারেশন',
      quote_en: 'Excellent care, pain-free recovery and utmost kindness.',
      quote_bn: 'অসাধারণ চিকিৎসা ও খুব দ্রুত সুস্থ হয়েছি।',
      rating: 5,
      is_sample: false,
      is_featured: true,
      sort_order: nextId,
    });
    setSaveSuccess(false);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    setSaving(true);
    try {
      await onSaveReview(editingReview);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setEditingReview(null);
      }, 1000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-[#062F31]">FAQs & Patient Reviews</h2>
          <p className="text-xs text-[#062F31]/60">
            Manage frequently asked surgical questions and verified patient testimonials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveSubTab('faqs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'faqs' ? 'bg-white text-[#0B6E73] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              FAQs ({faqs.length})
            </button>
            <button
              onClick={() => setActiveSubTab('reviews')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'reviews' ? 'bg-white text-[#0B6E73] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          <button
            onClick={activeSubTab === 'faqs' ? handleAddNewFaq : handleAddNewReview}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0B6E73] hover:bg-[#084f53] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add {activeSubTab === 'faqs' ? 'FAQ' : 'Review'}</span>
          </button>
        </div>
      </div>

      {/* FAQs Tab */}
      {activeSubTab === 'faqs' && (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-[#0B6E73]/15 p-4.5 hover:border-[#2BB3B1] transition-all flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#0B6E73] font-bold">#{faq.sort_order}</span>
                  <h3 className="font-serif font-bold text-sm text-[#062F31]">{faq.question_en}</h3>
                </div>
                <h4 className="text-xs font-semibold text-gray-600 font-serif">{faq.question_bn}</h4>
                <p className="text-xs text-gray-500 pt-1 border-t border-gray-100">{faq.answer_en}</p>
              </div>

              <button
                onClick={() => {
                  setEditingFaq({ ...faq });
                  setSaveSuccess(false);
                }}
                className="p-1.5 rounded-lg bg-gray-50 hover:bg-[#EEF7F6] text-[#0B6E73] hover:text-[#062F31] transition-colors cursor-pointer border border-gray-200 shrink-0"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Reviews Tab */}
      {activeSubTab === 'reviews' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-[#0B6E73]/15 p-5 hover:border-[#2BB3B1] transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <h3 className="font-semibold text-sm text-[#062F31]">{rev.author_name_en} ({rev.author_name_bn})</h3>
                  <p className="text-xs text-gray-500">{rev.author_meta_en}</p>
                </div>

                <button
                  onClick={() => {
                    setEditingReview({ ...rev });
                    setSaveSuccess(false);
                  }}
                  className="p-1.5 rounded-lg bg-gray-50 hover:bg-[#EEF7F6] text-[#0B6E73] hover:text-[#062F31] transition-colors cursor-pointer border border-gray-200 shrink-0"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-gray-600 italic bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                &quot;{rev.quote_en}&quot;
              </p>
              <p className="text-xs text-gray-500 italic mt-1 font-serif">
                &quot;{rev.quote_bn}&quot;
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Edit FAQ Modal */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#EEF7F6]/50">
              <h3 className="font-serif font-bold text-lg text-[#062F31]">Edit FAQ #{editingFaq.id}</h3>
              <button
                onClick={() => setEditingFaq(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Question (EN)</label>
                <input
                  type="text"
                  value={editingFaq.question_en}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question_en: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">প্রশ্ন (BN)</label>
                <input
                  type="text"
                  value={editingFaq.question_bn}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question_bn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Answer (EN)</label>
                <textarea
                  rows={3}
                  value={editingFaq.answer_en}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer_en: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">উত্তর (BN)</label>
                <textarea
                  rows={3}
                  value={editingFaq.answer_bn}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer_bn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={editingFaq.sort_order}
                  onChange={(e) => setEditingFaq({ ...editingFaq, sort_order: parseInt(e.target.value) || 1 })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0B6E73] hover:bg-[#084f53] text-white font-semibold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <span>Saving...</span> : saveSuccess ? <span>Saved!</span> : <span>Save FAQ</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#EEF7F6]/50">
              <h3 className="font-serif font-bold text-lg text-[#062F31]">Edit Review #{editingReview.id}</h3>
              <button
                onClick={() => setEditingReview(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Author Name (EN)</label>
                  <input
                    type="text"
                    value={editingReview.author_name_en}
                    onChange={(e) => setEditingReview({ ...editingReview, author_name_en: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">রোগীর নাম (BN)</label>
                  <input
                    type="text"
                    value={editingReview.author_name_bn}
                    onChange={(e) => setEditingReview({ ...editingReview, author_name_bn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Procedure / Location (EN)</label>
                  <input
                    type="text"
                    value={editingReview.author_meta_en}
                    onChange={(e) => setEditingReview({ ...editingReview, author_meta_en: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">অপারেশন / এলাকা (BN)</label>
                  <input
                    type="text"
                    value={editingReview.author_meta_bn}
                    onChange={(e) => setEditingReview({ ...editingReview, author_meta_bn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Quote Review (EN)</label>
                <textarea
                  rows={2}
                  value={editingReview.quote_en}
                  onChange={(e) => setEditingReview({ ...editingReview, quote_en: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">রোগীর মন্তব্য (BN)</label>
                <textarea
                  rows={2}
                  value={editingReview.quote_bn}
                  onChange={(e) => setEditingReview({ ...editingReview, quote_bn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Star Rating (1-5)</label>
                  <select
                    value={editingReview.rating}
                    onChange={(e) => setEditingReview({ ...editingReview, rating: parseInt(e.target.value) || 5 })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editingReview.sort_order}
                    onChange={(e) => setEditingReview({ ...editingReview, sort_order: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={editingReview.is_featured}
                    onChange={(e) => setEditingReview({ ...editingReview, is_featured: e.target.checked })}
                    className="w-4 h-4 text-[#0B6E73] rounded"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0B6E73] hover:bg-[#084f53] text-white font-semibold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <span>Saving...</span> : saveSuccess ? <span>Saved!</span> : <span>Save Review</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
