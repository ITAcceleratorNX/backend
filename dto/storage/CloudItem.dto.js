import { z } from 'zod';

export const CloudItemDto = z.object({
    storage_order_id: z.number().int().min(1, "Storage Order ID is required"),
    description: z.string().min(1, "Description is required").max(255),
    volume: z.number().min(0, "Volume must be a positive number"),
    category_code: z.string().min(1, "Category code is required").max(20)
});
export const CloudItemUpdateDto = z.object({
    storage_order_id: z.number().int().min(1, "Storage Order ID is required").optional(),
    description: z.string().min(1, "Description is required").max(255).optional(),
    volume: z.number().min(0, "Volume must be a positive number").optional(),
    category_code: z.string().min(1, "Category code is required").max(20).optional()
});