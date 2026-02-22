import { z } from "zod";

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

const result = envSchema.safeParse(import.meta.env);

if (!result.success) {
  console.error("Invalid client environment configuration:", result.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration.");
}

export const env = result.data;
