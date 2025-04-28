import { z } from 'zod';

export const RackItemDto = z.object({
    rack_id: z.number().int().positive(),
    description: z.string().min(1, "Description is required"),
    volume: z.number().positive("Volume must be a positive number"),
    category: z.string().optional()
});

export const RackItemUpdateDto = RackItemDto.partial();
