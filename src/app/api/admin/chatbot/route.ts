import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth/session';
import { getChatbotConfig, updateChatbotConfig } from '@/lib/content/service';

export const runtime = 'nodejs';

function maskKey(key: string): string {
  if (!key || key.length < 10) return '********';
  return `${key.slice(0, 6)}...${key.slice(-4)}`;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('kollol_admin_session')?.value;
  const session = await verifyAdminToken(token);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const config = await getChatbotConfig();

  // Return masked keys for display security and count
  const maskedKeys = (config.gemini_api_keys || []).map((k) => ({
    masked: maskKey(k),
    preview: k,
  }));

  return NextResponse.json({
    success: true,
    data: {
      ...config,
      gemini_api_keys: config.gemini_api_keys || [],
      masked_keys: maskedKeys,
    },
  });
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get('kollol_admin_session')?.value;
  const session = await verifyAdminToken(token);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await req.json();
    const updated = await updateChatbotConfig(payload);
    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Chatbot settings updated successfully.',
    });
  } catch (err) {
    console.error('Update chatbot config error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to update chatbot settings.' },
      { status: 500 }
    );
  }
}

// POST: Test a specific Gemini API key validity
export async function POST(req: NextRequest) {
  const token = req.cookies.get('kollol_admin_session')?.value;
  const session = await verifyAdminToken(token);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { key } = await req.json();
    if (!key || typeof key !== 'string') {
      return NextResponse.json({ success: false, message: 'API key is required for testing.' }, { status: 400 });
    }

    const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key.trim()}`;
    const testRes = await fetch(testUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Respond with exactly: OK' }] }],
      }),
    });

    if (!testRes.ok) {
      const errBody = await testRes.text();
      return NextResponse.json({
        success: false,
        message: `API Key test failed (HTTP ${testRes.status}): Invalid key or quota exceeded.`,
        details: errBody,
      });
    }

    const testData = await testRes.json();
    const reply = testData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    return NextResponse.json({
      success: true,
      message: 'Google Gemini API key verified successfully! Response: ' + reply,
    });
  } catch (testErr) {
    return NextResponse.json(
      {
        success: false,
        message: testErr instanceof Error ? testErr.message : 'Network test error',
      },
      { status: 500 }
    );
  }
}
