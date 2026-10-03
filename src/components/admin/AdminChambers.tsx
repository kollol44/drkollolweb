'use client';

import React, { useState } from 'react';
import { Building2, Edit3, Plus, Save, CheckCircle, X, MapPin, Clock } from 'lucide-react';
import type { Chamber } from '@/types/database';

interface AdminChambersProps {
  chambers: Chamber[];
  onSaveChamber: (chamber: Chamber) => Promise<void>;
}

export function AdminChambers({ chambers, onSaveChamber }: AdminChambersProps) {
  const [editingChamber, setEditingChamber] = useState<Chamber | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleEdit = (chamber: Chamber) => {
    setEditingChamber({ ...chamber });
    setSaveSuccess(false);
  };

  const handleAddNew = () => {
    const nextId = Math.max(...chambers.map((c) => c.id), 0) + 1;
    setEditingChamber({
      id: nextId,
      name_en: 'New Chamber Hospital',
      name_bn: 'নতুন চেম্বার হাসপাতাল',
      schedule_en: 'Saturday - Thursday',
      schedule_bn: 'শনিবার - বৃহস্পতিবার',
      timing_en: '5:00 PM - 9:00 PM',
      timing_bn: 'বিকাল ৫:০০ - রাত ৯:০০',
      address_en: 'Room 201, 2nd Floor, Medical Road',
      address_bn: 'রুম ২০১, ২য় তলা, মেডিকেল রোড',
      map_query: 'Mymensingh Medical College',
      is_highlighted: false,
      is_map_verified: true,
      sort_order: nextId,
    });
    setSaveSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChamber) return;

    setSaving(true);
    try {
      await onSaveChamber(editingChamber);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setEditingChamber(null);
      }, 1000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-2xl text-[#062F31]">Chambers & Visiting Hours</h2>
          <p className="text-xs text-[#062F31]/60">
            Control consultation locations across Sherpur and Mymensingh, patient serial schedules, and map directions.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B6E73] hover:bg-[#084f53] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Chamber</span>
        </button>
      </div>

      {/* Chambers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chambers.map((chamber) => (
          <div
            key={chamber.id}
            className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-md ${
              chamber.is_highlighted ? 'border-[#2BB3B1] ring-1 ring-[#2BB3B1]/30' : 'border-[#0B6E73]/15'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2BB3B1]/10 text-[#0B6E73] flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#062F31]">{chamber.name_en}</h3>
                  <p className="text-xs text-gray-500">{chamber.name_bn}</p>
                </div>
              </div>

              <button
                onClick={() => handleEdit(chamber)}
                className="p-1.5 rounded-lg bg-gray-50 hover:bg-[#EEF7F6] text-[#0B6E73] hover:text-[#062F31] transition-colors cursor-pointer border border-gray-200"
                title="Edit Chamber"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-600 my-3">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#0B6E73] shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-[#062F31]">{chamber.schedule_en}</div>
                  <div className="text-[11px] text-gray-500">{chamber.timing_en}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#0B6E73] shrink-0 mt-0.5" />
                <div>
                  <div>{chamber.address_en}</div>
                  <div className="text-[11px] text-gray-500">{chamber.address_bn}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
              {chamber.is_highlighted ? (
                <span className="px-2 py-0.5 rounded bg-[#2BB3B1]/10 text-[#0B6E73] font-bold">
                  Primary Chamber
                </span>
              ) : (
                <span className="text-gray-400">Standard</span>
              )}
              <span className="font-mono text-gray-400">Order: {chamber.sort_order}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Chamber Modal */}
      {editingChamber && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#EEF7F6]/50">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#062F31]">
                  Edit Chamber #{editingChamber.id}
                </h3>
                <p className="text-xs text-gray-500">{editingChamber.name_en}</p>
              </div>
              <button
                onClick={() => setEditingChamber(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Chamber Name (EN)</label>
                  <input
                    type="text"
                    value={editingChamber.name_en}
                    onChange={(e) => setEditingChamber({ ...editingChamber, name_en: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">চেম্বারের নাম (BN)</label>
                  <input
                    type="text"
                    value={editingChamber.name_bn}
                    onChange={(e) => setEditingChamber({ ...editingChamber, name_bn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Schedule Days (EN)</label>
                  <input
                    type="text"
                    value={editingChamber.schedule_en}
                    onChange={(e) => setEditingChamber({ ...editingChamber, schedule_en: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">সাপ্তাহিক দিন (BN)</label>
                  <input
                    type="text"
                    value={editingChamber.schedule_bn}
                    onChange={(e) => setEditingChamber({ ...editingChamber, schedule_bn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Visiting Hours (EN)</label>
                  <input
                    type="text"
                    value={editingChamber.timing_en}
                    onChange={(e) => setEditingChamber({ ...editingChamber, timing_en: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">রোগী দেখার সময় (BN)</label>
                  <input
                    type="text"
                    value={editingChamber.timing_bn}
                    onChange={(e) => setEditingChamber({ ...editingChamber, timing_bn: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Address Details (EN)</label>
                <input
                  type="text"
                  value={editingChamber.address_en}
                  onChange={(e) => setEditingChamber({ ...editingChamber, address_en: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">ঠিকানার বিবরণ (BN)</label>
                <input
                  type="text"
                  value={editingChamber.address_bn}
                  onChange={(e) => setEditingChamber({ ...editingChamber, address_bn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Google Maps Query / Location</label>
                  <input
                    type="text"
                    value={editingChamber.map_query}
                    onChange={(e) => setEditingChamber({ ...editingChamber, map_query: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editingChamber.sort_order}
                    onChange={(e) => setEditingChamber({ ...editingChamber, sort_order: parseInt(e.target.value) || 1 })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2BB3B1]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={editingChamber.is_highlighted}
                    onChange={(e) => setEditingChamber({ ...editingChamber, is_highlighted: e.target.checked })}
                    className="w-4 h-4 text-[#0B6E73] rounded"
                  />
                  <span>Mark as Highlighted / Main Hospital</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingChamber(null)}
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
                      <span>Save Chamber</span>
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
