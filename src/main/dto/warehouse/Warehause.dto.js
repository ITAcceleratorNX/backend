import { z } from 'zod';

export const WAREHOUSE_STATUS = z.enum(["AVAILABLE", "UNAVAILABLE"]);
const TIME_REGEX = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

export const WarehouseDto = z.object({
    name: z.string().min(1, "Name is required").max(100),
    address: z.string().min(1, "Address is required"),
    latitude: z.number(),
    longitude: z.number(),
    work_start: z
        .string()
        .regex(TIME_REGEX, "Invalid time format. Use HH:mm"),
    work_end: z
        .string()
        .regex(TIME_REGEX, "Invalid time format. Use HH:mm"),
    status: WAREHOUSE_STATUS.default("AVAILABLE"),
});

export const WarehouseUpdateDto = WarehouseDto.partial();

