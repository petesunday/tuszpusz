import * as z from 'zod/mini';

export const logoutRequestSchema = z.strictObject({
  refresh: z.string(),
});

export type LogoutRequest = z.infer<typeof logoutRequestSchema>;
