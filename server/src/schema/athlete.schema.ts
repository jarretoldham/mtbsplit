import z from 'zod';

export const AthleteCreateInputSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string().optional().nullable(),
    lastName: z.string().optional().nullable(),
    passwordHash: z.string().optional(),
    tokens: z.lazy(() => AthleteTokenCreateInputSchema).optional(),
  })
  .strict();

export type AthleteCreateInput = z.infer<typeof AthleteCreateInputSchema>;

export const AthleteUpdateInputSchema = z.object({
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  tokens: z.lazy(() => AthleteTokenUpdateInputSchema).optional(),
});

export type AthleteUpdateInput = z.infer<typeof AthleteUpdateInputSchema>;

export const AthleteTokenCreateInputSchema = z
  .object({
    provider: z.string(),
    accessToken: z.string(),
    refreshToken: z.string().optional().nullable(),
    expiresAt: z.coerce.date(),
  })
  .strict();

export type AthleteTokenCreateInput = z.infer<
  typeof AthleteTokenCreateInputSchema
>;

export const AthleteTokenUpdateInputSchema = z.object({
  provider: z.string(),
  accessToken: z.string(),
  refreshToken: z.string().optional().nullable(),
  expiresAt: z.coerce.date(),
});
