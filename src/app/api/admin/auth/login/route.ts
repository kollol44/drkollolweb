import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminToken } from '@/lib/auth/session';

// In-memory rate limiting map: IP -> { attempts: number, lockUntil: number }
const loginAttempts = new Map<string, { attempts: number; lockUntil: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remainingSec?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };

  if (record.lockUntil > now) {
    return { allowed: false, remainingSec: Math.ceil((record.lockUntil - now) / 1000) };
  }

  if (record.lockUntil <= now && record.attempts >= 5) {
    loginAttempts.delete(ip);
  }

  return { allowed: true };
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { attempts: 0, lockUntil: 0 };
  record.attempts += 1;
  if (record.attempts >= 5) {
    record.lockUntil = now + 15 * 60 * 1000; // 15-minute lockout after 5 consecutive failures
  }
  loginAttempts.set(ip, record);
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip);
}

function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Constant time dummy comparison
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

  // 1. Rate limiting check
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: `Too many failed attempts. Account temporarily locked for security. Try again in ${rateLimit.remainingSec}s.`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const identifier = (body.identifier || body.username || body.email || 'admin').trim();
    const password = body.password || '';

    if (!password) {
      return NextResponse.json({ success: false, message: 'Password is required.' }, { status: 400 });
    }

    let authenticatedUser: { id?: string; email: string; username: string; role?: string; full_name?: string } | null = null;

    // 2. Try Supabase verification via verify_admin_login RPC
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.rpc('verify_admin_login', {
          p_identifier: identifier,
          p_password: password,
        });

        if (!error && Array.isArray(data) && data.length > 0) {
          authenticatedUser = data[0];
        }
      } catch (err) {
        // Fallback gracefully if RPC is not yet created in Supabase
        console.warn('Supabase admin RPC auth check skipped/failed:', err);
      }
    }

    // 3. Fallback verification: Check against ADMIN_PASSWORD from environment
    if (!authenticatedUser) {
      const envAdminPassword = process.env.ADMIN_PASSWORD || 'admin@kollol2026!';
      const validIdentifiers = [
        'admin',
        'drkollol',
        'kollol',
        'admin@drkollol.com',
        'kollolsomc44@gmail.com',
      ];

      const matchesIdentifier = validIdentifiers.includes(identifier.toLowerCase());
      const matchesPassword = timingSafeCompare(password, envAdminPassword);

      if (matchesIdentifier && matchesPassword) {
        authenticatedUser = {
          id: 'admin_root',
          email: identifier.includes('@') ? identifier : 'admin@drkollol.com',
          username: identifier.includes('@') ? identifier.split('@')[0] : identifier,
          role: 'super_admin',
          full_name: 'Dr. Fahim Foysal Kollol',
        };
      }
    }

    // 4. Handle result
    if (!authenticatedUser) {
      recordFailedAttempt(ip);
      return NextResponse.json({ success: false, message: 'Invalid credentials. Access denied.' }, { status: 401 });
    }

    clearAttempts(ip);

    // 5. Generate cryptographically signed HMAC token
    const token = await createAdminToken(authenticatedUser);

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully.',
      user: {
        email: authenticatedUser.email,
        username: authenticatedUser.username,
        role: authenticatedUser.role,
        full_name: authenticatedUser.full_name,
      },
    });

    // 6. Set secure HTTP-only session cookie
    response.cookies.set('kollol_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Admin authentication exception:', error);
    return NextResponse.json({ success: false, message: 'Internal authentication service error.' }, { status: 500 });
  }
}
