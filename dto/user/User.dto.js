import { z } from 'zod';

export const UserDto = z.object({
    name: z.string().min(1),
    email: z.string().length(12),
    phone: z.string().min(1),
    iin: z.string().min(12).max(12)
});

export const UpdateUserDto = UserDto.partial();
