'use client';

import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Star,
  Edit3,
  Plus,
  Save,
  CheckCircle,
  X,
  Trash2,
  ExternalLink,
  QrCode,
  Globe,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import type { FAQ, Review, SiteSettings } from '@/types/database';
import QRCodeLib from 'qrcode';

interface AdminFaqsReviewsProps {
  faqs: FAQ[];
  reviews: Review[];
  siteSettings?: SiteSettings | null;
  onSaveFaq: (faq: FAQ) => Promise<void>;
  onDeleteFaq?: (id: number) => Promise<void>;
  onSaveReview: (review: Review) => Promise<void>;
  onDeleteReview?: (id: number) => Promise<void>;
  onSaveSiteSettings?: (settings: SiteSettings) => Promise<void>;
}

export function AdminFaqsReviews({
  faqs,
  reviews,
  siteSettings,
  onSaveFaq,
  onDeleteFaq,
  onSaveReview,
  onDeleteReview,
  onSaveSiteSettings,
}: AdminFaqsReviewsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'faqs' | 'reviews'>('reviews');
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingId, setDeletingId] = useState<{ type: 'faq' | 'review'; id: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Google settings state
  const [googleUrl, setGoogleUrl] = useState(
    siteSettings?.google_review_url || 'https://maps.google.com/?cid=drkollol'
  );
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Generate QR for Google Review Link
  useEffect(() => {
    const targetUrl = googleUrl || 'https://maps.google.com';
    QRCodeLib.toDataURL(targetUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#062F31',
        light: '#FFFFFF',
      },
    })
      .then((dataUrl) => setQrPreviewUrl(dataUrl))
      .catch((err) => console.error('Admin QR Generation Error:', err));
  }, [googleUrl]);

  const handleSaveGoogleUrl = async () => {
    if (!siteSettings || !onSaveSiteSettings) return;
    setSavingSettings(true);
    try {
      await onSaveSiteSettings({
        ...siteSettings,
        google_review_url: googleUrl,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(googleUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

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
      }, 800);
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteFaq = async (id: number) => {
    if (!onDeleteFaq) return;
    if (confirm('Are you sure you want to permanently delete this FAQ?')) {
      await onDeleteFaq(id);
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
      quote_en: 'Excellent care, smooth keyhole surgery and quick recovery.',
      quote_bn: 'অসাধারণ চিকিৎসা ও খুব দ্রুত সুস্থ হয়েছি।',
      rating: 5,
      is_sample: false,
      is_featured: true,
      sort_order: nextId,
      google_review_url: googleUrl || 'https://maps.google.com',
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
      }, 800);
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteReview = async (id: number) => {
    if (!onDeleteReview) return;
    if (confirm('Are you sure you want to permanently delete this review?')) {
      await onDeleteReview(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Subtab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-[#062F31]">Patient Reviews & FAQs</h2>
          <p className="text-xs text-[#062F31]/60">
            Control verified Google patient testimonials, individual review links, QR codes, and clinical FAQs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveSubTab('reviews')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'reviews'
                  ? 'bg-white text-[#0B6E73] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveSubTab('faqs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'faqs'
                  ? 'bg-white text-[#0B6E73] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              FAQs ({faqs.length})
            </button>
          </div>

          <button
            onClick={activeSubTab === 'reviews' ? handleAddNewReview : handleAddNewFaq}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0B6E73] hover:bg-[#084f53] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add {activeSubTab === 'reviews' ? 'Review' : 'FAQ'}</span>
          </button>
        </div>
      </div>

      {/* Reviews Tab */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-6">
          {/* Google Profile & QR Code Master Card */}
          <div className="bg-gradient-to-br from-[#EEF7F6] to-white rounded-2xl border border-[#0B6E73]/20 p-5 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#2BB3B1]/40 flex items-center justify-center font-bold text-[#0B6E73] text-base shadow-xs">
                    G
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#062F31]">
                      Google Reviews &amp; Dynamic QR Code
                    </h3>
                    <p className="text-xs text-gray-500">
                      The primary review link used for the &quot;Write a review&quot; button, &quot;See reviews on Google&quot;, and the interactive QR code modal on the homepage.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={googleUrl}
                      onChange={(e) => setGoogleUrl(e.target.value)}
                      placeholder="https://maps.app.goo.gl/... or https://g.page/r/.../review"
                      className="w-full pl-3 pr-20 py-2 text-xs font-mono rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-semibold text-gray-600 hover:text-[#0B6E73] bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 flex items-center gap-1 transition-colors"
                    >
                      {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {onSaveSiteSettings && (
                    <button
                      type="button"
                      onClick={handleSaveGoogleUrl}
                      disabled={savingSettings}
                      className="px-4 py-2 bg-[#0B6E73] hover:bg-[#084f53] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {savingSettings ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save URL'}
                    </button>
                  )}

                  <a
                    href={googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </a>
                </div>
              </div>

              {/* QR Preview Pill */}
              <div className="bg-white rounded-xl p-3 border border-[#0B6E73]/15 flex items-center gap-3.5 shadow-xs shrink-0 self-start lg:self-center">
                {qrPreviewUrl ? (
                  <img
                    src={qrPreviewUrl}
                    alt="Google Review QR Code Preview"
                    className="w-16 h-16 rounded-lg border border-gray-100 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div className="text-left">
                  <div className="flex items-center gap-1 text-[#0B6E73] font-bold text-xs">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Live QR Code</span>
                  </div>
                  <p className="text-[11px] text-gray-500 max-w-[130px] leading-tight mt-0.5">
                    Scan with any phone to write a Google review.
                  </p>
                  {qrPreviewUrl && (
                    <a
                      href={qrPreviewUrl}
                      download="dr-kollol-google-review-qr.png"
                      className="inline-block text-[11px] text-[#2BB3B1] hover:underline font-semibold mt-1"
                    >
                      Download QR
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-[#0B6E73]/15 p-5 hover:border-[#2BB3B1] transition-all flex flex-col justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-[11px] font-mono font-bold text-gray-400">
                          #{rev.sort_order}
                        </span>
                        {rev.is_sample ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Sample
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                            Verified
                          </span>
                        )}
                        {rev.is_featured && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-[#0B6E73] border border-teal-200">
                            Homepage
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-sm text-[#062F31]">
                        {rev.author_name_en} <span className="font-normal text-gray-500 font-serif">({rev.author_name_bn})</span>
                      </h3>
                      <p className="text-xs text-gray-500">{rev.author_meta_en}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingReview({ ...rev });
                          setSaveSuccess(false);
                        }}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-[#EEF7F6] text-[#0B6E73] hover:text-[#062F31] transition-colors cursor-pointer border border-gray-200"
                        title="Edit Review"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {onDeleteReview && (
                        <button
                          onClick={() => confirmDeleteReview(rev.id)}
                          className="p-1.5 rounded-lg bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer border border-gray-200"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 italic bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                    &quot;{rev.quote_en}&quot;
                  </p>
                  <p className="text-xs text-gray-500 italic mt-1 font-serif px-1">
                    &quot;{rev.quote_bn}&quot;
                  </p>
                </div>

                {/* Individual Google Review Link */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <span className="font-semibold text-gray-700">Google Link:</span>
                    {rev.google_review_url ? (
                      <span className="text-emerald-700 font-mono truncate max-w-[200px]">
                        {rev.google_review_url}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Defaults to main profile</span>
                    )}
                  </div>

                  <a
                    href={rev.google_review_url || googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#0B6E73] hover:text-[#2BB3B1] font-semibold transition-colors"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    setEditingFaq({ ...faq });
                    setSaveSuccess(false);
                  }}
                  className="p-1.5 rounded-lg bg-gray-50 hover:bg-[#EEF7F6] text-[#0B6E73] hover:text-[#062F31] transition-colors cursor-pointer border border-gray-200"
                  title="Edit FAQ"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                {onDeleteFaq && (
                  <button
                    onClick={() => confirmDeleteFaq(faq.id)}
                    className="p-1.5 rounded-lg bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer border border-gray-200"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add FAQ Modal */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#EEF7F6]/50">
              <h3 className="font-serif font-bold text-lg text-[#062F31]">
                {editingFaq.id ? `Edit FAQ #${editingFaq.id}` : 'Add New FAQ'}
              </h3>
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
                  required
                  value={editingFaq.question_en}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question_en: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">প্রশ্ন (BN)</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question_bn}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question_bn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Answer (EN)</label>
                <textarea
                  rows={3}
                  required
                  value={editingFaq.answer_en}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer_en: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">উত্তর (BN)</label>
                <textarea
                  rows={3}
                  required
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

      {/* Edit / Add Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#EEF7F6]/50">
              <h3 className="font-serif font-bold text-lg text-[#062F31]">
                {editingReview.id ? `Edit Review #${editingReview.id}` : 'Add New Review'}
              </h3>
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
                    required
                    value={editingReview.author_name_en}
                    onChange={(e) => setEditingReview({ ...editingReview, author_name_en: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                    placeholder="e.g. A. R. Rahman"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">রোগীর নাম (BN)</label>
                  <input
                    type="text"
                    required
                    value={editingReview.author_name_bn}
                    onChange={(e) => setEditingReview({ ...editingReview, author_name_bn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                    placeholder="যেমন: আ. র. রহমান"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Procedure / Location (EN)</label>
                  <input
                    type="text"
                    required
                    value={editingReview.author_meta_en}
                    onChange={(e) => setEditingReview({ ...editingReview, author_meta_en: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                    placeholder="e.g. 45 yrs · Sherpur · Piles"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">অপারেশন / এলাকা (BN)</label>
                  <input
                    type="text"
                    required
                    value={editingReview.author_meta_bn}
                    onChange={(e) => setEditingReview({ ...editingReview, author_meta_bn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                    placeholder="যেমন: ৪৫ বছর · শেরপুর · পাইলস"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Quote Review (EN)</label>
                <textarea
                  rows={2}
                  required
                  value={editingReview.quote_en}
                  onChange={(e) => setEditingReview({ ...editingReview, quote_en: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  placeholder="Patient testimonial in English..."
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">রোগীর মন্তব্য (BN)</label>
                <textarea
                  rows={2}
                  required
                  value={editingReview.quote_bn}
                  onChange={(e) => setEditingReview({ ...editingReview, quote_bn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  placeholder="রোগীর অভিজ্ঞতা বাংলায় লিখুন..."
                />
              </div>

              {/* Direct Google Review URL field */}
              <div className="bg-[#EEF7F6]/50 p-3.5 rounded-2xl border border-[#2BB3B1]/20 space-y-1.5">
                <label className="block font-semibold text-[#062F31] flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-[#0B6E73]" />
                  <span>Direct Google Review URL (Optional)</span>
                </label>
                <input
                  type="url"
                  value={editingReview.google_review_url || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, google_review_url: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-[#2BB3B1] bg-white"
                  placeholder="https://maps.app.goo.gl/... or direct review link"
                />
                <span className="text-[11px] text-gray-500 block leading-tight">
                  When patients click &quot;View on Google&quot; on this specific card, they will jump directly to this actual Google Review. If empty, it defaults to the clinic&apos;s main review profile.
                </span>
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

              <div className="grid grid-cols-2 gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <input
                    type="checkbox"
                    checked={editingReview.is_featured}
                    onChange={(e) => setEditingReview({ ...editingReview, is_featured: e.target.checked })}
                    className="w-4 h-4 text-[#0B6E73] rounded"
                  />
                  <span>Show on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <input
                    type="checkbox"
                    checked={!editingReview.is_sample}
                    onChange={(e) => setEditingReview({ ...editingReview, is_sample: !e.target.checked })}
                    className="w-4 h-4 text-[#0B6E73] rounded"
                  />
                  <span>Verified Patient Badge</span>
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
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0B6E73] hover:bg-[#084f53] text-white font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
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
