import { supabase, hasSupabase, supabaseInitError } from '../lib/supabase';

export type GeminiAction = 'generate' | 'summarize' | 'assist';

export interface GeminiOptions {
  model?: string;
  options?: Record<string, unknown>;
}

export interface GeminiResponse<T = any> {
  ok: boolean;
  text?: string | null;
  raw?: T;
  error?: string;
}

const FN_NAME = 'gemini';

async function callGemini(action: GeminiAction, prompt: string, opts?: GeminiOptions): Promise<GeminiResponse> {
  if (!hasSupabase) {
    return { ok: false, error: supabaseInitError || 'Supabase not initialized' };
  }

  try {
    const { data, error } = await supabase.functions.invoke(FN_NAME, {
      body: {
        action,
        prompt,
        model: opts?.model,
        options: opts?.options,
      },
    });

    if (error) {
      return { ok: false, error: error.message || 'Gemini function invocation failed' };
    }

    return {
      ok: true,
      text: (data as any)?.text ?? null,
      raw: data,
    };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Unexpected error calling Gemini' };
  }
}

export const GeminiService = {
  generateText: (prompt: string, opts?: GeminiOptions) => callGemini('generate', prompt, opts),
  summarize: (content: string, opts?: GeminiOptions) => callGemini('summarize', content, opts),
  assist: (query: string, opts?: GeminiOptions) => callGemini('assist', query, opts),
};
