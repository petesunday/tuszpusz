import * as z from 'zod/mini';

export const messageResponseSchema = z.strictObject({
  message: z.string(),
});

export type MessageResponse = z.infer<typeof messageResponseSchema>;
