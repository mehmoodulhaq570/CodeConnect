// Edge Function for Supabase - runs in Deno environment
// TypeScript errors are expected as this uses Deno imports, not Node.js
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

console.log("Hello from Functions!")

serve(async (req: Request) => {
  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
    timestamp: new Date().toISOString(),
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})
