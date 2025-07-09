import { z } from 'zod';

export const ServiceType = z.enum(["INDIVIDUAL", "CLOUD", "RACK", "MOVING"]);

export const ServiceDto = z.object({
    type: ServiceType,
    price: z.number().positive().gt(0),
});

export const UpdateServiceDto = ServiceDto.partial();

export const CalculatePriceDto = z.object({
    type: ServiceType,
    area: z.number().positive(),
    month: z.number().positive()
});

export const OrderServiceDto = z.object({
    service_id: z.number().int(),
    count: z.number().int().positive().gt(0),
})