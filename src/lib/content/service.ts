import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_HERO_SECTION,
  DEFAULT_SURGEON_PROFILE,
  DEFAULT_CATEGORIES,
  DEFAULT_CONDITIONS,
  DEFAULT_SERIAL_STEPS,
  DEFAULT_CHAMBERS,
  DEFAULT_REVIEWS,
  DEFAULT_FAQS,
  DEFAULT_BLOGS,
} from './default-data';
import {
  SiteSettings,
  HeroSection,
  SurgeonProfile,
  Category,
  Condition,
  SerialStep,
  Chamber,
  Review,
  FAQ,
  BlogPost,
  Appointment,
} from '@/types/database';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// In-memory runtime store for development & mock fallback
let memSiteSettings: SiteSettings = { ...DEFAULT_SITE_SETTINGS };
let memHeroSection: HeroSection = { ...DEFAULT_HERO_SECTION };
let memSurgeonProfile: SurgeonProfile = { ...DEFAULT_SURGEON_PROFILE };
let memCategories: Category[] = [...DEFAULT_CATEGORIES];
let memConditions: Condition[] = [...DEFAULT_CONDITIONS];
let memSerialSteps: SerialStep[] = [...DEFAULT_SERIAL_STEPS];
let memChambers: Chamber[] = [...DEFAULT_CHAMBERS];
let memReviews: Review[] = [...DEFAULT_REVIEWS];
let memFaqs: FAQ[] = [...DEFAULT_FAQS];
let memBlogs: BlogPost[] = [...DEFAULT_BLOGS];
let memAppointments: Appointment[] = [];

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
      if (!error && data) {
        memSiteSettings = data as SiteSettings;
        return memSiteSettings;
      }
    } catch (e) {
      console.warn('Falling back to cached site settings:', e);
    }
  }
  return memSiteSettings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  memSiteSettings = { ...memSiteSettings, ...settings, updated_at: new Date().toISOString() };
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('site_settings').upsert(memSiteSettings);
      if (error) console.error('Supabase updateSiteSettings error:', error);
    } catch (e) {
      console.error('Supabase updateSiteSettings exception:', e);
    }
  }
  return memSiteSettings;
}

export async function getHeroSection(): Promise<HeroSection> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('hero_section').select('*').limit(1).single();
      if (!error && data) {
        memHeroSection = data as HeroSection;
        return memHeroSection;
      }
    } catch (e) {
      console.warn('Falling back to cached hero section:', e);
    }
  }
  return memHeroSection;
}

export async function updateHeroSection(hero: Partial<HeroSection>): Promise<HeroSection> {
  memHeroSection = { ...memHeroSection, ...hero, updated_at: new Date().toISOString() };
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('hero_section').upsert(memHeroSection);
      if (error) console.error('Supabase updateHeroSection error:', error);
    } catch (e) {
      console.error('Supabase updateHeroSection exception:', e);
    }
  }
  return memHeroSection;
}

export async function getSurgeonProfile(): Promise<SurgeonProfile> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('surgeon_profile').select('*').limit(1).single();
      if (!error && data) {
        memSurgeonProfile = data as SurgeonProfile;
        return memSurgeonProfile;
      }
    } catch (e) {
      console.warn('Falling back to cached surgeon profile:', e);
    }
  }
  return memSurgeonProfile;
}

export async function updateSurgeonProfile(profile: Partial<SurgeonProfile>): Promise<SurgeonProfile> {
  memSurgeonProfile = { ...memSurgeonProfile, ...profile, updated_at: new Date().toISOString() };
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('surgeon_profile').upsert(memSurgeonProfile);
      if (error) console.error('Supabase updateSurgeonProfile error:', error);
    } catch (e) {
      console.error('Supabase updateSurgeonProfile exception:', e);
    }
  }
  return memSurgeonProfile;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        memCategories = data as Category[];
        return memCategories;
      }
    } catch (e) {
      console.warn('Falling back to cached categories:', e);
    }
  }
  return memCategories;
}

export async function getConditions(categorySlug?: string): Promise<Condition[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      let query = supabase.from('conditions').select('*').eq('is_hidden', false).order('sort_order', { ascending: true });
      if (categorySlug) {
        query = query.eq('category_slug', categorySlug);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Condition[];
      }
    } catch (e) {
      console.warn('Falling back to cached conditions:', e);
    }
  }
  let list = memConditions.filter((c) => !c.is_hidden);
  if (categorySlug) {
    list = list.filter((c) => c.category_slug === categorySlug);
  }
  return list;
}

export async function getAllConditionsAdmin(): Promise<Condition[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('conditions').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        memConditions = data as Condition[];
        return memConditions;
      }
    } catch (e) {
      console.warn('Falling back to all mem conditions:', e);
    }
  }
  return memConditions;
}

export async function getConditionBySlug(slug: string): Promise<Condition | null> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('conditions').select('*').eq('slug', slug).single();
      if (!error && data) return data as Condition;
    } catch (e) {
      console.warn('Falling back to cached condition by slug:', e);
    }
  }
  return memConditions.find((c) => c.slug === slug) || null;
}

export async function saveCondition(condition: Condition): Promise<Condition> {
  const idx = memConditions.findIndex((c) => c.slug === condition.slug);
  if (idx >= 0) {
    memConditions[idx] = { ...memConditions[idx], ...condition };
  } else {
    memConditions.push(condition);
  }

  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('conditions').upsert(condition);
      if (error) console.error('Supabase saveCondition error:', error);
    } catch (e) {
      console.error('Supabase saveCondition exception:', e);
    }
  }
  return condition;
}

export async function deleteCondition(slug: string): Promise<boolean> {
  memConditions = memConditions.filter((c) => c.slug !== slug);
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('conditions').delete().eq('slug', slug);
      if (error) console.error('Supabase deleteCondition error:', error);
    } catch (e) {
      console.error('Supabase deleteCondition exception:', e);
    }
  }
  return true;
}

export async function getSerialSteps(): Promise<SerialStep[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('serial_steps').select('*').order('step_number', { ascending: true });
      if (!error && data && data.length > 0) {
        memSerialSteps = data as SerialStep[];
        return memSerialSteps;
      }
    } catch (e) {
      console.warn('Falling back to cached serial steps:', e);
    }
  }
  return memSerialSteps;
}

export async function updateSerialStep(step: SerialStep): Promise<SerialStep> {
  const idx = memSerialSteps.findIndex((s) => s.step_number === step.step_number);
  if (idx >= 0) {
    memSerialSteps[idx] = { ...memSerialSteps[idx], ...step };
  }
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('serial_steps').upsert(step);
      if (error) console.error('Supabase updateSerialStep error:', error);
    } catch (e) {
      console.error('Supabase updateSerialStep exception:', e);
    }
  }
  return step;
}

export async function getChambers(): Promise<Chamber[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('chambers').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        memChambers = data as Chamber[];
        return memChambers;
      }
    } catch (e) {
      console.warn('Falling back to cached chambers:', e);
    }
  }
  return memChambers;
}

export async function saveChamber(chamber: Chamber): Promise<Chamber> {
  const idx = memChambers.findIndex((c) => c.id === chamber.id);
  if (idx >= 0) {
    memChambers[idx] = { ...memChambers[idx], ...chamber };
  } else {
    memChambers.push(chamber);
  }
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('chambers').upsert(chamber);
      if (error) console.error('Supabase saveChamber error:', error);
    } catch (e) {
      console.error('Supabase saveChamber exception:', e);
    }
  }
  return chamber;
}

export async function deleteChamber(id: number): Promise<boolean> {
  memChambers = memChambers.filter((c) => c.id !== id);
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('chambers').delete().eq('id', id);
      if (error) console.error('Supabase deleteChamber error:', error);
    } catch (e) {
      console.error('Supabase deleteChamber exception:', e);
    }
  }
  return true;
}

export async function getReviews(): Promise<Review[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('reviews').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        memReviews = data as Review[];
        return memReviews;
      }
    } catch (e) {
      console.warn('Falling back to cached reviews:', e);
    }
  }
  return memReviews;
}

export async function saveReview(review: Review): Promise<Review> {
  const idx = memReviews.findIndex((r) => r.id === review.id);
  if (idx >= 0) {
    memReviews[idx] = { ...memReviews[idx], ...review };
  } else {
    memReviews.push(review);
  }
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('reviews').upsert(review);
      if (error) console.error('Supabase saveReview error:', error);
    } catch (e) {
      console.error('Supabase saveReview exception:', e);
    }
  }
  return review;
}

export async function deleteReview(id: number): Promise<boolean> {
  memReviews = memReviews.filter((r) => r.id !== id);
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) console.error('Supabase deleteReview error:', error);
    } catch (e) {
      console.error('Supabase deleteReview exception:', e);
    }
  }
  return true;
}

export async function getFaqs(): Promise<FAQ[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('faqs').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        memFaqs = data as FAQ[];
        return memFaqs;
      }
    } catch (e) {
      console.warn('Falling back to cached faqs:', e);
    }
  }
  return memFaqs;
}

export async function saveFaq(faq: FAQ): Promise<FAQ> {
  const idx = memFaqs.findIndex((f) => f.id === faq.id);
  if (idx >= 0) {
    memFaqs[idx] = { ...memFaqs[idx], ...faq };
  } else {
    memFaqs.push(faq);
  }
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('faqs').upsert(faq);
      if (error) console.error('Supabase saveFaq error:', error);
    } catch (e) {
      console.error('Supabase saveFaq exception:', e);
    }
  }
  return faq;
}

export async function deleteFaq(id: number): Promise<boolean> {
  memFaqs = memFaqs.filter((f) => f.id !== id);
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) console.error('Supabase deleteFaq error:', error);
    } catch (e) {
      console.error('Supabase deleteFaq exception:', e);
    }
  }
  return true;
}

export async function getBlogs(): Promise<BlogPost[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as BlogPost[];
      }
    } catch (e) {
      console.warn('Falling back to cached published blogs:', e);
    }
  }
  return memBlogs.filter((b) => b.is_published);
}

export async function getAllBlogsAdmin(): Promise<BlogPost[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('blogs').select('*').order('published_at', { ascending: false });
      if (!error && data && data.length > 0) {
        memBlogs = data as BlogPost[];
        return memBlogs;
      }
    } catch (e) {
      console.warn('Falling back to all cached blogs:', e);
    }
  }
  return memBlogs;
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('blogs').select('*').eq('slug', slug).single();
      if (!error && data) return data as BlogPost;
    } catch (e) {
      console.warn('Falling back to cached blog by slug:', e);
    }
  }
  return memBlogs.find((b) => b.slug === slug) || null;
}

export async function saveBlog(blog: BlogPost): Promise<BlogPost> {
  const idx = memBlogs.findIndex((b) => b.slug === blog.slug);
  if (idx >= 0) {
    memBlogs[idx] = { ...memBlogs[idx], ...blog };
  } else {
    memBlogs.push(blog);
  }
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('blogs').upsert(blog);
      if (error) console.error('Supabase saveBlog error:', error);
    } catch (e) {
      console.error('Supabase saveBlog exception:', e);
    }
  }
  return blog;
}

export async function deleteBlog(slug: string): Promise<boolean> {
  memBlogs = memBlogs.filter((b) => b.slug !== slug);
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('blogs').delete().eq('slug', slug);
      if (error) console.error('Supabase deleteBlog error:', error);
    } catch (e) {
      console.error('Supabase deleteBlog exception:', e);
    }
  }
  return true;
}

export async function getAppointments(): Promise<Appointment[]> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Appointment[];
    } catch (e) {
      console.warn('Falling back to mem appointments:', e);
    }
  }
  return memAppointments;
}

export async function createAppointment(appointment: Omit<Appointment, 'id' | 'created_at'>): Promise<Appointment> {
  const newAppointment: Appointment = {
    ...appointment,
    id: 'apt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    created_at: new Date().toISOString(),
    status: appointment.status || 'pending',
  };
  memAppointments.unshift(newAppointment);

  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('appointments').insert(newAppointment);
      if (error) console.error('Supabase createAppointment error:', error);
    } catch (e) {
      console.error('Supabase createAppointment exception:', e);
    }
  }
  return newAppointment;
}

export async function updateAppointmentStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled'): Promise<boolean> {
  const apt = memAppointments.find((a) => a.id === id);
  if (apt) {
    apt.status = status;
  }
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
      if (error) console.error('Supabase updateAppointmentStatus error:', error);
    } catch (e) {
      console.error('Supabase updateAppointmentStatus exception:', e);
    }
  }
  return true;
}
