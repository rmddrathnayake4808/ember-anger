import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { readFaceEmotions } from "./emotion.server";

const inputSchema = z.object({
  image: z
    .string()
    .startsWith("data:image/", "Image must be a base64 image data URL")
    .max(4_000_000, "Image is too large"),
});

export const analyzeFaceEmotion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => readFaceEmotions(data.image));
