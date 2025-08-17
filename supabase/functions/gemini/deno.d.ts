// Type shim for Deno global to satisfy project-wide TypeScript tooling
// This file is only for editor/linter happiness in a Node/Vite monorepo.
// The actual runtime is Deno when running the Supabase Edge Function.
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};
