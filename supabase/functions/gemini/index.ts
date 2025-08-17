// Supabase Edge Function: gemini
// Deno runtime
// Exposes a POST endpoint to call Google Gemini safely using a server-side API key

import 'https://deno.land/std@0.224.0/dotenv/load.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const DEFAULT_MODEL = Deno.env.get('GEMINI_MODEL') || 'gemini-1.5-flash';

// Basic CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeminiRequestBody {
  action?: 'generate' | 'summarize' | 'assist';
  prompt?: string;
  input?: string;
  options?: Record<string, unknown>;
  model?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { ...corsHeaders } });
  }

  if (!GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: 'Server missing GEMINI_API_KEY' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const body = (await req.json()) as GeminiRequestBody;
    const action = body.action || 'generate';
    const model = body.model || DEFAULT_MODEL;

    let prompt = body.prompt || body.input || '';

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Missing prompt or input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Light instruction wrapping depending on action
    if (action === 'summarize') {
      prompt = `Summarize the following content clearly and concisely for an educational admin audience.\n\nContent:\n${prompt}`;
    } else if (action === 'assist') {
      prompt = `You are an intelligent assistant for a school management system in the DRC (French primary). Provide helpful, brief answers.\n\nUser query:\n${prompt}`;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      // Allow downstream overrides via options
      ...(body.options || {}),
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data?.error || 'Gemini request failed' }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Extract plain text from response if possible
    const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).join('') ?? null;

    return new Response(
      JSON.stringify({ model, action, text, raw: data }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || 'Unhandled error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
