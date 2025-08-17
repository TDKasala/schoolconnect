import React, { useState } from 'react';
import { useGemini } from '../hooks/useGemini';

export default function GeminiDemo() {
  const { loading, error, text, generate, summarize, assist } = useGemini();
  const [input, setInput] = useState('Explique le règlement intérieur de l’école en 5 points.');

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm space-y-3">
      <h3 className="text-lg font-semibold">Gemini Demo</h3>

      <textarea
        className="w-full border rounded p-2 text-sm"
        rows={5}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          onClick={() => generate(input)}
          className="px-3 py-1.5 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={loading}
        >
          Generate
        </button>
        <button
          onClick={() => summarize(input)}
          className="px-3 py-1.5 bg-emerald-600 text-white rounded disabled:opacity-50"
          disabled={loading}
        >
          Summarize
        </button>
        <button
          onClick={() => assist(input)}
          className="px-3 py-1.5 bg-purple-600 text-white rounded disabled:opacity-50"
          disabled={loading}
        >
          Assist
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Thinking…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {text && (
        <pre className="text-sm whitespace-pre-wrap bg-gray-50 border rounded p-2 max-h-80 overflow-auto">
          {text}
        </pre>
      )}
    </div>
  );
}
