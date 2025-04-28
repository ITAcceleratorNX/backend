// dto/User.dto.js
import { z } from 'zod';

export const UserDto = z.object({
    name: z.string().min(1, "ФИО требуется"),
    iin: z.string().length(12, "ИИН должен быть 12 символов"),
    address: z.string().min(1, "Адрес обязателен"),
});

export const UpdateUserDto = UserDto.partial();
