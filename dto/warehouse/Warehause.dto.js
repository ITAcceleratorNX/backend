import { z } from 'zod';

export const WarehouseDto = z.object({
    name: z.string().min(1, "Name is required").max(100),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required").max(50),
    status_code: z.string().min(1, "Status code is required").max(20),
});

export const WarehouseUpdateDto = WarehouseDto.partial();
