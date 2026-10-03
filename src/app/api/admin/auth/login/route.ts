import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin@kollol2026!';

    if (password === adminPassword) {
      const response = NextResponse.json({ success: true, message: 'Authenticated successfully.' });
      
      // Set secure HTTP-only cookie
      response.cookies.set('kollol_admin_session', 'authenticated_token_active', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Authentication error.' }, { status: 500 });
  }
}
