import { z } from 'zod';

export const appointmentSchema = z.object({
  patient_name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(100, { message: 'Name cannot exceed 100 characters.' })
    .trim(),
  patient_phone: z
    .string()
    .min(10, { message: 'Please enter a valid phone number (at least 10 digits).' })
    .max(16, { message: 'Phone number cannot exceed 16 digits.' })
    .regex(/^[0-9+-\s]+$/, { message: 'Phone number contains invalid characters.' }),
  chamber_name: z.string().min(2, { message: 'Please select a valid chamber.' }),
  preferred_date: z.string().min(6, { message: 'Please select a preferred appointment date.' }),
  problem_summary: z.string().max(500, { message: 'Problem summary cannot exceed 500 characters.' }).optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
