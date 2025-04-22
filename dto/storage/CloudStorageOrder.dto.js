import { z } from 'zod';

export const CloudStorageOrderDto = z.object({
    user_id: z.number().int().min(1, "User ID is required"),
    storage_id: z.number().int().min(1, "Storage ID is required"),
    volume: z.number().min(0, "Volume must be a positive number"),
    rental_start: z.date(),
    rental_end: z.date().refine((val, ctx) => {
        if (val <= ctx.parent.rental_start) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Rental end must be after rental start"
            });
            return false;
        }
        return true;
    })
});
export const CloudStorageOrderUpdateDto = CloudStorageOrderDto.partial();