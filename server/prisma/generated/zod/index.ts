import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const AthleteScalarFieldEnumSchema = z.enum(['id','email','firstName','lastName','createdAt','updatedAt']);

export const AthleteTokenScalarFieldEnumSchema = z.enum(['id','athleteId','provider','accessToken','refreshToken','expiresAt','createdAt','updatedAt']);

export const TrackScalarFieldEnumSchema = z.enum(['id','name','activityType','distance','elevationGain','elevationLoss','startLatLng','endLatLng','polyline','city','state','country','createdAt','updatedAt']);

export const TrackDetailsScalarFieldEnumSchema = z.enum(['id','trackId','streams','createdAt','updatedAt']);

export const TrackEffortScalarFieldEnumSchema = z.enum(['id','trackId','athleteId','activityId','startTime','endTime','time','polyline','streams','createdAt','updatedAt']);

export const ActivityScalarFieldEnumSchema = z.enum(['id','athleteId','name','type','distance','elevationGain','elevationLoss','averageSpeed','maxSpeed','startLatLng','endLatLng','polyline','elapsedTime','startDateTime','timezone','source','sourceId','city','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const TokenPoviderSchema = z.enum(['Strava']);

export type TokenPoviderType = `${z.infer<typeof TokenPoviderSchema>}`

export const ActivityTypeSchema = z.enum(['Ride']);

export type ActivityTypeType = `${z.infer<typeof ActivityTypeSchema>}`

export const ActivitySourceSchema = z.enum(['Strava']);

export type ActivitySourceType = `${z.infer<typeof ActivitySourceSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ATHLETE SCHEMA
/////////////////////////////////////////

/**
 * *
 * * This generator creates Zod schemas from your Prisma models using npx prisma generate zod
 */
export const AthleteSchema = z.object({
  id: z.number().int(),
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Athlete = z.infer<typeof AthleteSchema>

/////////////////////////////////////////
// ATHLETE TOKEN SCHEMA
/////////////////////////////////////////

export const AthleteTokenSchema = z.object({
  provider: TokenPoviderSchema,
  id: z.number().int(),
  athleteId: z.number().int(),
  accessToken: z.string(),
  refreshToken: z.string().nullable(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type AthleteToken = z.infer<typeof AthleteTokenSchema>

/////////////////////////////////////////
// TRACK SCHEMA
/////////////////////////////////////////

export const TrackSchema = z.object({
  activityType: ActivityTypeSchema,
  id: z.number().int(),
  name: z.string(),
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number().nullable(),
  startLatLng: z.number().array(),
  endLatLng: z.number().array(),
  polyline: z.string().nullable(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Track = z.infer<typeof TrackSchema>

/////////////////////////////////////////
// TRACK DETAILS SCHEMA
/////////////////////////////////////////

export const TrackDetailsSchema = z.object({
  id: z.number().int(),
  trackId: z.number().int(),
  streams: JsonValueSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type TrackDetails = z.infer<typeof TrackDetailsSchema>

/////////////////////////////////////////
// TRACK EFFORT SCHEMA
/////////////////////////////////////////

export const TrackEffortSchema = z.object({
  id: z.number().int(),
  trackId: z.number().int(),
  athleteId: z.number().int(),
  activityId: z.number().int(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  time: z.number().int(),
  polyline: z.string(),
  streams: JsonValueSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type TrackEffort = z.infer<typeof TrackEffortSchema>

/////////////////////////////////////////
// ACTIVITY SCHEMA
/////////////////////////////////////////

export const ActivitySchema = z.object({
  type: ActivityTypeSchema,
  source: ActivitySourceSchema,
  id: z.number().int(),
  athleteId: z.number().int(),
  name: z.string(),
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number().nullable(),
  averageSpeed: z.number().nullable(),
  maxSpeed: z.number().nullable(),
  startLatLng: z.number().array(),
  endLatLng: z.number().array(),
  polyline: z.string(),
  elapsedTime: z.number().int(),
  startDateTime: z.coerce.date(),
  timezone: z.string(),
  sourceId: z.string().nullable(),
  city: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Activity = z.infer<typeof ActivitySchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// ATHLETE
//------------------------------------------------------

export const AthleteIncludeSchema: z.ZodType<Prisma.AthleteInclude> = z.object({
  tracks: z.union([z.boolean(),z.lazy(() => TrackEffortFindManyArgsSchema)]).optional(),
  activities: z.union([z.boolean(),z.lazy(() => ActivityFindManyArgsSchema)]).optional(),
  tokens: z.union([z.boolean(),z.lazy(() => AthleteTokenFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AthleteCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const AthleteArgsSchema: z.ZodType<Prisma.AthleteDefaultArgs> = z.object({
  select: z.lazy(() => AthleteSelectSchema).optional(),
  include: z.lazy(() => AthleteIncludeSchema).optional(),
}).strict();

export const AthleteCountOutputTypeArgsSchema: z.ZodType<Prisma.AthleteCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => AthleteCountOutputTypeSelectSchema).nullish(),
}).strict();

export const AthleteCountOutputTypeSelectSchema: z.ZodType<Prisma.AthleteCountOutputTypeSelect> = z.object({
  tracks: z.boolean().optional(),
  activities: z.boolean().optional(),
  tokens: z.boolean().optional(),
}).strict();

export const AthleteSelectSchema: z.ZodType<Prisma.AthleteSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  tracks: z.union([z.boolean(),z.lazy(() => TrackEffortFindManyArgsSchema)]).optional(),
  activities: z.union([z.boolean(),z.lazy(() => ActivityFindManyArgsSchema)]).optional(),
  tokens: z.union([z.boolean(),z.lazy(() => AthleteTokenFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AthleteCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ATHLETE TOKEN
//------------------------------------------------------

export const AthleteTokenIncludeSchema: z.ZodType<Prisma.AthleteTokenInclude> = z.object({
  athlete: z.union([z.boolean(),z.lazy(() => AthleteArgsSchema)]).optional(),
}).strict()

export const AthleteTokenArgsSchema: z.ZodType<Prisma.AthleteTokenDefaultArgs> = z.object({
  select: z.lazy(() => AthleteTokenSelectSchema).optional(),
  include: z.lazy(() => AthleteTokenIncludeSchema).optional(),
}).strict();

export const AthleteTokenSelectSchema: z.ZodType<Prisma.AthleteTokenSelect> = z.object({
  id: z.boolean().optional(),
  athleteId: z.boolean().optional(),
  provider: z.boolean().optional(),
  accessToken: z.boolean().optional(),
  refreshToken: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  athlete: z.union([z.boolean(),z.lazy(() => AthleteArgsSchema)]).optional(),
}).strict()

// TRACK
//------------------------------------------------------

export const TrackIncludeSchema: z.ZodType<Prisma.TrackInclude> = z.object({
  trackDetails: z.union([z.boolean(),z.lazy(() => TrackDetailsArgsSchema)]).optional(),
  trackEfforts: z.union([z.boolean(),z.lazy(() => TrackEffortFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TrackCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TrackArgsSchema: z.ZodType<Prisma.TrackDefaultArgs> = z.object({
  select: z.lazy(() => TrackSelectSchema).optional(),
  include: z.lazy(() => TrackIncludeSchema).optional(),
}).strict();

export const TrackCountOutputTypeArgsSchema: z.ZodType<Prisma.TrackCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TrackCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TrackCountOutputTypeSelectSchema: z.ZodType<Prisma.TrackCountOutputTypeSelect> = z.object({
  trackEfforts: z.boolean().optional(),
}).strict();

export const TrackSelectSchema: z.ZodType<Prisma.TrackSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  activityType: z.boolean().optional(),
  distance: z.boolean().optional(),
  elevationGain: z.boolean().optional(),
  elevationLoss: z.boolean().optional(),
  startLatLng: z.boolean().optional(),
  endLatLng: z.boolean().optional(),
  polyline: z.boolean().optional(),
  city: z.boolean().optional(),
  state: z.boolean().optional(),
  country: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  trackDetails: z.union([z.boolean(),z.lazy(() => TrackDetailsArgsSchema)]).optional(),
  trackEfforts: z.union([z.boolean(),z.lazy(() => TrackEffortFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TrackCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TRACK DETAILS
//------------------------------------------------------

export const TrackDetailsIncludeSchema: z.ZodType<Prisma.TrackDetailsInclude> = z.object({
  track: z.union([z.boolean(),z.lazy(() => TrackArgsSchema)]).optional(),
}).strict()

export const TrackDetailsArgsSchema: z.ZodType<Prisma.TrackDetailsDefaultArgs> = z.object({
  select: z.lazy(() => TrackDetailsSelectSchema).optional(),
  include: z.lazy(() => TrackDetailsIncludeSchema).optional(),
}).strict();

export const TrackDetailsSelectSchema: z.ZodType<Prisma.TrackDetailsSelect> = z.object({
  id: z.boolean().optional(),
  trackId: z.boolean().optional(),
  streams: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  track: z.union([z.boolean(),z.lazy(() => TrackArgsSchema)]).optional(),
}).strict()

// TRACK EFFORT
//------------------------------------------------------

export const TrackEffortIncludeSchema: z.ZodType<Prisma.TrackEffortInclude> = z.object({
  track: z.union([z.boolean(),z.lazy(() => TrackArgsSchema)]).optional(),
  athlete: z.union([z.boolean(),z.lazy(() => AthleteArgsSchema)]).optional(),
  activity: z.union([z.boolean(),z.lazy(() => ActivityArgsSchema)]).optional(),
}).strict()

export const TrackEffortArgsSchema: z.ZodType<Prisma.TrackEffortDefaultArgs> = z.object({
  select: z.lazy(() => TrackEffortSelectSchema).optional(),
  include: z.lazy(() => TrackEffortIncludeSchema).optional(),
}).strict();

export const TrackEffortSelectSchema: z.ZodType<Prisma.TrackEffortSelect> = z.object({
  id: z.boolean().optional(),
  trackId: z.boolean().optional(),
  athleteId: z.boolean().optional(),
  activityId: z.boolean().optional(),
  startTime: z.boolean().optional(),
  endTime: z.boolean().optional(),
  time: z.boolean().optional(),
  polyline: z.boolean().optional(),
  streams: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  track: z.union([z.boolean(),z.lazy(() => TrackArgsSchema)]).optional(),
  athlete: z.union([z.boolean(),z.lazy(() => AthleteArgsSchema)]).optional(),
  activity: z.union([z.boolean(),z.lazy(() => ActivityArgsSchema)]).optional(),
}).strict()

// ACTIVITY
//------------------------------------------------------

export const ActivityIncludeSchema: z.ZodType<Prisma.ActivityInclude> = z.object({
  athlete: z.union([z.boolean(),z.lazy(() => AthleteArgsSchema)]).optional(),
  trackEfforts: z.union([z.boolean(),z.lazy(() => TrackEffortFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ActivityCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ActivityArgsSchema: z.ZodType<Prisma.ActivityDefaultArgs> = z.object({
  select: z.lazy(() => ActivitySelectSchema).optional(),
  include: z.lazy(() => ActivityIncludeSchema).optional(),
}).strict();

export const ActivityCountOutputTypeArgsSchema: z.ZodType<Prisma.ActivityCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ActivityCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ActivityCountOutputTypeSelectSchema: z.ZodType<Prisma.ActivityCountOutputTypeSelect> = z.object({
  trackEfforts: z.boolean().optional(),
}).strict();

export const ActivitySelectSchema: z.ZodType<Prisma.ActivitySelect> = z.object({
  id: z.boolean().optional(),
  athleteId: z.boolean().optional(),
  name: z.boolean().optional(),
  type: z.boolean().optional(),
  distance: z.boolean().optional(),
  elevationGain: z.boolean().optional(),
  elevationLoss: z.boolean().optional(),
  averageSpeed: z.boolean().optional(),
  maxSpeed: z.boolean().optional(),
  startLatLng: z.boolean().optional(),
  endLatLng: z.boolean().optional(),
  polyline: z.boolean().optional(),
  elapsedTime: z.boolean().optional(),
  startDateTime: z.boolean().optional(),
  timezone: z.boolean().optional(),
  source: z.boolean().optional(),
  sourceId: z.boolean().optional(),
  city: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  athlete: z.union([z.boolean(),z.lazy(() => AthleteArgsSchema)]).optional(),
  trackEfforts: z.union([z.boolean(),z.lazy(() => TrackEffortFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ActivityCountOutputTypeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const AthleteWhereInputSchema: z.ZodType<Prisma.AthleteWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AthleteWhereInputSchema),z.lazy(() => AthleteWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AthleteWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AthleteWhereInputSchema),z.lazy(() => AthleteWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  tracks: z.lazy(() => TrackEffortListRelationFilterSchema).optional(),
  activities: z.lazy(() => ActivityListRelationFilterSchema).optional(),
  tokens: z.lazy(() => AthleteTokenListRelationFilterSchema).optional()
}).strict();

export const AthleteOrderByWithRelationInputSchema: z.ZodType<Prisma.AthleteOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  tracks: z.lazy(() => TrackEffortOrderByRelationAggregateInputSchema).optional(),
  activities: z.lazy(() => ActivityOrderByRelationAggregateInputSchema).optional(),
  tokens: z.lazy(() => AthleteTokenOrderByRelationAggregateInputSchema).optional()
}).strict();

export const AthleteWhereUniqueInputSchema: z.ZodType<Prisma.AthleteWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    email: z.string()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => AthleteWhereInputSchema),z.lazy(() => AthleteWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AthleteWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AthleteWhereInputSchema),z.lazy(() => AthleteWhereInputSchema).array() ]).optional(),
  firstName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  tracks: z.lazy(() => TrackEffortListRelationFilterSchema).optional(),
  activities: z.lazy(() => ActivityListRelationFilterSchema).optional(),
  tokens: z.lazy(() => AthleteTokenListRelationFilterSchema).optional()
}).strict());

export const AthleteOrderByWithAggregationInputSchema: z.ZodType<Prisma.AthleteOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AthleteCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AthleteAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AthleteMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AthleteMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AthleteSumOrderByAggregateInputSchema).optional()
}).strict();

export const AthleteScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AthleteScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AthleteScalarWhereWithAggregatesInputSchema),z.lazy(() => AthleteScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AthleteScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AthleteScalarWhereWithAggregatesInputSchema),z.lazy(() => AthleteScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  lastName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AthleteTokenWhereInputSchema: z.ZodType<Prisma.AthleteTokenWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AthleteTokenWhereInputSchema),z.lazy(() => AthleteTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AthleteTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AthleteTokenWhereInputSchema),z.lazy(() => AthleteTokenWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  athleteId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  provider: z.union([ z.lazy(() => EnumTokenPoviderFilterSchema),z.lazy(() => TokenPoviderSchema) ]).optional(),
  accessToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refreshToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  athlete: z.union([ z.lazy(() => AthleteScalarRelationFilterSchema),z.lazy(() => AthleteWhereInputSchema) ]).optional(),
}).strict();

export const AthleteTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.AthleteTokenOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  athlete: z.lazy(() => AthleteOrderByWithRelationInputSchema).optional()
}).strict();

export const AthleteTokenWhereUniqueInputSchema: z.ZodType<Prisma.AthleteTokenWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => AthleteTokenWhereInputSchema),z.lazy(() => AthleteTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AthleteTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AthleteTokenWhereInputSchema),z.lazy(() => AthleteTokenWhereInputSchema).array() ]).optional(),
  athleteId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  provider: z.union([ z.lazy(() => EnumTokenPoviderFilterSchema),z.lazy(() => TokenPoviderSchema) ]).optional(),
  accessToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refreshToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  athlete: z.union([ z.lazy(() => AthleteScalarRelationFilterSchema),z.lazy(() => AthleteWhereInputSchema) ]).optional(),
}).strict());

export const AthleteTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.AthleteTokenOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AthleteTokenCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AthleteTokenAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AthleteTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AthleteTokenMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AthleteTokenSumOrderByAggregateInputSchema).optional()
}).strict();

export const AthleteTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AthleteTokenScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AthleteTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => AthleteTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AthleteTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AthleteTokenScalarWhereWithAggregatesInputSchema),z.lazy(() => AthleteTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  athleteId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  provider: z.union([ z.lazy(() => EnumTokenPoviderWithAggregatesFilterSchema),z.lazy(() => TokenPoviderSchema) ]).optional(),
  accessToken: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  refreshToken: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  expiresAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TrackWhereInputSchema: z.ZodType<Prisma.TrackWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TrackWhereInputSchema),z.lazy(() => TrackWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackWhereInputSchema),z.lazy(() => TrackWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  activityType: z.union([ z.lazy(() => EnumActivityTypeFilterSchema),z.lazy(() => ActivityTypeSchema) ]).optional(),
  distance: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  elevationGain: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  elevationLoss: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  startLatLng: z.lazy(() => FloatNullableListFilterSchema).optional(),
  endLatLng: z.lazy(() => FloatNullableListFilterSchema).optional(),
  polyline: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  state: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  trackDetails: z.union([ z.lazy(() => TrackDetailsNullableScalarRelationFilterSchema),z.lazy(() => TrackDetailsWhereInputSchema) ]).optional().nullable(),
  trackEfforts: z.lazy(() => TrackEffortListRelationFilterSchema).optional()
}).strict();

export const TrackOrderByWithRelationInputSchema: z.ZodType<Prisma.TrackOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  activityType: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional(),
  elevationGain: z.lazy(() => SortOrderSchema).optional(),
  elevationLoss: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  startLatLng: z.lazy(() => SortOrderSchema).optional(),
  endLatLng: z.lazy(() => SortOrderSchema).optional(),
  polyline: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  trackDetails: z.lazy(() => TrackDetailsOrderByWithRelationInputSchema).optional(),
  trackEfforts: z.lazy(() => TrackEffortOrderByRelationAggregateInputSchema).optional()
}).strict();

export const TrackWhereUniqueInputSchema: z.ZodType<Prisma.TrackWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => TrackWhereInputSchema),z.lazy(() => TrackWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackWhereInputSchema),z.lazy(() => TrackWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  activityType: z.union([ z.lazy(() => EnumActivityTypeFilterSchema),z.lazy(() => ActivityTypeSchema) ]).optional(),
  distance: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  elevationGain: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  elevationLoss: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  startLatLng: z.lazy(() => FloatNullableListFilterSchema).optional(),
  endLatLng: z.lazy(() => FloatNullableListFilterSchema).optional(),
  polyline: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  state: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  trackDetails: z.union([ z.lazy(() => TrackDetailsNullableScalarRelationFilterSchema),z.lazy(() => TrackDetailsWhereInputSchema) ]).optional().nullable(),
  trackEfforts: z.lazy(() => TrackEffortListRelationFilterSchema).optional()
}).strict());

export const TrackOrderByWithAggregationInputSchema: z.ZodType<Prisma.TrackOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  activityType: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional(),
  elevationGain: z.lazy(() => SortOrderSchema).optional(),
  elevationLoss: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  startLatLng: z.lazy(() => SortOrderSchema).optional(),
  endLatLng: z.lazy(() => SortOrderSchema).optional(),
  polyline: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TrackCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TrackAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TrackMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TrackMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TrackSumOrderByAggregateInputSchema).optional()
}).strict();

export const TrackScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TrackScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TrackScalarWhereWithAggregatesInputSchema),z.lazy(() => TrackScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackScalarWhereWithAggregatesInputSchema),z.lazy(() => TrackScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  activityType: z.union([ z.lazy(() => EnumActivityTypeWithAggregatesFilterSchema),z.lazy(() => ActivityTypeSchema) ]).optional(),
  distance: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  elevationGain: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  elevationLoss: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  startLatLng: z.lazy(() => FloatNullableListFilterSchema).optional(),
  endLatLng: z.lazy(() => FloatNullableListFilterSchema).optional(),
  polyline: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  state: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TrackDetailsWhereInputSchema: z.ZodType<Prisma.TrackDetailsWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TrackDetailsWhereInputSchema),z.lazy(() => TrackDetailsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackDetailsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackDetailsWhereInputSchema),z.lazy(() => TrackDetailsWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  trackId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  streams: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  track: z.union([ z.lazy(() => TrackScalarRelationFilterSchema),z.lazy(() => TrackWhereInputSchema) ]).optional(),
}).strict();

export const TrackDetailsOrderByWithRelationInputSchema: z.ZodType<Prisma.TrackDetailsOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  streams: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  track: z.lazy(() => TrackOrderByWithRelationInputSchema).optional()
}).strict();

export const TrackDetailsWhereUniqueInputSchema: z.ZodType<Prisma.TrackDetailsWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    trackId: z.number().int()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    trackId: z.number().int(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  trackId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => TrackDetailsWhereInputSchema),z.lazy(() => TrackDetailsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackDetailsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackDetailsWhereInputSchema),z.lazy(() => TrackDetailsWhereInputSchema).array() ]).optional(),
  streams: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  track: z.union([ z.lazy(() => TrackScalarRelationFilterSchema),z.lazy(() => TrackWhereInputSchema) ]).optional(),
}).strict());

export const TrackDetailsOrderByWithAggregationInputSchema: z.ZodType<Prisma.TrackDetailsOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  streams: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TrackDetailsCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TrackDetailsAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TrackDetailsMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TrackDetailsMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TrackDetailsSumOrderByAggregateInputSchema).optional()
}).strict();

export const TrackDetailsScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TrackDetailsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TrackDetailsScalarWhereWithAggregatesInputSchema),z.lazy(() => TrackDetailsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackDetailsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackDetailsScalarWhereWithAggregatesInputSchema),z.lazy(() => TrackDetailsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  trackId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  streams: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TrackEffortWhereInputSchema: z.ZodType<Prisma.TrackEffortWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TrackEffortWhereInputSchema),z.lazy(() => TrackEffortWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackEffortWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackEffortWhereInputSchema),z.lazy(() => TrackEffortWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  trackId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  athleteId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  activityId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  startTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  time: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  polyline: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  streams: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  track: z.union([ z.lazy(() => TrackScalarRelationFilterSchema),z.lazy(() => TrackWhereInputSchema) ]).optional(),
  athlete: z.union([ z.lazy(() => AthleteScalarRelationFilterSchema),z.lazy(() => AthleteWhereInputSchema) ]).optional(),
  activity: z.union([ z.lazy(() => ActivityScalarRelationFilterSchema),z.lazy(() => ActivityWhereInputSchema) ]).optional(),
}).strict();

export const TrackEffortOrderByWithRelationInputSchema: z.ZodType<Prisma.TrackEffortOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  activityId: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  polyline: z.lazy(() => SortOrderSchema).optional(),
  streams: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  track: z.lazy(() => TrackOrderByWithRelationInputSchema).optional(),
  athlete: z.lazy(() => AthleteOrderByWithRelationInputSchema).optional(),
  activity: z.lazy(() => ActivityOrderByWithRelationInputSchema).optional()
}).strict();

export const TrackEffortWhereUniqueInputSchema: z.ZodType<Prisma.TrackEffortWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => TrackEffortWhereInputSchema),z.lazy(() => TrackEffortWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackEffortWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackEffortWhereInputSchema),z.lazy(() => TrackEffortWhereInputSchema).array() ]).optional(),
  trackId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  athleteId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  activityId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  startTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  time: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  polyline: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  streams: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  track: z.union([ z.lazy(() => TrackScalarRelationFilterSchema),z.lazy(() => TrackWhereInputSchema) ]).optional(),
  athlete: z.union([ z.lazy(() => AthleteScalarRelationFilterSchema),z.lazy(() => AthleteWhereInputSchema) ]).optional(),
  activity: z.union([ z.lazy(() => ActivityScalarRelationFilterSchema),z.lazy(() => ActivityWhereInputSchema) ]).optional(),
}).strict());

export const TrackEffortOrderByWithAggregationInputSchema: z.ZodType<Prisma.TrackEffortOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  activityId: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  polyline: z.lazy(() => SortOrderSchema).optional(),
  streams: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TrackEffortCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TrackEffortAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TrackEffortMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TrackEffortMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TrackEffortSumOrderByAggregateInputSchema).optional()
}).strict();

export const TrackEffortScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TrackEffortScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TrackEffortScalarWhereWithAggregatesInputSchema),z.lazy(() => TrackEffortScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackEffortScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackEffortScalarWhereWithAggregatesInputSchema),z.lazy(() => TrackEffortScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  trackId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  athleteId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  activityId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  startTime: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  time: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  polyline: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  streams: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ActivityWhereInputSchema: z.ZodType<Prisma.ActivityWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ActivityWhereInputSchema),z.lazy(() => ActivityWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivityWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivityWhereInputSchema),z.lazy(() => ActivityWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  athleteId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumActivityTypeFilterSchema),z.lazy(() => ActivityTypeSchema) ]).optional(),
  distance: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  elevationGain: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  elevationLoss: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  averageSpeed: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  maxSpeed: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  startLatLng: z.lazy(() => FloatNullableListFilterSchema).optional(),
  endLatLng: z.lazy(() => FloatNullableListFilterSchema).optional(),
  polyline: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  elapsedTime: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  startDateTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  timezone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  source: z.union([ z.lazy(() => EnumActivitySourceFilterSchema),z.lazy(() => ActivitySourceSchema) ]).optional(),
  sourceId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  athlete: z.union([ z.lazy(() => AthleteScalarRelationFilterSchema),z.lazy(() => AthleteWhereInputSchema) ]).optional(),
  trackEfforts: z.lazy(() => TrackEffortListRelationFilterSchema).optional()
}).strict();

export const ActivityOrderByWithRelationInputSchema: z.ZodType<Prisma.ActivityOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional(),
  elevationGain: z.lazy(() => SortOrderSchema).optional(),
  elevationLoss: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  averageSpeed: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  maxSpeed: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  startLatLng: z.lazy(() => SortOrderSchema).optional(),
  endLatLng: z.lazy(() => SortOrderSchema).optional(),
  polyline: z.lazy(() => SortOrderSchema).optional(),
  elapsedTime: z.lazy(() => SortOrderSchema).optional(),
  startDateTime: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.lazy(() => SortOrderSchema).optional(),
  source: z.lazy(() => SortOrderSchema).optional(),
  sourceId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  athlete: z.lazy(() => AthleteOrderByWithRelationInputSchema).optional(),
  trackEfforts: z.lazy(() => TrackEffortOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ActivityWhereUniqueInputSchema: z.ZodType<Prisma.ActivityWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ActivityWhereInputSchema),z.lazy(() => ActivityWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivityWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivityWhereInputSchema),z.lazy(() => ActivityWhereInputSchema).array() ]).optional(),
  athleteId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumActivityTypeFilterSchema),z.lazy(() => ActivityTypeSchema) ]).optional(),
  distance: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  elevationGain: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  elevationLoss: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  averageSpeed: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  maxSpeed: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  startLatLng: z.lazy(() => FloatNullableListFilterSchema).optional(),
  endLatLng: z.lazy(() => FloatNullableListFilterSchema).optional(),
  polyline: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  elapsedTime: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  startDateTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  timezone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  source: z.union([ z.lazy(() => EnumActivitySourceFilterSchema),z.lazy(() => ActivitySourceSchema) ]).optional(),
  sourceId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  athlete: z.union([ z.lazy(() => AthleteScalarRelationFilterSchema),z.lazy(() => AthleteWhereInputSchema) ]).optional(),
  trackEfforts: z.lazy(() => TrackEffortListRelationFilterSchema).optional()
}).strict());

export const ActivityOrderByWithAggregationInputSchema: z.ZodType<Prisma.ActivityOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional(),
  elevationGain: z.lazy(() => SortOrderSchema).optional(),
  elevationLoss: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  averageSpeed: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  maxSpeed: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  startLatLng: z.lazy(() => SortOrderSchema).optional(),
  endLatLng: z.lazy(() => SortOrderSchema).optional(),
  polyline: z.lazy(() => SortOrderSchema).optional(),
  elapsedTime: z.lazy(() => SortOrderSchema).optional(),
  startDateTime: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.lazy(() => SortOrderSchema).optional(),
  source: z.lazy(() => SortOrderSchema).optional(),
  sourceId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ActivityCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ActivityAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ActivityMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ActivityMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ActivitySumOrderByAggregateInputSchema).optional()
}).strict();

export const ActivityScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ActivityScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ActivityScalarWhereWithAggregatesInputSchema),z.lazy(() => ActivityScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivityScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivityScalarWhereWithAggregatesInputSchema),z.lazy(() => ActivityScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  athleteId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumActivityTypeWithAggregatesFilterSchema),z.lazy(() => ActivityTypeSchema) ]).optional(),
  distance: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  elevationGain: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  elevationLoss: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  averageSpeed: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  maxSpeed: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  startLatLng: z.lazy(() => FloatNullableListFilterSchema).optional(),
  endLatLng: z.lazy(() => FloatNullableListFilterSchema).optional(),
  polyline: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  elapsedTime: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  startDateTime: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  timezone: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  source: z.union([ z.lazy(() => EnumActivitySourceWithAggregatesFilterSchema),z.lazy(() => ActivitySourceSchema) ]).optional(),
  sourceId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AthleteCreateInputSchema: z.ZodType<Prisma.AthleteCreateInput> = z.object({
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tracks: z.lazy(() => TrackEffortCreateNestedManyWithoutAthleteInputSchema).optional(),
  activities: z.lazy(() => ActivityCreateNestedManyWithoutAthleteInputSchema).optional(),
  tokens: z.lazy(() => AthleteTokenCreateNestedManyWithoutAthleteInputSchema).optional()
}).strict();

export const AthleteUncheckedCreateInputSchema: z.ZodType<Prisma.AthleteUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tracks: z.lazy(() => TrackEffortUncheckedCreateNestedManyWithoutAthleteInputSchema).optional(),
  activities: z.lazy(() => ActivityUncheckedCreateNestedManyWithoutAthleteInputSchema).optional(),
  tokens: z.lazy(() => AthleteTokenUncheckedCreateNestedManyWithoutAthleteInputSchema).optional()
}).strict();

export const AthleteUpdateInputSchema: z.ZodType<Prisma.AthleteUpdateInput> = z.object({
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tracks: z.lazy(() => TrackEffortUpdateManyWithoutAthleteNestedInputSchema).optional(),
  activities: z.lazy(() => ActivityUpdateManyWithoutAthleteNestedInputSchema).optional(),
  tokens: z.lazy(() => AthleteTokenUpdateManyWithoutAthleteNestedInputSchema).optional()
}).strict();

export const AthleteUncheckedUpdateInputSchema: z.ZodType<Prisma.AthleteUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tracks: z.lazy(() => TrackEffortUncheckedUpdateManyWithoutAthleteNestedInputSchema).optional(),
  activities: z.lazy(() => ActivityUncheckedUpdateManyWithoutAthleteNestedInputSchema).optional(),
  tokens: z.lazy(() => AthleteTokenUncheckedUpdateManyWithoutAthleteNestedInputSchema).optional()
}).strict();

export const AthleteCreateManyInputSchema: z.ZodType<Prisma.AthleteCreateManyInput> = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AthleteUpdateManyMutationInputSchema: z.ZodType<Prisma.AthleteUpdateManyMutationInput> = z.object({
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AthleteUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AthleteUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AthleteTokenCreateInputSchema: z.ZodType<Prisma.AthleteTokenCreateInput> = z.object({
  provider: z.lazy(() => TokenPoviderSchema),
  accessToken: z.string(),
  refreshToken: z.string().optional().nullable(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  athlete: z.lazy(() => AthleteCreateNestedOneWithoutTokensInputSchema)
}).strict();

export const AthleteTokenUncheckedCreateInputSchema: z.ZodType<Prisma.AthleteTokenUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  athleteId: z.number().int(),
  provider: z.lazy(() => TokenPoviderSchema),
  accessToken: z.string(),
  refreshToken: z.string().optional().nullable(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AthleteTokenUpdateInputSchema: z.ZodType<Prisma.AthleteTokenUpdateInput> = z.object({
  provider: z.union([ z.lazy(() => TokenPoviderSchema),z.lazy(() => EnumTokenPoviderFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  athlete: z.lazy(() => AthleteUpdateOneRequiredWithoutTokensNestedInputSchema).optional()
}).strict();

export const AthleteTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.AthleteTokenUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  athleteId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => TokenPoviderSchema),z.lazy(() => EnumTokenPoviderFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AthleteTokenCreateManyInputSchema: z.ZodType<Prisma.AthleteTokenCreateManyInput> = z.object({
  id: z.number().int().optional(),
  athleteId: z.number().int(),
  provider: z.lazy(() => TokenPoviderSchema),
  accessToken: z.string(),
  refreshToken: z.string().optional().nullable(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AthleteTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.AthleteTokenUpdateManyMutationInput> = z.object({
  provider: z.union([ z.lazy(() => TokenPoviderSchema),z.lazy(() => EnumTokenPoviderFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AthleteTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AthleteTokenUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  athleteId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => TokenPoviderSchema),z.lazy(() => EnumTokenPoviderFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackCreateInputSchema: z.ZodType<Prisma.TrackCreateInput> = z.object({
  name: z.string(),
  activityType: z.lazy(() => ActivityTypeSchema).optional(),
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number().optional().nullable(),
  startLatLng: z.union([ z.lazy(() => TrackCreatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => TrackCreateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.string().optional().nullable(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  trackDetails: z.lazy(() => TrackDetailsCreateNestedOneWithoutTrackInputSchema).optional(),
  trackEfforts: z.lazy(() => TrackEffortCreateNestedManyWithoutTrackInputSchema).optional()
}).strict();

export const TrackUncheckedCreateInputSchema: z.ZodType<Prisma.TrackUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  activityType: z.lazy(() => ActivityTypeSchema).optional(),
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number().optional().nullable(),
  startLatLng: z.union([ z.lazy(() => TrackCreatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => TrackCreateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.string().optional().nullable(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  trackDetails: z.lazy(() => TrackDetailsUncheckedCreateNestedOneWithoutTrackInputSchema).optional(),
  trackEfforts: z.lazy(() => TrackEffortUncheckedCreateNestedManyWithoutTrackInputSchema).optional()
}).strict();

export const TrackUpdateInputSchema: z.ZodType<Prisma.TrackUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activityType: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationGain: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationLoss: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLatLng: z.union([ z.lazy(() => TrackUpdatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => TrackUpdateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  trackDetails: z.lazy(() => TrackDetailsUpdateOneWithoutTrackNestedInputSchema).optional(),
  trackEfforts: z.lazy(() => TrackEffortUpdateManyWithoutTrackNestedInputSchema).optional()
}).strict();

export const TrackUncheckedUpdateInputSchema: z.ZodType<Prisma.TrackUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activityType: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationGain: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationLoss: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLatLng: z.union([ z.lazy(() => TrackUpdatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => TrackUpdateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  trackDetails: z.lazy(() => TrackDetailsUncheckedUpdateOneWithoutTrackNestedInputSchema).optional(),
  trackEfforts: z.lazy(() => TrackEffortUncheckedUpdateManyWithoutTrackNestedInputSchema).optional()
}).strict();

export const TrackCreateManyInputSchema: z.ZodType<Prisma.TrackCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  activityType: z.lazy(() => ActivityTypeSchema).optional(),
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number().optional().nullable(),
  startLatLng: z.union([ z.lazy(() => TrackCreatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => TrackCreateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.string().optional().nullable(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TrackUpdateManyMutationInputSchema: z.ZodType<Prisma.TrackUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activityType: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationGain: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationLoss: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLatLng: z.union([ z.lazy(() => TrackUpdatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => TrackUpdateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TrackUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activityType: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationGain: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationLoss: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLatLng: z.union([ z.lazy(() => TrackUpdatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => TrackUpdateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackDetailsCreateInputSchema: z.ZodType<Prisma.TrackDetailsCreateInput> = z.object({
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  track: z.lazy(() => TrackCreateNestedOneWithoutTrackDetailsInputSchema)
}).strict();

export const TrackDetailsUncheckedCreateInputSchema: z.ZodType<Prisma.TrackDetailsUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  trackId: z.number().int(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TrackDetailsUpdateInputSchema: z.ZodType<Prisma.TrackDetailsUpdateInput> = z.object({
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  track: z.lazy(() => TrackUpdateOneRequiredWithoutTrackDetailsNestedInputSchema).optional()
}).strict();

export const TrackDetailsUncheckedUpdateInputSchema: z.ZodType<Prisma.TrackDetailsUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  trackId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackDetailsCreateManyInputSchema: z.ZodType<Prisma.TrackDetailsCreateManyInput> = z.object({
  id: z.number().int().optional(),
  trackId: z.number().int(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TrackDetailsUpdateManyMutationInputSchema: z.ZodType<Prisma.TrackDetailsUpdateManyMutationInput> = z.object({
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackDetailsUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TrackDetailsUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  trackId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackEffortCreateInputSchema: z.ZodType<Prisma.TrackEffortCreateInput> = z.object({
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  time: z.number().int(),
  polyline: z.string(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  track: z.lazy(() => TrackCreateNestedOneWithoutTrackEffortsInputSchema),
  athlete: z.lazy(() => AthleteCreateNestedOneWithoutTracksInputSchema),
  activity: z.lazy(() => ActivityCreateNestedOneWithoutTrackEffortsInputSchema)
}).strict();

export const TrackEffortUncheckedCreateInputSchema: z.ZodType<Prisma.TrackEffortUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  trackId: z.number().int(),
  athleteId: z.number().int(),
  activityId: z.number().int(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  time: z.number().int(),
  polyline: z.string(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TrackEffortUpdateInputSchema: z.ZodType<Prisma.TrackEffortUpdateInput> = z.object({
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  track: z.lazy(() => TrackUpdateOneRequiredWithoutTrackEffortsNestedInputSchema).optional(),
  athlete: z.lazy(() => AthleteUpdateOneRequiredWithoutTracksNestedInputSchema).optional(),
  activity: z.lazy(() => ActivityUpdateOneRequiredWithoutTrackEffortsNestedInputSchema).optional()
}).strict();

export const TrackEffortUncheckedUpdateInputSchema: z.ZodType<Prisma.TrackEffortUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  trackId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  athleteId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  activityId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackEffortCreateManyInputSchema: z.ZodType<Prisma.TrackEffortCreateManyInput> = z.object({
  id: z.number().int().optional(),
  trackId: z.number().int(),
  athleteId: z.number().int(),
  activityId: z.number().int(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  time: z.number().int(),
  polyline: z.string(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TrackEffortUpdateManyMutationInputSchema: z.ZodType<Prisma.TrackEffortUpdateManyMutationInput> = z.object({
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackEffortUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TrackEffortUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  trackId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  athleteId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  activityId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ActivityCreateInputSchema: z.ZodType<Prisma.ActivityCreateInput> = z.object({
  name: z.string(),
  type: z.lazy(() => ActivityTypeSchema),
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number().optional().nullable(),
  averageSpeed: z.number().optional().nullable(),
  maxSpeed: z.number().optional().nullable(),
  startLatLng: z.union([ z.lazy(() => ActivityCreatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => ActivityCreateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.string(),
  elapsedTime: z.number().int(),
  startDateTime: z.coerce.date(),
  timezone: z.string(),
  source: z.lazy(() => ActivitySourceSchema).optional(),
  sourceId: z.string().optional().nullable(),
  city: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  athlete: z.lazy(() => AthleteCreateNestedOneWithoutActivitiesInputSchema),
  trackEfforts: z.lazy(() => TrackEffortCreateNestedManyWithoutActivityInputSchema).optional()
}).strict();

export const ActivityUncheckedCreateInputSchema: z.ZodType<Prisma.ActivityUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  athleteId: z.number().int(),
  name: z.string(),
  type: z.lazy(() => ActivityTypeSchema),
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number().optional().nullable(),
  averageSpeed: z.number().optional().nullable(),
  maxSpeed: z.number().optional().nullable(),
  startLatLng: z.union([ z.lazy(() => ActivityCreatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => ActivityCreateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.string(),
  elapsedTime: z.number().int(),
  startDateTime: z.coerce.date(),
  timezone: z.string(),
  source: z.lazy(() => ActivitySourceSchema).optional(),
  sourceId: z.string().optional().nullable(),
  city: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  trackEfforts: z.lazy(() => TrackEffortUncheckedCreateNestedManyWithoutActivityInputSchema).optional()
}).strict();

export const ActivityUpdateInputSchema: z.ZodType<Prisma.ActivityUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationGain: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationLoss: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averageSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLatLng: z.union([ z.lazy(() => ActivityUpdatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => ActivityUpdateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  elapsedTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => ActivitySourceSchema),z.lazy(() => EnumActivitySourceFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  athlete: z.lazy(() => AthleteUpdateOneRequiredWithoutActivitiesNestedInputSchema).optional(),
  trackEfforts: z.lazy(() => TrackEffortUpdateManyWithoutActivityNestedInputSchema).optional()
}).strict();

export const ActivityUncheckedUpdateInputSchema: z.ZodType<Prisma.ActivityUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  athleteId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationGain: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationLoss: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averageSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLatLng: z.union([ z.lazy(() => ActivityUpdatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => ActivityUpdateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  elapsedTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => ActivitySourceSchema),z.lazy(() => EnumActivitySourceFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  trackEfforts: z.lazy(() => TrackEffortUncheckedUpdateManyWithoutActivityNestedInputSchema).optional()
}).strict();

export const ActivityCreateManyInputSchema: z.ZodType<Prisma.ActivityCreateManyInput> = z.object({
  id: z.number().int().optional(),
  athleteId: z.number().int(),
  name: z.string(),
  type: z.lazy(() => ActivityTypeSchema),
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number().optional().nullable(),
  averageSpeed: z.number().optional().nullable(),
  maxSpeed: z.number().optional().nullable(),
  startLatLng: z.union([ z.lazy(() => ActivityCreatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => ActivityCreateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.string(),
  elapsedTime: z.number().int(),
  startDateTime: z.coerce.date(),
  timezone: z.string(),
  source: z.lazy(() => ActivitySourceSchema).optional(),
  sourceId: z.string().optional().nullable(),
  city: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ActivityUpdateManyMutationInputSchema: z.ZodType<Prisma.ActivityUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationGain: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationLoss: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averageSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLatLng: z.union([ z.lazy(() => ActivityUpdatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => ActivityUpdateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  elapsedTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => ActivitySourceSchema),z.lazy(() => EnumActivitySourceFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ActivityUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ActivityUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  athleteId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationGain: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationLoss: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averageSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLatLng: z.union([ z.lazy(() => ActivityUpdatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => ActivityUpdateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  elapsedTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => ActivitySourceSchema),z.lazy(() => EnumActivitySourceFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const TrackEffortListRelationFilterSchema: z.ZodType<Prisma.TrackEffortListRelationFilter> = z.object({
  every: z.lazy(() => TrackEffortWhereInputSchema).optional(),
  some: z.lazy(() => TrackEffortWhereInputSchema).optional(),
  none: z.lazy(() => TrackEffortWhereInputSchema).optional()
}).strict();

export const ActivityListRelationFilterSchema: z.ZodType<Prisma.ActivityListRelationFilter> = z.object({
  every: z.lazy(() => ActivityWhereInputSchema).optional(),
  some: z.lazy(() => ActivityWhereInputSchema).optional(),
  none: z.lazy(() => ActivityWhereInputSchema).optional()
}).strict();

export const AthleteTokenListRelationFilterSchema: z.ZodType<Prisma.AthleteTokenListRelationFilter> = z.object({
  every: z.lazy(() => AthleteTokenWhereInputSchema).optional(),
  some: z.lazy(() => AthleteTokenWhereInputSchema).optional(),
  none: z.lazy(() => AthleteTokenWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const TrackEffortOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TrackEffortOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivityOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ActivityOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AthleteTokenOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AthleteTokenOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AthleteCountOrderByAggregateInputSchema: z.ZodType<Prisma.AthleteCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AthleteAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AthleteAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AthleteMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AthleteMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AthleteMinOrderByAggregateInputSchema: z.ZodType<Prisma.AthleteMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AthleteSumOrderByAggregateInputSchema: z.ZodType<Prisma.AthleteSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const EnumTokenPoviderFilterSchema: z.ZodType<Prisma.EnumTokenPoviderFilter> = z.object({
  equals: z.lazy(() => TokenPoviderSchema).optional(),
  in: z.lazy(() => TokenPoviderSchema).array().optional(),
  notIn: z.lazy(() => TokenPoviderSchema).array().optional(),
  not: z.union([ z.lazy(() => TokenPoviderSchema),z.lazy(() => NestedEnumTokenPoviderFilterSchema) ]).optional(),
}).strict();

export const AthleteScalarRelationFilterSchema: z.ZodType<Prisma.AthleteScalarRelationFilter> = z.object({
  is: z.lazy(() => AthleteWhereInputSchema).optional(),
  isNot: z.lazy(() => AthleteWhereInputSchema).optional()
}).strict();

export const AthleteTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.AthleteTokenCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AthleteTokenAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AthleteTokenAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AthleteTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AthleteTokenMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AthleteTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.AthleteTokenMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  accessToken: z.lazy(() => SortOrderSchema).optional(),
  refreshToken: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AthleteTokenSumOrderByAggregateInputSchema: z.ZodType<Prisma.AthleteTokenSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumTokenPoviderWithAggregatesFilterSchema: z.ZodType<Prisma.EnumTokenPoviderWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TokenPoviderSchema).optional(),
  in: z.lazy(() => TokenPoviderSchema).array().optional(),
  notIn: z.lazy(() => TokenPoviderSchema).array().optional(),
  not: z.union([ z.lazy(() => TokenPoviderSchema),z.lazy(() => NestedEnumTokenPoviderWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTokenPoviderFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTokenPoviderFilterSchema).optional()
}).strict();

export const EnumActivityTypeFilterSchema: z.ZodType<Prisma.EnumActivityTypeFilter> = z.object({
  equals: z.lazy(() => ActivityTypeSchema).optional(),
  in: z.lazy(() => ActivityTypeSchema).array().optional(),
  notIn: z.lazy(() => ActivityTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => NestedEnumActivityTypeFilterSchema) ]).optional(),
}).strict();

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const FloatNullableListFilterSchema: z.ZodType<Prisma.FloatNullableListFilter> = z.object({
  equals: z.number().array().optional().nullable(),
  has: z.number().optional().nullable(),
  hasEvery: z.number().array().optional(),
  hasSome: z.number().array().optional(),
  isEmpty: z.boolean().optional()
}).strict();

export const TrackDetailsNullableScalarRelationFilterSchema: z.ZodType<Prisma.TrackDetailsNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => TrackDetailsWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => TrackDetailsWhereInputSchema).optional().nullable()
}).strict();

export const TrackCountOrderByAggregateInputSchema: z.ZodType<Prisma.TrackCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  activityType: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional(),
  elevationGain: z.lazy(() => SortOrderSchema).optional(),
  elevationLoss: z.lazy(() => SortOrderSchema).optional(),
  startLatLng: z.lazy(() => SortOrderSchema).optional(),
  endLatLng: z.lazy(() => SortOrderSchema).optional(),
  polyline: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TrackAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional(),
  elevationGain: z.lazy(() => SortOrderSchema).optional(),
  elevationLoss: z.lazy(() => SortOrderSchema).optional(),
  startLatLng: z.lazy(() => SortOrderSchema).optional(),
  endLatLng: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TrackMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  activityType: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional(),
  elevationGain: z.lazy(() => SortOrderSchema).optional(),
  elevationLoss: z.lazy(() => SortOrderSchema).optional(),
  polyline: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackMinOrderByAggregateInputSchema: z.ZodType<Prisma.TrackMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  activityType: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional(),
  elevationGain: z.lazy(() => SortOrderSchema).optional(),
  elevationLoss: z.lazy(() => SortOrderSchema).optional(),
  polyline: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackSumOrderByAggregateInputSchema: z.ZodType<Prisma.TrackSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional(),
  elevationGain: z.lazy(() => SortOrderSchema).optional(),
  elevationLoss: z.lazy(() => SortOrderSchema).optional(),
  startLatLng: z.lazy(() => SortOrderSchema).optional(),
  endLatLng: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumActivityTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumActivityTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ActivityTypeSchema).optional(),
  in: z.lazy(() => ActivityTypeSchema).array().optional(),
  notIn: z.lazy(() => ActivityTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => NestedEnumActivityTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumActivityTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumActivityTypeFilterSchema).optional()
}).strict();

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const TrackScalarRelationFilterSchema: z.ZodType<Prisma.TrackScalarRelationFilter> = z.object({
  is: z.lazy(() => TrackWhereInputSchema).optional(),
  isNot: z.lazy(() => TrackWhereInputSchema).optional()
}).strict();

export const TrackDetailsCountOrderByAggregateInputSchema: z.ZodType<Prisma.TrackDetailsCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  streams: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackDetailsAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TrackDetailsAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackDetailsMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TrackDetailsMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackDetailsMinOrderByAggregateInputSchema: z.ZodType<Prisma.TrackDetailsMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackDetailsSumOrderByAggregateInputSchema: z.ZodType<Prisma.TrackDetailsSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const ActivityScalarRelationFilterSchema: z.ZodType<Prisma.ActivityScalarRelationFilter> = z.object({
  is: z.lazy(() => ActivityWhereInputSchema).optional(),
  isNot: z.lazy(() => ActivityWhereInputSchema).optional()
}).strict();

export const TrackEffortCountOrderByAggregateInputSchema: z.ZodType<Prisma.TrackEffortCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  activityId: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  polyline: z.lazy(() => SortOrderSchema).optional(),
  streams: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackEffortAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TrackEffortAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  activityId: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackEffortMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TrackEffortMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  activityId: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  polyline: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackEffortMinOrderByAggregateInputSchema: z.ZodType<Prisma.TrackEffortMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  activityId: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  polyline: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TrackEffortSumOrderByAggregateInputSchema: z.ZodType<Prisma.TrackEffortSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  trackId: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  activityId: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumActivitySourceFilterSchema: z.ZodType<Prisma.EnumActivitySourceFilter> = z.object({
  equals: z.lazy(() => ActivitySourceSchema).optional(),
  in: z.lazy(() => ActivitySourceSchema).array().optional(),
  notIn: z.lazy(() => ActivitySourceSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivitySourceSchema),z.lazy(() => NestedEnumActivitySourceFilterSchema) ]).optional(),
}).strict();

export const ActivityCountOrderByAggregateInputSchema: z.ZodType<Prisma.ActivityCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional(),
  elevationGain: z.lazy(() => SortOrderSchema).optional(),
  elevationLoss: z.lazy(() => SortOrderSchema).optional(),
  averageSpeed: z.lazy(() => SortOrderSchema).optional(),
  maxSpeed: z.lazy(() => SortOrderSchema).optional(),
  startLatLng: z.lazy(() => SortOrderSchema).optional(),
  endLatLng: z.lazy(() => SortOrderSchema).optional(),
  polyline: z.lazy(() => SortOrderSchema).optional(),
  elapsedTime: z.lazy(() => SortOrderSchema).optional(),
  startDateTime: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.lazy(() => SortOrderSchema).optional(),
  source: z.lazy(() => SortOrderSchema).optional(),
  sourceId: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivityAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ActivityAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional(),
  elevationGain: z.lazy(() => SortOrderSchema).optional(),
  elevationLoss: z.lazy(() => SortOrderSchema).optional(),
  averageSpeed: z.lazy(() => SortOrderSchema).optional(),
  maxSpeed: z.lazy(() => SortOrderSchema).optional(),
  startLatLng: z.lazy(() => SortOrderSchema).optional(),
  endLatLng: z.lazy(() => SortOrderSchema).optional(),
  elapsedTime: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivityMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ActivityMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional(),
  elevationGain: z.lazy(() => SortOrderSchema).optional(),
  elevationLoss: z.lazy(() => SortOrderSchema).optional(),
  averageSpeed: z.lazy(() => SortOrderSchema).optional(),
  maxSpeed: z.lazy(() => SortOrderSchema).optional(),
  polyline: z.lazy(() => SortOrderSchema).optional(),
  elapsedTime: z.lazy(() => SortOrderSchema).optional(),
  startDateTime: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.lazy(() => SortOrderSchema).optional(),
  source: z.lazy(() => SortOrderSchema).optional(),
  sourceId: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivityMinOrderByAggregateInputSchema: z.ZodType<Prisma.ActivityMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional(),
  elevationGain: z.lazy(() => SortOrderSchema).optional(),
  elevationLoss: z.lazy(() => SortOrderSchema).optional(),
  averageSpeed: z.lazy(() => SortOrderSchema).optional(),
  maxSpeed: z.lazy(() => SortOrderSchema).optional(),
  polyline: z.lazy(() => SortOrderSchema).optional(),
  elapsedTime: z.lazy(() => SortOrderSchema).optional(),
  startDateTime: z.lazy(() => SortOrderSchema).optional(),
  timezone: z.lazy(() => SortOrderSchema).optional(),
  source: z.lazy(() => SortOrderSchema).optional(),
  sourceId: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ActivitySumOrderByAggregateInputSchema: z.ZodType<Prisma.ActivitySumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  athleteId: z.lazy(() => SortOrderSchema).optional(),
  distance: z.lazy(() => SortOrderSchema).optional(),
  elevationGain: z.lazy(() => SortOrderSchema).optional(),
  elevationLoss: z.lazy(() => SortOrderSchema).optional(),
  averageSpeed: z.lazy(() => SortOrderSchema).optional(),
  maxSpeed: z.lazy(() => SortOrderSchema).optional(),
  startLatLng: z.lazy(() => SortOrderSchema).optional(),
  endLatLng: z.lazy(() => SortOrderSchema).optional(),
  elapsedTime: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumActivitySourceWithAggregatesFilterSchema: z.ZodType<Prisma.EnumActivitySourceWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ActivitySourceSchema).optional(),
  in: z.lazy(() => ActivitySourceSchema).array().optional(),
  notIn: z.lazy(() => ActivitySourceSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivitySourceSchema),z.lazy(() => NestedEnumActivitySourceWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumActivitySourceFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumActivitySourceFilterSchema).optional()
}).strict();

export const TrackEffortCreateNestedManyWithoutAthleteInputSchema: z.ZodType<Prisma.TrackEffortCreateNestedManyWithoutAthleteInput> = z.object({
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutAthleteInputSchema),z.lazy(() => TrackEffortCreateWithoutAthleteInputSchema).array(),z.lazy(() => TrackEffortUncheckedCreateWithoutAthleteInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutAthleteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackEffortCreateOrConnectWithoutAthleteInputSchema),z.lazy(() => TrackEffortCreateOrConnectWithoutAthleteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackEffortCreateManyAthleteInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ActivityCreateNestedManyWithoutAthleteInputSchema: z.ZodType<Prisma.ActivityCreateNestedManyWithoutAthleteInput> = z.object({
  create: z.union([ z.lazy(() => ActivityCreateWithoutAthleteInputSchema),z.lazy(() => ActivityCreateWithoutAthleteInputSchema).array(),z.lazy(() => ActivityUncheckedCreateWithoutAthleteInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutAthleteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityCreateOrConnectWithoutAthleteInputSchema),z.lazy(() => ActivityCreateOrConnectWithoutAthleteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityCreateManyAthleteInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AthleteTokenCreateNestedManyWithoutAthleteInputSchema: z.ZodType<Prisma.AthleteTokenCreateNestedManyWithoutAthleteInput> = z.object({
  create: z.union([ z.lazy(() => AthleteTokenCreateWithoutAthleteInputSchema),z.lazy(() => AthleteTokenCreateWithoutAthleteInputSchema).array(),z.lazy(() => AthleteTokenUncheckedCreateWithoutAthleteInputSchema),z.lazy(() => AthleteTokenUncheckedCreateWithoutAthleteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AthleteTokenCreateOrConnectWithoutAthleteInputSchema),z.lazy(() => AthleteTokenCreateOrConnectWithoutAthleteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AthleteTokenCreateManyAthleteInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AthleteTokenWhereUniqueInputSchema),z.lazy(() => AthleteTokenWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TrackEffortUncheckedCreateNestedManyWithoutAthleteInputSchema: z.ZodType<Prisma.TrackEffortUncheckedCreateNestedManyWithoutAthleteInput> = z.object({
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutAthleteInputSchema),z.lazy(() => TrackEffortCreateWithoutAthleteInputSchema).array(),z.lazy(() => TrackEffortUncheckedCreateWithoutAthleteInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutAthleteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackEffortCreateOrConnectWithoutAthleteInputSchema),z.lazy(() => TrackEffortCreateOrConnectWithoutAthleteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackEffortCreateManyAthleteInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ActivityUncheckedCreateNestedManyWithoutAthleteInputSchema: z.ZodType<Prisma.ActivityUncheckedCreateNestedManyWithoutAthleteInput> = z.object({
  create: z.union([ z.lazy(() => ActivityCreateWithoutAthleteInputSchema),z.lazy(() => ActivityCreateWithoutAthleteInputSchema).array(),z.lazy(() => ActivityUncheckedCreateWithoutAthleteInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutAthleteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityCreateOrConnectWithoutAthleteInputSchema),z.lazy(() => ActivityCreateOrConnectWithoutAthleteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityCreateManyAthleteInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AthleteTokenUncheckedCreateNestedManyWithoutAthleteInputSchema: z.ZodType<Prisma.AthleteTokenUncheckedCreateNestedManyWithoutAthleteInput> = z.object({
  create: z.union([ z.lazy(() => AthleteTokenCreateWithoutAthleteInputSchema),z.lazy(() => AthleteTokenCreateWithoutAthleteInputSchema).array(),z.lazy(() => AthleteTokenUncheckedCreateWithoutAthleteInputSchema),z.lazy(() => AthleteTokenUncheckedCreateWithoutAthleteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AthleteTokenCreateOrConnectWithoutAthleteInputSchema),z.lazy(() => AthleteTokenCreateOrConnectWithoutAthleteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AthleteTokenCreateManyAthleteInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AthleteTokenWhereUniqueInputSchema),z.lazy(() => AthleteTokenWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const TrackEffortUpdateManyWithoutAthleteNestedInputSchema: z.ZodType<Prisma.TrackEffortUpdateManyWithoutAthleteNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutAthleteInputSchema),z.lazy(() => TrackEffortCreateWithoutAthleteInputSchema).array(),z.lazy(() => TrackEffortUncheckedCreateWithoutAthleteInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutAthleteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackEffortCreateOrConnectWithoutAthleteInputSchema),z.lazy(() => TrackEffortCreateOrConnectWithoutAthleteInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TrackEffortUpsertWithWhereUniqueWithoutAthleteInputSchema),z.lazy(() => TrackEffortUpsertWithWhereUniqueWithoutAthleteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackEffortCreateManyAthleteInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TrackEffortUpdateWithWhereUniqueWithoutAthleteInputSchema),z.lazy(() => TrackEffortUpdateWithWhereUniqueWithoutAthleteInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TrackEffortUpdateManyWithWhereWithoutAthleteInputSchema),z.lazy(() => TrackEffortUpdateManyWithWhereWithoutAthleteInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TrackEffortScalarWhereInputSchema),z.lazy(() => TrackEffortScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ActivityUpdateManyWithoutAthleteNestedInputSchema: z.ZodType<Prisma.ActivityUpdateManyWithoutAthleteNestedInput> = z.object({
  create: z.union([ z.lazy(() => ActivityCreateWithoutAthleteInputSchema),z.lazy(() => ActivityCreateWithoutAthleteInputSchema).array(),z.lazy(() => ActivityUncheckedCreateWithoutAthleteInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutAthleteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityCreateOrConnectWithoutAthleteInputSchema),z.lazy(() => ActivityCreateOrConnectWithoutAthleteInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ActivityUpsertWithWhereUniqueWithoutAthleteInputSchema),z.lazy(() => ActivityUpsertWithWhereUniqueWithoutAthleteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityCreateManyAthleteInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ActivityUpdateWithWhereUniqueWithoutAthleteInputSchema),z.lazy(() => ActivityUpdateWithWhereUniqueWithoutAthleteInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ActivityUpdateManyWithWhereWithoutAthleteInputSchema),z.lazy(() => ActivityUpdateManyWithWhereWithoutAthleteInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ActivityScalarWhereInputSchema),z.lazy(() => ActivityScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AthleteTokenUpdateManyWithoutAthleteNestedInputSchema: z.ZodType<Prisma.AthleteTokenUpdateManyWithoutAthleteNestedInput> = z.object({
  create: z.union([ z.lazy(() => AthleteTokenCreateWithoutAthleteInputSchema),z.lazy(() => AthleteTokenCreateWithoutAthleteInputSchema).array(),z.lazy(() => AthleteTokenUncheckedCreateWithoutAthleteInputSchema),z.lazy(() => AthleteTokenUncheckedCreateWithoutAthleteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AthleteTokenCreateOrConnectWithoutAthleteInputSchema),z.lazy(() => AthleteTokenCreateOrConnectWithoutAthleteInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AthleteTokenUpsertWithWhereUniqueWithoutAthleteInputSchema),z.lazy(() => AthleteTokenUpsertWithWhereUniqueWithoutAthleteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AthleteTokenCreateManyAthleteInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AthleteTokenWhereUniqueInputSchema),z.lazy(() => AthleteTokenWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AthleteTokenWhereUniqueInputSchema),z.lazy(() => AthleteTokenWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AthleteTokenWhereUniqueInputSchema),z.lazy(() => AthleteTokenWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AthleteTokenWhereUniqueInputSchema),z.lazy(() => AthleteTokenWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AthleteTokenUpdateWithWhereUniqueWithoutAthleteInputSchema),z.lazy(() => AthleteTokenUpdateWithWhereUniqueWithoutAthleteInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AthleteTokenUpdateManyWithWhereWithoutAthleteInputSchema),z.lazy(() => AthleteTokenUpdateManyWithWhereWithoutAthleteInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AthleteTokenScalarWhereInputSchema),z.lazy(() => AthleteTokenScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const TrackEffortUncheckedUpdateManyWithoutAthleteNestedInputSchema: z.ZodType<Prisma.TrackEffortUncheckedUpdateManyWithoutAthleteNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutAthleteInputSchema),z.lazy(() => TrackEffortCreateWithoutAthleteInputSchema).array(),z.lazy(() => TrackEffortUncheckedCreateWithoutAthleteInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutAthleteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackEffortCreateOrConnectWithoutAthleteInputSchema),z.lazy(() => TrackEffortCreateOrConnectWithoutAthleteInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TrackEffortUpsertWithWhereUniqueWithoutAthleteInputSchema),z.lazy(() => TrackEffortUpsertWithWhereUniqueWithoutAthleteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackEffortCreateManyAthleteInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TrackEffortUpdateWithWhereUniqueWithoutAthleteInputSchema),z.lazy(() => TrackEffortUpdateWithWhereUniqueWithoutAthleteInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TrackEffortUpdateManyWithWhereWithoutAthleteInputSchema),z.lazy(() => TrackEffortUpdateManyWithWhereWithoutAthleteInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TrackEffortScalarWhereInputSchema),z.lazy(() => TrackEffortScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ActivityUncheckedUpdateManyWithoutAthleteNestedInputSchema: z.ZodType<Prisma.ActivityUncheckedUpdateManyWithoutAthleteNestedInput> = z.object({
  create: z.union([ z.lazy(() => ActivityCreateWithoutAthleteInputSchema),z.lazy(() => ActivityCreateWithoutAthleteInputSchema).array(),z.lazy(() => ActivityUncheckedCreateWithoutAthleteInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutAthleteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ActivityCreateOrConnectWithoutAthleteInputSchema),z.lazy(() => ActivityCreateOrConnectWithoutAthleteInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ActivityUpsertWithWhereUniqueWithoutAthleteInputSchema),z.lazy(() => ActivityUpsertWithWhereUniqueWithoutAthleteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ActivityCreateManyAthleteInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ActivityWhereUniqueInputSchema),z.lazy(() => ActivityWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ActivityUpdateWithWhereUniqueWithoutAthleteInputSchema),z.lazy(() => ActivityUpdateWithWhereUniqueWithoutAthleteInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ActivityUpdateManyWithWhereWithoutAthleteInputSchema),z.lazy(() => ActivityUpdateManyWithWhereWithoutAthleteInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ActivityScalarWhereInputSchema),z.lazy(() => ActivityScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AthleteTokenUncheckedUpdateManyWithoutAthleteNestedInputSchema: z.ZodType<Prisma.AthleteTokenUncheckedUpdateManyWithoutAthleteNestedInput> = z.object({
  create: z.union([ z.lazy(() => AthleteTokenCreateWithoutAthleteInputSchema),z.lazy(() => AthleteTokenCreateWithoutAthleteInputSchema).array(),z.lazy(() => AthleteTokenUncheckedCreateWithoutAthleteInputSchema),z.lazy(() => AthleteTokenUncheckedCreateWithoutAthleteInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AthleteTokenCreateOrConnectWithoutAthleteInputSchema),z.lazy(() => AthleteTokenCreateOrConnectWithoutAthleteInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AthleteTokenUpsertWithWhereUniqueWithoutAthleteInputSchema),z.lazy(() => AthleteTokenUpsertWithWhereUniqueWithoutAthleteInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AthleteTokenCreateManyAthleteInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AthleteTokenWhereUniqueInputSchema),z.lazy(() => AthleteTokenWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AthleteTokenWhereUniqueInputSchema),z.lazy(() => AthleteTokenWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AthleteTokenWhereUniqueInputSchema),z.lazy(() => AthleteTokenWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AthleteTokenWhereUniqueInputSchema),z.lazy(() => AthleteTokenWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AthleteTokenUpdateWithWhereUniqueWithoutAthleteInputSchema),z.lazy(() => AthleteTokenUpdateWithWhereUniqueWithoutAthleteInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AthleteTokenUpdateManyWithWhereWithoutAthleteInputSchema),z.lazy(() => AthleteTokenUpdateManyWithWhereWithoutAthleteInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AthleteTokenScalarWhereInputSchema),z.lazy(() => AthleteTokenScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AthleteCreateNestedOneWithoutTokensInputSchema: z.ZodType<Prisma.AthleteCreateNestedOneWithoutTokensInput> = z.object({
  create: z.union([ z.lazy(() => AthleteCreateWithoutTokensInputSchema),z.lazy(() => AthleteUncheckedCreateWithoutTokensInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AthleteCreateOrConnectWithoutTokensInputSchema).optional(),
  connect: z.lazy(() => AthleteWhereUniqueInputSchema).optional()
}).strict();

export const EnumTokenPoviderFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumTokenPoviderFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => TokenPoviderSchema).optional()
}).strict();

export const AthleteUpdateOneRequiredWithoutTokensNestedInputSchema: z.ZodType<Prisma.AthleteUpdateOneRequiredWithoutTokensNestedInput> = z.object({
  create: z.union([ z.lazy(() => AthleteCreateWithoutTokensInputSchema),z.lazy(() => AthleteUncheckedCreateWithoutTokensInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AthleteCreateOrConnectWithoutTokensInputSchema).optional(),
  upsert: z.lazy(() => AthleteUpsertWithoutTokensInputSchema).optional(),
  connect: z.lazy(() => AthleteWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AthleteUpdateToOneWithWhereWithoutTokensInputSchema),z.lazy(() => AthleteUpdateWithoutTokensInputSchema),z.lazy(() => AthleteUncheckedUpdateWithoutTokensInputSchema) ]).optional(),
}).strict();

export const TrackCreatestartLatLngInputSchema: z.ZodType<Prisma.TrackCreatestartLatLngInput> = z.object({
  set: z.number().array()
}).strict();

export const TrackCreateendLatLngInputSchema: z.ZodType<Prisma.TrackCreateendLatLngInput> = z.object({
  set: z.number().array()
}).strict();

export const TrackDetailsCreateNestedOneWithoutTrackInputSchema: z.ZodType<Prisma.TrackDetailsCreateNestedOneWithoutTrackInput> = z.object({
  create: z.union([ z.lazy(() => TrackDetailsCreateWithoutTrackInputSchema),z.lazy(() => TrackDetailsUncheckedCreateWithoutTrackInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TrackDetailsCreateOrConnectWithoutTrackInputSchema).optional(),
  connect: z.lazy(() => TrackDetailsWhereUniqueInputSchema).optional()
}).strict();

export const TrackEffortCreateNestedManyWithoutTrackInputSchema: z.ZodType<Prisma.TrackEffortCreateNestedManyWithoutTrackInput> = z.object({
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutTrackInputSchema),z.lazy(() => TrackEffortCreateWithoutTrackInputSchema).array(),z.lazy(() => TrackEffortUncheckedCreateWithoutTrackInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutTrackInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackEffortCreateOrConnectWithoutTrackInputSchema),z.lazy(() => TrackEffortCreateOrConnectWithoutTrackInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackEffortCreateManyTrackInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TrackDetailsUncheckedCreateNestedOneWithoutTrackInputSchema: z.ZodType<Prisma.TrackDetailsUncheckedCreateNestedOneWithoutTrackInput> = z.object({
  create: z.union([ z.lazy(() => TrackDetailsCreateWithoutTrackInputSchema),z.lazy(() => TrackDetailsUncheckedCreateWithoutTrackInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TrackDetailsCreateOrConnectWithoutTrackInputSchema).optional(),
  connect: z.lazy(() => TrackDetailsWhereUniqueInputSchema).optional()
}).strict();

export const TrackEffortUncheckedCreateNestedManyWithoutTrackInputSchema: z.ZodType<Prisma.TrackEffortUncheckedCreateNestedManyWithoutTrackInput> = z.object({
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutTrackInputSchema),z.lazy(() => TrackEffortCreateWithoutTrackInputSchema).array(),z.lazy(() => TrackEffortUncheckedCreateWithoutTrackInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutTrackInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackEffortCreateOrConnectWithoutTrackInputSchema),z.lazy(() => TrackEffortCreateOrConnectWithoutTrackInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackEffortCreateManyTrackInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumActivityTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumActivityTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ActivityTypeSchema).optional()
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const TrackUpdatestartLatLngInputSchema: z.ZodType<Prisma.TrackUpdatestartLatLngInput> = z.object({
  set: z.number().array().optional(),
  push: z.union([ z.number(),z.number().array() ]).optional(),
}).strict();

export const TrackUpdateendLatLngInputSchema: z.ZodType<Prisma.TrackUpdateendLatLngInput> = z.object({
  set: z.number().array().optional(),
  push: z.union([ z.number(),z.number().array() ]).optional(),
}).strict();

export const TrackDetailsUpdateOneWithoutTrackNestedInputSchema: z.ZodType<Prisma.TrackDetailsUpdateOneWithoutTrackNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackDetailsCreateWithoutTrackInputSchema),z.lazy(() => TrackDetailsUncheckedCreateWithoutTrackInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TrackDetailsCreateOrConnectWithoutTrackInputSchema).optional(),
  upsert: z.lazy(() => TrackDetailsUpsertWithoutTrackInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => TrackDetailsWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => TrackDetailsWhereInputSchema) ]).optional(),
  connect: z.lazy(() => TrackDetailsWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TrackDetailsUpdateToOneWithWhereWithoutTrackInputSchema),z.lazy(() => TrackDetailsUpdateWithoutTrackInputSchema),z.lazy(() => TrackDetailsUncheckedUpdateWithoutTrackInputSchema) ]).optional(),
}).strict();

export const TrackEffortUpdateManyWithoutTrackNestedInputSchema: z.ZodType<Prisma.TrackEffortUpdateManyWithoutTrackNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutTrackInputSchema),z.lazy(() => TrackEffortCreateWithoutTrackInputSchema).array(),z.lazy(() => TrackEffortUncheckedCreateWithoutTrackInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutTrackInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackEffortCreateOrConnectWithoutTrackInputSchema),z.lazy(() => TrackEffortCreateOrConnectWithoutTrackInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TrackEffortUpsertWithWhereUniqueWithoutTrackInputSchema),z.lazy(() => TrackEffortUpsertWithWhereUniqueWithoutTrackInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackEffortCreateManyTrackInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TrackEffortUpdateWithWhereUniqueWithoutTrackInputSchema),z.lazy(() => TrackEffortUpdateWithWhereUniqueWithoutTrackInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TrackEffortUpdateManyWithWhereWithoutTrackInputSchema),z.lazy(() => TrackEffortUpdateManyWithWhereWithoutTrackInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TrackEffortScalarWhereInputSchema),z.lazy(() => TrackEffortScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TrackDetailsUncheckedUpdateOneWithoutTrackNestedInputSchema: z.ZodType<Prisma.TrackDetailsUncheckedUpdateOneWithoutTrackNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackDetailsCreateWithoutTrackInputSchema),z.lazy(() => TrackDetailsUncheckedCreateWithoutTrackInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TrackDetailsCreateOrConnectWithoutTrackInputSchema).optional(),
  upsert: z.lazy(() => TrackDetailsUpsertWithoutTrackInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => TrackDetailsWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => TrackDetailsWhereInputSchema) ]).optional(),
  connect: z.lazy(() => TrackDetailsWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TrackDetailsUpdateToOneWithWhereWithoutTrackInputSchema),z.lazy(() => TrackDetailsUpdateWithoutTrackInputSchema),z.lazy(() => TrackDetailsUncheckedUpdateWithoutTrackInputSchema) ]).optional(),
}).strict();

export const TrackEffortUncheckedUpdateManyWithoutTrackNestedInputSchema: z.ZodType<Prisma.TrackEffortUncheckedUpdateManyWithoutTrackNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutTrackInputSchema),z.lazy(() => TrackEffortCreateWithoutTrackInputSchema).array(),z.lazy(() => TrackEffortUncheckedCreateWithoutTrackInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutTrackInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackEffortCreateOrConnectWithoutTrackInputSchema),z.lazy(() => TrackEffortCreateOrConnectWithoutTrackInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TrackEffortUpsertWithWhereUniqueWithoutTrackInputSchema),z.lazy(() => TrackEffortUpsertWithWhereUniqueWithoutTrackInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackEffortCreateManyTrackInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TrackEffortUpdateWithWhereUniqueWithoutTrackInputSchema),z.lazy(() => TrackEffortUpdateWithWhereUniqueWithoutTrackInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TrackEffortUpdateManyWithWhereWithoutTrackInputSchema),z.lazy(() => TrackEffortUpdateManyWithWhereWithoutTrackInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TrackEffortScalarWhereInputSchema),z.lazy(() => TrackEffortScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TrackCreateNestedOneWithoutTrackDetailsInputSchema: z.ZodType<Prisma.TrackCreateNestedOneWithoutTrackDetailsInput> = z.object({
  create: z.union([ z.lazy(() => TrackCreateWithoutTrackDetailsInputSchema),z.lazy(() => TrackUncheckedCreateWithoutTrackDetailsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TrackCreateOrConnectWithoutTrackDetailsInputSchema).optional(),
  connect: z.lazy(() => TrackWhereUniqueInputSchema).optional()
}).strict();

export const TrackUpdateOneRequiredWithoutTrackDetailsNestedInputSchema: z.ZodType<Prisma.TrackUpdateOneRequiredWithoutTrackDetailsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackCreateWithoutTrackDetailsInputSchema),z.lazy(() => TrackUncheckedCreateWithoutTrackDetailsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TrackCreateOrConnectWithoutTrackDetailsInputSchema).optional(),
  upsert: z.lazy(() => TrackUpsertWithoutTrackDetailsInputSchema).optional(),
  connect: z.lazy(() => TrackWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TrackUpdateToOneWithWhereWithoutTrackDetailsInputSchema),z.lazy(() => TrackUpdateWithoutTrackDetailsInputSchema),z.lazy(() => TrackUncheckedUpdateWithoutTrackDetailsInputSchema) ]).optional(),
}).strict();

export const TrackCreateNestedOneWithoutTrackEffortsInputSchema: z.ZodType<Prisma.TrackCreateNestedOneWithoutTrackEffortsInput> = z.object({
  create: z.union([ z.lazy(() => TrackCreateWithoutTrackEffortsInputSchema),z.lazy(() => TrackUncheckedCreateWithoutTrackEffortsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TrackCreateOrConnectWithoutTrackEffortsInputSchema).optional(),
  connect: z.lazy(() => TrackWhereUniqueInputSchema).optional()
}).strict();

export const AthleteCreateNestedOneWithoutTracksInputSchema: z.ZodType<Prisma.AthleteCreateNestedOneWithoutTracksInput> = z.object({
  create: z.union([ z.lazy(() => AthleteCreateWithoutTracksInputSchema),z.lazy(() => AthleteUncheckedCreateWithoutTracksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AthleteCreateOrConnectWithoutTracksInputSchema).optional(),
  connect: z.lazy(() => AthleteWhereUniqueInputSchema).optional()
}).strict();

export const ActivityCreateNestedOneWithoutTrackEffortsInputSchema: z.ZodType<Prisma.ActivityCreateNestedOneWithoutTrackEffortsInput> = z.object({
  create: z.union([ z.lazy(() => ActivityCreateWithoutTrackEffortsInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutTrackEffortsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ActivityCreateOrConnectWithoutTrackEffortsInputSchema).optional(),
  connect: z.lazy(() => ActivityWhereUniqueInputSchema).optional()
}).strict();

export const TrackUpdateOneRequiredWithoutTrackEffortsNestedInputSchema: z.ZodType<Prisma.TrackUpdateOneRequiredWithoutTrackEffortsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackCreateWithoutTrackEffortsInputSchema),z.lazy(() => TrackUncheckedCreateWithoutTrackEffortsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TrackCreateOrConnectWithoutTrackEffortsInputSchema).optional(),
  upsert: z.lazy(() => TrackUpsertWithoutTrackEffortsInputSchema).optional(),
  connect: z.lazy(() => TrackWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TrackUpdateToOneWithWhereWithoutTrackEffortsInputSchema),z.lazy(() => TrackUpdateWithoutTrackEffortsInputSchema),z.lazy(() => TrackUncheckedUpdateWithoutTrackEffortsInputSchema) ]).optional(),
}).strict();

export const AthleteUpdateOneRequiredWithoutTracksNestedInputSchema: z.ZodType<Prisma.AthleteUpdateOneRequiredWithoutTracksNestedInput> = z.object({
  create: z.union([ z.lazy(() => AthleteCreateWithoutTracksInputSchema),z.lazy(() => AthleteUncheckedCreateWithoutTracksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AthleteCreateOrConnectWithoutTracksInputSchema).optional(),
  upsert: z.lazy(() => AthleteUpsertWithoutTracksInputSchema).optional(),
  connect: z.lazy(() => AthleteWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AthleteUpdateToOneWithWhereWithoutTracksInputSchema),z.lazy(() => AthleteUpdateWithoutTracksInputSchema),z.lazy(() => AthleteUncheckedUpdateWithoutTracksInputSchema) ]).optional(),
}).strict();

export const ActivityUpdateOneRequiredWithoutTrackEffortsNestedInputSchema: z.ZodType<Prisma.ActivityUpdateOneRequiredWithoutTrackEffortsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ActivityCreateWithoutTrackEffortsInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutTrackEffortsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ActivityCreateOrConnectWithoutTrackEffortsInputSchema).optional(),
  upsert: z.lazy(() => ActivityUpsertWithoutTrackEffortsInputSchema).optional(),
  connect: z.lazy(() => ActivityWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ActivityUpdateToOneWithWhereWithoutTrackEffortsInputSchema),z.lazy(() => ActivityUpdateWithoutTrackEffortsInputSchema),z.lazy(() => ActivityUncheckedUpdateWithoutTrackEffortsInputSchema) ]).optional(),
}).strict();

export const ActivityCreatestartLatLngInputSchema: z.ZodType<Prisma.ActivityCreatestartLatLngInput> = z.object({
  set: z.number().array()
}).strict();

export const ActivityCreateendLatLngInputSchema: z.ZodType<Prisma.ActivityCreateendLatLngInput> = z.object({
  set: z.number().array()
}).strict();

export const AthleteCreateNestedOneWithoutActivitiesInputSchema: z.ZodType<Prisma.AthleteCreateNestedOneWithoutActivitiesInput> = z.object({
  create: z.union([ z.lazy(() => AthleteCreateWithoutActivitiesInputSchema),z.lazy(() => AthleteUncheckedCreateWithoutActivitiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AthleteCreateOrConnectWithoutActivitiesInputSchema).optional(),
  connect: z.lazy(() => AthleteWhereUniqueInputSchema).optional()
}).strict();

export const TrackEffortCreateNestedManyWithoutActivityInputSchema: z.ZodType<Prisma.TrackEffortCreateNestedManyWithoutActivityInput> = z.object({
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutActivityInputSchema),z.lazy(() => TrackEffortCreateWithoutActivityInputSchema).array(),z.lazy(() => TrackEffortUncheckedCreateWithoutActivityInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutActivityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackEffortCreateOrConnectWithoutActivityInputSchema),z.lazy(() => TrackEffortCreateOrConnectWithoutActivityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackEffortCreateManyActivityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TrackEffortUncheckedCreateNestedManyWithoutActivityInputSchema: z.ZodType<Prisma.TrackEffortUncheckedCreateNestedManyWithoutActivityInput> = z.object({
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutActivityInputSchema),z.lazy(() => TrackEffortCreateWithoutActivityInputSchema).array(),z.lazy(() => TrackEffortUncheckedCreateWithoutActivityInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutActivityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackEffortCreateOrConnectWithoutActivityInputSchema),z.lazy(() => TrackEffortCreateOrConnectWithoutActivityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackEffortCreateManyActivityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ActivityUpdatestartLatLngInputSchema: z.ZodType<Prisma.ActivityUpdatestartLatLngInput> = z.object({
  set: z.number().array().optional(),
  push: z.union([ z.number(),z.number().array() ]).optional(),
}).strict();

export const ActivityUpdateendLatLngInputSchema: z.ZodType<Prisma.ActivityUpdateendLatLngInput> = z.object({
  set: z.number().array().optional(),
  push: z.union([ z.number(),z.number().array() ]).optional(),
}).strict();

export const EnumActivitySourceFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumActivitySourceFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ActivitySourceSchema).optional()
}).strict();

export const AthleteUpdateOneRequiredWithoutActivitiesNestedInputSchema: z.ZodType<Prisma.AthleteUpdateOneRequiredWithoutActivitiesNestedInput> = z.object({
  create: z.union([ z.lazy(() => AthleteCreateWithoutActivitiesInputSchema),z.lazy(() => AthleteUncheckedCreateWithoutActivitiesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AthleteCreateOrConnectWithoutActivitiesInputSchema).optional(),
  upsert: z.lazy(() => AthleteUpsertWithoutActivitiesInputSchema).optional(),
  connect: z.lazy(() => AthleteWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AthleteUpdateToOneWithWhereWithoutActivitiesInputSchema),z.lazy(() => AthleteUpdateWithoutActivitiesInputSchema),z.lazy(() => AthleteUncheckedUpdateWithoutActivitiesInputSchema) ]).optional(),
}).strict();

export const TrackEffortUpdateManyWithoutActivityNestedInputSchema: z.ZodType<Prisma.TrackEffortUpdateManyWithoutActivityNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutActivityInputSchema),z.lazy(() => TrackEffortCreateWithoutActivityInputSchema).array(),z.lazy(() => TrackEffortUncheckedCreateWithoutActivityInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutActivityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackEffortCreateOrConnectWithoutActivityInputSchema),z.lazy(() => TrackEffortCreateOrConnectWithoutActivityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TrackEffortUpsertWithWhereUniqueWithoutActivityInputSchema),z.lazy(() => TrackEffortUpsertWithWhereUniqueWithoutActivityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackEffortCreateManyActivityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TrackEffortUpdateWithWhereUniqueWithoutActivityInputSchema),z.lazy(() => TrackEffortUpdateWithWhereUniqueWithoutActivityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TrackEffortUpdateManyWithWhereWithoutActivityInputSchema),z.lazy(() => TrackEffortUpdateManyWithWhereWithoutActivityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TrackEffortScalarWhereInputSchema),z.lazy(() => TrackEffortScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TrackEffortUncheckedUpdateManyWithoutActivityNestedInputSchema: z.ZodType<Prisma.TrackEffortUncheckedUpdateManyWithoutActivityNestedInput> = z.object({
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutActivityInputSchema),z.lazy(() => TrackEffortCreateWithoutActivityInputSchema).array(),z.lazy(() => TrackEffortUncheckedCreateWithoutActivityInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutActivityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TrackEffortCreateOrConnectWithoutActivityInputSchema),z.lazy(() => TrackEffortCreateOrConnectWithoutActivityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TrackEffortUpsertWithWhereUniqueWithoutActivityInputSchema),z.lazy(() => TrackEffortUpsertWithWhereUniqueWithoutActivityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TrackEffortCreateManyActivityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TrackEffortWhereUniqueInputSchema),z.lazy(() => TrackEffortWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TrackEffortUpdateWithWhereUniqueWithoutActivityInputSchema),z.lazy(() => TrackEffortUpdateWithWhereUniqueWithoutActivityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TrackEffortUpdateManyWithWhereWithoutActivityInputSchema),z.lazy(() => TrackEffortUpdateManyWithWhereWithoutActivityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TrackEffortScalarWhereInputSchema),z.lazy(() => TrackEffortScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedEnumTokenPoviderFilterSchema: z.ZodType<Prisma.NestedEnumTokenPoviderFilter> = z.object({
  equals: z.lazy(() => TokenPoviderSchema).optional(),
  in: z.lazy(() => TokenPoviderSchema).array().optional(),
  notIn: z.lazy(() => TokenPoviderSchema).array().optional(),
  not: z.union([ z.lazy(() => TokenPoviderSchema),z.lazy(() => NestedEnumTokenPoviderFilterSchema) ]).optional(),
}).strict();

export const NestedEnumTokenPoviderWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumTokenPoviderWithAggregatesFilter> = z.object({
  equals: z.lazy(() => TokenPoviderSchema).optional(),
  in: z.lazy(() => TokenPoviderSchema).array().optional(),
  notIn: z.lazy(() => TokenPoviderSchema).array().optional(),
  not: z.union([ z.lazy(() => TokenPoviderSchema),z.lazy(() => NestedEnumTokenPoviderWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumTokenPoviderFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumTokenPoviderFilterSchema).optional()
}).strict();

export const NestedEnumActivityTypeFilterSchema: z.ZodType<Prisma.NestedEnumActivityTypeFilter> = z.object({
  equals: z.lazy(() => ActivityTypeSchema).optional(),
  in: z.lazy(() => ActivityTypeSchema).array().optional(),
  notIn: z.lazy(() => ActivityTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => NestedEnumActivityTypeFilterSchema) ]).optional(),
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumActivityTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumActivityTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ActivityTypeSchema).optional(),
  in: z.lazy(() => ActivityTypeSchema).array().optional(),
  notIn: z.lazy(() => ActivityTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => NestedEnumActivityTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumActivityTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumActivityTypeFilterSchema).optional()
}).strict();

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedEnumActivitySourceFilterSchema: z.ZodType<Prisma.NestedEnumActivitySourceFilter> = z.object({
  equals: z.lazy(() => ActivitySourceSchema).optional(),
  in: z.lazy(() => ActivitySourceSchema).array().optional(),
  notIn: z.lazy(() => ActivitySourceSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivitySourceSchema),z.lazy(() => NestedEnumActivitySourceFilterSchema) ]).optional(),
}).strict();

export const NestedEnumActivitySourceWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumActivitySourceWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ActivitySourceSchema).optional(),
  in: z.lazy(() => ActivitySourceSchema).array().optional(),
  notIn: z.lazy(() => ActivitySourceSchema).array().optional(),
  not: z.union([ z.lazy(() => ActivitySourceSchema),z.lazy(() => NestedEnumActivitySourceWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumActivitySourceFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumActivitySourceFilterSchema).optional()
}).strict();

export const TrackEffortCreateWithoutAthleteInputSchema: z.ZodType<Prisma.TrackEffortCreateWithoutAthleteInput> = z.object({
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  time: z.number().int(),
  polyline: z.string(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  track: z.lazy(() => TrackCreateNestedOneWithoutTrackEffortsInputSchema),
  activity: z.lazy(() => ActivityCreateNestedOneWithoutTrackEffortsInputSchema)
}).strict();

export const TrackEffortUncheckedCreateWithoutAthleteInputSchema: z.ZodType<Prisma.TrackEffortUncheckedCreateWithoutAthleteInput> = z.object({
  id: z.number().int().optional(),
  trackId: z.number().int(),
  activityId: z.number().int(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  time: z.number().int(),
  polyline: z.string(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TrackEffortCreateOrConnectWithoutAthleteInputSchema: z.ZodType<Prisma.TrackEffortCreateOrConnectWithoutAthleteInput> = z.object({
  where: z.lazy(() => TrackEffortWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutAthleteInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutAthleteInputSchema) ]),
}).strict();

export const TrackEffortCreateManyAthleteInputEnvelopeSchema: z.ZodType<Prisma.TrackEffortCreateManyAthleteInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TrackEffortCreateManyAthleteInputSchema),z.lazy(() => TrackEffortCreateManyAthleteInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ActivityCreateWithoutAthleteInputSchema: z.ZodType<Prisma.ActivityCreateWithoutAthleteInput> = z.object({
  name: z.string(),
  type: z.lazy(() => ActivityTypeSchema),
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number().optional().nullable(),
  averageSpeed: z.number().optional().nullable(),
  maxSpeed: z.number().optional().nullable(),
  startLatLng: z.union([ z.lazy(() => ActivityCreatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => ActivityCreateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.string(),
  elapsedTime: z.number().int(),
  startDateTime: z.coerce.date(),
  timezone: z.string(),
  source: z.lazy(() => ActivitySourceSchema).optional(),
  sourceId: z.string().optional().nullable(),
  city: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  trackEfforts: z.lazy(() => TrackEffortCreateNestedManyWithoutActivityInputSchema).optional()
}).strict();

export const ActivityUncheckedCreateWithoutAthleteInputSchema: z.ZodType<Prisma.ActivityUncheckedCreateWithoutAthleteInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  type: z.lazy(() => ActivityTypeSchema),
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number().optional().nullable(),
  averageSpeed: z.number().optional().nullable(),
  maxSpeed: z.number().optional().nullable(),
  startLatLng: z.union([ z.lazy(() => ActivityCreatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => ActivityCreateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.string(),
  elapsedTime: z.number().int(),
  startDateTime: z.coerce.date(),
  timezone: z.string(),
  source: z.lazy(() => ActivitySourceSchema).optional(),
  sourceId: z.string().optional().nullable(),
  city: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  trackEfforts: z.lazy(() => TrackEffortUncheckedCreateNestedManyWithoutActivityInputSchema).optional()
}).strict();

export const ActivityCreateOrConnectWithoutAthleteInputSchema: z.ZodType<Prisma.ActivityCreateOrConnectWithoutAthleteInput> = z.object({
  where: z.lazy(() => ActivityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ActivityCreateWithoutAthleteInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutAthleteInputSchema) ]),
}).strict();

export const ActivityCreateManyAthleteInputEnvelopeSchema: z.ZodType<Prisma.ActivityCreateManyAthleteInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ActivityCreateManyAthleteInputSchema),z.lazy(() => ActivityCreateManyAthleteInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AthleteTokenCreateWithoutAthleteInputSchema: z.ZodType<Prisma.AthleteTokenCreateWithoutAthleteInput> = z.object({
  provider: z.lazy(() => TokenPoviderSchema),
  accessToken: z.string(),
  refreshToken: z.string().optional().nullable(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AthleteTokenUncheckedCreateWithoutAthleteInputSchema: z.ZodType<Prisma.AthleteTokenUncheckedCreateWithoutAthleteInput> = z.object({
  id: z.number().int().optional(),
  provider: z.lazy(() => TokenPoviderSchema),
  accessToken: z.string(),
  refreshToken: z.string().optional().nullable(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AthleteTokenCreateOrConnectWithoutAthleteInputSchema: z.ZodType<Prisma.AthleteTokenCreateOrConnectWithoutAthleteInput> = z.object({
  where: z.lazy(() => AthleteTokenWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AthleteTokenCreateWithoutAthleteInputSchema),z.lazy(() => AthleteTokenUncheckedCreateWithoutAthleteInputSchema) ]),
}).strict();

export const AthleteTokenCreateManyAthleteInputEnvelopeSchema: z.ZodType<Prisma.AthleteTokenCreateManyAthleteInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AthleteTokenCreateManyAthleteInputSchema),z.lazy(() => AthleteTokenCreateManyAthleteInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TrackEffortUpsertWithWhereUniqueWithoutAthleteInputSchema: z.ZodType<Prisma.TrackEffortUpsertWithWhereUniqueWithoutAthleteInput> = z.object({
  where: z.lazy(() => TrackEffortWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TrackEffortUpdateWithoutAthleteInputSchema),z.lazy(() => TrackEffortUncheckedUpdateWithoutAthleteInputSchema) ]),
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutAthleteInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutAthleteInputSchema) ]),
}).strict();

export const TrackEffortUpdateWithWhereUniqueWithoutAthleteInputSchema: z.ZodType<Prisma.TrackEffortUpdateWithWhereUniqueWithoutAthleteInput> = z.object({
  where: z.lazy(() => TrackEffortWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TrackEffortUpdateWithoutAthleteInputSchema),z.lazy(() => TrackEffortUncheckedUpdateWithoutAthleteInputSchema) ]),
}).strict();

export const TrackEffortUpdateManyWithWhereWithoutAthleteInputSchema: z.ZodType<Prisma.TrackEffortUpdateManyWithWhereWithoutAthleteInput> = z.object({
  where: z.lazy(() => TrackEffortScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TrackEffortUpdateManyMutationInputSchema),z.lazy(() => TrackEffortUncheckedUpdateManyWithoutAthleteInputSchema) ]),
}).strict();

export const TrackEffortScalarWhereInputSchema: z.ZodType<Prisma.TrackEffortScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TrackEffortScalarWhereInputSchema),z.lazy(() => TrackEffortScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TrackEffortScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TrackEffortScalarWhereInputSchema),z.lazy(() => TrackEffortScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  trackId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  athleteId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  activityId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  startTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  time: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  polyline: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  streams: z.lazy(() => JsonFilterSchema).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ActivityUpsertWithWhereUniqueWithoutAthleteInputSchema: z.ZodType<Prisma.ActivityUpsertWithWhereUniqueWithoutAthleteInput> = z.object({
  where: z.lazy(() => ActivityWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ActivityUpdateWithoutAthleteInputSchema),z.lazy(() => ActivityUncheckedUpdateWithoutAthleteInputSchema) ]),
  create: z.union([ z.lazy(() => ActivityCreateWithoutAthleteInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutAthleteInputSchema) ]),
}).strict();

export const ActivityUpdateWithWhereUniqueWithoutAthleteInputSchema: z.ZodType<Prisma.ActivityUpdateWithWhereUniqueWithoutAthleteInput> = z.object({
  where: z.lazy(() => ActivityWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ActivityUpdateWithoutAthleteInputSchema),z.lazy(() => ActivityUncheckedUpdateWithoutAthleteInputSchema) ]),
}).strict();

export const ActivityUpdateManyWithWhereWithoutAthleteInputSchema: z.ZodType<Prisma.ActivityUpdateManyWithWhereWithoutAthleteInput> = z.object({
  where: z.lazy(() => ActivityScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ActivityUpdateManyMutationInputSchema),z.lazy(() => ActivityUncheckedUpdateManyWithoutAthleteInputSchema) ]),
}).strict();

export const ActivityScalarWhereInputSchema: z.ZodType<Prisma.ActivityScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ActivityScalarWhereInputSchema),z.lazy(() => ActivityScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ActivityScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ActivityScalarWhereInputSchema),z.lazy(() => ActivityScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  athleteId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => EnumActivityTypeFilterSchema),z.lazy(() => ActivityTypeSchema) ]).optional(),
  distance: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  elevationGain: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  elevationLoss: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  averageSpeed: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  maxSpeed: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  startLatLng: z.lazy(() => FloatNullableListFilterSchema).optional(),
  endLatLng: z.lazy(() => FloatNullableListFilterSchema).optional(),
  polyline: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  elapsedTime: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  startDateTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  timezone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  source: z.union([ z.lazy(() => EnumActivitySourceFilterSchema),z.lazy(() => ActivitySourceSchema) ]).optional(),
  sourceId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  city: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AthleteTokenUpsertWithWhereUniqueWithoutAthleteInputSchema: z.ZodType<Prisma.AthleteTokenUpsertWithWhereUniqueWithoutAthleteInput> = z.object({
  where: z.lazy(() => AthleteTokenWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AthleteTokenUpdateWithoutAthleteInputSchema),z.lazy(() => AthleteTokenUncheckedUpdateWithoutAthleteInputSchema) ]),
  create: z.union([ z.lazy(() => AthleteTokenCreateWithoutAthleteInputSchema),z.lazy(() => AthleteTokenUncheckedCreateWithoutAthleteInputSchema) ]),
}).strict();

export const AthleteTokenUpdateWithWhereUniqueWithoutAthleteInputSchema: z.ZodType<Prisma.AthleteTokenUpdateWithWhereUniqueWithoutAthleteInput> = z.object({
  where: z.lazy(() => AthleteTokenWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AthleteTokenUpdateWithoutAthleteInputSchema),z.lazy(() => AthleteTokenUncheckedUpdateWithoutAthleteInputSchema) ]),
}).strict();

export const AthleteTokenUpdateManyWithWhereWithoutAthleteInputSchema: z.ZodType<Prisma.AthleteTokenUpdateManyWithWhereWithoutAthleteInput> = z.object({
  where: z.lazy(() => AthleteTokenScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AthleteTokenUpdateManyMutationInputSchema),z.lazy(() => AthleteTokenUncheckedUpdateManyWithoutAthleteInputSchema) ]),
}).strict();

export const AthleteTokenScalarWhereInputSchema: z.ZodType<Prisma.AthleteTokenScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AthleteTokenScalarWhereInputSchema),z.lazy(() => AthleteTokenScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AthleteTokenScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AthleteTokenScalarWhereInputSchema),z.lazy(() => AthleteTokenScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  athleteId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  provider: z.union([ z.lazy(() => EnumTokenPoviderFilterSchema),z.lazy(() => TokenPoviderSchema) ]).optional(),
  accessToken: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  refreshToken: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AthleteCreateWithoutTokensInputSchema: z.ZodType<Prisma.AthleteCreateWithoutTokensInput> = z.object({
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tracks: z.lazy(() => TrackEffortCreateNestedManyWithoutAthleteInputSchema).optional(),
  activities: z.lazy(() => ActivityCreateNestedManyWithoutAthleteInputSchema).optional()
}).strict();

export const AthleteUncheckedCreateWithoutTokensInputSchema: z.ZodType<Prisma.AthleteUncheckedCreateWithoutTokensInput> = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tracks: z.lazy(() => TrackEffortUncheckedCreateNestedManyWithoutAthleteInputSchema).optional(),
  activities: z.lazy(() => ActivityUncheckedCreateNestedManyWithoutAthleteInputSchema).optional()
}).strict();

export const AthleteCreateOrConnectWithoutTokensInputSchema: z.ZodType<Prisma.AthleteCreateOrConnectWithoutTokensInput> = z.object({
  where: z.lazy(() => AthleteWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AthleteCreateWithoutTokensInputSchema),z.lazy(() => AthleteUncheckedCreateWithoutTokensInputSchema) ]),
}).strict();

export const AthleteUpsertWithoutTokensInputSchema: z.ZodType<Prisma.AthleteUpsertWithoutTokensInput> = z.object({
  update: z.union([ z.lazy(() => AthleteUpdateWithoutTokensInputSchema),z.lazy(() => AthleteUncheckedUpdateWithoutTokensInputSchema) ]),
  create: z.union([ z.lazy(() => AthleteCreateWithoutTokensInputSchema),z.lazy(() => AthleteUncheckedCreateWithoutTokensInputSchema) ]),
  where: z.lazy(() => AthleteWhereInputSchema).optional()
}).strict();

export const AthleteUpdateToOneWithWhereWithoutTokensInputSchema: z.ZodType<Prisma.AthleteUpdateToOneWithWhereWithoutTokensInput> = z.object({
  where: z.lazy(() => AthleteWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AthleteUpdateWithoutTokensInputSchema),z.lazy(() => AthleteUncheckedUpdateWithoutTokensInputSchema) ]),
}).strict();

export const AthleteUpdateWithoutTokensInputSchema: z.ZodType<Prisma.AthleteUpdateWithoutTokensInput> = z.object({
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tracks: z.lazy(() => TrackEffortUpdateManyWithoutAthleteNestedInputSchema).optional(),
  activities: z.lazy(() => ActivityUpdateManyWithoutAthleteNestedInputSchema).optional()
}).strict();

export const AthleteUncheckedUpdateWithoutTokensInputSchema: z.ZodType<Prisma.AthleteUncheckedUpdateWithoutTokensInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tracks: z.lazy(() => TrackEffortUncheckedUpdateManyWithoutAthleteNestedInputSchema).optional(),
  activities: z.lazy(() => ActivityUncheckedUpdateManyWithoutAthleteNestedInputSchema).optional()
}).strict();

export const TrackDetailsCreateWithoutTrackInputSchema: z.ZodType<Prisma.TrackDetailsCreateWithoutTrackInput> = z.object({
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TrackDetailsUncheckedCreateWithoutTrackInputSchema: z.ZodType<Prisma.TrackDetailsUncheckedCreateWithoutTrackInput> = z.object({
  id: z.number().int().optional(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TrackDetailsCreateOrConnectWithoutTrackInputSchema: z.ZodType<Prisma.TrackDetailsCreateOrConnectWithoutTrackInput> = z.object({
  where: z.lazy(() => TrackDetailsWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TrackDetailsCreateWithoutTrackInputSchema),z.lazy(() => TrackDetailsUncheckedCreateWithoutTrackInputSchema) ]),
}).strict();

export const TrackEffortCreateWithoutTrackInputSchema: z.ZodType<Prisma.TrackEffortCreateWithoutTrackInput> = z.object({
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  time: z.number().int(),
  polyline: z.string(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  athlete: z.lazy(() => AthleteCreateNestedOneWithoutTracksInputSchema),
  activity: z.lazy(() => ActivityCreateNestedOneWithoutTrackEffortsInputSchema)
}).strict();

export const TrackEffortUncheckedCreateWithoutTrackInputSchema: z.ZodType<Prisma.TrackEffortUncheckedCreateWithoutTrackInput> = z.object({
  id: z.number().int().optional(),
  athleteId: z.number().int(),
  activityId: z.number().int(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  time: z.number().int(),
  polyline: z.string(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TrackEffortCreateOrConnectWithoutTrackInputSchema: z.ZodType<Prisma.TrackEffortCreateOrConnectWithoutTrackInput> = z.object({
  where: z.lazy(() => TrackEffortWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutTrackInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutTrackInputSchema) ]),
}).strict();

export const TrackEffortCreateManyTrackInputEnvelopeSchema: z.ZodType<Prisma.TrackEffortCreateManyTrackInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TrackEffortCreateManyTrackInputSchema),z.lazy(() => TrackEffortCreateManyTrackInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TrackDetailsUpsertWithoutTrackInputSchema: z.ZodType<Prisma.TrackDetailsUpsertWithoutTrackInput> = z.object({
  update: z.union([ z.lazy(() => TrackDetailsUpdateWithoutTrackInputSchema),z.lazy(() => TrackDetailsUncheckedUpdateWithoutTrackInputSchema) ]),
  create: z.union([ z.lazy(() => TrackDetailsCreateWithoutTrackInputSchema),z.lazy(() => TrackDetailsUncheckedCreateWithoutTrackInputSchema) ]),
  where: z.lazy(() => TrackDetailsWhereInputSchema).optional()
}).strict();

export const TrackDetailsUpdateToOneWithWhereWithoutTrackInputSchema: z.ZodType<Prisma.TrackDetailsUpdateToOneWithWhereWithoutTrackInput> = z.object({
  where: z.lazy(() => TrackDetailsWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TrackDetailsUpdateWithoutTrackInputSchema),z.lazy(() => TrackDetailsUncheckedUpdateWithoutTrackInputSchema) ]),
}).strict();

export const TrackDetailsUpdateWithoutTrackInputSchema: z.ZodType<Prisma.TrackDetailsUpdateWithoutTrackInput> = z.object({
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackDetailsUncheckedUpdateWithoutTrackInputSchema: z.ZodType<Prisma.TrackDetailsUncheckedUpdateWithoutTrackInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackEffortUpsertWithWhereUniqueWithoutTrackInputSchema: z.ZodType<Prisma.TrackEffortUpsertWithWhereUniqueWithoutTrackInput> = z.object({
  where: z.lazy(() => TrackEffortWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TrackEffortUpdateWithoutTrackInputSchema),z.lazy(() => TrackEffortUncheckedUpdateWithoutTrackInputSchema) ]),
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutTrackInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutTrackInputSchema) ]),
}).strict();

export const TrackEffortUpdateWithWhereUniqueWithoutTrackInputSchema: z.ZodType<Prisma.TrackEffortUpdateWithWhereUniqueWithoutTrackInput> = z.object({
  where: z.lazy(() => TrackEffortWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TrackEffortUpdateWithoutTrackInputSchema),z.lazy(() => TrackEffortUncheckedUpdateWithoutTrackInputSchema) ]),
}).strict();

export const TrackEffortUpdateManyWithWhereWithoutTrackInputSchema: z.ZodType<Prisma.TrackEffortUpdateManyWithWhereWithoutTrackInput> = z.object({
  where: z.lazy(() => TrackEffortScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TrackEffortUpdateManyMutationInputSchema),z.lazy(() => TrackEffortUncheckedUpdateManyWithoutTrackInputSchema) ]),
}).strict();

export const TrackCreateWithoutTrackDetailsInputSchema: z.ZodType<Prisma.TrackCreateWithoutTrackDetailsInput> = z.object({
  name: z.string(),
  activityType: z.lazy(() => ActivityTypeSchema).optional(),
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number().optional().nullable(),
  startLatLng: z.union([ z.lazy(() => TrackCreatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => TrackCreateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.string().optional().nullable(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  trackEfforts: z.lazy(() => TrackEffortCreateNestedManyWithoutTrackInputSchema).optional()
}).strict();

export const TrackUncheckedCreateWithoutTrackDetailsInputSchema: z.ZodType<Prisma.TrackUncheckedCreateWithoutTrackDetailsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  activityType: z.lazy(() => ActivityTypeSchema).optional(),
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number().optional().nullable(),
  startLatLng: z.union([ z.lazy(() => TrackCreatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => TrackCreateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.string().optional().nullable(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  trackEfforts: z.lazy(() => TrackEffortUncheckedCreateNestedManyWithoutTrackInputSchema).optional()
}).strict();

export const TrackCreateOrConnectWithoutTrackDetailsInputSchema: z.ZodType<Prisma.TrackCreateOrConnectWithoutTrackDetailsInput> = z.object({
  where: z.lazy(() => TrackWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TrackCreateWithoutTrackDetailsInputSchema),z.lazy(() => TrackUncheckedCreateWithoutTrackDetailsInputSchema) ]),
}).strict();

export const TrackUpsertWithoutTrackDetailsInputSchema: z.ZodType<Prisma.TrackUpsertWithoutTrackDetailsInput> = z.object({
  update: z.union([ z.lazy(() => TrackUpdateWithoutTrackDetailsInputSchema),z.lazy(() => TrackUncheckedUpdateWithoutTrackDetailsInputSchema) ]),
  create: z.union([ z.lazy(() => TrackCreateWithoutTrackDetailsInputSchema),z.lazy(() => TrackUncheckedCreateWithoutTrackDetailsInputSchema) ]),
  where: z.lazy(() => TrackWhereInputSchema).optional()
}).strict();

export const TrackUpdateToOneWithWhereWithoutTrackDetailsInputSchema: z.ZodType<Prisma.TrackUpdateToOneWithWhereWithoutTrackDetailsInput> = z.object({
  where: z.lazy(() => TrackWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TrackUpdateWithoutTrackDetailsInputSchema),z.lazy(() => TrackUncheckedUpdateWithoutTrackDetailsInputSchema) ]),
}).strict();

export const TrackUpdateWithoutTrackDetailsInputSchema: z.ZodType<Prisma.TrackUpdateWithoutTrackDetailsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activityType: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationGain: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationLoss: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLatLng: z.union([ z.lazy(() => TrackUpdatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => TrackUpdateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  trackEfforts: z.lazy(() => TrackEffortUpdateManyWithoutTrackNestedInputSchema).optional()
}).strict();

export const TrackUncheckedUpdateWithoutTrackDetailsInputSchema: z.ZodType<Prisma.TrackUncheckedUpdateWithoutTrackDetailsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activityType: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationGain: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationLoss: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLatLng: z.union([ z.lazy(() => TrackUpdatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => TrackUpdateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  trackEfforts: z.lazy(() => TrackEffortUncheckedUpdateManyWithoutTrackNestedInputSchema).optional()
}).strict();

export const TrackCreateWithoutTrackEffortsInputSchema: z.ZodType<Prisma.TrackCreateWithoutTrackEffortsInput> = z.object({
  name: z.string(),
  activityType: z.lazy(() => ActivityTypeSchema).optional(),
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number().optional().nullable(),
  startLatLng: z.union([ z.lazy(() => TrackCreatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => TrackCreateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.string().optional().nullable(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  trackDetails: z.lazy(() => TrackDetailsCreateNestedOneWithoutTrackInputSchema).optional()
}).strict();

export const TrackUncheckedCreateWithoutTrackEffortsInputSchema: z.ZodType<Prisma.TrackUncheckedCreateWithoutTrackEffortsInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  activityType: z.lazy(() => ActivityTypeSchema).optional(),
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number().optional().nullable(),
  startLatLng: z.union([ z.lazy(() => TrackCreatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => TrackCreateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.string().optional().nullable(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  trackDetails: z.lazy(() => TrackDetailsUncheckedCreateNestedOneWithoutTrackInputSchema).optional()
}).strict();

export const TrackCreateOrConnectWithoutTrackEffortsInputSchema: z.ZodType<Prisma.TrackCreateOrConnectWithoutTrackEffortsInput> = z.object({
  where: z.lazy(() => TrackWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TrackCreateWithoutTrackEffortsInputSchema),z.lazy(() => TrackUncheckedCreateWithoutTrackEffortsInputSchema) ]),
}).strict();

export const AthleteCreateWithoutTracksInputSchema: z.ZodType<Prisma.AthleteCreateWithoutTracksInput> = z.object({
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  activities: z.lazy(() => ActivityCreateNestedManyWithoutAthleteInputSchema).optional(),
  tokens: z.lazy(() => AthleteTokenCreateNestedManyWithoutAthleteInputSchema).optional()
}).strict();

export const AthleteUncheckedCreateWithoutTracksInputSchema: z.ZodType<Prisma.AthleteUncheckedCreateWithoutTracksInput> = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  activities: z.lazy(() => ActivityUncheckedCreateNestedManyWithoutAthleteInputSchema).optional(),
  tokens: z.lazy(() => AthleteTokenUncheckedCreateNestedManyWithoutAthleteInputSchema).optional()
}).strict();

export const AthleteCreateOrConnectWithoutTracksInputSchema: z.ZodType<Prisma.AthleteCreateOrConnectWithoutTracksInput> = z.object({
  where: z.lazy(() => AthleteWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AthleteCreateWithoutTracksInputSchema),z.lazy(() => AthleteUncheckedCreateWithoutTracksInputSchema) ]),
}).strict();

export const ActivityCreateWithoutTrackEffortsInputSchema: z.ZodType<Prisma.ActivityCreateWithoutTrackEffortsInput> = z.object({
  name: z.string(),
  type: z.lazy(() => ActivityTypeSchema),
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number().optional().nullable(),
  averageSpeed: z.number().optional().nullable(),
  maxSpeed: z.number().optional().nullable(),
  startLatLng: z.union([ z.lazy(() => ActivityCreatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => ActivityCreateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.string(),
  elapsedTime: z.number().int(),
  startDateTime: z.coerce.date(),
  timezone: z.string(),
  source: z.lazy(() => ActivitySourceSchema).optional(),
  sourceId: z.string().optional().nullable(),
  city: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  athlete: z.lazy(() => AthleteCreateNestedOneWithoutActivitiesInputSchema)
}).strict();

export const ActivityUncheckedCreateWithoutTrackEffortsInputSchema: z.ZodType<Prisma.ActivityUncheckedCreateWithoutTrackEffortsInput> = z.object({
  id: z.number().int().optional(),
  athleteId: z.number().int(),
  name: z.string(),
  type: z.lazy(() => ActivityTypeSchema),
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number().optional().nullable(),
  averageSpeed: z.number().optional().nullable(),
  maxSpeed: z.number().optional().nullable(),
  startLatLng: z.union([ z.lazy(() => ActivityCreatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => ActivityCreateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.string(),
  elapsedTime: z.number().int(),
  startDateTime: z.coerce.date(),
  timezone: z.string(),
  source: z.lazy(() => ActivitySourceSchema).optional(),
  sourceId: z.string().optional().nullable(),
  city: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ActivityCreateOrConnectWithoutTrackEffortsInputSchema: z.ZodType<Prisma.ActivityCreateOrConnectWithoutTrackEffortsInput> = z.object({
  where: z.lazy(() => ActivityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ActivityCreateWithoutTrackEffortsInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutTrackEffortsInputSchema) ]),
}).strict();

export const TrackUpsertWithoutTrackEffortsInputSchema: z.ZodType<Prisma.TrackUpsertWithoutTrackEffortsInput> = z.object({
  update: z.union([ z.lazy(() => TrackUpdateWithoutTrackEffortsInputSchema),z.lazy(() => TrackUncheckedUpdateWithoutTrackEffortsInputSchema) ]),
  create: z.union([ z.lazy(() => TrackCreateWithoutTrackEffortsInputSchema),z.lazy(() => TrackUncheckedCreateWithoutTrackEffortsInputSchema) ]),
  where: z.lazy(() => TrackWhereInputSchema).optional()
}).strict();

export const TrackUpdateToOneWithWhereWithoutTrackEffortsInputSchema: z.ZodType<Prisma.TrackUpdateToOneWithWhereWithoutTrackEffortsInput> = z.object({
  where: z.lazy(() => TrackWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TrackUpdateWithoutTrackEffortsInputSchema),z.lazy(() => TrackUncheckedUpdateWithoutTrackEffortsInputSchema) ]),
}).strict();

export const TrackUpdateWithoutTrackEffortsInputSchema: z.ZodType<Prisma.TrackUpdateWithoutTrackEffortsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activityType: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationGain: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationLoss: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLatLng: z.union([ z.lazy(() => TrackUpdatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => TrackUpdateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  trackDetails: z.lazy(() => TrackDetailsUpdateOneWithoutTrackNestedInputSchema).optional()
}).strict();

export const TrackUncheckedUpdateWithoutTrackEffortsInputSchema: z.ZodType<Prisma.TrackUncheckedUpdateWithoutTrackEffortsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  activityType: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationGain: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationLoss: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLatLng: z.union([ z.lazy(() => TrackUpdatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => TrackUpdateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  trackDetails: z.lazy(() => TrackDetailsUncheckedUpdateOneWithoutTrackNestedInputSchema).optional()
}).strict();

export const AthleteUpsertWithoutTracksInputSchema: z.ZodType<Prisma.AthleteUpsertWithoutTracksInput> = z.object({
  update: z.union([ z.lazy(() => AthleteUpdateWithoutTracksInputSchema),z.lazy(() => AthleteUncheckedUpdateWithoutTracksInputSchema) ]),
  create: z.union([ z.lazy(() => AthleteCreateWithoutTracksInputSchema),z.lazy(() => AthleteUncheckedCreateWithoutTracksInputSchema) ]),
  where: z.lazy(() => AthleteWhereInputSchema).optional()
}).strict();

export const AthleteUpdateToOneWithWhereWithoutTracksInputSchema: z.ZodType<Prisma.AthleteUpdateToOneWithWhereWithoutTracksInput> = z.object({
  where: z.lazy(() => AthleteWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AthleteUpdateWithoutTracksInputSchema),z.lazy(() => AthleteUncheckedUpdateWithoutTracksInputSchema) ]),
}).strict();

export const AthleteUpdateWithoutTracksInputSchema: z.ZodType<Prisma.AthleteUpdateWithoutTracksInput> = z.object({
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activities: z.lazy(() => ActivityUpdateManyWithoutAthleteNestedInputSchema).optional(),
  tokens: z.lazy(() => AthleteTokenUpdateManyWithoutAthleteNestedInputSchema).optional()
}).strict();

export const AthleteUncheckedUpdateWithoutTracksInputSchema: z.ZodType<Prisma.AthleteUncheckedUpdateWithoutTracksInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  activities: z.lazy(() => ActivityUncheckedUpdateManyWithoutAthleteNestedInputSchema).optional(),
  tokens: z.lazy(() => AthleteTokenUncheckedUpdateManyWithoutAthleteNestedInputSchema).optional()
}).strict();

export const ActivityUpsertWithoutTrackEffortsInputSchema: z.ZodType<Prisma.ActivityUpsertWithoutTrackEffortsInput> = z.object({
  update: z.union([ z.lazy(() => ActivityUpdateWithoutTrackEffortsInputSchema),z.lazy(() => ActivityUncheckedUpdateWithoutTrackEffortsInputSchema) ]),
  create: z.union([ z.lazy(() => ActivityCreateWithoutTrackEffortsInputSchema),z.lazy(() => ActivityUncheckedCreateWithoutTrackEffortsInputSchema) ]),
  where: z.lazy(() => ActivityWhereInputSchema).optional()
}).strict();

export const ActivityUpdateToOneWithWhereWithoutTrackEffortsInputSchema: z.ZodType<Prisma.ActivityUpdateToOneWithWhereWithoutTrackEffortsInput> = z.object({
  where: z.lazy(() => ActivityWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ActivityUpdateWithoutTrackEffortsInputSchema),z.lazy(() => ActivityUncheckedUpdateWithoutTrackEffortsInputSchema) ]),
}).strict();

export const ActivityUpdateWithoutTrackEffortsInputSchema: z.ZodType<Prisma.ActivityUpdateWithoutTrackEffortsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationGain: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationLoss: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averageSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLatLng: z.union([ z.lazy(() => ActivityUpdatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => ActivityUpdateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  elapsedTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => ActivitySourceSchema),z.lazy(() => EnumActivitySourceFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  athlete: z.lazy(() => AthleteUpdateOneRequiredWithoutActivitiesNestedInputSchema).optional()
}).strict();

export const ActivityUncheckedUpdateWithoutTrackEffortsInputSchema: z.ZodType<Prisma.ActivityUncheckedUpdateWithoutTrackEffortsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  athleteId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationGain: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationLoss: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averageSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLatLng: z.union([ z.lazy(() => ActivityUpdatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => ActivityUpdateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  elapsedTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => ActivitySourceSchema),z.lazy(() => EnumActivitySourceFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AthleteCreateWithoutActivitiesInputSchema: z.ZodType<Prisma.AthleteCreateWithoutActivitiesInput> = z.object({
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tracks: z.lazy(() => TrackEffortCreateNestedManyWithoutAthleteInputSchema).optional(),
  tokens: z.lazy(() => AthleteTokenCreateNestedManyWithoutAthleteInputSchema).optional()
}).strict();

export const AthleteUncheckedCreateWithoutActivitiesInputSchema: z.ZodType<Prisma.AthleteUncheckedCreateWithoutActivitiesInput> = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  tracks: z.lazy(() => TrackEffortUncheckedCreateNestedManyWithoutAthleteInputSchema).optional(),
  tokens: z.lazy(() => AthleteTokenUncheckedCreateNestedManyWithoutAthleteInputSchema).optional()
}).strict();

export const AthleteCreateOrConnectWithoutActivitiesInputSchema: z.ZodType<Prisma.AthleteCreateOrConnectWithoutActivitiesInput> = z.object({
  where: z.lazy(() => AthleteWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AthleteCreateWithoutActivitiesInputSchema),z.lazy(() => AthleteUncheckedCreateWithoutActivitiesInputSchema) ]),
}).strict();

export const TrackEffortCreateWithoutActivityInputSchema: z.ZodType<Prisma.TrackEffortCreateWithoutActivityInput> = z.object({
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  time: z.number().int(),
  polyline: z.string(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  track: z.lazy(() => TrackCreateNestedOneWithoutTrackEffortsInputSchema),
  athlete: z.lazy(() => AthleteCreateNestedOneWithoutTracksInputSchema)
}).strict();

export const TrackEffortUncheckedCreateWithoutActivityInputSchema: z.ZodType<Prisma.TrackEffortUncheckedCreateWithoutActivityInput> = z.object({
  id: z.number().int().optional(),
  trackId: z.number().int(),
  athleteId: z.number().int(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  time: z.number().int(),
  polyline: z.string(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TrackEffortCreateOrConnectWithoutActivityInputSchema: z.ZodType<Prisma.TrackEffortCreateOrConnectWithoutActivityInput> = z.object({
  where: z.lazy(() => TrackEffortWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutActivityInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutActivityInputSchema) ]),
}).strict();

export const TrackEffortCreateManyActivityInputEnvelopeSchema: z.ZodType<Prisma.TrackEffortCreateManyActivityInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TrackEffortCreateManyActivityInputSchema),z.lazy(() => TrackEffortCreateManyActivityInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AthleteUpsertWithoutActivitiesInputSchema: z.ZodType<Prisma.AthleteUpsertWithoutActivitiesInput> = z.object({
  update: z.union([ z.lazy(() => AthleteUpdateWithoutActivitiesInputSchema),z.lazy(() => AthleteUncheckedUpdateWithoutActivitiesInputSchema) ]),
  create: z.union([ z.lazy(() => AthleteCreateWithoutActivitiesInputSchema),z.lazy(() => AthleteUncheckedCreateWithoutActivitiesInputSchema) ]),
  where: z.lazy(() => AthleteWhereInputSchema).optional()
}).strict();

export const AthleteUpdateToOneWithWhereWithoutActivitiesInputSchema: z.ZodType<Prisma.AthleteUpdateToOneWithWhereWithoutActivitiesInput> = z.object({
  where: z.lazy(() => AthleteWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AthleteUpdateWithoutActivitiesInputSchema),z.lazy(() => AthleteUncheckedUpdateWithoutActivitiesInputSchema) ]),
}).strict();

export const AthleteUpdateWithoutActivitiesInputSchema: z.ZodType<Prisma.AthleteUpdateWithoutActivitiesInput> = z.object({
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tracks: z.lazy(() => TrackEffortUpdateManyWithoutAthleteNestedInputSchema).optional(),
  tokens: z.lazy(() => AthleteTokenUpdateManyWithoutAthleteNestedInputSchema).optional()
}).strict();

export const AthleteUncheckedUpdateWithoutActivitiesInputSchema: z.ZodType<Prisma.AthleteUncheckedUpdateWithoutActivitiesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  tracks: z.lazy(() => TrackEffortUncheckedUpdateManyWithoutAthleteNestedInputSchema).optional(),
  tokens: z.lazy(() => AthleteTokenUncheckedUpdateManyWithoutAthleteNestedInputSchema).optional()
}).strict();

export const TrackEffortUpsertWithWhereUniqueWithoutActivityInputSchema: z.ZodType<Prisma.TrackEffortUpsertWithWhereUniqueWithoutActivityInput> = z.object({
  where: z.lazy(() => TrackEffortWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TrackEffortUpdateWithoutActivityInputSchema),z.lazy(() => TrackEffortUncheckedUpdateWithoutActivityInputSchema) ]),
  create: z.union([ z.lazy(() => TrackEffortCreateWithoutActivityInputSchema),z.lazy(() => TrackEffortUncheckedCreateWithoutActivityInputSchema) ]),
}).strict();

export const TrackEffortUpdateWithWhereUniqueWithoutActivityInputSchema: z.ZodType<Prisma.TrackEffortUpdateWithWhereUniqueWithoutActivityInput> = z.object({
  where: z.lazy(() => TrackEffortWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TrackEffortUpdateWithoutActivityInputSchema),z.lazy(() => TrackEffortUncheckedUpdateWithoutActivityInputSchema) ]),
}).strict();

export const TrackEffortUpdateManyWithWhereWithoutActivityInputSchema: z.ZodType<Prisma.TrackEffortUpdateManyWithWhereWithoutActivityInput> = z.object({
  where: z.lazy(() => TrackEffortScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TrackEffortUpdateManyMutationInputSchema),z.lazy(() => TrackEffortUncheckedUpdateManyWithoutActivityInputSchema) ]),
}).strict();

export const TrackEffortCreateManyAthleteInputSchema: z.ZodType<Prisma.TrackEffortCreateManyAthleteInput> = z.object({
  id: z.number().int().optional(),
  trackId: z.number().int(),
  activityId: z.number().int(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  time: z.number().int(),
  polyline: z.string(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ActivityCreateManyAthleteInputSchema: z.ZodType<Prisma.ActivityCreateManyAthleteInput> = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  type: z.lazy(() => ActivityTypeSchema),
  distance: z.number(),
  elevationGain: z.number(),
  elevationLoss: z.number().optional().nullable(),
  averageSpeed: z.number().optional().nullable(),
  maxSpeed: z.number().optional().nullable(),
  startLatLng: z.union([ z.lazy(() => ActivityCreatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => ActivityCreateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.string(),
  elapsedTime: z.number().int(),
  startDateTime: z.coerce.date(),
  timezone: z.string(),
  source: z.lazy(() => ActivitySourceSchema).optional(),
  sourceId: z.string().optional().nullable(),
  city: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AthleteTokenCreateManyAthleteInputSchema: z.ZodType<Prisma.AthleteTokenCreateManyAthleteInput> = z.object({
  id: z.number().int().optional(),
  provider: z.lazy(() => TokenPoviderSchema),
  accessToken: z.string(),
  refreshToken: z.string().optional().nullable(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TrackEffortUpdateWithoutAthleteInputSchema: z.ZodType<Prisma.TrackEffortUpdateWithoutAthleteInput> = z.object({
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  track: z.lazy(() => TrackUpdateOneRequiredWithoutTrackEffortsNestedInputSchema).optional(),
  activity: z.lazy(() => ActivityUpdateOneRequiredWithoutTrackEffortsNestedInputSchema).optional()
}).strict();

export const TrackEffortUncheckedUpdateWithoutAthleteInputSchema: z.ZodType<Prisma.TrackEffortUncheckedUpdateWithoutAthleteInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  trackId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  activityId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackEffortUncheckedUpdateManyWithoutAthleteInputSchema: z.ZodType<Prisma.TrackEffortUncheckedUpdateManyWithoutAthleteInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  trackId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  activityId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ActivityUpdateWithoutAthleteInputSchema: z.ZodType<Prisma.ActivityUpdateWithoutAthleteInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationGain: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationLoss: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averageSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLatLng: z.union([ z.lazy(() => ActivityUpdatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => ActivityUpdateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  elapsedTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => ActivitySourceSchema),z.lazy(() => EnumActivitySourceFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  trackEfforts: z.lazy(() => TrackEffortUpdateManyWithoutActivityNestedInputSchema).optional()
}).strict();

export const ActivityUncheckedUpdateWithoutAthleteInputSchema: z.ZodType<Prisma.ActivityUncheckedUpdateWithoutAthleteInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationGain: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationLoss: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averageSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLatLng: z.union([ z.lazy(() => ActivityUpdatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => ActivityUpdateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  elapsedTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => ActivitySourceSchema),z.lazy(() => EnumActivitySourceFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  trackEfforts: z.lazy(() => TrackEffortUncheckedUpdateManyWithoutActivityNestedInputSchema).optional()
}).strict();

export const ActivityUncheckedUpdateManyWithoutAthleteInputSchema: z.ZodType<Prisma.ActivityUncheckedUpdateManyWithoutAthleteInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => ActivityTypeSchema),z.lazy(() => EnumActivityTypeFieldUpdateOperationsInputSchema) ]).optional(),
  distance: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationGain: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  elevationLoss: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  averageSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  maxSpeed: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startLatLng: z.union([ z.lazy(() => ActivityUpdatestartLatLngInputSchema),z.number().array() ]).optional(),
  endLatLng: z.union([ z.lazy(() => ActivityUpdateendLatLngInputSchema),z.number().array() ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  elapsedTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startDateTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  timezone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  source: z.union([ z.lazy(() => ActivitySourceSchema),z.lazy(() => EnumActivitySourceFieldUpdateOperationsInputSchema) ]).optional(),
  sourceId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AthleteTokenUpdateWithoutAthleteInputSchema: z.ZodType<Prisma.AthleteTokenUpdateWithoutAthleteInput> = z.object({
  provider: z.union([ z.lazy(() => TokenPoviderSchema),z.lazy(() => EnumTokenPoviderFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AthleteTokenUncheckedUpdateWithoutAthleteInputSchema: z.ZodType<Prisma.AthleteTokenUncheckedUpdateWithoutAthleteInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => TokenPoviderSchema),z.lazy(() => EnumTokenPoviderFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AthleteTokenUncheckedUpdateManyWithoutAthleteInputSchema: z.ZodType<Prisma.AthleteTokenUncheckedUpdateManyWithoutAthleteInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => TokenPoviderSchema),z.lazy(() => EnumTokenPoviderFieldUpdateOperationsInputSchema) ]).optional(),
  accessToken: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  refreshToken: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackEffortCreateManyTrackInputSchema: z.ZodType<Prisma.TrackEffortCreateManyTrackInput> = z.object({
  id: z.number().int().optional(),
  athleteId: z.number().int(),
  activityId: z.number().int(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  time: z.number().int(),
  polyline: z.string(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TrackEffortUpdateWithoutTrackInputSchema: z.ZodType<Prisma.TrackEffortUpdateWithoutTrackInput> = z.object({
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  athlete: z.lazy(() => AthleteUpdateOneRequiredWithoutTracksNestedInputSchema).optional(),
  activity: z.lazy(() => ActivityUpdateOneRequiredWithoutTrackEffortsNestedInputSchema).optional()
}).strict();

export const TrackEffortUncheckedUpdateWithoutTrackInputSchema: z.ZodType<Prisma.TrackEffortUncheckedUpdateWithoutTrackInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  athleteId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  activityId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackEffortUncheckedUpdateManyWithoutTrackInputSchema: z.ZodType<Prisma.TrackEffortUncheckedUpdateManyWithoutTrackInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  athleteId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  activityId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackEffortCreateManyActivityInputSchema: z.ZodType<Prisma.TrackEffortCreateManyActivityInput> = z.object({
  id: z.number().int().optional(),
  trackId: z.number().int(),
  athleteId: z.number().int(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  time: z.number().int(),
  polyline: z.string(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TrackEffortUpdateWithoutActivityInputSchema: z.ZodType<Prisma.TrackEffortUpdateWithoutActivityInput> = z.object({
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  track: z.lazy(() => TrackUpdateOneRequiredWithoutTrackEffortsNestedInputSchema).optional(),
  athlete: z.lazy(() => AthleteUpdateOneRequiredWithoutTracksNestedInputSchema).optional()
}).strict();

export const TrackEffortUncheckedUpdateWithoutActivityInputSchema: z.ZodType<Prisma.TrackEffortUncheckedUpdateWithoutActivityInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  trackId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  athleteId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TrackEffortUncheckedUpdateManyWithoutActivityInputSchema: z.ZodType<Prisma.TrackEffortUncheckedUpdateManyWithoutActivityInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  trackId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  athleteId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  polyline: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  streams: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const AthleteFindFirstArgsSchema: z.ZodType<Prisma.AthleteFindFirstArgs> = z.object({
  select: AthleteSelectSchema.optional(),
  include: AthleteIncludeSchema.optional(),
  where: AthleteWhereInputSchema.optional(),
  orderBy: z.union([ AthleteOrderByWithRelationInputSchema.array(),AthleteOrderByWithRelationInputSchema ]).optional(),
  cursor: AthleteWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AthleteScalarFieldEnumSchema,AthleteScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AthleteFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AthleteFindFirstOrThrowArgs> = z.object({
  select: AthleteSelectSchema.optional(),
  include: AthleteIncludeSchema.optional(),
  where: AthleteWhereInputSchema.optional(),
  orderBy: z.union([ AthleteOrderByWithRelationInputSchema.array(),AthleteOrderByWithRelationInputSchema ]).optional(),
  cursor: AthleteWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AthleteScalarFieldEnumSchema,AthleteScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AthleteFindManyArgsSchema: z.ZodType<Prisma.AthleteFindManyArgs> = z.object({
  select: AthleteSelectSchema.optional(),
  include: AthleteIncludeSchema.optional(),
  where: AthleteWhereInputSchema.optional(),
  orderBy: z.union([ AthleteOrderByWithRelationInputSchema.array(),AthleteOrderByWithRelationInputSchema ]).optional(),
  cursor: AthleteWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AthleteScalarFieldEnumSchema,AthleteScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AthleteAggregateArgsSchema: z.ZodType<Prisma.AthleteAggregateArgs> = z.object({
  where: AthleteWhereInputSchema.optional(),
  orderBy: z.union([ AthleteOrderByWithRelationInputSchema.array(),AthleteOrderByWithRelationInputSchema ]).optional(),
  cursor: AthleteWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AthleteGroupByArgsSchema: z.ZodType<Prisma.AthleteGroupByArgs> = z.object({
  where: AthleteWhereInputSchema.optional(),
  orderBy: z.union([ AthleteOrderByWithAggregationInputSchema.array(),AthleteOrderByWithAggregationInputSchema ]).optional(),
  by: AthleteScalarFieldEnumSchema.array(),
  having: AthleteScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AthleteFindUniqueArgsSchema: z.ZodType<Prisma.AthleteFindUniqueArgs> = z.object({
  select: AthleteSelectSchema.optional(),
  include: AthleteIncludeSchema.optional(),
  where: AthleteWhereUniqueInputSchema,
}).strict() ;

export const AthleteFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AthleteFindUniqueOrThrowArgs> = z.object({
  select: AthleteSelectSchema.optional(),
  include: AthleteIncludeSchema.optional(),
  where: AthleteWhereUniqueInputSchema,
}).strict() ;

export const AthleteTokenFindFirstArgsSchema: z.ZodType<Prisma.AthleteTokenFindFirstArgs> = z.object({
  select: AthleteTokenSelectSchema.optional(),
  include: AthleteTokenIncludeSchema.optional(),
  where: AthleteTokenWhereInputSchema.optional(),
  orderBy: z.union([ AthleteTokenOrderByWithRelationInputSchema.array(),AthleteTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: AthleteTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AthleteTokenScalarFieldEnumSchema,AthleteTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AthleteTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AthleteTokenFindFirstOrThrowArgs> = z.object({
  select: AthleteTokenSelectSchema.optional(),
  include: AthleteTokenIncludeSchema.optional(),
  where: AthleteTokenWhereInputSchema.optional(),
  orderBy: z.union([ AthleteTokenOrderByWithRelationInputSchema.array(),AthleteTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: AthleteTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AthleteTokenScalarFieldEnumSchema,AthleteTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AthleteTokenFindManyArgsSchema: z.ZodType<Prisma.AthleteTokenFindManyArgs> = z.object({
  select: AthleteTokenSelectSchema.optional(),
  include: AthleteTokenIncludeSchema.optional(),
  where: AthleteTokenWhereInputSchema.optional(),
  orderBy: z.union([ AthleteTokenOrderByWithRelationInputSchema.array(),AthleteTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: AthleteTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AthleteTokenScalarFieldEnumSchema,AthleteTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AthleteTokenAggregateArgsSchema: z.ZodType<Prisma.AthleteTokenAggregateArgs> = z.object({
  where: AthleteTokenWhereInputSchema.optional(),
  orderBy: z.union([ AthleteTokenOrderByWithRelationInputSchema.array(),AthleteTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: AthleteTokenWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AthleteTokenGroupByArgsSchema: z.ZodType<Prisma.AthleteTokenGroupByArgs> = z.object({
  where: AthleteTokenWhereInputSchema.optional(),
  orderBy: z.union([ AthleteTokenOrderByWithAggregationInputSchema.array(),AthleteTokenOrderByWithAggregationInputSchema ]).optional(),
  by: AthleteTokenScalarFieldEnumSchema.array(),
  having: AthleteTokenScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AthleteTokenFindUniqueArgsSchema: z.ZodType<Prisma.AthleteTokenFindUniqueArgs> = z.object({
  select: AthleteTokenSelectSchema.optional(),
  include: AthleteTokenIncludeSchema.optional(),
  where: AthleteTokenWhereUniqueInputSchema,
}).strict() ;

export const AthleteTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AthleteTokenFindUniqueOrThrowArgs> = z.object({
  select: AthleteTokenSelectSchema.optional(),
  include: AthleteTokenIncludeSchema.optional(),
  where: AthleteTokenWhereUniqueInputSchema,
}).strict() ;

export const TrackFindFirstArgsSchema: z.ZodType<Prisma.TrackFindFirstArgs> = z.object({
  select: TrackSelectSchema.optional(),
  include: TrackIncludeSchema.optional(),
  where: TrackWhereInputSchema.optional(),
  orderBy: z.union([ TrackOrderByWithRelationInputSchema.array(),TrackOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TrackScalarFieldEnumSchema,TrackScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TrackFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TrackFindFirstOrThrowArgs> = z.object({
  select: TrackSelectSchema.optional(),
  include: TrackIncludeSchema.optional(),
  where: TrackWhereInputSchema.optional(),
  orderBy: z.union([ TrackOrderByWithRelationInputSchema.array(),TrackOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TrackScalarFieldEnumSchema,TrackScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TrackFindManyArgsSchema: z.ZodType<Prisma.TrackFindManyArgs> = z.object({
  select: TrackSelectSchema.optional(),
  include: TrackIncludeSchema.optional(),
  where: TrackWhereInputSchema.optional(),
  orderBy: z.union([ TrackOrderByWithRelationInputSchema.array(),TrackOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TrackScalarFieldEnumSchema,TrackScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TrackAggregateArgsSchema: z.ZodType<Prisma.TrackAggregateArgs> = z.object({
  where: TrackWhereInputSchema.optional(),
  orderBy: z.union([ TrackOrderByWithRelationInputSchema.array(),TrackOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TrackGroupByArgsSchema: z.ZodType<Prisma.TrackGroupByArgs> = z.object({
  where: TrackWhereInputSchema.optional(),
  orderBy: z.union([ TrackOrderByWithAggregationInputSchema.array(),TrackOrderByWithAggregationInputSchema ]).optional(),
  by: TrackScalarFieldEnumSchema.array(),
  having: TrackScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TrackFindUniqueArgsSchema: z.ZodType<Prisma.TrackFindUniqueArgs> = z.object({
  select: TrackSelectSchema.optional(),
  include: TrackIncludeSchema.optional(),
  where: TrackWhereUniqueInputSchema,
}).strict() ;

export const TrackFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TrackFindUniqueOrThrowArgs> = z.object({
  select: TrackSelectSchema.optional(),
  include: TrackIncludeSchema.optional(),
  where: TrackWhereUniqueInputSchema,
}).strict() ;

export const TrackDetailsFindFirstArgsSchema: z.ZodType<Prisma.TrackDetailsFindFirstArgs> = z.object({
  select: TrackDetailsSelectSchema.optional(),
  include: TrackDetailsIncludeSchema.optional(),
  where: TrackDetailsWhereInputSchema.optional(),
  orderBy: z.union([ TrackDetailsOrderByWithRelationInputSchema.array(),TrackDetailsOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackDetailsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TrackDetailsScalarFieldEnumSchema,TrackDetailsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TrackDetailsFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TrackDetailsFindFirstOrThrowArgs> = z.object({
  select: TrackDetailsSelectSchema.optional(),
  include: TrackDetailsIncludeSchema.optional(),
  where: TrackDetailsWhereInputSchema.optional(),
  orderBy: z.union([ TrackDetailsOrderByWithRelationInputSchema.array(),TrackDetailsOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackDetailsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TrackDetailsScalarFieldEnumSchema,TrackDetailsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TrackDetailsFindManyArgsSchema: z.ZodType<Prisma.TrackDetailsFindManyArgs> = z.object({
  select: TrackDetailsSelectSchema.optional(),
  include: TrackDetailsIncludeSchema.optional(),
  where: TrackDetailsWhereInputSchema.optional(),
  orderBy: z.union([ TrackDetailsOrderByWithRelationInputSchema.array(),TrackDetailsOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackDetailsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TrackDetailsScalarFieldEnumSchema,TrackDetailsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TrackDetailsAggregateArgsSchema: z.ZodType<Prisma.TrackDetailsAggregateArgs> = z.object({
  where: TrackDetailsWhereInputSchema.optional(),
  orderBy: z.union([ TrackDetailsOrderByWithRelationInputSchema.array(),TrackDetailsOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackDetailsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TrackDetailsGroupByArgsSchema: z.ZodType<Prisma.TrackDetailsGroupByArgs> = z.object({
  where: TrackDetailsWhereInputSchema.optional(),
  orderBy: z.union([ TrackDetailsOrderByWithAggregationInputSchema.array(),TrackDetailsOrderByWithAggregationInputSchema ]).optional(),
  by: TrackDetailsScalarFieldEnumSchema.array(),
  having: TrackDetailsScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TrackDetailsFindUniqueArgsSchema: z.ZodType<Prisma.TrackDetailsFindUniqueArgs> = z.object({
  select: TrackDetailsSelectSchema.optional(),
  include: TrackDetailsIncludeSchema.optional(),
  where: TrackDetailsWhereUniqueInputSchema,
}).strict() ;

export const TrackDetailsFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TrackDetailsFindUniqueOrThrowArgs> = z.object({
  select: TrackDetailsSelectSchema.optional(),
  include: TrackDetailsIncludeSchema.optional(),
  where: TrackDetailsWhereUniqueInputSchema,
}).strict() ;

export const TrackEffortFindFirstArgsSchema: z.ZodType<Prisma.TrackEffortFindFirstArgs> = z.object({
  select: TrackEffortSelectSchema.optional(),
  include: TrackEffortIncludeSchema.optional(),
  where: TrackEffortWhereInputSchema.optional(),
  orderBy: z.union([ TrackEffortOrderByWithRelationInputSchema.array(),TrackEffortOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackEffortWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TrackEffortScalarFieldEnumSchema,TrackEffortScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TrackEffortFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TrackEffortFindFirstOrThrowArgs> = z.object({
  select: TrackEffortSelectSchema.optional(),
  include: TrackEffortIncludeSchema.optional(),
  where: TrackEffortWhereInputSchema.optional(),
  orderBy: z.union([ TrackEffortOrderByWithRelationInputSchema.array(),TrackEffortOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackEffortWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TrackEffortScalarFieldEnumSchema,TrackEffortScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TrackEffortFindManyArgsSchema: z.ZodType<Prisma.TrackEffortFindManyArgs> = z.object({
  select: TrackEffortSelectSchema.optional(),
  include: TrackEffortIncludeSchema.optional(),
  where: TrackEffortWhereInputSchema.optional(),
  orderBy: z.union([ TrackEffortOrderByWithRelationInputSchema.array(),TrackEffortOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackEffortWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TrackEffortScalarFieldEnumSchema,TrackEffortScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TrackEffortAggregateArgsSchema: z.ZodType<Prisma.TrackEffortAggregateArgs> = z.object({
  where: TrackEffortWhereInputSchema.optional(),
  orderBy: z.union([ TrackEffortOrderByWithRelationInputSchema.array(),TrackEffortOrderByWithRelationInputSchema ]).optional(),
  cursor: TrackEffortWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TrackEffortGroupByArgsSchema: z.ZodType<Prisma.TrackEffortGroupByArgs> = z.object({
  where: TrackEffortWhereInputSchema.optional(),
  orderBy: z.union([ TrackEffortOrderByWithAggregationInputSchema.array(),TrackEffortOrderByWithAggregationInputSchema ]).optional(),
  by: TrackEffortScalarFieldEnumSchema.array(),
  having: TrackEffortScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TrackEffortFindUniqueArgsSchema: z.ZodType<Prisma.TrackEffortFindUniqueArgs> = z.object({
  select: TrackEffortSelectSchema.optional(),
  include: TrackEffortIncludeSchema.optional(),
  where: TrackEffortWhereUniqueInputSchema,
}).strict() ;

export const TrackEffortFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TrackEffortFindUniqueOrThrowArgs> = z.object({
  select: TrackEffortSelectSchema.optional(),
  include: TrackEffortIncludeSchema.optional(),
  where: TrackEffortWhereUniqueInputSchema,
}).strict() ;

export const ActivityFindFirstArgsSchema: z.ZodType<Prisma.ActivityFindFirstArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  where: ActivityWhereInputSchema.optional(),
  orderBy: z.union([ ActivityOrderByWithRelationInputSchema.array(),ActivityOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActivityScalarFieldEnumSchema,ActivityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ActivityFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ActivityFindFirstOrThrowArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  where: ActivityWhereInputSchema.optional(),
  orderBy: z.union([ ActivityOrderByWithRelationInputSchema.array(),ActivityOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActivityScalarFieldEnumSchema,ActivityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ActivityFindManyArgsSchema: z.ZodType<Prisma.ActivityFindManyArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  where: ActivityWhereInputSchema.optional(),
  orderBy: z.union([ ActivityOrderByWithRelationInputSchema.array(),ActivityOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ActivityScalarFieldEnumSchema,ActivityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ActivityAggregateArgsSchema: z.ZodType<Prisma.ActivityAggregateArgs> = z.object({
  where: ActivityWhereInputSchema.optional(),
  orderBy: z.union([ ActivityOrderByWithRelationInputSchema.array(),ActivityOrderByWithRelationInputSchema ]).optional(),
  cursor: ActivityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ActivityGroupByArgsSchema: z.ZodType<Prisma.ActivityGroupByArgs> = z.object({
  where: ActivityWhereInputSchema.optional(),
  orderBy: z.union([ ActivityOrderByWithAggregationInputSchema.array(),ActivityOrderByWithAggregationInputSchema ]).optional(),
  by: ActivityScalarFieldEnumSchema.array(),
  having: ActivityScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ActivityFindUniqueArgsSchema: z.ZodType<Prisma.ActivityFindUniqueArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  where: ActivityWhereUniqueInputSchema,
}).strict() ;

export const ActivityFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ActivityFindUniqueOrThrowArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  where: ActivityWhereUniqueInputSchema,
}).strict() ;

export const AthleteCreateArgsSchema: z.ZodType<Prisma.AthleteCreateArgs> = z.object({
  select: AthleteSelectSchema.optional(),
  include: AthleteIncludeSchema.optional(),
  data: z.union([ AthleteCreateInputSchema,AthleteUncheckedCreateInputSchema ]),
}).strict() ;

export const AthleteUpsertArgsSchema: z.ZodType<Prisma.AthleteUpsertArgs> = z.object({
  select: AthleteSelectSchema.optional(),
  include: AthleteIncludeSchema.optional(),
  where: AthleteWhereUniqueInputSchema,
  create: z.union([ AthleteCreateInputSchema,AthleteUncheckedCreateInputSchema ]),
  update: z.union([ AthleteUpdateInputSchema,AthleteUncheckedUpdateInputSchema ]),
}).strict() ;

export const AthleteCreateManyArgsSchema: z.ZodType<Prisma.AthleteCreateManyArgs> = z.object({
  data: z.union([ AthleteCreateManyInputSchema,AthleteCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AthleteCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AthleteCreateManyAndReturnArgs> = z.object({
  data: z.union([ AthleteCreateManyInputSchema,AthleteCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AthleteDeleteArgsSchema: z.ZodType<Prisma.AthleteDeleteArgs> = z.object({
  select: AthleteSelectSchema.optional(),
  include: AthleteIncludeSchema.optional(),
  where: AthleteWhereUniqueInputSchema,
}).strict() ;

export const AthleteUpdateArgsSchema: z.ZodType<Prisma.AthleteUpdateArgs> = z.object({
  select: AthleteSelectSchema.optional(),
  include: AthleteIncludeSchema.optional(),
  data: z.union([ AthleteUpdateInputSchema,AthleteUncheckedUpdateInputSchema ]),
  where: AthleteWhereUniqueInputSchema,
}).strict() ;

export const AthleteUpdateManyArgsSchema: z.ZodType<Prisma.AthleteUpdateManyArgs> = z.object({
  data: z.union([ AthleteUpdateManyMutationInputSchema,AthleteUncheckedUpdateManyInputSchema ]),
  where: AthleteWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AthleteUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AthleteUpdateManyAndReturnArgs> = z.object({
  data: z.union([ AthleteUpdateManyMutationInputSchema,AthleteUncheckedUpdateManyInputSchema ]),
  where: AthleteWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AthleteDeleteManyArgsSchema: z.ZodType<Prisma.AthleteDeleteManyArgs> = z.object({
  where: AthleteWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AthleteTokenCreateArgsSchema: z.ZodType<Prisma.AthleteTokenCreateArgs> = z.object({
  select: AthleteTokenSelectSchema.optional(),
  include: AthleteTokenIncludeSchema.optional(),
  data: z.union([ AthleteTokenCreateInputSchema,AthleteTokenUncheckedCreateInputSchema ]),
}).strict() ;

export const AthleteTokenUpsertArgsSchema: z.ZodType<Prisma.AthleteTokenUpsertArgs> = z.object({
  select: AthleteTokenSelectSchema.optional(),
  include: AthleteTokenIncludeSchema.optional(),
  where: AthleteTokenWhereUniqueInputSchema,
  create: z.union([ AthleteTokenCreateInputSchema,AthleteTokenUncheckedCreateInputSchema ]),
  update: z.union([ AthleteTokenUpdateInputSchema,AthleteTokenUncheckedUpdateInputSchema ]),
}).strict() ;

export const AthleteTokenCreateManyArgsSchema: z.ZodType<Prisma.AthleteTokenCreateManyArgs> = z.object({
  data: z.union([ AthleteTokenCreateManyInputSchema,AthleteTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AthleteTokenCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AthleteTokenCreateManyAndReturnArgs> = z.object({
  data: z.union([ AthleteTokenCreateManyInputSchema,AthleteTokenCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AthleteTokenDeleteArgsSchema: z.ZodType<Prisma.AthleteTokenDeleteArgs> = z.object({
  select: AthleteTokenSelectSchema.optional(),
  include: AthleteTokenIncludeSchema.optional(),
  where: AthleteTokenWhereUniqueInputSchema,
}).strict() ;

export const AthleteTokenUpdateArgsSchema: z.ZodType<Prisma.AthleteTokenUpdateArgs> = z.object({
  select: AthleteTokenSelectSchema.optional(),
  include: AthleteTokenIncludeSchema.optional(),
  data: z.union([ AthleteTokenUpdateInputSchema,AthleteTokenUncheckedUpdateInputSchema ]),
  where: AthleteTokenWhereUniqueInputSchema,
}).strict() ;

export const AthleteTokenUpdateManyArgsSchema: z.ZodType<Prisma.AthleteTokenUpdateManyArgs> = z.object({
  data: z.union([ AthleteTokenUpdateManyMutationInputSchema,AthleteTokenUncheckedUpdateManyInputSchema ]),
  where: AthleteTokenWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AthleteTokenUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AthleteTokenUpdateManyAndReturnArgs> = z.object({
  data: z.union([ AthleteTokenUpdateManyMutationInputSchema,AthleteTokenUncheckedUpdateManyInputSchema ]),
  where: AthleteTokenWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AthleteTokenDeleteManyArgsSchema: z.ZodType<Prisma.AthleteTokenDeleteManyArgs> = z.object({
  where: AthleteTokenWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TrackCreateArgsSchema: z.ZodType<Prisma.TrackCreateArgs> = z.object({
  select: TrackSelectSchema.optional(),
  include: TrackIncludeSchema.optional(),
  data: z.union([ TrackCreateInputSchema,TrackUncheckedCreateInputSchema ]),
}).strict() ;

export const TrackUpsertArgsSchema: z.ZodType<Prisma.TrackUpsertArgs> = z.object({
  select: TrackSelectSchema.optional(),
  include: TrackIncludeSchema.optional(),
  where: TrackWhereUniqueInputSchema,
  create: z.union([ TrackCreateInputSchema,TrackUncheckedCreateInputSchema ]),
  update: z.union([ TrackUpdateInputSchema,TrackUncheckedUpdateInputSchema ]),
}).strict() ;

export const TrackCreateManyArgsSchema: z.ZodType<Prisma.TrackCreateManyArgs> = z.object({
  data: z.union([ TrackCreateManyInputSchema,TrackCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TrackCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TrackCreateManyAndReturnArgs> = z.object({
  data: z.union([ TrackCreateManyInputSchema,TrackCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TrackDeleteArgsSchema: z.ZodType<Prisma.TrackDeleteArgs> = z.object({
  select: TrackSelectSchema.optional(),
  include: TrackIncludeSchema.optional(),
  where: TrackWhereUniqueInputSchema,
}).strict() ;

export const TrackUpdateArgsSchema: z.ZodType<Prisma.TrackUpdateArgs> = z.object({
  select: TrackSelectSchema.optional(),
  include: TrackIncludeSchema.optional(),
  data: z.union([ TrackUpdateInputSchema,TrackUncheckedUpdateInputSchema ]),
  where: TrackWhereUniqueInputSchema,
}).strict() ;

export const TrackUpdateManyArgsSchema: z.ZodType<Prisma.TrackUpdateManyArgs> = z.object({
  data: z.union([ TrackUpdateManyMutationInputSchema,TrackUncheckedUpdateManyInputSchema ]),
  where: TrackWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TrackUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.TrackUpdateManyAndReturnArgs> = z.object({
  data: z.union([ TrackUpdateManyMutationInputSchema,TrackUncheckedUpdateManyInputSchema ]),
  where: TrackWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TrackDeleteManyArgsSchema: z.ZodType<Prisma.TrackDeleteManyArgs> = z.object({
  where: TrackWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TrackDetailsCreateArgsSchema: z.ZodType<Prisma.TrackDetailsCreateArgs> = z.object({
  select: TrackDetailsSelectSchema.optional(),
  include: TrackDetailsIncludeSchema.optional(),
  data: z.union([ TrackDetailsCreateInputSchema,TrackDetailsUncheckedCreateInputSchema ]),
}).strict() ;

export const TrackDetailsUpsertArgsSchema: z.ZodType<Prisma.TrackDetailsUpsertArgs> = z.object({
  select: TrackDetailsSelectSchema.optional(),
  include: TrackDetailsIncludeSchema.optional(),
  where: TrackDetailsWhereUniqueInputSchema,
  create: z.union([ TrackDetailsCreateInputSchema,TrackDetailsUncheckedCreateInputSchema ]),
  update: z.union([ TrackDetailsUpdateInputSchema,TrackDetailsUncheckedUpdateInputSchema ]),
}).strict() ;

export const TrackDetailsCreateManyArgsSchema: z.ZodType<Prisma.TrackDetailsCreateManyArgs> = z.object({
  data: z.union([ TrackDetailsCreateManyInputSchema,TrackDetailsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TrackDetailsCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TrackDetailsCreateManyAndReturnArgs> = z.object({
  data: z.union([ TrackDetailsCreateManyInputSchema,TrackDetailsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TrackDetailsDeleteArgsSchema: z.ZodType<Prisma.TrackDetailsDeleteArgs> = z.object({
  select: TrackDetailsSelectSchema.optional(),
  include: TrackDetailsIncludeSchema.optional(),
  where: TrackDetailsWhereUniqueInputSchema,
}).strict() ;

export const TrackDetailsUpdateArgsSchema: z.ZodType<Prisma.TrackDetailsUpdateArgs> = z.object({
  select: TrackDetailsSelectSchema.optional(),
  include: TrackDetailsIncludeSchema.optional(),
  data: z.union([ TrackDetailsUpdateInputSchema,TrackDetailsUncheckedUpdateInputSchema ]),
  where: TrackDetailsWhereUniqueInputSchema,
}).strict() ;

export const TrackDetailsUpdateManyArgsSchema: z.ZodType<Prisma.TrackDetailsUpdateManyArgs> = z.object({
  data: z.union([ TrackDetailsUpdateManyMutationInputSchema,TrackDetailsUncheckedUpdateManyInputSchema ]),
  where: TrackDetailsWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TrackDetailsUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.TrackDetailsUpdateManyAndReturnArgs> = z.object({
  data: z.union([ TrackDetailsUpdateManyMutationInputSchema,TrackDetailsUncheckedUpdateManyInputSchema ]),
  where: TrackDetailsWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TrackDetailsDeleteManyArgsSchema: z.ZodType<Prisma.TrackDetailsDeleteManyArgs> = z.object({
  where: TrackDetailsWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TrackEffortCreateArgsSchema: z.ZodType<Prisma.TrackEffortCreateArgs> = z.object({
  select: TrackEffortSelectSchema.optional(),
  include: TrackEffortIncludeSchema.optional(),
  data: z.union([ TrackEffortCreateInputSchema,TrackEffortUncheckedCreateInputSchema ]),
}).strict() ;

export const TrackEffortUpsertArgsSchema: z.ZodType<Prisma.TrackEffortUpsertArgs> = z.object({
  select: TrackEffortSelectSchema.optional(),
  include: TrackEffortIncludeSchema.optional(),
  where: TrackEffortWhereUniqueInputSchema,
  create: z.union([ TrackEffortCreateInputSchema,TrackEffortUncheckedCreateInputSchema ]),
  update: z.union([ TrackEffortUpdateInputSchema,TrackEffortUncheckedUpdateInputSchema ]),
}).strict() ;

export const TrackEffortCreateManyArgsSchema: z.ZodType<Prisma.TrackEffortCreateManyArgs> = z.object({
  data: z.union([ TrackEffortCreateManyInputSchema,TrackEffortCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TrackEffortCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TrackEffortCreateManyAndReturnArgs> = z.object({
  data: z.union([ TrackEffortCreateManyInputSchema,TrackEffortCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TrackEffortDeleteArgsSchema: z.ZodType<Prisma.TrackEffortDeleteArgs> = z.object({
  select: TrackEffortSelectSchema.optional(),
  include: TrackEffortIncludeSchema.optional(),
  where: TrackEffortWhereUniqueInputSchema,
}).strict() ;

export const TrackEffortUpdateArgsSchema: z.ZodType<Prisma.TrackEffortUpdateArgs> = z.object({
  select: TrackEffortSelectSchema.optional(),
  include: TrackEffortIncludeSchema.optional(),
  data: z.union([ TrackEffortUpdateInputSchema,TrackEffortUncheckedUpdateInputSchema ]),
  where: TrackEffortWhereUniqueInputSchema,
}).strict() ;

export const TrackEffortUpdateManyArgsSchema: z.ZodType<Prisma.TrackEffortUpdateManyArgs> = z.object({
  data: z.union([ TrackEffortUpdateManyMutationInputSchema,TrackEffortUncheckedUpdateManyInputSchema ]),
  where: TrackEffortWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TrackEffortUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.TrackEffortUpdateManyAndReturnArgs> = z.object({
  data: z.union([ TrackEffortUpdateManyMutationInputSchema,TrackEffortUncheckedUpdateManyInputSchema ]),
  where: TrackEffortWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TrackEffortDeleteManyArgsSchema: z.ZodType<Prisma.TrackEffortDeleteManyArgs> = z.object({
  where: TrackEffortWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ActivityCreateArgsSchema: z.ZodType<Prisma.ActivityCreateArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  data: z.union([ ActivityCreateInputSchema,ActivityUncheckedCreateInputSchema ]),
}).strict() ;

export const ActivityUpsertArgsSchema: z.ZodType<Prisma.ActivityUpsertArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  where: ActivityWhereUniqueInputSchema,
  create: z.union([ ActivityCreateInputSchema,ActivityUncheckedCreateInputSchema ]),
  update: z.union([ ActivityUpdateInputSchema,ActivityUncheckedUpdateInputSchema ]),
}).strict() ;

export const ActivityCreateManyArgsSchema: z.ZodType<Prisma.ActivityCreateManyArgs> = z.object({
  data: z.union([ ActivityCreateManyInputSchema,ActivityCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ActivityCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ActivityCreateManyAndReturnArgs> = z.object({
  data: z.union([ ActivityCreateManyInputSchema,ActivityCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ActivityDeleteArgsSchema: z.ZodType<Prisma.ActivityDeleteArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  where: ActivityWhereUniqueInputSchema,
}).strict() ;

export const ActivityUpdateArgsSchema: z.ZodType<Prisma.ActivityUpdateArgs> = z.object({
  select: ActivitySelectSchema.optional(),
  include: ActivityIncludeSchema.optional(),
  data: z.union([ ActivityUpdateInputSchema,ActivityUncheckedUpdateInputSchema ]),
  where: ActivityWhereUniqueInputSchema,
}).strict() ;

export const ActivityUpdateManyArgsSchema: z.ZodType<Prisma.ActivityUpdateManyArgs> = z.object({
  data: z.union([ ActivityUpdateManyMutationInputSchema,ActivityUncheckedUpdateManyInputSchema ]),
  where: ActivityWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ActivityUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ActivityUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ActivityUpdateManyMutationInputSchema,ActivityUncheckedUpdateManyInputSchema ]),
  where: ActivityWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ActivityDeleteManyArgsSchema: z.ZodType<Prisma.ActivityDeleteManyArgs> = z.object({
  where: ActivityWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;