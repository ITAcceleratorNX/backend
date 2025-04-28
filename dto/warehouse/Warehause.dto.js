import { z } from 'zod';

export const WAREHOUSE_STATUS = z.enum(["AVAILABLE", "UNAVAILABLE"]).optional();

export const WarehouseDto = z.object({
    name: z.string().min(1, "Name is required").max(100),
    address: z.string().min(1, "Address is required"),
    status: WAREHOUSE_STATUS,
});

export const WarehouseUpdateDto = WarehouseDto.partial();
