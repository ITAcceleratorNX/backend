import { z } from 'zod';

export const IndividualStorageDto = z.object({
    warehouse_id: z.number().int().positive(),
    name: z.string().nonempty("Name is required").min(1).max(255),
    description: z.string().nonempty("Description is required").min(1).max(255),
    image_url: z.string().nonempty("Image is required").min(1).max(255),
    total_volume: z.number().int().positive(),
});

export const UpdateIndividualStorageDto = IndividualStorageDto.partial();
