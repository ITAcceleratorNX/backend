import { z } from 'zod';

export const CloudStorageDto = z.object({
    warehouse_id: z.number().int().min(1, "Warehouse ID is required"),
    status: z.enum(['active', 'completed']),
    name: z.string().nonempty("Name is required").min(1).max(255),
    description: z.string().nonempty("Description is required").min(1).max(255),
    image_url: z.string().nonempty("Image is required").min(1).max(255),
    total_volume: z.number().min(0, "Total volume must be a positive number")
});
export const CloudStorageUpdateDto = CloudStorageDto.partial();