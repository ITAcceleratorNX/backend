import { z } from 'zod';

export const CreateNotificationDto = z.object({
    user_id: z.number().int().positive(),
    title: z.string().min(1),
    message: z.string().min(1),
    notification_type: z.enum(['payment', 'contract', 'general']).default('general'),
    related_order_id: z.number().int().optional().nullable(),
    is_email: z.boolean().default(false),
    is_sms: z.boolean().default(false),
});
