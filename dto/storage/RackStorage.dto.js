import { z } from 'zod';

export const RackStorageDto = z.object({
    name: z.string().nonempty("Name is required").min(1).max(255),
    capacity: z.number().positive("Capacity must be a positive number"),
    price: z.number().positive("Price must be a positive number"),
    occupied_volume: z.number().nonnegative("Occupied volume must be 0 or more").optional()
});

export const RackStorageUpdateDto = RackStorageDto.partial();
