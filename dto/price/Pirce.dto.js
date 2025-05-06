import { z } from 'zod';

export const PriceType = z.enum(["INDIVIDUAL_STORAGE", "CLOUD_STORAGE", "RACK_STORAGE", "MOVING"]);

export const PriceDto = z.object({
    type: PriceType,
    amount: z.number().positive(),
});

export const UpdatePriceDto = PriceDto.partial();