import { z } from 'zod';

export const CloudStorageDto = z.object({
    warehouse_id: z.number().int().min(1, "Warehouse ID is required"),
    type_id: z.number().int().min(1, "Type ID is required"),
    status: z.enum(['active', 'completed']),
    total_volume: z.number().min(0, "Total volume must be a positive number")
});
export const CloudStorageUpdateDto = z.object({
    warehouse_id: z.number().int().min(1, "Warehouse ID is required").optional(),
    type_id: z.number().int().min(1, "Type ID is required").optional(),
    status: z.enum(['active', 'completed']).optional(),
    total_volume: z.number().min(0, "Total volume must be a positive number").optional()
});