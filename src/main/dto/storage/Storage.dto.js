import { z } from 'zod';
export const StorageTypeEnum = z.enum(["INDIVIDUAL", "CLOUD", "RACK"]);
export const StorageStatusEnum = z.enum(["OCCUPIED", "VACANT"]);

export const StorageDto = z.object({
    warehouse_id: z.preprocess((val) => Number(val), z.number().int().positive()),
    name: z.string().nonempty("Name is required").min(1).max(255),
    storage_type: StorageTypeEnum,
    description: z.string().max(255).optional(),
    image_url: z.string().optional(),
    rows: z.preprocess((val) => Number(val), z.number().int().positive()),
    columns: z.preprocess((val) => Number(val), z.number().int().positive()),
    height: z.preprocess((val) => Number(val), z.number().positive()),
    total_volume: z.preprocess((val) => Number(val), z.number().positive()).optional(),
    status: StorageStatusEnum.optional(),
});
export const UpdateStorageDto = StorageDto.partial();