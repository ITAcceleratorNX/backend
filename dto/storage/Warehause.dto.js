import { z } from 'zod';

export const WarehouseDto = z.object({
    name: z.string().min(1, "Name is required").max(100),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required").max(50),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    status_code: z.string().min(1, "Status code is required").max(20),
});

export const WarehouseUpdateDto = z.object({
    name: z.string().min(1, "Name is required").max(100).optional(),
    address: z.string().min(1, "Address is required").optional(),
    city: z.string().min(1, "City is required").max(50).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    status_code: z.string().min(1, "Status code is required").max(20).optional(),
});
