import * as z from 'zod/mini';

export const loginRequestSchema = z.strictObject({
  password: z.string(),
  remember_me: z.optional(z.boolean()),
  username: z.string(),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
