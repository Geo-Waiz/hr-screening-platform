import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  companyId: z.string().uuid('Invalid company ID'),
  role: z.nativeEnum(UserRole).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(100, 'Company name too long'),
  domain: z.string().min(1, 'Domain is required').max(100, 'Domain too long'),
  adminEmail: z.string().email('Invalid email format'),
  adminPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  adminFirstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  adminLastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
});
