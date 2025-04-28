import { z } from 'zod';

export const TenantDto = z.object({
    user_id: z.number().int().positive(),
    storage_id: z.number().int().positive(),
    status: z.enum(['active', 'completed'])
});

export const TenantUpdateDto = TenantDto.partial();
