import { z } from 'zod';

export const WAREHOUSE_STATUS = z.enum(["AVAILABLE", "UNAVAILABLE"]);

export const WarehouseDto = z.object({
    name: z.string().min(1, "Name is required").max(100),
    address: z.string().min(1, "Address is required"),
    latitude: z.number(),
    longitude: z.number(),
    work_start: z.string().min(1, "Work start is required"),
    work_end: z.string().min(1, "Work end is required"),
    status: WAREHOUSE_STATUS.default("AVAILABLE"),
});

export const WarehouseUpdateDto = WarehouseDto.partial();

