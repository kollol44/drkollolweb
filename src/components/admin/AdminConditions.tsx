'use client';

import React, { useState } from 'react';
import { Search, Edit3, CheckCircle, Save, X, Eye, EyeOff } from 'lucide-react';
import type { Condition, Category } from '@/types/database';

interface AdminConditionsProps {
  conditions: Condition[];
  categories: Category[];
  onSaveCondition: (condition: Condition) => Promise<void>;
}

export function AdminConditions({ conditions, categories, onSaveCondition }: AdminConditionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCondition, setEditingCondition] = useState<Condition | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filtered
  const filtered = conditions.filter((c) => {
    const matchesCat = selectedCategory === 'all' || c.category_slug === selectedCategory;
    const matchesQuery =
      c.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name_bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.med_en.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleEditClick = (cond: Condition) => {
    setEditingCondition({ ...cond });
    setSaveSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCondition) return;

    setSaving(true);
    try {
      await onSaveCondition(editingCondition);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setEditingCondition(null);
      }, 1000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-[#062F31]">Clinical Conditions (26)</h2>
          <p className="text-xs text-[#062F31]/60">
            Control laparoscopic tags, clinical descriptions, symptoms, and surgical treatments for each condition.
          </p>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#0B6E73]/15 space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#0B6E73] text-white shadow-sm'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Conditions ({conditions.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-[#0B6E73] text-white shadow-sm'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.name_en}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search condition by name or medical terminology..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
          />
        </div>
      </div>

      {/* Conditions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cond) => (
          <div
            key={cond.slug}
            className={`bg-white rounded-2xl border p-4.5 transition-all hover:shadow-md relative ${
              cond.is_hidden ? 'opacity-50 border-gray-200' : 'border-[#0B6E73]/15 hover:border-[#2BB3B1]'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B6E73] bg-[#2BB3B1]/10 px-2 py-0.5 rounded-full">
                  {cond.category_slug}
                </span>
                <h3 className="font-serif font-bold text-base text-[#062F31] mt-1.5">
                  {cond.name_en}
                </h3>
                <div className="text-xs text-gray-500 font-medium">
                  {cond.name_bn} • <span className="font-mono">{cond.med_en}</span>
                </div>
              </div>

              <button
                onClick={() => handleEditClick(cond)}
                className="p-2 rounded-xl bg-gray-50 hover:bg-[#EEF7F6] text-[#0B6E73] hover:text-[#062F31] transition-colors cursor-pointer border border-gray-200/80"
                title="Edit Condition"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 line-clamp-2 my-2.5">
              {cond.short_en}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px]">
              <div className="flex items-center gap-1.5">
                {cond.is_laparoscopic && (
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    Laparoscopic
                  </span>
                )}
                {cond.is_hidden && (
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> Hidden
                  </span>
                )}
              </div>
              <span className="text-gray-400 font-mono">Order: {cond.sort_order}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingCondition && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#EEF7F6]/50">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#062F31]">
                  Edit Condition: {editingCondition.name_en}
                </h3>
                <p className="text-xs text-gray-500 font-mono">Slug: {editingCondition.slug}</p>
              </div>
              <button
                onClick={() => setEditingCondition(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Name (EN)</label>
                  <input
                    type="text"
                    value={editingCondition.name_en}
                    onChange={(e) => setEditingCondition({ ...editingCondition, name_en: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">নাম (BN)</label>
                  <input
                    type="text"
                    value={editingCondition.name_bn}
                    onChange={(e) => setEditingCondition({ ...editingCondition, name_bn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Medical Term (EN)</label>
                  <input
                    type="text"
                    value={editingCondition.med_en}
                    onChange={(e) => setEditingCondition({ ...editingCondition, med_en: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">চিকিৎসা পরিভাষা (BN)</label>
                  <input
                    type="text"
                    value={editingCondition.med_bn}
                    onChange={(e) => setEditingCondition({ ...editingCondition, med_bn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Short Description (EN)</label>
                  <textarea
                    rows={2}
                    value={editingCondition.short_en}
                    onChange={(e) => setEditingCondition({ ...editingCondition, short_en: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">সংক্ষেপ বিবরণ (BN)</label>
                  <textarea
                    rows={2}
                    value={editingCondition.short_bn}
                    onChange={(e) => setEditingCondition({ ...editingCondition, short_bn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
              </div>

              {/* Symptoms */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Symptoms (EN - Comma separated)</label>
                  <textarea
                    rows={2}
                    value={editingCondition.symptoms_en.join(', ')}
                    onChange={(e) =>
                      setEditingCondition({
                        ...editingCondition,
                        symptoms_en: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">লক্ষণসমূহ (BN - কমা দিয়ে আলাদা করুন)</label>
                  <textarea
                    rows={2}
                    value={editingCondition.symptoms_bn.join(', ')}
                    onChange={(e) =>
                      setEditingCondition({
                        ...editingCondition,
                        symptoms_bn: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
              </div>

              {/* Treatments */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Treatments (EN - Comma separated)</label>
                  <textarea
                    rows={2}
                    value={editingCondition.treat_en.join(', ')}
                    onChange={(e) =>
                      setEditingCondition({
                        ...editingCondition,
                        treat_en: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">চিকিৎসাপদ্ধতি (BN - কমা দিয়ে আলাদা করুন)</label>
                  <textarea
                    rows={2}
                    value={editingCondition.treat_bn.join(', ')}
                    onChange={(e) =>
                      setEditingCondition({
                        ...editingCondition,
                        treat_bn: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={editingCondition.is_laparoscopic}
                    onChange={(e) => setEditingCondition({ ...editingCondition, is_laparoscopic: e.target.checked })}
                    className="w-4 h-4 text-[#0B6E73] rounded"
                  />
                  <span>Laparoscopic Suitable</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={editingCondition.is_hidden}
                    onChange={(e) => setEditingCondition({ ...editingCondition, is_hidden: e.target.checked })}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <span>Hide from Website</span>
                </label>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCondition(null)}
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
                      <span>Save Changes</span>
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
