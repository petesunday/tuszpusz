import * as z from 'zod/mini';

export const refreshTokenRequestSchema = z.strictObject({
  refresh: z.string(),
});

export type RefreshTokenRequest = z.infer<typeof refreshTokenRequestSchema>;
