# Gemini AI Integration (Google Generative AI)

This project integrates Google Gemini via a Supabase Edge Function to enable secure AI-powered features like content generation, summarization, and intelligent assistance.

- Backend: Supabase Edge Function `gemini` in `supabase/functions/gemini/` (Deno runtime).
- Frontend: Service `src/services/geminiService.ts` and optional hook `src/hooks/useGemini.ts`.
- Security: API key is server-side only (`GEMINI_API_KEY`). Do not expose it in the frontend.

## Setup

1) Configure environment variables

- In `.env.example` we added:
```
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash
```
Do NOT prefix with VITE_. These are for the server function only.

2) Set secrets for Supabase Edge Functions

- In Supabase Dashboard:
  - Project Settings → API → add `GEMINI_API_KEY` secret.
  - Alternatively, via CLI for local serve:
    ```bash
    supabase secrets set GEMINI_API_KEY=your_key_here
    ```

3) Local development (optional)

- To run the function locally:
  ```bash
  supabase functions serve gemini --env-file .env
  ```
  Ensure `.env` contains `GEMINI_API_KEY` (server-side key). Do not commit real keys.

4) Deployment

- Deploy functions:
  ```bash
  supabase functions deploy gemini
  ```
  Ensure project has required permissions to invoke Edge Functions.

## Frontend usage

- Use the service directly:
```ts
import { GeminiService } from '@/services/geminiService';

const res = await GeminiService.generateText('Génère un bulletin de classe pour 5 élèves.');
if (res.ok) console.log(res.text);
```

- Or use the React hook:
```ts
import { useGemini } from '@/hooks/useGemini';

const { loading, error, text, summarize } = useGemini();
await summarize('Long admin policy text...');
```

## Edge Function contract

- Path: `supabase/functions/gemini/index.ts`
- Request body:
```json
{
  "action": "generate" | "summarize" | "assist",
  "prompt": "Your prompt...",
  "model": "gemini-1.5-flash",
  "options": { }
}
```
- Response body:
```json
{
  "model": "gemini-1.5-flash",
  "action": "generate",
  "text": "...",
  "raw": { /* full Gemini API response */ }
}
```

## Notes
- The Edge Function performs light wrapping on prompts depending on `action`.
- You can override the `model` per-call.
- CORS is permissive by default; tighten as needed.

## Example component

See `src/examples/GeminiDemo.tsx` for a simple demo UI (not mounted in the app by default).
