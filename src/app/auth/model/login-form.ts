import * as z from 'zod/mini';

export const loginFormSchema = z.strictObject({
  password: z.string(),
  rememberMe: z.boolean(),
  username: z.string(),
});

export type LoginFormModel = z.infer<typeof loginFormSchema>;
