import * as z from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: 'To pole jest wymagane' })
    .transform((v) => v.trim()),
  description: z
    .string()
    .max(20, { message: 'Opis niemoze byc dluzszy niz 20 znakow' }),
});

export type CreateCategoryPayload = z.infer<typeof createCategorySchema>;
