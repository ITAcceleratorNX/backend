import z from 'zod'

export const MovingOrderDto = z.object({
    moving_date: z.date(),
    status: z.enum(['PENDING_FROM', 'PENDING_TO']),
});