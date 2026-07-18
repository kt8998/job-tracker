import { z } from 'zod';

const statusEnum = z.enum(['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED']);

export const createApplicationSchema = z.object({
  company: z.string().min(1, 'Company is required').max(200),
  role: z.string().min(1, 'Role is required').max(200),
  status: statusEnum.optional(),
  jobUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  notes: z.string().max(2000).optional(),
  salary: z.number().int().positive().optional(),
  location: z.string().max(200).optional(),
  appliedDate: z.coerce.date().optional(),
});

export const updateApplicationSchema = createApplicationSchema.partial();

export const listApplicationsQuerySchema = z.object({
  status: statusEnum.optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type ListApplicationsQuery = z.infer<typeof listApplicationsQuerySchema>;
