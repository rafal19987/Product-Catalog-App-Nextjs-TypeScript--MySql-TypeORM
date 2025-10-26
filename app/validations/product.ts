import * as z from 'zod';

export const createProductSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Nazwa jest wymagana' })
        .trim(),
    sku: z
        .string()
        .min(1, { message: 'SKU jest wymagane' })
        .trim(),
    description: z
        .string()
        .trim(),
    price: z
        .number()
        .positive({ message: 'Cena musi być większa od 0' }),
    stock: z
        .number()
        .int({ message: 'Stan magazynowy musi być liczbą całkowitą' })
        .nonnegative({ message: 'Stan magazynowy nie może być ujemny' })
        .default(0),
    imageUrl: z
        .string()
        .url({ message: 'Nieprawidłowy URL obrazka' })
        .or(z.literal('')),
    isActive: z
        .boolean()
        .default(true),
    categoryId: z
        .string()
        .uuid({ message: 'Nieprawidłowe ID kategorii' })
        .or(z.literal('')),
});

export type CreateProductPayload = z.infer<typeof createProductSchema>;