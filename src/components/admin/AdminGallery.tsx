'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Play,
  X,
  Layers,
  ArrowUpDown,
  Eye,
  Film,
} from 'lucide-react';
import type { GalleryPhoto, GalleryVideo, GalleryCategory } from '@/types/database';
import { parseVideoUrl } from '@/lib/video-utils';

interface AdminGalleryProps {
  photos: GalleryPhoto[];
  videos: GalleryVideo[];
  onSavePhoto: (photo: GalleryPhoto) => Promise<void>;
  onDeletePhoto: (id: string) => Promise<void>;
  onSaveVideo: (video: GalleryVideo) => Promise<void>;
  onDeleteVideo: (id: string) => Promise<void>;
}

const CATEGORY_LABELS: Record<GalleryCategory, { en: string; bn: string }> = {
  ot: { en: 'Operation Theatre', bn: 'অপারেশন থিয়েটার' },
  chamber: { en: 'Consultation Chambers', bn: 'চেম্বার ও ক্লিনিক' },
  camp: { en: 'Health Camps', bn: 'স্বাস্থ্য ক্যাম্প' },
  conference: { en: 'Conferences & Seminars', bn: 'সম্মেলন ও সেমিনার' },
  patient: { en: 'Patient Care & Rounds', bn: 'রোগী সেবা ও ওয়ার্ড' },
  general: { en: 'Clinical Practice', bn: 'সাধারণ ক্লিনিক্যাল' },
};

export function AdminGallery({
  photos,
  videos,
  onSavePhoto,
  onDeletePhoto,
  onSaveVideo,
  onDeleteVideo,
}: AdminGalleryProps) {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');

  // Photo state
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoFilter, setPhotoFilter] = useState<string>('all');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadStats, setUploadStats] = useState<{
    originalSize: string;
    optimizedSize: string;
    savings: string;
  } | null>(null);
  const [photoForm, setPhotoForm] = useState<Partial<GalleryPhoto>>({
    title_en: '',
    title_bn: '',
    caption_en: '',
    caption_bn: '',
    image_url: '',
    category: 'ot',
    sort_order: 1,
    is_featured: true,
  });

  // Video state
  const [editingVideo, setEditingVideo] = useState<GalleryVideo | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [videoForm, setVideoForm] = useState<Partial<GalleryVideo>>({
    title_en: '',
    title_bn: '',
    description_en: '',
    description_bn: '',
    video_url: '',
    video_type: 'youtube',
    video_id: '',
    thumbnail_url: '',
    category: 'Laparoscopy',
    sort_order: 1,
    is_featured: true,
  });

  // Delete confirmations
  const [itemToDelete, setItemToDelete] = useState<{ type: 'photo' | 'video'; id: string; title: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // ----------------------------------------------------------------------------------
  // Photo Handlers
  // ----------------------------------------------------------------------------------
  const handleOpenPhotoModal = (photo?: GalleryPhoto) => {
    setUploadStats(null);
    if (photo) {
      setEditingPhoto(photo);
      setPhotoForm({ ...photo });
    } else {
      setEditingPhoto(null);
      setPhotoForm({
        id: 'photo_' + Date.now(),
        title_en: '',
        title_bn: '',
        caption_en: '',
        caption_bn: '',
        image_url: '',
        category: 'ot',
        sort_order: (photos.length || 0) + 1,
        is_featured: true,
      });
    }
    setIsPhotoModalOpen(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadStats(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPhotoForm((prev) => ({
          ...prev,
          image_url: data.url,
        }));
        setUploadStats({
          originalSize: data.originalSizeFormatted,
          optimizedSize: data.optimizedSizeFormatted,
          savings: data.savings,
        });
      } else {
        alert(data.message || 'Image optimization & upload failed.');
      }
    } catch {
      alert('Network error while uploading image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSavePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.image_url) {
      alert('Please upload an image or provide an image URL.');
      return;
    }
    if (!photoForm.title_en || !photoForm.title_bn) {
      alert('Please provide titles in both English and Bangla.');
      return;
    }

    setSaving(true);
    try {
      await onSavePhoto(photoForm as GalleryPhoto);
      setIsPhotoModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------------------------------------------------
  // Video Handlers
  // ----------------------------------------------------------------------------------
  const handleOpenVideoModal = (video?: GalleryVideo) => {
    if (video) {
      setEditingVideo(video);
      setVideoForm({ ...video });
    } else {
      setEditingVideo(null);
      setVideoForm({
        id: 'vid_' + Date.now(),
        title_en: '',
        title_bn: '',
        description_en: '',
        description_bn: '',
        video_url: '',
        video_type: 'youtube',
        video_id: '',
        thumbnail_url: '',
        category: 'Laparoscopy',
        sort_order: (videos.length || 0) + 1,
        is_featured: true,
      });
    }
    setIsVideoModalOpen(true);
  };

  const handleVideoUrlChange = (url: string) => {
    const parsed = parseVideoUrl(url);
    setVideoForm((prev) => ({
      ...prev,
      video_url: url,
      video_type: parsed.platform === 'facebook' ? 'facebook' : 'youtube',
      video_id: parsed.videoId || '',
      thumbnail_url: prev.thumbnail_url || parsed.thumbnailUrl || '',
    }));
  };

  const handleSaveVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.video_url) {
      alert('Please provide a valid YouTube or Facebook video URL.');
      return;
    }
    if (!videoForm.title_en || !videoForm.title_bn) {
      alert('Please provide titles in both English and Bangla.');
      return;
    }

    const parsed = parseVideoUrl(videoForm.video_url || '');
    const finalVideo: GalleryVideo = {
      ...(videoForm as GalleryVideo),
      video_type: parsed.platform === 'facebook' ? 'facebook' : 'youtube',
      video_id: parsed.videoId || videoForm.video_id || '',
      thumbnail_url: videoForm.thumbnail_url || parsed.thumbnailUrl || '/img/doctor-cta.webp',
    };

    setSaving(true);
    try {
      await onSaveVideo(finalVideo);
      setIsVideoModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------------------------------------------------
  // Filtered & Sorted Lists
  // ----------------------------------------------------------------------------------
  const filteredPhotos = photos.filter((p) => {
    if (photoFilter === 'all') return true;
    return p.category === photoFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-[#0B6E73]/15 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#0B6E73] uppercase tracking-wider mb-1">
              <Film className="w-4 h-4 text-[#2BB3B1]" />
              Media Management Console
            </div>
            <h2 className="text-2xl font-bold font-serif text-[#062F31]">
              Photo Gallery & Video Insights
            </h2>
            <p className="text-xs sm:text-sm text-[#3F6668] mt-1 max-w-2xl">
              Upload and organize clinical photos with automatic WebP storage optimization and manage YouTube / Facebook medical videos.
            </p>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex items-center gap-2 p-1.5 bg-[#EEF7F6] rounded-2xl border border-[#2BB3B1]/20">
            <button
              type="button"
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'photos'
                  ? 'bg-gradient-to-r from-[#0B6E73] to-[#2BB3B1] text-white shadow-md'
                  : 'text-[#062F31] hover:text-[#0B6E73]'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Photos ({photos.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'videos'
                  ? 'bg-gradient-to-r from-[#0B6E73] to-[#2BB3B1] text-white shadow-md'
                  : 'text-[#062F31] hover:text-[#0B6E73]'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Videos ({videos.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------------------- */}
      {/* TAB 1: PHOTOS */}
      {/* ---------------------------------------------------------------------------------- */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          {/* Controls Bar: Category Filters & Add Photo Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setPhotoFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  photoFilter === 'all'
                    ? 'bg-[#0B6E73] text-white shadow-xs'
                    : 'bg-white text-[#3F6668] border border-[#0B6E73]/15 hover:bg-[#EEF7F6]'
                }`}
              >
                All Categories ({photos.length})
              </button>
              {(Object.keys(CATEGORY_LABELS) as GalleryCategory[]).map((cat) => {
                const count = photos.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPhotoFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      photoFilter === cat
                        ? 'bg-[#0B6E73] text-white shadow-xs'
                        : 'bg-white text-[#3F6668] border border-[#0B6E73]/15 hover:bg-[#EEF7F6]'
                    }`}
                  >
                    {CATEGORY_LABELS[cat].en} ({count})
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handleOpenPhotoModal()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#0B6E73] to-[#2BB3B1] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Photo</span>
            </button>
          </div>

          {/* Photos Grid: 4 columns on large screens matching website specification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group bg-white rounded-2xl border border-[#0B6E73]/15 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                  <Image
                    src={photo.image_url}
                    alt={photo.title_en}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Category Badge */}
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#062F31]/80 text-white backdrop-blur-xs">
                    {CATEGORY_LABELS[photo.category]?.en || photo.category}
                  </span>

                  {/* Featured Badge */}
                  {photo.is_featured && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#2BB3B1] text-white shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Home
                    </span>
                  )}

                  {/* Sort Order */}
                  <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/90 text-[#062F31]">
                    #{photo.sort_order}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#062F31] line-clamp-1">
                      {photo.title_en}
                    </h3>
                    <p className="text-[11px] text-[#0B6E73] font-medium line-clamp-1 mt-0.5">
                      {photo.title_bn}
                    </p>
                    {photo.caption_en && (
                      <p className="text-[11px] text-[#3F6668] line-clamp-2 mt-1.5 leading-relaxed">
                        {photo.caption_en}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleOpenPhotoModal(photo)}
                      className="p-1.5 rounded-lg text-[#0B6E73] hover:bg-[#EEF7F6] transition-colors"
                      title="Edit photo details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setItemToDelete({ type: 'photo', id: photo.id, title: photo.title_en })
                      }
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredPhotos.length === 0 && (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-[#0B6E73]/20">
                <ImageIcon className="w-10 h-10 text-[#0B6E73]/40 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-[#062F31]">No photos in this category</h4>
                <p className="text-xs text-[#3F6668] mt-1">Upload photos to populate this category.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------------------- */}
      {/* TAB 2: VIDEOS */}
      {/* ---------------------------------------------------------------------------------- */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#3F6668]">
              Manage surgical guides, procedure explanations, and live Q&A videos from YouTube or Facebook.
            </p>
            <button
              type="button"
              onClick={() => handleOpenVideoModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#0B6E73] to-[#2BB3B1] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Video Link</span>
            </button>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {videos.map((vid) => {
              const parsed = parseVideoUrl(vid.video_url);
              const thumb = vid.thumbnail_url || parsed.thumbnailUrl || '/img/doctor-cta.webp';

              return (
                <div
                  key={vid.id}
                  className="group bg-white rounded-2xl border border-[#0B6E73]/15 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video bg-gray-900 overflow-hidden cursor-pointer">
                    <Image
                      src={thumb}
                      alt={vid.title_en}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Play Button Overlay */}
                    <button
                      type="button"
                      onClick={() => setPreviewVideoUrl(parsed.embedUrl)}
                      className="absolute inset-0 grid place-items-center bg-black/30 group-hover:bg-black/40 transition-colors"
                    >
                      <span className="w-11 h-11 rounded-full bg-white/95 text-[#0B6E73] grid place-items-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </span>
                    </button>

                    {/* Platform Tag */}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#062F31]/80 text-white backdrop-blur-xs uppercase">
                      {vid.video_type}
                    </span>

                    {/* Featured */}
                    {vid.is_featured && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#2BB3B1] text-white shadow-xs">
                        Home
                      </span>
                    )}

                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/90 text-[#062F31]">
                      #{vid.sort_order}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-[#062F31] line-clamp-1">
                        {vid.title_en}
                      </h3>
                      <p className="text-[11px] text-[#0B6E73] font-medium line-clamp-1 mt-0.5">
                        {vid.title_bn}
                      </p>
                      {vid.description_en && (
                        <p className="text-[11px] text-[#3F6668] line-clamp-2 mt-1.5 leading-relaxed">
                          {vid.description_en}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                      <a
                        href={vid.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-[#0B6E73] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Original Link
                      </a>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenVideoModal(vid)}
                          className="p-1.5 rounded-lg text-[#0B6E73] hover:bg-[#EEF7F6] transition-colors"
                          title="Edit video"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setItemToDelete({ type: 'video', id: vid.id, title: vid.title_en })
                          }
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------------------- */}
      {/* PHOTO UPLOAD / EDIT MODAL */}
      {/* ---------------------------------------------------------------------------------- */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#0B6E73]" />
                <h3 className="font-bold text-base font-serif text-[#062F31]">
                  {editingPhoto ? 'Edit Gallery Photo' : 'Upload & Add Clinical Photo'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePhotoSubmit} className="space-y-4 mt-4">
              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-bold text-[#062F31] mb-1.5">
                  Photo File (Auto-Optimized to WebP)
                </label>
                <div className="border-2 border-dashed border-[#2BB3B1]/40 rounded-2xl p-4 text-center bg-[#EEF7F6]/40 hover:bg-[#EEF7F6]/70 transition-colors relative">
                  {photoForm.image_url ? (
                    <div className="space-y-3">
                      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={photoForm.image_url}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <label className="cursor-pointer text-xs font-bold text-[#0B6E73] hover:underline flex items-center gap-1.5">
                          <UploadCloud className="w-4 h-4" />
                          Change Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer block py-6">
                      <UploadCloud className="w-10 h-10 text-[#0B6E73]/60 mx-auto mb-2" />
                      <span className="text-xs font-bold text-[#0B6E73] block">
                        Click to select image file
                      </span>
                      <span className="text-[11px] text-[#3F6668] block mt-1">
                        Any 5MB–15MB JPG/PNG is automatically compressed to WebP under 800KB.
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}

                  {uploadingImage && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#0B6E73] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold text-[#062F31]">
                        Optimizing & converting to WebP...
                      </span>
                    </div>
                  )}
                </div>

                {/* Storage Optimization Feedback Badge */}
                {uploadStats && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <b>Optimized:</b> {uploadStats.originalSize} →{' '}
                      <b>{uploadStats.optimizedSize}</b> ({uploadStats.savings})
                    </span>
                  </div>
                )}
              </div>

              {/* Or manual URL */}
              <div>
                <label className="block text-[11px] font-semibold text-[#3F6668] mb-1">
                  Or Direct Image URL / Path
                </label>
                <input
                  type="text"
                  value={photoForm.image_url || ''}
                  onChange={(e) => setPhotoForm({ ...photoForm, image_url: e.target.value })}
                  placeholder="/img/gallery/ot-laparoscopic-surgery.webp"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#0B6E73]"
                />
              </div>

              {/* Title EN & BN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#062F31] mb-1">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={photoForm.title_en || ''}
                    onChange={(e) => setPhotoForm({ ...photoForm, title_en: e.target.value })}
                    placeholder="Laparoscopic Surgery Setup"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#0B6E73]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#062F31] mb-1">
                    Title (Bangla) *
                  </label>
                  <input
                    type="text"
                    required
                    value={photoForm.title_bn || ''}
                    onChange={(e) => setPhotoForm({ ...photoForm, title_bn: e.target.value })}
                    placeholder="উন্নত ল্যাপারোস্কপিক অপারেশন থিয়েটার"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#0B6E73]"
                  />
                </div>
              </div>

              {/* Caption EN & BN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#062F31] mb-1">
                    Caption (English)
                  </label>
                  <textarea
                    rows={2}
                    value={photoForm.caption_en || ''}
                    onChange={(e) => setPhotoForm({ ...photoForm, caption_en: e.target.value })}
                    placeholder="Brief description of the clinical context..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#0B6E73]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#062F31] mb-1">
                    Caption (Bangla)
                  </label>
                  <textarea
                    rows={2}
                    value={photoForm.caption_bn || ''}
                    onChange={(e) => setPhotoForm({ ...photoForm, caption_bn: e.target.value })}
                    placeholder="ছবির সংক্ষিপ্ত বিবরণ..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#0B6E73]"
                  />
                </div>
              </div>

              {/* Category, Sort Order, Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#062F31] mb-1">Category</label>
                  <select
                    value={photoForm.category || 'ot'}
                    onChange={(e) =>
                      setPhotoForm({ ...photoForm, category: e.target.value as GalleryCategory })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-hidden focus:border-[#0B6E73]"
                  >
                    {(Object.keys(CATEGORY_LABELS) as GalleryCategory[]).map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_LABELS[cat].en}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#062F31] mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={photoForm.sort_order ?? 1}
                    onChange={(e) =>
                      setPhotoForm({ ...photoForm, sort_order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#0B6E73]"
                  />
                </div>
                <div className="flex items-center sm:pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#062F31]">
                    <input
                      type="checkbox"
                      checked={photoForm.is_featured ?? true}
                      onChange={(e) => setPhotoForm({ ...photoForm, is_featured: e.target.checked })}
                      className="w-4 h-4 text-[#0B6E73] rounded-md focus:ring-0"
                    />
                    Feature on Homepage
                  </label>
                </div>
              </div>

              {/* Submit / Cancel */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#0B6E73] to-[#2BB3B1] rounded-xl shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingPhoto ? 'Update Photo' : 'Save Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------------------- */}
      {/* VIDEO ADD / EDIT MODAL */}
      {/* ---------------------------------------------------------------------------------- */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#0B6E73]" />
                <h3 className="font-bold text-base font-serif text-[#062F31]">
                  {editingVideo ? 'Edit Video Link' : 'Add Medical Video'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVideoSubmit} className="space-y-4 mt-4">
              {/* Video URL */}
              <div>
                <label className="block text-xs font-bold text-[#062F31] mb-1">
                  Video Link (YouTube or Facebook) *
                </label>
                <input
                  type="url"
                  required
                  value={videoForm.video_url || ''}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://fb.watch/..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#0B6E73]"
                />
                <span className="text-[11px] text-[#3F6668] block mt-1">
                  Supports YouTube standard watch URLs, share links, shorts, and Facebook video links.
                </span>
              </div>

              {/* Live Preview of detected video */}
              {videoForm.video_url && (
                <div className="p-3 bg-[#EEF7F6] rounded-2xl border border-[#2BB3B1]/20 flex items-center gap-3">
                  <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-200 relative shrink-0">
                    {videoForm.thumbnail_url && (
                      <Image
                        src={videoForm.thumbnail_url}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-xs">
                    <span className="font-bold text-[#0B6E73] block uppercase text-[10px]">
                      Detected: {videoForm.video_type}
                    </span>
                    <span className="text-[#3F6668] truncate block">
                      {videoForm.video_id ? `ID: ${videoForm.video_id}` : 'Direct Link'}
                    </span>
                  </div>
                </div>
              )}

              {/* Title EN & BN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#062F31] mb-1">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={videoForm.title_en || ''}
                    onChange={(e) => setVideoForm({ ...videoForm, title_en: e.target.value })}
                    placeholder="Laparoscopic Gallstone Surgery"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#0B6E73]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#062F31] mb-1">
                    Title (Bangla) *
                  </label>
                  <input
                    type="text"
                    required
                    value={videoForm.title_bn || ''}
                    onChange={(e) => setVideoForm({ ...videoForm, title_bn: e.target.value })}
                    placeholder="ল্যাপারোস্কপিক পিত্তথলির পাথর অপারেশন"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#0B6E73]"
                  />
                </div>
              </div>

              {/* Description EN & BN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#062F31] mb-1">
                    Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={videoForm.description_en || ''}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, description_en: e.target.value })
                    }
                    placeholder="What the patient learns from this video..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#0B6E73]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#062F31] mb-1">
                    Description (Bangla)
                  </label>
                  <textarea
                    rows={2}
                    value={videoForm.description_bn || ''}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, description_bn: e.target.value })
                    }
                    placeholder="ভিডিওর বিষয়বস্তু..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#0B6E73]"
                  />
                </div>
              </div>

              {/* Category, Sort Order, Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#062F31] mb-1">Category</label>
                  <input
                    type="text"
                    value={videoForm.category || ''}
                    onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                    placeholder="Laparoscopy / Colorectal"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#0B6E73]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#062F31] mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={videoForm.sort_order ?? 1}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, sort_order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#0B6E73]"
                  />
                </div>
                <div className="flex items-center sm:pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#062F31]">
                    <input
                      type="checkbox"
                      checked={videoForm.is_featured ?? true}
                      onChange={(e) => setVideoForm({ ...videoForm, is_featured: e.target.checked })}
                      className="w-4 h-4 text-[#0B6E73] rounded-md focus:ring-0"
                    />
                    Feature on Homepage
                  </label>
                </div>
              </div>

              {/* Submit / Cancel */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#0B6E73] to-[#2BB3B1] rounded-xl shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingVideo ? 'Update Video' : 'Save Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------------------- */}
      {/* VIDEO PREVIEW MODAL */}
      {/* ---------------------------------------------------------------------------------- */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-black rounded-3xl max-w-3xl w-full overflow-hidden relative shadow-2xl">
            <button
              type="button"
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/20 text-white grid place-items-center hover:bg-white/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={previewVideoUrl}
                title="Video Preview"
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ---------------------------------------------------------------------------------- */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 grid place-items-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#062F31]">Confirm Deletion</h3>
            <p className="text-xs text-[#3F6668] mt-1.5 leading-relaxed">
              Are you sure you want to remove &quot;{itemToDelete.title}&quot; from the medical {itemToDelete.type} library?
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (itemToDelete.type === 'photo') {
                    await onDeletePhoto(itemToDelete.id);
                  } else {
                    await onDeleteVideo(itemToDelete.id);
                  }
                  setItemToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
