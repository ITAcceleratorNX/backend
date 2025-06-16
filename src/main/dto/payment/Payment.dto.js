import {z} from "zod";

export const PaymentDto = z.object({
    order_id: z.number().positive().gt(0),
});

export const OrderPaymentDto = z.object({
    order_payment_id: z.number().positive().gt(0),
})