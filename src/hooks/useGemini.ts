import { useCallback, useState } from 'react';
import { GeminiService, type GeminiOptions } from '../services/geminiService';

export interface UseGeminiState {
  loading: boolean;
  error: string | null;
  text: string | null | undefined;
}

export function useGemini(defaultOpts?: GeminiOptions) {
  const [state, setState] = useState<UseGeminiState>({ loading: false, error: null, text: null });

  const generate = useCallback(async (prompt: string, opts?: GeminiOptions) => {
    setState(s => ({ ...s, loading: true, error: null }));
    const res = await GeminiService.generateText(prompt, { ...defaultOpts, ...opts });
    setState({ loading: false, error: res.error || null, text: res.text });
    return res;
  }, [defaultOpts]);

  const summarize = useCallback(async (content: string, opts?: GeminiOptions) => {
    setState(s => ({ ...s, loading: true, error: null }));
    const res = await GeminiService.summarize(content, { ...defaultOpts, ...opts });
    setState({ loading: false, error: res.error || null, text: res.text });
    return res;
  }, [defaultOpts]);

  const assist = useCallback(async (query: string, opts?: GeminiOptions) => {
    setState(s => ({ ...s, loading: true, error: null }));
    const res = await GeminiService.assist(query, { ...defaultOpts, ...opts });
    setState({ loading: false, error: res.error || null, text: res.text });
    return res;
  }, [defaultOpts]);

  return { ...state, generate, summarize, assist };
}
