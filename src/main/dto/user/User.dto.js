import { z } from 'zod';

export const UserDto = z.object({
    name: z.string().min(1),
    email: z.string().min(1),
    phone: z.string().min(1),
    iin: z.string().min(12).max(12)
});

export const UserEmailDto = z.object({
    email: z.string().email().min(1),
})

export const LoginDto = z.object({
    email: z.string().min(1).email(),
    password: z.string().min(1),
})

export const RegisterDto = z.object({
    email: z.string().email().min(1),
    password: z.string().min(6),
    unique_code: z.string().min(1),
})

export const UpdateUserDto = UserDto.partial();
