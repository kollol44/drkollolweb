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

// Model preference candidates from lowest cost / highest speed to standard flash
const PREFERRED_FLASH_MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash-8b',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
];

// POST: Dynamically test and discover working Gemini model for any provided key
export async function POST(req: NextRequest) {
  const token = req.cookies.get('kollol_admin_session')?.value;
  const session = await verifyAdminToken(token);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { key, preferredModel } = await req.json();
    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { success: false, message: 'API key is required for testing.' },
        { status: 400 }
      );
    }

    const cleanKey = key.trim();

    // -------------------------------------------------------------------------
    // STEP 1: Query Google's ListModels endpoint to validate key & discover models
    // -------------------------------------------------------------------------
    let availableModels: string[] = [];
    let listModelsError: string | null = null;

    try {
      const modelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`;
      const listRes = await fetch(modelsUrl, { method: 'GET' });

      if (listRes.ok) {
        const listData = await listRes.json();
        const models = Array.isArray(listData.models) ? listData.models : [];
        availableModels = models
          .filter((m: { supportedGenerationMethods?: string[] }) =>
            m.supportedGenerationMethods?.includes('generateContent')
          )
          .map((m: { name: string }) => m.name.replace(/^models\//, ''));
      } else {
        const errJson = await listRes.json().catch(() => null);
        const errMsg = errJson?.error?.message || `HTTP ${listRes.status}`;
        listModelsError = errMsg;

        // If the key itself is invalid or permissions denied, return immediately
        if (listRes.status === 400 || listRes.status === 403) {
          return NextResponse.json({
            success: false,
            message: `Google API Error (${listRes.status}): ${errMsg}`,
            details: JSON.stringify(errJson || errMsg),
          });
        }
      }
    } catch (e: unknown) {
      listModelsError = e instanceof Error ? e.message : 'Network error';
    }

    // -------------------------------------------------------------------------
    // STEP 2: Build candidate models list to test
    // -------------------------------------------------------------------------
    const candidateList: string[] = [];

    // User's explicitly preferred model first (if specified and not 'auto')
    if (preferredModel && preferredModel !== 'auto') {
      candidateList.push(preferredModel);
    }

    // Next: Prioritized modern flash models that exist in availableModels
    for (const model of PREFERRED_FLASH_MODELS) {
      if (availableModels.includes(model) && !candidateList.includes(model)) {
        candidateList.push(model);
      }
    }

    // Next: Any other available models returned by Google
    for (const model of availableModels) {
      if (!candidateList.includes(model)) {
        candidateList.push(model);
      }
    }

    // Fallback: If availableModels was empty (e.g. list endpoint restricted), test hardcoded priority models
    if (candidateList.length === 0) {
      candidateList.push(...PREFERRED_FLASH_MODELS);
    }

    // -------------------------------------------------------------------------
    // STEP 3: Test generateContent with candidate models until one succeeds
    // -------------------------------------------------------------------------
    let lastErrorDetails = listModelsError || '';

    for (const model of candidateList) {
      try {
        const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
        const genRes = await fetch(testUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with exactly: OK' }] }],
          }),
        });

        if (genRes.ok) {
          const genData = await genRes.json();
          const reply = genData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'OK';

          return NextResponse.json({
            success: true,
            workingModel: model,
            availableModels: availableModels.slice(0, 10),
            message: `API Key verified! Successfully connected to model "${model}".`,
            reply,
          });
        }

        const errData = await genRes.json().catch(() => null);
        const errMessage = errData?.error?.message || `HTTP ${genRes.status}`;
        lastErrorDetails = `Model "${model}": ${errMessage}`;

        // If it's a 404 (model not found), proceed to try next candidate model
        if (genRes.status === 404) {
          continue;
        }

        // If quota exceeded or forbidden, keep looking or log
        if (genRes.status === 429) {
          continue;
        }
      } catch (genErr: unknown) {
        lastErrorDetails = genErr instanceof Error ? genErr.message : 'Network failure';
      }
    }

    return NextResponse.json({
      success: false,
      message: `Failed to connect with tested models (${candidateList.slice(0, 3).join(', ')}). ${lastErrorDetails}`,
      details: lastErrorDetails,
      availableModels,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : 'Unexpected server error while testing key',
      },
      { status: 500 }
    );
  }
}
