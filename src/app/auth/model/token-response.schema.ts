import * as z from 'zod/mini';

export const tokenResponseSchema = z.strictObject({
  access: z.string(),
  refresh: z.string(),
  username: z.string(),
});

export type TokenResponse = z.infer<typeof tokenResponseSchema>;
