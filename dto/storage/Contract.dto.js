import { z } from 'zod';

export const ContractDto = z.object({
    user_id: z.number().int().positive(),
    order_id: z.number().int().positive(),
    contract_date: z.string(), // ISO format expected
    expiration_date: z.string().optional(),
    contract_type: z.enum(['individual', 'cloud', 'moving']),
    contract_url: z.string().optional(),
    status: z.enum(['active', 'expired', 'terminated']).optional()
});

export const ContractUpdateDto = ContractDto.partial();
