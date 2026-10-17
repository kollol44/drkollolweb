import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import crypto from 'crypto';
import { verifyAdminToken } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

// Max raw file size: 25MB
const MAX_RAW_SIZE_BYTES = 25 * 1024 * 1024;

// Magic byte signatures for secure image validation
function isValidImageSignature(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return true;
  }

  // WebP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return true;
  }

  return false;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export async function POST(req: NextRequest) {
  // 1. Authenticate Admin Session
  const token = req.cookies.get('kollol_admin_session')?.value;
  const session = await verifyAdminToken(token);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized. Admin credentials required.' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided in form submission.' }, { status: 400 });
    }

    // 2. Size check
    if (file.size > MAX_RAW_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          message: `File exceeds maximum allowed upload limit of 25MB (Received: ${formatBytes(file.size)}).`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    // 3. Security validation: Verify magic bytes
    if (!isValidImageSignature(rawBuffer)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or unsupported image file. Only genuine JPG, PNG, and WebP images are permitted.',
        },
        { status: 400 }
      );
    }

    // 4. Sharp Optimization & Auto-WebP Conversion
    // Handles non-technical admin uploading 10MB-15MB photos:
    // - Auto-rotates orientation
    // - Scales down max dimension to 1920px while maintaining crisp details
    // - Encodes into modern, highly compressed WebP format
    // - Dynamically regulates quality to hit optimal 300KB - 800KB target
    let pipeline = sharp(rawBuffer).rotate().resize({
      width: 1920,
      height: 1920,
      fit: 'inside',
      withoutEnlargement: true,
    });

    let optimizedBuffer = await pipeline.webp({ quality: 82, effort: 4 }).toBuffer();

    // If still over 900KB, optimize slightly further
    if (optimizedBuffer.length > 900 * 1024) {
      optimizedBuffer = await sharp(rawBuffer)
        .rotate()
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 75, effort: 5 })
        .toBuffer();
    }

    // Get final metadata
    const finalMeta = await sharp(optimizedBuffer).metadata();

    // 5. Secure File Naming
    const randomSuffix = crypto.randomBytes(6).toString('hex');
    const safeName = `gallery_${Date.now()}_${randomSuffix}.webp`;

    let publicUrl = '';

    // 6. Primary Persistence: Supabase Cloud Storage (Bucket: 'gallery')
    // Dedicated cloud storage for serverless platforms like Vercel
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        let { data: uploadData, error: uploadErr } = await supabase.storage
          .from('gallery')
          .upload(safeName, optimizedBuffer, {
            contentType: 'image/webp',
            cacheControl: '31536000',
            upsert: true,
          });

        // Auto-create bucket if missing and retry
        if (uploadErr && (uploadErr.message?.includes('Bucket not found') || (uploadErr as any).statusCode === 404)) {
          await supabase.storage.createBucket('gallery', { public: true });
          const retry = await supabase.storage
            .from('gallery')
            .upload(safeName, optimizedBuffer, {
              contentType: 'image/webp',
              cacheControl: '31536000',
              upsert: true,
            });
          uploadData = retry.data;
          uploadErr = retry.error;
        }

        if (!uploadErr && uploadData) {
          const { data: pubData } = supabase.storage.from('gallery').getPublicUrl(safeName);
          if (pubData?.publicUrl) {
            publicUrl = pubData.publicUrl;
          }
        } else if (uploadErr) {
          console.warn('Supabase storage upload error:', uploadErr);
        }
      }
    } catch (sbErr) {
      console.warn('Supabase storage exception:', sbErr);
    }

    // 7. Fallback A: Local Storage (Local development only - safe for serverless)
    if (!publicUrl) {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');
        await fs.mkdir(uploadDir, { recursive: true });
        const localFilePath = path.join(uploadDir, safeName);
        await fs.writeFile(localFilePath, optimizedBuffer);
        publicUrl = `/uploads/gallery/${safeName}`;
      } catch (fsErr) {
        console.warn('Local filesystem write failed (read-only environment like Vercel):', fsErr);
      }
    }

    // 8. Fallback B: Base64 WebP Data URL (Ultimate fallback if storage and disk fail)
    if (!publicUrl) {
      publicUrl = `data:image/webp;base64,${optimizedBuffer.toString('base64')}`;
    }

    const savedPercent = Math.max(0, ((rawBuffer.length - optimizedBuffer.length) / rawBuffer.length) * 100).toFixed(1);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: safeName,
      format: 'webp',
      originalSize: rawBuffer.length,
      originalSizeFormatted: formatBytes(rawBuffer.length),
      optimizedSize: optimizedBuffer.length,
      optimizedSizeFormatted: formatBytes(optimizedBuffer.length),
      savings: `${savedPercent}% reduction`,
      width: finalMeta.width,
      height: finalMeta.height,
    });
  } catch (err: unknown) {
    console.error('Image upload & optimization error:', err);
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : 'Failed to process and optimize image.',
      },
      { status: 500 }
    );
  }
}
