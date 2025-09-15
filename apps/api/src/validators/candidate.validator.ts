import { z } from 'zod';
import { CandidateStatus } from '@prisma/client';

export const createCandidateSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name too long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'First name contains invalid characters'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name too long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Last name contains invalid characters'),
  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email too long'),
  phone: z.string()
    .regex(/^[\+]?[\d\s\-\(\)]+$/, 'Invalid phone number format')
    .min(10, 'Phone number too short')
    .max(20, 'Phone number too long')
    .optional(),
  position: z.string()
    .min(1, 'Position is required')
    .max(100, 'Position title too long'),
});

export const updateCandidateSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name too long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'First name contains invalid characters')
    .optional(),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name too long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Last name contains invalid characters')
    .optional(),
  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email too long')
    .optional(),
  phone: z.string()
    .regex(/^[\+]?[\d\s\-\(\)]+$/, 'Invalid phone number format')
    .min(10, 'Phone number too short')
    .max(20, 'Phone number too long')
    .optional()
    .nullable(),
  position: z.string()
    .min(1, 'Position is required')
    .max(100, 'Position title too long')
    .optional(),
  status: z.nativeEnum(CandidateStatus).optional(),
  consentGiven: z.boolean().optional(),
});

export const candidateFiltersSchema = z.object({
  status: z.nativeEnum(CandidateStatus).optional(),
  position: z.string().max(100).optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().min(1).max(1000).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export const candidateIdSchema = z.object({
  id: z.string().uuid('Invalid candidate ID'),
});
