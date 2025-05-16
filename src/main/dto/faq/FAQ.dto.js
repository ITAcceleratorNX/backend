import { z } from 'zod';

export const FAQDto = z.object({
    question: z.string().nonempty("Question is required"),
    answer: z.string().nonempty("Answer is required"),
    type: z.string().nonempty("Type is required"),
});

export const UpdateFAQDto = FAQDto.partial();
