import {z} from "zod";

export const PaymentDto = z.object({
    order_id: z.number().positive().gt(0),
});