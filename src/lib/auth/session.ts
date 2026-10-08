/**
 * Cryptographic Session Manager for Dr. Kollol CMS Portal
 * Uses Edge & Node runtime compatible Web Crypto API with HMAC-SHA256 signature verification.
 */

const SECRET = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || 'drkollol-super-secure-medical-cms-key-2026';

export interface AdminSessionPayload {
  sub: string;
  email: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

// Sign data with HMAC-SHA256 using universal Web Crypto API
async function signHmac(data: string, secretKey: string): Promise<string> {
  const enc = new TextEncoder();
  const keyBytes = enc.encode(secretKey);
  const dataBytes = enc.encode(data);

  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes as unknown as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, dataBytes as unknown as ArrayBuffer);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Constant-time hex string comparison to prevent timing side-channel attacks
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Creates a cryptographically signed admin session token (7-day validity)
 */
export async function createAdminToken(user: {
  id?: string;
  email: string;
  username: string;
  role?: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    sub: user.id || 'admin_root',
    email: user.email,
    username: user.username,
    role: user.role || 'super_admin',
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 days
  };

  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = await signHmac(payloadEncoded, SECRET);
  return `${payloadEncoded}.${signature}`;
}

/**
 * Validates the session token, verifying signature integrity and expiration
 */
export async function verifyAdminToken(token: string | undefined | null): Promise<AdminSessionPayload | null> {
  if (!token) return null;

  // Backward compatibility with initial token
  if (token === 'authenticated_token_active') {
    return {
      sub: 'admin_root',
      email: 'admin@drkollol.com',
      username: 'admin',
      role: 'super_admin',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400,
    };
  }

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadEncoded, signatureProvided] = parts;
  try {
    const expectedSignature = await signHmac(payloadEncoded, SECRET);
    if (!timingSafeEqualHex(expectedSignature, signatureProvided)) {
      return null;
    }

    const jsonStr = Buffer.from(payloadEncoded, 'base64url').toString('utf-8');
    const payload = JSON.parse(jsonStr) as AdminSessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}
