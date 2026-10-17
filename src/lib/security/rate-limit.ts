/**
 * In-Memory Sliding Window Rate Limiter
 * Provides DDoS, spam, and API exhaustion protection for serverless endpoints.
 * Automatically evicts stale IP records to avoid memory leaks.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale records every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function purgeStaleRecords(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [ip, record] of rateLimitMap.entries()) {
    const valid = record.timestamps.filter((ts) => now - ts < windowMs);
    if (valid.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      record.timestamps = valid;
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): RateLimitResult {
  const now = Date.now();
  purgeStaleRecords(windowMs);

  let record = rateLimitMap.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(identifier, record);
  }

  // Filter timestamps within the current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetMs = Math.max(0, windowMs - (now - oldest));
    return {
      success: false,
      limit,
      remaining: 0,
      resetMs,
    };
  }

  record.timestamps.push(now);
  return {
    success: true,
    limit,
    remaining: limit - record.timestamps.length,
    resetMs: windowMs,
  };
}

/**
 * Extracts client IP from standard Next.js request headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  return 'anonymous-client';
}
