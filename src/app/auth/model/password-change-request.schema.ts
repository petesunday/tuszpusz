import * as z from 'zod/mini';

export const passwordChangeRequestSchema = z.strictObject({
  confirm_new_password: z.string(),
  current_password: z.string(),
  new_password: z.string(),
});

export type PasswordChangeRequest = z.infer<typeof passwordChangeRequestSchema>;
