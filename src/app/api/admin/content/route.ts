import { NextRequest, NextResponse } from 'next/server';
import {
  getSiteSettings,
  updateSiteSettings,
  getHeroSection,
  updateHeroSection,
  getSurgeonProfile,
  updateSurgeonProfile,
  getCategories,
  getAllConditionsAdmin,
  saveCondition,
  getSerialSteps,
  updateSerialStep,
  getChambers,
  saveChamber,
  getReviews,
  saveReview,
  getFaqs,
  saveFaq,
  getAllBlogsAdmin,
  saveBlog,
  getAppointments,
  updateAppointmentStatus,
} from '@/lib/content/service';

export async function GET(req: NextRequest) {
  // Check admin session
  const session = req.cookies.get('kollol_admin_session')?.value;
  if (session !== 'authenticated_token_active') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const [
    siteSettings,
    heroSection,
    surgeonProfile,
    categories,
    conditions,
    serialSteps,
    chambers,
    reviews,
    faqs,
    blogs,
    appointments,
  ] = await Promise.all([
    getSiteSettings(),
    getHeroSection(),
    getSurgeonProfile(),
    getCategories(),
    getAllConditionsAdmin(),
    getSerialSteps(),
    getChambers(),
    getReviews(),
    getFaqs(),
    getAllBlogsAdmin(),
    getAppointments(),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      siteSettings,
      heroSection,
      surgeonProfile,
      categories,
      conditions,
      serialSteps,
      chambers,
      reviews,
      faqs,
      blogs,
      appointments,
    },
  });
}

export async function PUT(req: NextRequest) {
  // Check admin session
  const session = req.cookies.get('kollol_admin_session')?.value;
  if (session !== 'authenticated_token_active') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { section, payload } = await req.json();

    switch (section) {
      case 'siteSettings':
        await updateSiteSettings(payload);
        break;
      case 'heroSection':
        await updateHeroSection(payload);
        break;
      case 'surgeonProfile':
        await updateSurgeonProfile(payload);
        break;
      case 'condition':
        await saveCondition(payload);
        break;
      case 'serialStep':
        await updateSerialStep(payload);
        break;
      case 'chamber':
        await saveChamber(payload);
        break;
      case 'review':
        await saveReview(payload);
        break;
      case 'faq':
        await saveFaq(payload);
        break;
      case 'blog':
        await saveBlog(payload);
        break;
      case 'appointmentStatus':
        await updateAppointmentStatus(payload.id, payload.status);
        break;
      default:
        return NextResponse.json({ success: false, message: 'Unknown section specified.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `${section} updated successfully.` });
  } catch (error) {
    console.error('Admin content update error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update content.' }, { status: 500 });
  }
}
