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

// DECIMAL
//------------------------------------------------------

export const DecimalJsLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({
  d: z.array(z.number()),
  e: z.number(),
  s: z.number(),
  toFixed: z.function(z.tuple([]), z.string()),
})

export const DECIMAL_STRING_REGEX = /^(?:-?Infinity|NaN|-?(?:0[bB][01]+(?:\.[01]+)?(?:[pP][-+]?\d+)?|0[oO][0-7]+(?:\.[0-7]+)?(?:[pP][-+]?\d+)?|0[xX][\da-fA-F]+(?:\.[\da-fA-F]+)?(?:[pP][-+]?\d+)?|(?:\d+|\d*\.\d+)(?:[eE][-+]?\d+)?))$/;

export const isValidDecimalInput =
  (v?: null | string | number | Prisma.DecimalJsLike): v is string | number | Prisma.DecimalJsLike => {
    if (v === undefined || v === null) return false;
    return (
      (typeof v === 'object' && 'd' in v && 'e' in v && 's' in v && 'toFixed' in v) ||
      (typeof v === 'string' && DECIMAL_STRING_REGEX.test(v)) ||
      typeof v === 'number'
    )
  };

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const CommunityScalarFieldEnumSchema = z.enum(['id','title','address']);

export const UserScalarFieldEnumSchema = z.enum(['id','userName','email','password','identification','firstName','lastName','phone','isVerified','isActive','community_id','role_id','residence_id']);

export const ResidenceScalarFieldEnumSchema = z.enum(['id','title','owner_id','community_id','contacts','residenceType_id']);

export const ParkingSlotScalarFieldEnumSchema = z.enum(['id','number','residence_id']);

export const ResidenceTypeScalarFieldEnumSchema = z.enum(['id','title','description','community_id']);

export const ProviderScalarFieldEnumSchema = z.enum(['id','title','contactName','description','phone','email','address','website','active','community_id']);

export const RoleScalarFieldEnumSchema = z.enum(['id','title','description','modules']);

export const ExpenseScalarFieldEnumSchema = z.enum(['id','title','residence_id','emitingDate','expireDate','status','expenseType_id','payment_id']);

export const PaymentScalarFieldEnumSchema = z.enum(['id','title','description','registerDate','amount','owner_id','voucherImage','isEmailSend','account_id','created_by']);

export const CashoutScalarFieldEnumSchema = z.enum(['id','title','description','provider_id','amount','billImage','account_id','status','registerDate']);

export const ExpenseTypeScalarFieldEnumSchema = z.enum(['id','title','value','residenceType_id']);

export const AccountScalarFieldEnumSchema = z.enum(['id','title','description','active','community_id','balance']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// COMMUNITY SCHEMA
/////////////////////////////////////////

export const CommunitySchema = z.object({
  id: z.string(),
  title: z.string(),
  address: z.string(),
})

export type Community = z.infer<typeof CommunitySchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  userName: z.string(),
  email: z.string(),
  password: z.string().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().nullable(),
  isActive: z.boolean().nullable(),
  community_id: z.string(),
  role_id: z.number().int(),
  residence_id: z.string().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// RESIDENCE SCHEMA
/////////////////////////////////////////

export const ResidenceSchema = z.object({
  id: z.string(),
  title: z.string(),
  owner_id: z.string().nullable(),
  community_id: z.string(),
  contacts: JsonValueSchema.nullable(),
  residenceType_id: z.number().int(),
})

export type Residence = z.infer<typeof ResidenceSchema>

/////////////////////////////////////////
// PARKING SLOT SCHEMA
/////////////////////////////////////////

export const ParkingSlotSchema = z.object({
  id: z.string(),
  number: z.number().int(),
  residence_id: z.string(),
})

export type ParkingSlot = z.infer<typeof ParkingSlotSchema>

/////////////////////////////////////////
// RESIDENCE TYPE SCHEMA
/////////////////////////////////////////

export const ResidenceTypeSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  community_id: z.string(),
})

export type ResidenceType = z.infer<typeof ResidenceTypeSchema>

/////////////////////////////////////////
// PROVIDER SCHEMA
/////////////////////////////////////////

export const ProviderSchema = z.object({
  id: z.string(),
  title: z.string(),
  contactName: z.string(),
  description: z.string(),
  phone: z.string(),
  email: z.string().nullable(),
  address: z.string().nullable(),
  website: z.string().nullable(),
  active: z.boolean(),
  community_id: z.string(),
})

export type Provider = z.infer<typeof ProviderSchema>

/////////////////////////////////////////
// ROLE SCHEMA
/////////////////////////////////////////

export const RoleSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  modules: z.string(),
})

export type Role = z.infer<typeof RoleSchema>

/////////////////////////////////////////
// EXPENSE SCHEMA
/////////////////////////////////////////

export const ExpenseSchema = z.object({
  id: z.string(),
  title: z.string(),
  residence_id: z.string(),
  emitingDate: z.coerce.date(),
  expireDate: z.coerce.date(),
  status: z.string(),
  expenseType_id: z.number().int(),
  payment_id: z.string(),
})

export type Expense = z.infer<typeof ExpenseSchema>

/////////////////////////////////////////
// PAYMENT SCHEMA
/////////////////////////////////////////

export const PaymentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  registerDate: z.coerce.date(),
  amount: z.instanceof(Prisma.Decimal, { message: "Field 'amount' must be a Decimal. Location: ['Models', 'Payment']"}),
  owner_id: z.string(),
  voucherImage: z.string(),
  isEmailSend: z.boolean(),
  account_id: z.string(),
  created_by: z.string(),
})

export type Payment = z.infer<typeof PaymentSchema>

/////////////////////////////////////////
// CASHOUT SCHEMA
/////////////////////////////////////////

export const CashoutSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  provider_id: z.string(),
  amount: z.instanceof(Prisma.Decimal, { message: "Field 'amount' must be a Decimal. Location: ['Models', 'Cashout']"}),
  billImage: z.string(),
  account_id: z.string(),
  status: z.string(),
  registerDate: z.coerce.date(),
})

export type Cashout = z.infer<typeof CashoutSchema>

/////////////////////////////////////////
// EXPENSE TYPE SCHEMA
/////////////////////////////////////////

export const ExpenseTypeSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  value: z.number().int(),
  residenceType_id: z.number().int(),
})

export type ExpenseType = z.infer<typeof ExpenseTypeSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  active: z.boolean(),
  community_id: z.string(),
  balance: z.bigint(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// COMMUNITY
//------------------------------------------------------

export const CommunityIncludeSchema: z.ZodType<Prisma.CommunityInclude> = z.object({
  Residence: z.union([z.boolean(),z.lazy(() => ResidenceFindManyArgsSchema)]).optional(),
  Provider: z.union([z.boolean(),z.lazy(() => ProviderFindManyArgsSchema)]).optional(),
  User: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  Account: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  ResidenceType: z.union([z.boolean(),z.lazy(() => ResidenceTypeFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CommunityCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CommunityArgsSchema: z.ZodType<Prisma.CommunityDefaultArgs> = z.object({
  select: z.lazy(() => CommunitySelectSchema).optional(),
  include: z.lazy(() => CommunityIncludeSchema).optional(),
}).strict();

export const CommunityCountOutputTypeArgsSchema: z.ZodType<Prisma.CommunityCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CommunityCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CommunityCountOutputTypeSelectSchema: z.ZodType<Prisma.CommunityCountOutputTypeSelect> = z.object({
  Residence: z.boolean().optional(),
  Provider: z.boolean().optional(),
  User: z.boolean().optional(),
  Account: z.boolean().optional(),
  ResidenceType: z.boolean().optional(),
}).strict();

export const CommunitySelectSchema: z.ZodType<Prisma.CommunitySelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  address: z.boolean().optional(),
  Residence: z.union([z.boolean(),z.lazy(() => ResidenceFindManyArgsSchema)]).optional(),
  Provider: z.union([z.boolean(),z.lazy(() => ProviderFindManyArgsSchema)]).optional(),
  User: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  Account: z.union([z.boolean(),z.lazy(() => AccountFindManyArgsSchema)]).optional(),
  ResidenceType: z.union([z.boolean(),z.lazy(() => ResidenceTypeFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CommunityCountOutputTypeArgsSchema)]).optional(),
}).strict()

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  Community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  Role: z.union([z.boolean(),z.lazy(() => RoleArgsSchema)]).optional(),
  paymentsCreated: z.union([z.boolean(),z.lazy(() => PaymentFindManyArgsSchema)]).optional(),
  paymentsMade: z.union([z.boolean(),z.lazy(() => PaymentFindManyArgsSchema)]).optional(),
  Residence: z.union([z.boolean(),z.lazy(() => ResidenceFindManyArgsSchema)]).optional(),
  ResidentIn: z.union([z.boolean(),z.lazy(() => ResidenceArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  paymentsCreated: z.boolean().optional(),
  paymentsMade: z.boolean().optional(),
  Residence: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  userName: z.boolean().optional(),
  email: z.boolean().optional(),
  password: z.boolean().optional(),
  identification: z.boolean().optional(),
  firstName: z.boolean().optional(),
  lastName: z.boolean().optional(),
  phone: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  community_id: z.boolean().optional(),
  role_id: z.boolean().optional(),
  residence_id: z.boolean().optional(),
  Community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  Role: z.union([z.boolean(),z.lazy(() => RoleArgsSchema)]).optional(),
  paymentsCreated: z.union([z.boolean(),z.lazy(() => PaymentFindManyArgsSchema)]).optional(),
  paymentsMade: z.union([z.boolean(),z.lazy(() => PaymentFindManyArgsSchema)]).optional(),
  Residence: z.union([z.boolean(),z.lazy(() => ResidenceFindManyArgsSchema)]).optional(),
  ResidentIn: z.union([z.boolean(),z.lazy(() => ResidenceArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// RESIDENCE
//------------------------------------------------------

export const ResidenceIncludeSchema: z.ZodType<Prisma.ResidenceInclude> = z.object({
  Owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  Community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  ResidenceType: z.union([z.boolean(),z.lazy(() => ResidenceTypeArgsSchema)]).optional(),
  ParkingSlot: z.union([z.boolean(),z.lazy(() => ParkingSlotFindManyArgsSchema)]).optional(),
  Expense: z.union([z.boolean(),z.lazy(() => ExpenseFindManyArgsSchema)]).optional(),
  Resident: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ResidenceCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ResidenceArgsSchema: z.ZodType<Prisma.ResidenceDefaultArgs> = z.object({
  select: z.lazy(() => ResidenceSelectSchema).optional(),
  include: z.lazy(() => ResidenceIncludeSchema).optional(),
}).strict();

export const ResidenceCountOutputTypeArgsSchema: z.ZodType<Prisma.ResidenceCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ResidenceCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ResidenceCountOutputTypeSelectSchema: z.ZodType<Prisma.ResidenceCountOutputTypeSelect> = z.object({
  ParkingSlot: z.boolean().optional(),
  Expense: z.boolean().optional(),
  Resident: z.boolean().optional(),
}).strict();

export const ResidenceSelectSchema: z.ZodType<Prisma.ResidenceSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  owner_id: z.boolean().optional(),
  community_id: z.boolean().optional(),
  contacts: z.boolean().optional(),
  residenceType_id: z.boolean().optional(),
  Owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  Community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  ResidenceType: z.union([z.boolean(),z.lazy(() => ResidenceTypeArgsSchema)]).optional(),
  ParkingSlot: z.union([z.boolean(),z.lazy(() => ParkingSlotFindManyArgsSchema)]).optional(),
  Expense: z.union([z.boolean(),z.lazy(() => ExpenseFindManyArgsSchema)]).optional(),
  Resident: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ResidenceCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PARKING SLOT
//------------------------------------------------------

export const ParkingSlotIncludeSchema: z.ZodType<Prisma.ParkingSlotInclude> = z.object({
  Residence: z.union([z.boolean(),z.lazy(() => ResidenceArgsSchema)]).optional(),
}).strict()

export const ParkingSlotArgsSchema: z.ZodType<Prisma.ParkingSlotDefaultArgs> = z.object({
  select: z.lazy(() => ParkingSlotSelectSchema).optional(),
  include: z.lazy(() => ParkingSlotIncludeSchema).optional(),
}).strict();

export const ParkingSlotSelectSchema: z.ZodType<Prisma.ParkingSlotSelect> = z.object({
  id: z.boolean().optional(),
  number: z.boolean().optional(),
  residence_id: z.boolean().optional(),
  Residence: z.union([z.boolean(),z.lazy(() => ResidenceArgsSchema)]).optional(),
}).strict()

// RESIDENCE TYPE
//------------------------------------------------------

export const ResidenceTypeIncludeSchema: z.ZodType<Prisma.ResidenceTypeInclude> = z.object({
  Residence: z.union([z.boolean(),z.lazy(() => ResidenceFindManyArgsSchema)]).optional(),
  ExpenseType: z.union([z.boolean(),z.lazy(() => ExpenseTypeFindManyArgsSchema)]).optional(),
  Community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ResidenceTypeCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ResidenceTypeArgsSchema: z.ZodType<Prisma.ResidenceTypeDefaultArgs> = z.object({
  select: z.lazy(() => ResidenceTypeSelectSchema).optional(),
  include: z.lazy(() => ResidenceTypeIncludeSchema).optional(),
}).strict();

export const ResidenceTypeCountOutputTypeArgsSchema: z.ZodType<Prisma.ResidenceTypeCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ResidenceTypeCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ResidenceTypeCountOutputTypeSelectSchema: z.ZodType<Prisma.ResidenceTypeCountOutputTypeSelect> = z.object({
  Residence: z.boolean().optional(),
  ExpenseType: z.boolean().optional(),
}).strict();

export const ResidenceTypeSelectSchema: z.ZodType<Prisma.ResidenceTypeSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  community_id: z.boolean().optional(),
  Residence: z.union([z.boolean(),z.lazy(() => ResidenceFindManyArgsSchema)]).optional(),
  ExpenseType: z.union([z.boolean(),z.lazy(() => ExpenseTypeFindManyArgsSchema)]).optional(),
  Community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ResidenceTypeCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PROVIDER
//------------------------------------------------------

export const ProviderIncludeSchema: z.ZodType<Prisma.ProviderInclude> = z.object({
  Community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  Cashout: z.union([z.boolean(),z.lazy(() => CashoutFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProviderCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ProviderArgsSchema: z.ZodType<Prisma.ProviderDefaultArgs> = z.object({
  select: z.lazy(() => ProviderSelectSchema).optional(),
  include: z.lazy(() => ProviderIncludeSchema).optional(),
}).strict();

export const ProviderCountOutputTypeArgsSchema: z.ZodType<Prisma.ProviderCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ProviderCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ProviderCountOutputTypeSelectSchema: z.ZodType<Prisma.ProviderCountOutputTypeSelect> = z.object({
  Cashout: z.boolean().optional(),
}).strict();

export const ProviderSelectSchema: z.ZodType<Prisma.ProviderSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  contactName: z.boolean().optional(),
  description: z.boolean().optional(),
  phone: z.boolean().optional(),
  email: z.boolean().optional(),
  address: z.boolean().optional(),
  website: z.boolean().optional(),
  active: z.boolean().optional(),
  community_id: z.boolean().optional(),
  Community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  Cashout: z.union([z.boolean(),z.lazy(() => CashoutFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProviderCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ROLE
//------------------------------------------------------

export const RoleIncludeSchema: z.ZodType<Prisma.RoleInclude> = z.object({
  User: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RoleCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const RoleArgsSchema: z.ZodType<Prisma.RoleDefaultArgs> = z.object({
  select: z.lazy(() => RoleSelectSchema).optional(),
  include: z.lazy(() => RoleIncludeSchema).optional(),
}).strict();

export const RoleCountOutputTypeArgsSchema: z.ZodType<Prisma.RoleCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => RoleCountOutputTypeSelectSchema).nullish(),
}).strict();

export const RoleCountOutputTypeSelectSchema: z.ZodType<Prisma.RoleCountOutputTypeSelect> = z.object({
  User: z.boolean().optional(),
}).strict();

export const RoleSelectSchema: z.ZodType<Prisma.RoleSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  modules: z.boolean().optional(),
  User: z.union([z.boolean(),z.lazy(() => UserFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RoleCountOutputTypeArgsSchema)]).optional(),
}).strict()

// EXPENSE
//------------------------------------------------------

export const ExpenseIncludeSchema: z.ZodType<Prisma.ExpenseInclude> = z.object({
  Residence: z.union([z.boolean(),z.lazy(() => ResidenceArgsSchema)]).optional(),
  ExpenseType: z.union([z.boolean(),z.lazy(() => ExpenseTypeArgsSchema)]).optional(),
  Payment: z.union([z.boolean(),z.lazy(() => PaymentArgsSchema)]).optional(),
}).strict()

export const ExpenseArgsSchema: z.ZodType<Prisma.ExpenseDefaultArgs> = z.object({
  select: z.lazy(() => ExpenseSelectSchema).optional(),
  include: z.lazy(() => ExpenseIncludeSchema).optional(),
}).strict();

export const ExpenseSelectSchema: z.ZodType<Prisma.ExpenseSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  residence_id: z.boolean().optional(),
  emitingDate: z.boolean().optional(),
  expireDate: z.boolean().optional(),
  status: z.boolean().optional(),
  expenseType_id: z.boolean().optional(),
  payment_id: z.boolean().optional(),
  Residence: z.union([z.boolean(),z.lazy(() => ResidenceArgsSchema)]).optional(),
  ExpenseType: z.union([z.boolean(),z.lazy(() => ExpenseTypeArgsSchema)]).optional(),
  Payment: z.union([z.boolean(),z.lazy(() => PaymentArgsSchema)]).optional(),
}).strict()

// PAYMENT
//------------------------------------------------------

export const PaymentIncludeSchema: z.ZodType<Prisma.PaymentInclude> = z.object({
  Expense: z.union([z.boolean(),z.lazy(() => ExpenseFindManyArgsSchema)]).optional(),
  User: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  Account: z.union([z.boolean(),z.lazy(() => AccountArgsSchema)]).optional(),
  Admin: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PaymentCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PaymentArgsSchema: z.ZodType<Prisma.PaymentDefaultArgs> = z.object({
  select: z.lazy(() => PaymentSelectSchema).optional(),
  include: z.lazy(() => PaymentIncludeSchema).optional(),
}).strict();

export const PaymentCountOutputTypeArgsSchema: z.ZodType<Prisma.PaymentCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PaymentCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PaymentCountOutputTypeSelectSchema: z.ZodType<Prisma.PaymentCountOutputTypeSelect> = z.object({
  Expense: z.boolean().optional(),
}).strict();

export const PaymentSelectSchema: z.ZodType<Prisma.PaymentSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  registerDate: z.boolean().optional(),
  amount: z.boolean().optional(),
  owner_id: z.boolean().optional(),
  voucherImage: z.boolean().optional(),
  isEmailSend: z.boolean().optional(),
  account_id: z.boolean().optional(),
  created_by: z.boolean().optional(),
  Expense: z.union([z.boolean(),z.lazy(() => ExpenseFindManyArgsSchema)]).optional(),
  User: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  Account: z.union([z.boolean(),z.lazy(() => AccountArgsSchema)]).optional(),
  Admin: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PaymentCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CASHOUT
//------------------------------------------------------

export const CashoutIncludeSchema: z.ZodType<Prisma.CashoutInclude> = z.object({
  Provider: z.union([z.boolean(),z.lazy(() => ProviderArgsSchema)]).optional(),
  Account: z.union([z.boolean(),z.lazy(() => AccountArgsSchema)]).optional(),
}).strict()

export const CashoutArgsSchema: z.ZodType<Prisma.CashoutDefaultArgs> = z.object({
  select: z.lazy(() => CashoutSelectSchema).optional(),
  include: z.lazy(() => CashoutIncludeSchema).optional(),
}).strict();

export const CashoutSelectSchema: z.ZodType<Prisma.CashoutSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  provider_id: z.boolean().optional(),
  amount: z.boolean().optional(),
  billImage: z.boolean().optional(),
  account_id: z.boolean().optional(),
  status: z.boolean().optional(),
  registerDate: z.boolean().optional(),
  Provider: z.union([z.boolean(),z.lazy(() => ProviderArgsSchema)]).optional(),
  Account: z.union([z.boolean(),z.lazy(() => AccountArgsSchema)]).optional(),
}).strict()

// EXPENSE TYPE
//------------------------------------------------------

export const ExpenseTypeIncludeSchema: z.ZodType<Prisma.ExpenseTypeInclude> = z.object({
  ResidenceType: z.union([z.boolean(),z.lazy(() => ResidenceTypeArgsSchema)]).optional(),
  Expense: z.union([z.boolean(),z.lazy(() => ExpenseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ExpenseTypeCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ExpenseTypeArgsSchema: z.ZodType<Prisma.ExpenseTypeDefaultArgs> = z.object({
  select: z.lazy(() => ExpenseTypeSelectSchema).optional(),
  include: z.lazy(() => ExpenseTypeIncludeSchema).optional(),
}).strict();

export const ExpenseTypeCountOutputTypeArgsSchema: z.ZodType<Prisma.ExpenseTypeCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ExpenseTypeCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ExpenseTypeCountOutputTypeSelectSchema: z.ZodType<Prisma.ExpenseTypeCountOutputTypeSelect> = z.object({
  Expense: z.boolean().optional(),
}).strict();

export const ExpenseTypeSelectSchema: z.ZodType<Prisma.ExpenseTypeSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  value: z.boolean().optional(),
  residenceType_id: z.boolean().optional(),
  ResidenceType: z.union([z.boolean(),z.lazy(() => ResidenceTypeArgsSchema)]).optional(),
  Expense: z.union([z.boolean(),z.lazy(() => ExpenseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ExpenseTypeCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ACCOUNT
//------------------------------------------------------

export const AccountIncludeSchema: z.ZodType<Prisma.AccountInclude> = z.object({
  Community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  Payment: z.union([z.boolean(),z.lazy(() => PaymentFindManyArgsSchema)]).optional(),
  Cashout: z.union([z.boolean(),z.lazy(() => CashoutFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AccountCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const AccountArgsSchema: z.ZodType<Prisma.AccountDefaultArgs> = z.object({
  select: z.lazy(() => AccountSelectSchema).optional(),
  include: z.lazy(() => AccountIncludeSchema).optional(),
}).strict();

export const AccountCountOutputTypeArgsSchema: z.ZodType<Prisma.AccountCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => AccountCountOutputTypeSelectSchema).nullish(),
}).strict();

export const AccountCountOutputTypeSelectSchema: z.ZodType<Prisma.AccountCountOutputTypeSelect> = z.object({
  Payment: z.boolean().optional(),
  Cashout: z.boolean().optional(),
}).strict();

export const AccountSelectSchema: z.ZodType<Prisma.AccountSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  active: z.boolean().optional(),
  community_id: z.boolean().optional(),
  balance: z.boolean().optional(),
  Community: z.union([z.boolean(),z.lazy(() => CommunityArgsSchema)]).optional(),
  Payment: z.union([z.boolean(),z.lazy(() => PaymentFindManyArgsSchema)]).optional(),
  Cashout: z.union([z.boolean(),z.lazy(() => CashoutFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AccountCountOutputTypeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const CommunityWhereInputSchema: z.ZodType<Prisma.CommunityWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CommunityWhereInputSchema),z.lazy(() => CommunityWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CommunityWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CommunityWhereInputSchema),z.lazy(() => CommunityWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Residence: z.lazy(() => ResidenceListRelationFilterSchema).optional(),
  Provider: z.lazy(() => ProviderListRelationFilterSchema).optional(),
  User: z.lazy(() => UserListRelationFilterSchema).optional(),
  Account: z.lazy(() => AccountListRelationFilterSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeListRelationFilterSchema).optional()
}).strict();

export const CommunityOrderByWithRelationInputSchema: z.ZodType<Prisma.CommunityOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  Residence: z.lazy(() => ResidenceOrderByRelationAggregateInputSchema).optional(),
  Provider: z.lazy(() => ProviderOrderByRelationAggregateInputSchema).optional(),
  User: z.lazy(() => UserOrderByRelationAggregateInputSchema).optional(),
  Account: z.lazy(() => AccountOrderByRelationAggregateInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CommunityWhereUniqueInputSchema: z.ZodType<Prisma.CommunityWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => CommunityWhereInputSchema),z.lazy(() => CommunityWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CommunityWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CommunityWhereInputSchema),z.lazy(() => CommunityWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Residence: z.lazy(() => ResidenceListRelationFilterSchema).optional(),
  Provider: z.lazy(() => ProviderListRelationFilterSchema).optional(),
  User: z.lazy(() => UserListRelationFilterSchema).optional(),
  Account: z.lazy(() => AccountListRelationFilterSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeListRelationFilterSchema).optional()
}).strict());

export const CommunityOrderByWithAggregationInputSchema: z.ZodType<Prisma.CommunityOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CommunityCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CommunityMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CommunityMinOrderByAggregateInputSchema).optional()
}).strict();

export const CommunityScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CommunityScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CommunityScalarWhereWithAggregatesInputSchema),z.lazy(() => CommunityScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CommunityScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CommunityScalarWhereWithAggregatesInputSchema),z.lazy(() => CommunityScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  address: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  identification: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isVerified: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  isActive: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  community_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  residence_id: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  Community: z.union([ z.lazy(() => CommunityRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
  Role: z.union([ z.lazy(() => RoleNullableRelationFilterSchema),z.lazy(() => RoleWhereInputSchema) ]).optional().nullable(),
  paymentsCreated: z.lazy(() => PaymentListRelationFilterSchema).optional(),
  paymentsMade: z.lazy(() => PaymentListRelationFilterSchema).optional(),
  Residence: z.lazy(() => ResidenceListRelationFilterSchema).optional(),
  ResidentIn: z.union([ z.lazy(() => ResidenceNullableRelationFilterSchema),z.lazy(() => ResidenceWhereInputSchema) ]).optional().nullable(),
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  identification: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  isVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  isActive: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  role_id: z.lazy(() => SortOrderSchema).optional(),
  residence_id: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  Community: z.lazy(() => CommunityOrderByWithRelationInputSchema).optional(),
  Role: z.lazy(() => RoleOrderByWithRelationInputSchema).optional(),
  paymentsCreated: z.lazy(() => PaymentOrderByRelationAggregateInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentOrderByRelationAggregateInputSchema).optional(),
  Residence: z.lazy(() => ResidenceOrderByRelationAggregateInputSchema).optional(),
  ResidentIn: z.lazy(() => ResidenceOrderByWithRelationInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    email: z.string()
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  userName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  identification: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isVerified: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  isActive: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  community_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  residence_id: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  Community: z.union([ z.lazy(() => CommunityRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
  Role: z.union([ z.lazy(() => RoleNullableRelationFilterSchema),z.lazy(() => RoleWhereInputSchema) ]).optional().nullable(),
  paymentsCreated: z.lazy(() => PaymentListRelationFilterSchema).optional(),
  paymentsMade: z.lazy(() => PaymentListRelationFilterSchema).optional(),
  Residence: z.lazy(() => ResidenceListRelationFilterSchema).optional(),
  ResidentIn: z.union([ z.lazy(() => ResidenceNullableRelationFilterSchema),z.lazy(() => ResidenceWhereInputSchema) ]).optional().nullable(),
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  identification: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  isVerified: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  isActive: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  role_id: z.lazy(() => SortOrderSchema).optional(),
  residence_id: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  identification: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  isVerified: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
  isActive: z.union([ z.lazy(() => BoolNullableWithAggregatesFilterSchema),z.boolean() ]).optional().nullable(),
  community_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  role_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  residence_id: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const ResidenceWhereInputSchema: z.ZodType<Prisma.ResidenceWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ResidenceWhereInputSchema),z.lazy(() => ResidenceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResidenceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResidenceWhereInputSchema),z.lazy(() => ResidenceWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  owner_id: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  community_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contacts: z.lazy(() => JsonNullableFilterSchema).optional(),
  residenceType_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  Owner: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  Community: z.union([ z.lazy(() => CommunityRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
  ResidenceType: z.union([ z.lazy(() => ResidenceTypeRelationFilterSchema),z.lazy(() => ResidenceTypeWhereInputSchema) ]).optional(),
  ParkingSlot: z.lazy(() => ParkingSlotListRelationFilterSchema).optional(),
  Expense: z.lazy(() => ExpenseListRelationFilterSchema).optional(),
  Resident: z.lazy(() => UserListRelationFilterSchema).optional()
}).strict();

export const ResidenceOrderByWithRelationInputSchema: z.ZodType<Prisma.ResidenceOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  owner_id: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  contacts: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  residenceType_id: z.lazy(() => SortOrderSchema).optional(),
  Owner: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  Community: z.lazy(() => CommunityOrderByWithRelationInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeOrderByWithRelationInputSchema).optional(),
  ParkingSlot: z.lazy(() => ParkingSlotOrderByRelationAggregateInputSchema).optional(),
  Expense: z.lazy(() => ExpenseOrderByRelationAggregateInputSchema).optional(),
  Resident: z.lazy(() => UserOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ResidenceWhereUniqueInputSchema: z.ZodType<Prisma.ResidenceWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ResidenceWhereInputSchema),z.lazy(() => ResidenceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResidenceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResidenceWhereInputSchema),z.lazy(() => ResidenceWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  owner_id: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  community_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contacts: z.lazy(() => JsonNullableFilterSchema).optional(),
  residenceType_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  Owner: z.union([ z.lazy(() => UserNullableRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
  Community: z.union([ z.lazy(() => CommunityRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
  ResidenceType: z.union([ z.lazy(() => ResidenceTypeRelationFilterSchema),z.lazy(() => ResidenceTypeWhereInputSchema) ]).optional(),
  ParkingSlot: z.lazy(() => ParkingSlotListRelationFilterSchema).optional(),
  Expense: z.lazy(() => ExpenseListRelationFilterSchema).optional(),
  Resident: z.lazy(() => UserListRelationFilterSchema).optional()
}).strict());

export const ResidenceOrderByWithAggregationInputSchema: z.ZodType<Prisma.ResidenceOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  owner_id: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  contacts: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  residenceType_id: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ResidenceCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ResidenceAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ResidenceMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ResidenceMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ResidenceSumOrderByAggregateInputSchema).optional()
}).strict();

export const ResidenceScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ResidenceScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ResidenceScalarWhereWithAggregatesInputSchema),z.lazy(() => ResidenceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResidenceScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResidenceScalarWhereWithAggregatesInputSchema),z.lazy(() => ResidenceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  owner_id: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  community_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  contacts: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  residenceType_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const ParkingSlotWhereInputSchema: z.ZodType<Prisma.ParkingSlotWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ParkingSlotWhereInputSchema),z.lazy(() => ParkingSlotWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ParkingSlotWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ParkingSlotWhereInputSchema),z.lazy(() => ParkingSlotWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  number: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  residence_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Residence: z.union([ z.lazy(() => ResidenceRelationFilterSchema),z.lazy(() => ResidenceWhereInputSchema) ]).optional(),
}).strict();

export const ParkingSlotOrderByWithRelationInputSchema: z.ZodType<Prisma.ParkingSlotOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  residence_id: z.lazy(() => SortOrderSchema).optional(),
  Residence: z.lazy(() => ResidenceOrderByWithRelationInputSchema).optional()
}).strict();

export const ParkingSlotWhereUniqueInputSchema: z.ZodType<Prisma.ParkingSlotWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ParkingSlotWhereInputSchema),z.lazy(() => ParkingSlotWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ParkingSlotWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ParkingSlotWhereInputSchema),z.lazy(() => ParkingSlotWhereInputSchema).array() ]).optional(),
  number: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  residence_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Residence: z.union([ z.lazy(() => ResidenceRelationFilterSchema),z.lazy(() => ResidenceWhereInputSchema) ]).optional(),
}).strict());

export const ParkingSlotOrderByWithAggregationInputSchema: z.ZodType<Prisma.ParkingSlotOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  residence_id: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ParkingSlotCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ParkingSlotAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ParkingSlotMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ParkingSlotMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ParkingSlotSumOrderByAggregateInputSchema).optional()
}).strict();

export const ParkingSlotScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ParkingSlotScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ParkingSlotScalarWhereWithAggregatesInputSchema),z.lazy(() => ParkingSlotScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ParkingSlotScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ParkingSlotScalarWhereWithAggregatesInputSchema),z.lazy(() => ParkingSlotScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  number: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  residence_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const ResidenceTypeWhereInputSchema: z.ZodType<Prisma.ResidenceTypeWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ResidenceTypeWhereInputSchema),z.lazy(() => ResidenceTypeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResidenceTypeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResidenceTypeWhereInputSchema),z.lazy(() => ResidenceTypeWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  community_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Residence: z.lazy(() => ResidenceListRelationFilterSchema).optional(),
  ExpenseType: z.lazy(() => ExpenseTypeListRelationFilterSchema).optional(),
  Community: z.union([ z.lazy(() => CommunityRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
}).strict();

export const ResidenceTypeOrderByWithRelationInputSchema: z.ZodType<Prisma.ResidenceTypeOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  Residence: z.lazy(() => ResidenceOrderByRelationAggregateInputSchema).optional(),
  ExpenseType: z.lazy(() => ExpenseTypeOrderByRelationAggregateInputSchema).optional(),
  Community: z.lazy(() => CommunityOrderByWithRelationInputSchema).optional()
}).strict();

export const ResidenceTypeWhereUniqueInputSchema: z.ZodType<Prisma.ResidenceTypeWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ResidenceTypeWhereInputSchema),z.lazy(() => ResidenceTypeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResidenceTypeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResidenceTypeWhereInputSchema),z.lazy(() => ResidenceTypeWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  community_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Residence: z.lazy(() => ResidenceListRelationFilterSchema).optional(),
  ExpenseType: z.lazy(() => ExpenseTypeListRelationFilterSchema).optional(),
  Community: z.union([ z.lazy(() => CommunityRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
}).strict());

export const ResidenceTypeOrderByWithAggregationInputSchema: z.ZodType<Prisma.ResidenceTypeOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ResidenceTypeCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ResidenceTypeAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ResidenceTypeMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ResidenceTypeMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ResidenceTypeSumOrderByAggregateInputSchema).optional()
}).strict();

export const ResidenceTypeScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ResidenceTypeScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ResidenceTypeScalarWhereWithAggregatesInputSchema),z.lazy(() => ResidenceTypeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResidenceTypeScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResidenceTypeScalarWhereWithAggregatesInputSchema),z.lazy(() => ResidenceTypeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  community_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const ProviderWhereInputSchema: z.ZodType<Prisma.ProviderWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProviderWhereInputSchema),z.lazy(() => ProviderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProviderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProviderWhereInputSchema),z.lazy(() => ProviderWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contactName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  website: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  community_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Community: z.union([ z.lazy(() => CommunityRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
  Cashout: z.lazy(() => CashoutListRelationFilterSchema).optional()
}).strict();

export const ProviderOrderByWithRelationInputSchema: z.ZodType<Prisma.ProviderOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  contactName: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  website: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  Community: z.lazy(() => CommunityOrderByWithRelationInputSchema).optional(),
  Cashout: z.lazy(() => CashoutOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ProviderWhereUniqueInputSchema: z.ZodType<Prisma.ProviderWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ProviderWhereInputSchema),z.lazy(() => ProviderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProviderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProviderWhereInputSchema),z.lazy(() => ProviderWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contactName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  website: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  community_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Community: z.union([ z.lazy(() => CommunityRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
  Cashout: z.lazy(() => CashoutListRelationFilterSchema).optional()
}).strict());

export const ProviderOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProviderOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  contactName: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  website: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProviderCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProviderMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProviderMinOrderByAggregateInputSchema).optional()
}).strict();

export const ProviderScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProviderScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProviderScalarWhereWithAggregatesInputSchema),z.lazy(() => ProviderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProviderScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProviderScalarWhereWithAggregatesInputSchema),z.lazy(() => ProviderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  contactName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  website: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  active: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  community_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const RoleWhereInputSchema: z.ZodType<Prisma.RoleWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RoleWhereInputSchema),z.lazy(() => RoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoleWhereInputSchema),z.lazy(() => RoleWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  modules: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  User: z.lazy(() => UserListRelationFilterSchema).optional()
}).strict();

export const RoleOrderByWithRelationInputSchema: z.ZodType<Prisma.RoleOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  modules: z.lazy(() => SortOrderSchema).optional(),
  User: z.lazy(() => UserOrderByRelationAggregateInputSchema).optional()
}).strict();

export const RoleWhereUniqueInputSchema: z.ZodType<Prisma.RoleWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => RoleWhereInputSchema),z.lazy(() => RoleWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoleWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoleWhereInputSchema),z.lazy(() => RoleWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  modules: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  User: z.lazy(() => UserListRelationFilterSchema).optional()
}).strict());

export const RoleOrderByWithAggregationInputSchema: z.ZodType<Prisma.RoleOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  modules: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => RoleCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => RoleAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RoleMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RoleMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => RoleSumOrderByAggregateInputSchema).optional()
}).strict();

export const RoleScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RoleScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RoleScalarWhereWithAggregatesInputSchema),z.lazy(() => RoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RoleScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RoleScalarWhereWithAggregatesInputSchema),z.lazy(() => RoleScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  modules: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const ExpenseWhereInputSchema: z.ZodType<Prisma.ExpenseWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ExpenseWhereInputSchema),z.lazy(() => ExpenseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExpenseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExpenseWhereInputSchema),z.lazy(() => ExpenseWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  residence_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  emitingDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  expireDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expenseType_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  payment_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Residence: z.union([ z.lazy(() => ResidenceRelationFilterSchema),z.lazy(() => ResidenceWhereInputSchema) ]).optional(),
  ExpenseType: z.union([ z.lazy(() => ExpenseTypeRelationFilterSchema),z.lazy(() => ExpenseTypeWhereInputSchema) ]).optional(),
  Payment: z.union([ z.lazy(() => PaymentRelationFilterSchema),z.lazy(() => PaymentWhereInputSchema) ]).optional(),
}).strict();

export const ExpenseOrderByWithRelationInputSchema: z.ZodType<Prisma.ExpenseOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  residence_id: z.lazy(() => SortOrderSchema).optional(),
  emitingDate: z.lazy(() => SortOrderSchema).optional(),
  expireDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  expenseType_id: z.lazy(() => SortOrderSchema).optional(),
  payment_id: z.lazy(() => SortOrderSchema).optional(),
  Residence: z.lazy(() => ResidenceOrderByWithRelationInputSchema).optional(),
  ExpenseType: z.lazy(() => ExpenseTypeOrderByWithRelationInputSchema).optional(),
  Payment: z.lazy(() => PaymentOrderByWithRelationInputSchema).optional()
}).strict();

export const ExpenseWhereUniqueInputSchema: z.ZodType<Prisma.ExpenseWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ExpenseWhereInputSchema),z.lazy(() => ExpenseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExpenseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExpenseWhereInputSchema),z.lazy(() => ExpenseWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  residence_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  emitingDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  expireDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expenseType_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  payment_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Residence: z.union([ z.lazy(() => ResidenceRelationFilterSchema),z.lazy(() => ResidenceWhereInputSchema) ]).optional(),
  ExpenseType: z.union([ z.lazy(() => ExpenseTypeRelationFilterSchema),z.lazy(() => ExpenseTypeWhereInputSchema) ]).optional(),
  Payment: z.union([ z.lazy(() => PaymentRelationFilterSchema),z.lazy(() => PaymentWhereInputSchema) ]).optional(),
}).strict());

export const ExpenseOrderByWithAggregationInputSchema: z.ZodType<Prisma.ExpenseOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  residence_id: z.lazy(() => SortOrderSchema).optional(),
  emitingDate: z.lazy(() => SortOrderSchema).optional(),
  expireDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  expenseType_id: z.lazy(() => SortOrderSchema).optional(),
  payment_id: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ExpenseCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ExpenseAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ExpenseMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ExpenseMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ExpenseSumOrderByAggregateInputSchema).optional()
}).strict();

export const ExpenseScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ExpenseScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ExpenseScalarWhereWithAggregatesInputSchema),z.lazy(() => ExpenseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExpenseScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExpenseScalarWhereWithAggregatesInputSchema),z.lazy(() => ExpenseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  residence_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  emitingDate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  expireDate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  expenseType_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  payment_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const PaymentWhereInputSchema: z.ZodType<Prisma.PaymentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PaymentWhereInputSchema),z.lazy(() => PaymentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentWhereInputSchema),z.lazy(() => PaymentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  registerDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  amount: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  owner_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  voucherImage: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isEmailSend: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  account_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created_by: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Expense: z.lazy(() => ExpenseListRelationFilterSchema).optional(),
  User: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  Account: z.union([ z.lazy(() => AccountRelationFilterSchema),z.lazy(() => AccountWhereInputSchema) ]).optional(),
  Admin: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const PaymentOrderByWithRelationInputSchema: z.ZodType<Prisma.PaymentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  registerDate: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  owner_id: z.lazy(() => SortOrderSchema).optional(),
  voucherImage: z.lazy(() => SortOrderSchema).optional(),
  isEmailSend: z.lazy(() => SortOrderSchema).optional(),
  account_id: z.lazy(() => SortOrderSchema).optional(),
  created_by: z.lazy(() => SortOrderSchema).optional(),
  Expense: z.lazy(() => ExpenseOrderByRelationAggregateInputSchema).optional(),
  User: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  Account: z.lazy(() => AccountOrderByWithRelationInputSchema).optional(),
  Admin: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const PaymentWhereUniqueInputSchema: z.ZodType<Prisma.PaymentWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => PaymentWhereInputSchema),z.lazy(() => PaymentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentWhereInputSchema),z.lazy(() => PaymentWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  registerDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  amount: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  owner_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  voucherImage: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isEmailSend: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  account_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created_by: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  Expense: z.lazy(() => ExpenseListRelationFilterSchema).optional(),
  User: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  Account: z.union([ z.lazy(() => AccountRelationFilterSchema),z.lazy(() => AccountWhereInputSchema) ]).optional(),
  Admin: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const PaymentOrderByWithAggregationInputSchema: z.ZodType<Prisma.PaymentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  registerDate: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  owner_id: z.lazy(() => SortOrderSchema).optional(),
  voucherImage: z.lazy(() => SortOrderSchema).optional(),
  isEmailSend: z.lazy(() => SortOrderSchema).optional(),
  account_id: z.lazy(() => SortOrderSchema).optional(),
  created_by: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PaymentCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PaymentAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PaymentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PaymentMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PaymentSumOrderByAggregateInputSchema).optional()
}).strict();

export const PaymentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PaymentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema),z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema),z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  registerDate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  amount: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  owner_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  voucherImage: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  isEmailSend: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  account_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  created_by: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const CashoutWhereInputSchema: z.ZodType<Prisma.CashoutWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CashoutWhereInputSchema),z.lazy(() => CashoutWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CashoutWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CashoutWhereInputSchema),z.lazy(() => CashoutWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  amount: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  billImage: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  account_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  registerDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Provider: z.union([ z.lazy(() => ProviderRelationFilterSchema),z.lazy(() => ProviderWhereInputSchema) ]).optional(),
  Account: z.union([ z.lazy(() => AccountRelationFilterSchema),z.lazy(() => AccountWhereInputSchema) ]).optional(),
}).strict();

export const CashoutOrderByWithRelationInputSchema: z.ZodType<Prisma.CashoutOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  provider_id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  billImage: z.lazy(() => SortOrderSchema).optional(),
  account_id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  registerDate: z.lazy(() => SortOrderSchema).optional(),
  Provider: z.lazy(() => ProviderOrderByWithRelationInputSchema).optional(),
  Account: z.lazy(() => AccountOrderByWithRelationInputSchema).optional()
}).strict();

export const CashoutWhereUniqueInputSchema: z.ZodType<Prisma.CashoutWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => CashoutWhereInputSchema),z.lazy(() => CashoutWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CashoutWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CashoutWhereInputSchema),z.lazy(() => CashoutWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  amount: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  billImage: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  account_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  registerDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  Provider: z.union([ z.lazy(() => ProviderRelationFilterSchema),z.lazy(() => ProviderWhereInputSchema) ]).optional(),
  Account: z.union([ z.lazy(() => AccountRelationFilterSchema),z.lazy(() => AccountWhereInputSchema) ]).optional(),
}).strict());

export const CashoutOrderByWithAggregationInputSchema: z.ZodType<Prisma.CashoutOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  provider_id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  billImage: z.lazy(() => SortOrderSchema).optional(),
  account_id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  registerDate: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CashoutCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CashoutAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CashoutMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CashoutMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CashoutSumOrderByAggregateInputSchema).optional()
}).strict();

export const CashoutScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CashoutScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CashoutScalarWhereWithAggregatesInputSchema),z.lazy(() => CashoutScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CashoutScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CashoutScalarWhereWithAggregatesInputSchema),z.lazy(() => CashoutScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  provider_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  amount: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  billImage: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  account_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  registerDate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ExpenseTypeWhereInputSchema: z.ZodType<Prisma.ExpenseTypeWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ExpenseTypeWhereInputSchema),z.lazy(() => ExpenseTypeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExpenseTypeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExpenseTypeWhereInputSchema),z.lazy(() => ExpenseTypeWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  residenceType_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  ResidenceType: z.union([ z.lazy(() => ResidenceTypeRelationFilterSchema),z.lazy(() => ResidenceTypeWhereInputSchema) ]).optional(),
  Expense: z.lazy(() => ExpenseListRelationFilterSchema).optional()
}).strict();

export const ExpenseTypeOrderByWithRelationInputSchema: z.ZodType<Prisma.ExpenseTypeOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  residenceType_id: z.lazy(() => SortOrderSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeOrderByWithRelationInputSchema).optional(),
  Expense: z.lazy(() => ExpenseOrderByRelationAggregateInputSchema).optional()
}).strict();

export const ExpenseTypeWhereUniqueInputSchema: z.ZodType<Prisma.ExpenseTypeWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ExpenseTypeWhereInputSchema),z.lazy(() => ExpenseTypeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExpenseTypeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExpenseTypeWhereInputSchema),z.lazy(() => ExpenseTypeWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  residenceType_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  ResidenceType: z.union([ z.lazy(() => ResidenceTypeRelationFilterSchema),z.lazy(() => ResidenceTypeWhereInputSchema) ]).optional(),
  Expense: z.lazy(() => ExpenseListRelationFilterSchema).optional()
}).strict());

export const ExpenseTypeOrderByWithAggregationInputSchema: z.ZodType<Prisma.ExpenseTypeOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  residenceType_id: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ExpenseTypeCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ExpenseTypeAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ExpenseTypeMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ExpenseTypeMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ExpenseTypeSumOrderByAggregateInputSchema).optional()
}).strict();

export const ExpenseTypeScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ExpenseTypeScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ExpenseTypeScalarWhereWithAggregatesInputSchema),z.lazy(() => ExpenseTypeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExpenseTypeScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExpenseTypeScalarWhereWithAggregatesInputSchema),z.lazy(() => ExpenseTypeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  residenceType_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  community_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  balance: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  Community: z.union([ z.lazy(() => CommunityRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
  Payment: z.lazy(() => PaymentListRelationFilterSchema).optional(),
  Cashout: z.lazy(() => CashoutListRelationFilterSchema).optional()
}).strict();

export const AccountOrderByWithRelationInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
  Community: z.lazy(() => CommunityOrderByWithRelationInputSchema).optional(),
  Payment: z.lazy(() => PaymentOrderByRelationAggregateInputSchema).optional(),
  Cashout: z.lazy(() => CashoutOrderByRelationAggregateInputSchema).optional()
}).strict();

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountWhereInputSchema),z.lazy(() => AccountWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  community_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  balance: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
  Community: z.union([ z.lazy(() => CommunityRelationFilterSchema),z.lazy(() => CommunityWhereInputSchema) ]).optional(),
  Payment: z.lazy(() => PaymentListRelationFilterSchema).optional(),
  Cashout: z.lazy(() => CashoutListRelationFilterSchema).optional()
}).strict());

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AccountAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AccountSumOrderByAggregateInputSchema).optional()
}).strict();

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  active: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  community_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  balance: z.union([ z.lazy(() => BigIntWithAggregatesFilterSchema),z.bigint() ]).optional(),
}).strict();

export const CommunityCreateInputSchema: z.ZodType<Prisma.CommunityCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  address: z.string(),
  Residence: z.lazy(() => ResidenceCreateNestedManyWithoutCommunityInputSchema).optional(),
  Provider: z.lazy(() => ProviderCreateNestedManyWithoutCommunityInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutCommunityInputSchema).optional(),
  Account: z.lazy(() => AccountCreateNestedManyWithoutCommunityInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityUncheckedCreateInputSchema: z.ZodType<Prisma.CommunityUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  address: z.string(),
  Residence: z.lazy(() => ResidenceUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  Provider: z.lazy(() => ProviderUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  Account: z.lazy(() => AccountUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUncheckedCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityUpdateInputSchema: z.ZodType<Prisma.CommunityUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Provider: z.lazy(() => ProviderUpdateManyWithoutCommunityNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Account: z.lazy(() => AccountUpdateManyWithoutCommunityNestedInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const CommunityUncheckedUpdateInputSchema: z.ZodType<Prisma.CommunityUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Provider: z.lazy(() => ProviderUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Account: z.lazy(() => AccountUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const CommunityCreateManyInputSchema: z.ZodType<Prisma.CommunityCreateManyInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  address: z.string()
}).strict();

export const CommunityUpdateManyMutationInputSchema: z.ZodType<Prisma.CommunityUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CommunityUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CommunityUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutUserInputSchema).optional(),
  Role: z.lazy(() => RoleCreateNestedOneWithoutUserInputSchema).optional(),
  paymentsCreated: z.lazy(() => PaymentCreateNestedManyWithoutAdminInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentCreateNestedManyWithoutUserInputSchema).optional(),
  Residence: z.lazy(() => ResidenceCreateNestedManyWithoutOwnerInputSchema).optional(),
  ResidentIn: z.lazy(() => ResidenceCreateNestedOneWithoutResidentInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  community_id: z.string().optional(),
  role_id: z.number().int(),
  residence_id: z.string().optional().nullable(),
  paymentsCreated: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutAdminInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateOneWithoutUserNestedInputSchema).optional(),
  paymentsCreated: z.lazy(() => PaymentUpdateManyWithoutAdminNestedInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentUpdateManyWithoutUserNestedInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUpdateManyWithoutOwnerNestedInputSchema).optional(),
  ResidentIn: z.lazy(() => ResidenceUpdateOneWithoutResidentNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  residence_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentsCreated: z.lazy(() => PaymentUncheckedUpdateManyWithoutAdminNestedInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  community_id: z.string().optional(),
  role_id: z.number().int(),
  residence_id: z.string().optional().nullable()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  residence_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ResidenceCreateInputSchema: z.ZodType<Prisma.ResidenceCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  Owner: z.lazy(() => UserCreateNestedOneWithoutResidenceInputSchema).optional(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutResidenceInputSchema),
  ResidenceType: z.lazy(() => ResidenceTypeCreateNestedOneWithoutResidenceInputSchema),
  ParkingSlot: z.lazy(() => ParkingSlotCreateNestedManyWithoutResidenceInputSchema).optional(),
  Expense: z.lazy(() => ExpenseCreateNestedManyWithoutResidenceInputSchema).optional(),
  Resident: z.lazy(() => UserCreateNestedManyWithoutResidentInInputSchema).optional()
}).strict();

export const ResidenceUncheckedCreateInputSchema: z.ZodType<Prisma.ResidenceUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  owner_id: z.string().optional().nullable(),
  community_id: z.string(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.number().int(),
  ParkingSlot: z.lazy(() => ParkingSlotUncheckedCreateNestedManyWithoutResidenceInputSchema).optional(),
  Expense: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutResidenceInputSchema).optional(),
  Resident: z.lazy(() => UserUncheckedCreateNestedManyWithoutResidentInInputSchema).optional()
}).strict();

export const ResidenceUpdateInputSchema: z.ZodType<Prisma.ResidenceUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  Owner: z.lazy(() => UserUpdateOneWithoutResidenceNestedInputSchema).optional(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutResidenceNestedInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUpdateOneRequiredWithoutResidenceNestedInputSchema).optional(),
  ParkingSlot: z.lazy(() => ParkingSlotUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Expense: z.lazy(() => ExpenseUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Resident: z.lazy(() => UserUpdateManyWithoutResidentInNestedInputSchema).optional()
}).strict();

export const ResidenceUncheckedUpdateInputSchema: z.ZodType<Prisma.ResidenceUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ParkingSlot: z.lazy(() => ParkingSlotUncheckedUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Expense: z.lazy(() => ExpenseUncheckedUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Resident: z.lazy(() => UserUncheckedUpdateManyWithoutResidentInNestedInputSchema).optional()
}).strict();

export const ResidenceCreateManyInputSchema: z.ZodType<Prisma.ResidenceCreateManyInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  owner_id: z.string().optional().nullable(),
  community_id: z.string(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.number().int()
}).strict();

export const ResidenceUpdateManyMutationInputSchema: z.ZodType<Prisma.ResidenceUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const ResidenceUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ResidenceUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ParkingSlotCreateInputSchema: z.ZodType<Prisma.ParkingSlotCreateInput> = z.object({
  id: z.string().optional(),
  number: z.number().int(),
  Residence: z.lazy(() => ResidenceCreateNestedOneWithoutParkingSlotInputSchema)
}).strict();

export const ParkingSlotUncheckedCreateInputSchema: z.ZodType<Prisma.ParkingSlotUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  number: z.number().int(),
  residence_id: z.string()
}).strict();

export const ParkingSlotUpdateInputSchema: z.ZodType<Prisma.ParkingSlotUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUpdateOneRequiredWithoutParkingSlotNestedInputSchema).optional()
}).strict();

export const ParkingSlotUncheckedUpdateInputSchema: z.ZodType<Prisma.ParkingSlotUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  residence_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ParkingSlotCreateManyInputSchema: z.ZodType<Prisma.ParkingSlotCreateManyInput> = z.object({
  id: z.string().optional(),
  number: z.number().int(),
  residence_id: z.string()
}).strict();

export const ParkingSlotUpdateManyMutationInputSchema: z.ZodType<Prisma.ParkingSlotUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ParkingSlotUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ParkingSlotUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  residence_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ResidenceTypeCreateInputSchema: z.ZodType<Prisma.ResidenceTypeCreateInput> = z.object({
  title: z.string(),
  description: z.string(),
  Residence: z.lazy(() => ResidenceCreateNestedManyWithoutResidenceTypeInputSchema).optional(),
  ExpenseType: z.lazy(() => ExpenseTypeCreateNestedManyWithoutResidenceTypeInputSchema).optional(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutResidenceTypeInputSchema)
}).strict();

export const ResidenceTypeUncheckedCreateInputSchema: z.ZodType<Prisma.ResidenceTypeUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  description: z.string(),
  community_id: z.string(),
  Residence: z.lazy(() => ResidenceUncheckedCreateNestedManyWithoutResidenceTypeInputSchema).optional(),
  ExpenseType: z.lazy(() => ExpenseTypeUncheckedCreateNestedManyWithoutResidenceTypeInputSchema).optional()
}).strict();

export const ResidenceTypeUpdateInputSchema: z.ZodType<Prisma.ResidenceTypeUpdateInput> = z.object({
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUpdateManyWithoutResidenceTypeNestedInputSchema).optional(),
  ExpenseType: z.lazy(() => ExpenseTypeUpdateManyWithoutResidenceTypeNestedInputSchema).optional(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutResidenceTypeNestedInputSchema).optional()
}).strict();

export const ResidenceTypeUncheckedUpdateInputSchema: z.ZodType<Prisma.ResidenceTypeUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUncheckedUpdateManyWithoutResidenceTypeNestedInputSchema).optional(),
  ExpenseType: z.lazy(() => ExpenseTypeUncheckedUpdateManyWithoutResidenceTypeNestedInputSchema).optional()
}).strict();

export const ResidenceTypeCreateManyInputSchema: z.ZodType<Prisma.ResidenceTypeCreateManyInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  description: z.string(),
  community_id: z.string()
}).strict();

export const ResidenceTypeUpdateManyMutationInputSchema: z.ZodType<Prisma.ResidenceTypeUpdateManyMutationInput> = z.object({
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ResidenceTypeUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ResidenceTypeUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProviderCreateInputSchema: z.ZodType<Prisma.ProviderCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  contactName: z.string(),
  description: z.string(),
  phone: z.string(),
  email: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  active: z.boolean(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutProviderInputSchema),
  Cashout: z.lazy(() => CashoutCreateNestedManyWithoutProviderInputSchema).optional()
}).strict();

export const ProviderUncheckedCreateInputSchema: z.ZodType<Prisma.ProviderUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  contactName: z.string(),
  description: z.string(),
  phone: z.string(),
  email: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  active: z.boolean(),
  community_id: z.string(),
  Cashout: z.lazy(() => CashoutUncheckedCreateNestedManyWithoutProviderInputSchema).optional()
}).strict();

export const ProviderUpdateInputSchema: z.ZodType<Prisma.ProviderUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contactName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutProviderNestedInputSchema).optional(),
  Cashout: z.lazy(() => CashoutUpdateManyWithoutProviderNestedInputSchema).optional()
}).strict();

export const ProviderUncheckedUpdateInputSchema: z.ZodType<Prisma.ProviderUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contactName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Cashout: z.lazy(() => CashoutUncheckedUpdateManyWithoutProviderNestedInputSchema).optional()
}).strict();

export const ProviderCreateManyInputSchema: z.ZodType<Prisma.ProviderCreateManyInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  contactName: z.string(),
  description: z.string(),
  phone: z.string(),
  email: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  active: z.boolean(),
  community_id: z.string()
}).strict();

export const ProviderUpdateManyMutationInputSchema: z.ZodType<Prisma.ProviderUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contactName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProviderUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProviderUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contactName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoleCreateInputSchema: z.ZodType<Prisma.RoleCreateInput> = z.object({
  title: z.string(),
  description: z.string(),
  modules: z.string(),
  User: z.lazy(() => UserCreateNestedManyWithoutRoleInputSchema).optional()
}).strict();

export const RoleUncheckedCreateInputSchema: z.ZodType<Prisma.RoleUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  description: z.string(),
  modules: z.string(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutRoleInputSchema).optional()
}).strict();

export const RoleUpdateInputSchema: z.ZodType<Prisma.RoleUpdateInput> = z.object({
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  modules: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  User: z.lazy(() => UserUpdateManyWithoutRoleNestedInputSchema).optional()
}).strict();

export const RoleUncheckedUpdateInputSchema: z.ZodType<Prisma.RoleUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  modules: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutRoleNestedInputSchema).optional()
}).strict();

export const RoleCreateManyInputSchema: z.ZodType<Prisma.RoleCreateManyInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  description: z.string(),
  modules: z.string()
}).strict();

export const RoleUpdateManyMutationInputSchema: z.ZodType<Prisma.RoleUpdateManyMutationInput> = z.object({
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  modules: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoleUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RoleUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  modules: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExpenseCreateInputSchema: z.ZodType<Prisma.ExpenseCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  emitingDate: z.coerce.date(),
  expireDate: z.coerce.date(),
  status: z.string(),
  Residence: z.lazy(() => ResidenceCreateNestedOneWithoutExpenseInputSchema),
  ExpenseType: z.lazy(() => ExpenseTypeCreateNestedOneWithoutExpenseInputSchema),
  Payment: z.lazy(() => PaymentCreateNestedOneWithoutExpenseInputSchema)
}).strict();

export const ExpenseUncheckedCreateInputSchema: z.ZodType<Prisma.ExpenseUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  residence_id: z.string(),
  emitingDate: z.coerce.date(),
  expireDate: z.coerce.date(),
  status: z.string(),
  expenseType_id: z.number().int(),
  payment_id: z.string()
}).strict();

export const ExpenseUpdateInputSchema: z.ZodType<Prisma.ExpenseUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emitingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expireDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUpdateOneRequiredWithoutExpenseNestedInputSchema).optional(),
  ExpenseType: z.lazy(() => ExpenseTypeUpdateOneRequiredWithoutExpenseNestedInputSchema).optional(),
  Payment: z.lazy(() => PaymentUpdateOneRequiredWithoutExpenseNestedInputSchema).optional()
}).strict();

export const ExpenseUncheckedUpdateInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  residence_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emitingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expireDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expenseType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  payment_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExpenseCreateManyInputSchema: z.ZodType<Prisma.ExpenseCreateManyInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  residence_id: z.string(),
  emitingDate: z.coerce.date(),
  expireDate: z.coerce.date(),
  status: z.string(),
  expenseType_id: z.number().int(),
  payment_id: z.string()
}).strict();

export const ExpenseUpdateManyMutationInputSchema: z.ZodType<Prisma.ExpenseUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emitingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expireDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExpenseUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  residence_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emitingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expireDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expenseType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  payment_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentCreateInputSchema: z.ZodType<Prisma.PaymentCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  registerDate: z.coerce.date(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  voucherImage: z.string(),
  isEmailSend: z.boolean(),
  Expense: z.lazy(() => ExpenseCreateNestedManyWithoutPaymentInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedOneWithoutPaymentsMadeInputSchema),
  Account: z.lazy(() => AccountCreateNestedOneWithoutPaymentInputSchema),
  Admin: z.lazy(() => UserCreateNestedOneWithoutPaymentsCreatedInputSchema)
}).strict();

export const PaymentUncheckedCreateInputSchema: z.ZodType<Prisma.PaymentUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  registerDate: z.coerce.date(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  owner_id: z.string(),
  voucherImage: z.string(),
  isEmailSend: z.boolean(),
  account_id: z.string(),
  created_by: z.string(),
  Expense: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutPaymentInputSchema).optional()
}).strict();

export const PaymentUpdateInputSchema: z.ZodType<Prisma.PaymentUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  voucherImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isEmailSend: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Expense: z.lazy(() => ExpenseUpdateManyWithoutPaymentNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateOneRequiredWithoutPaymentsMadeNestedInputSchema).optional(),
  Account: z.lazy(() => AccountUpdateOneRequiredWithoutPaymentNestedInputSchema).optional(),
  Admin: z.lazy(() => UserUpdateOneRequiredWithoutPaymentsCreatedNestedInputSchema).optional()
}).strict();

export const PaymentUncheckedUpdateInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  voucherImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isEmailSend: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  account_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_by: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Expense: z.lazy(() => ExpenseUncheckedUpdateManyWithoutPaymentNestedInputSchema).optional()
}).strict();

export const PaymentCreateManyInputSchema: z.ZodType<Prisma.PaymentCreateManyInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  registerDate: z.coerce.date(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  owner_id: z.string(),
  voucherImage: z.string(),
  isEmailSend: z.boolean(),
  account_id: z.string(),
  created_by: z.string()
}).strict();

export const PaymentUpdateManyMutationInputSchema: z.ZodType<Prisma.PaymentUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  voucherImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isEmailSend: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  voucherImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isEmailSend: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  account_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_by: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CashoutCreateInputSchema: z.ZodType<Prisma.CashoutCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  billImage: z.string(),
  status: z.string(),
  registerDate: z.coerce.date(),
  Provider: z.lazy(() => ProviderCreateNestedOneWithoutCashoutInputSchema),
  Account: z.lazy(() => AccountCreateNestedOneWithoutCashoutInputSchema)
}).strict();

export const CashoutUncheckedCreateInputSchema: z.ZodType<Prisma.CashoutUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  provider_id: z.string(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  billImage: z.string(),
  account_id: z.string(),
  status: z.string(),
  registerDate: z.coerce.date()
}).strict();

export const CashoutUpdateInputSchema: z.ZodType<Prisma.CashoutUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  billImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Provider: z.lazy(() => ProviderUpdateOneRequiredWithoutCashoutNestedInputSchema).optional(),
  Account: z.lazy(() => AccountUpdateOneRequiredWithoutCashoutNestedInputSchema).optional()
}).strict();

export const CashoutUncheckedUpdateInputSchema: z.ZodType<Prisma.CashoutUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  billImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  account_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CashoutCreateManyInputSchema: z.ZodType<Prisma.CashoutCreateManyInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  provider_id: z.string(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  billImage: z.string(),
  account_id: z.string(),
  status: z.string(),
  registerDate: z.coerce.date()
}).strict();

export const CashoutUpdateManyMutationInputSchema: z.ZodType<Prisma.CashoutUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  billImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CashoutUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CashoutUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  billImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  account_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExpenseTypeCreateInputSchema: z.ZodType<Prisma.ExpenseTypeCreateInput> = z.object({
  title: z.string(),
  value: z.number().int(),
  ResidenceType: z.lazy(() => ResidenceTypeCreateNestedOneWithoutExpenseTypeInputSchema),
  Expense: z.lazy(() => ExpenseCreateNestedManyWithoutExpenseTypeInputSchema).optional()
}).strict();

export const ExpenseTypeUncheckedCreateInputSchema: z.ZodType<Prisma.ExpenseTypeUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  value: z.number().int(),
  residenceType_id: z.number().int(),
  Expense: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutExpenseTypeInputSchema).optional()
}).strict();

export const ExpenseTypeUpdateInputSchema: z.ZodType<Prisma.ExpenseTypeUpdateInput> = z.object({
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUpdateOneRequiredWithoutExpenseTypeNestedInputSchema).optional(),
  Expense: z.lazy(() => ExpenseUpdateManyWithoutExpenseTypeNestedInputSchema).optional()
}).strict();

export const ExpenseTypeUncheckedUpdateInputSchema: z.ZodType<Prisma.ExpenseTypeUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  residenceType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  Expense: z.lazy(() => ExpenseUncheckedUpdateManyWithoutExpenseTypeNestedInputSchema).optional()
}).strict();

export const ExpenseTypeCreateManyInputSchema: z.ZodType<Prisma.ExpenseTypeCreateManyInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  value: z.number().int(),
  residenceType_id: z.number().int()
}).strict();

export const ExpenseTypeUpdateManyMutationInputSchema: z.ZodType<Prisma.ExpenseTypeUpdateManyMutationInput> = z.object({
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExpenseTypeUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ExpenseTypeUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  residenceType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  active: z.boolean(),
  balance: z.bigint(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutAccountInputSchema),
  Payment: z.lazy(() => PaymentCreateNestedManyWithoutAccountInputSchema).optional(),
  Cashout: z.lazy(() => CashoutCreateNestedManyWithoutAccountInputSchema).optional()
}).strict();

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  active: z.boolean(),
  community_id: z.string(),
  balance: z.bigint(),
  Payment: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutAccountInputSchema).optional(),
  Cashout: z.lazy(() => CashoutUncheckedCreateNestedManyWithoutAccountInputSchema).optional()
}).strict();

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutAccountNestedInputSchema).optional(),
  Payment: z.lazy(() => PaymentUpdateManyWithoutAccountNestedInputSchema).optional(),
  Cashout: z.lazy(() => CashoutUpdateManyWithoutAccountNestedInputSchema).optional()
}).strict();

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  Payment: z.lazy(() => PaymentUncheckedUpdateManyWithoutAccountNestedInputSchema).optional(),
  Cashout: z.lazy(() => CashoutUncheckedUpdateManyWithoutAccountNestedInputSchema).optional()
}).strict();

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  active: z.boolean(),
  community_id: z.string(),
  balance: z.bigint()
}).strict();

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
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

export const ResidenceListRelationFilterSchema: z.ZodType<Prisma.ResidenceListRelationFilter> = z.object({
  every: z.lazy(() => ResidenceWhereInputSchema).optional(),
  some: z.lazy(() => ResidenceWhereInputSchema).optional(),
  none: z.lazy(() => ResidenceWhereInputSchema).optional()
}).strict();

export const ProviderListRelationFilterSchema: z.ZodType<Prisma.ProviderListRelationFilter> = z.object({
  every: z.lazy(() => ProviderWhereInputSchema).optional(),
  some: z.lazy(() => ProviderWhereInputSchema).optional(),
  none: z.lazy(() => ProviderWhereInputSchema).optional()
}).strict();

export const UserListRelationFilterSchema: z.ZodType<Prisma.UserListRelationFilter> = z.object({
  every: z.lazy(() => UserWhereInputSchema).optional(),
  some: z.lazy(() => UserWhereInputSchema).optional(),
  none: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const AccountListRelationFilterSchema: z.ZodType<Prisma.AccountListRelationFilter> = z.object({
  every: z.lazy(() => AccountWhereInputSchema).optional(),
  some: z.lazy(() => AccountWhereInputSchema).optional(),
  none: z.lazy(() => AccountWhereInputSchema).optional()
}).strict();

export const ResidenceTypeListRelationFilterSchema: z.ZodType<Prisma.ResidenceTypeListRelationFilter> = z.object({
  every: z.lazy(() => ResidenceTypeWhereInputSchema).optional(),
  some: z.lazy(() => ResidenceTypeWhereInputSchema).optional(),
  none: z.lazy(() => ResidenceTypeWhereInputSchema).optional()
}).strict();

export const ResidenceOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ResidenceOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProviderOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProviderOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AccountOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResidenceTypeOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ResidenceTypeOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CommunityCountOrderByAggregateInputSchema: z.ZodType<Prisma.CommunityCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CommunityMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CommunityMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CommunityMinOrderByAggregateInputSchema: z.ZodType<Prisma.CommunityMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional()
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

export const BoolNullableFilterSchema: z.ZodType<Prisma.BoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
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

export const CommunityRelationFilterSchema: z.ZodType<Prisma.CommunityRelationFilter> = z.object({
  is: z.lazy(() => CommunityWhereInputSchema).optional(),
  isNot: z.lazy(() => CommunityWhereInputSchema).optional()
}).strict();

export const RoleNullableRelationFilterSchema: z.ZodType<Prisma.RoleNullableRelationFilter> = z.object({
  is: z.lazy(() => RoleWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => RoleWhereInputSchema).optional().nullable()
}).strict();

export const PaymentListRelationFilterSchema: z.ZodType<Prisma.PaymentListRelationFilter> = z.object({
  every: z.lazy(() => PaymentWhereInputSchema).optional(),
  some: z.lazy(() => PaymentWhereInputSchema).optional(),
  none: z.lazy(() => PaymentWhereInputSchema).optional()
}).strict();

export const ResidenceNullableRelationFilterSchema: z.ZodType<Prisma.ResidenceNullableRelationFilter> = z.object({
  is: z.lazy(() => ResidenceWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ResidenceWhereInputSchema).optional().nullable()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const PaymentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PaymentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  identification: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  isVerified: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  role_id: z.lazy(() => SortOrderSchema).optional(),
  residence_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.object({
  role_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  identification: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  isVerified: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  role_id: z.lazy(() => SortOrderSchema).optional(),
  residence_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userName: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  identification: z.lazy(() => SortOrderSchema).optional(),
  firstName: z.lazy(() => SortOrderSchema).optional(),
  lastName: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  isVerified: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  role_id: z.lazy(() => SortOrderSchema).optional(),
  residence_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.object({
  role_id: z.lazy(() => SortOrderSchema).optional()
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

export const BoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.BoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
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

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const UserNullableRelationFilterSchema: z.ZodType<Prisma.UserNullableRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable()
}).strict();

export const ResidenceTypeRelationFilterSchema: z.ZodType<Prisma.ResidenceTypeRelationFilter> = z.object({
  is: z.lazy(() => ResidenceTypeWhereInputSchema).optional(),
  isNot: z.lazy(() => ResidenceTypeWhereInputSchema).optional()
}).strict();

export const ParkingSlotListRelationFilterSchema: z.ZodType<Prisma.ParkingSlotListRelationFilter> = z.object({
  every: z.lazy(() => ParkingSlotWhereInputSchema).optional(),
  some: z.lazy(() => ParkingSlotWhereInputSchema).optional(),
  none: z.lazy(() => ParkingSlotWhereInputSchema).optional()
}).strict();

export const ExpenseListRelationFilterSchema: z.ZodType<Prisma.ExpenseListRelationFilter> = z.object({
  every: z.lazy(() => ExpenseWhereInputSchema).optional(),
  some: z.lazy(() => ExpenseWhereInputSchema).optional(),
  none: z.lazy(() => ExpenseWhereInputSchema).optional()
}).strict();

export const ParkingSlotOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ParkingSlotOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExpenseOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ExpenseOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResidenceCountOrderByAggregateInputSchema: z.ZodType<Prisma.ResidenceCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  owner_id: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  contacts: z.lazy(() => SortOrderSchema).optional(),
  residenceType_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResidenceAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ResidenceAvgOrderByAggregateInput> = z.object({
  residenceType_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResidenceMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ResidenceMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  owner_id: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  residenceType_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResidenceMinOrderByAggregateInputSchema: z.ZodType<Prisma.ResidenceMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  owner_id: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  residenceType_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResidenceSumOrderByAggregateInputSchema: z.ZodType<Prisma.ResidenceSumOrderByAggregateInput> = z.object({
  residenceType_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const ResidenceRelationFilterSchema: z.ZodType<Prisma.ResidenceRelationFilter> = z.object({
  is: z.lazy(() => ResidenceWhereInputSchema).optional(),
  isNot: z.lazy(() => ResidenceWhereInputSchema).optional()
}).strict();

export const ParkingSlotCountOrderByAggregateInputSchema: z.ZodType<Prisma.ParkingSlotCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  residence_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ParkingSlotAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ParkingSlotAvgOrderByAggregateInput> = z.object({
  number: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ParkingSlotMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ParkingSlotMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  residence_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ParkingSlotMinOrderByAggregateInputSchema: z.ZodType<Prisma.ParkingSlotMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  residence_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ParkingSlotSumOrderByAggregateInputSchema: z.ZodType<Prisma.ParkingSlotSumOrderByAggregateInput> = z.object({
  number: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExpenseTypeListRelationFilterSchema: z.ZodType<Prisma.ExpenseTypeListRelationFilter> = z.object({
  every: z.lazy(() => ExpenseTypeWhereInputSchema).optional(),
  some: z.lazy(() => ExpenseTypeWhereInputSchema).optional(),
  none: z.lazy(() => ExpenseTypeWhereInputSchema).optional()
}).strict();

export const ExpenseTypeOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ExpenseTypeOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResidenceTypeCountOrderByAggregateInputSchema: z.ZodType<Prisma.ResidenceTypeCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResidenceTypeAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ResidenceTypeAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResidenceTypeMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ResidenceTypeMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResidenceTypeMinOrderByAggregateInputSchema: z.ZodType<Prisma.ResidenceTypeMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ResidenceTypeSumOrderByAggregateInputSchema: z.ZodType<Prisma.ResidenceTypeSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const CashoutListRelationFilterSchema: z.ZodType<Prisma.CashoutListRelationFilter> = z.object({
  every: z.lazy(() => CashoutWhereInputSchema).optional(),
  some: z.lazy(() => CashoutWhereInputSchema).optional(),
  none: z.lazy(() => CashoutWhereInputSchema).optional()
}).strict();

export const CashoutOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CashoutOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProviderCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProviderCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  contactName: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  website: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProviderMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProviderMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  contactName: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  website: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProviderMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProviderMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  contactName: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  website: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const RoleCountOrderByAggregateInputSchema: z.ZodType<Prisma.RoleCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  modules: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoleAvgOrderByAggregateInputSchema: z.ZodType<Prisma.RoleAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoleMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RoleMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  modules: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoleMinOrderByAggregateInputSchema: z.ZodType<Prisma.RoleMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  modules: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RoleSumOrderByAggregateInputSchema: z.ZodType<Prisma.RoleSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
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

export const ExpenseTypeRelationFilterSchema: z.ZodType<Prisma.ExpenseTypeRelationFilter> = z.object({
  is: z.lazy(() => ExpenseTypeWhereInputSchema).optional(),
  isNot: z.lazy(() => ExpenseTypeWhereInputSchema).optional()
}).strict();

export const PaymentRelationFilterSchema: z.ZodType<Prisma.PaymentRelationFilter> = z.object({
  is: z.lazy(() => PaymentWhereInputSchema).optional(),
  isNot: z.lazy(() => PaymentWhereInputSchema).optional()
}).strict();

export const ExpenseCountOrderByAggregateInputSchema: z.ZodType<Prisma.ExpenseCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  residence_id: z.lazy(() => SortOrderSchema).optional(),
  emitingDate: z.lazy(() => SortOrderSchema).optional(),
  expireDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  expenseType_id: z.lazy(() => SortOrderSchema).optional(),
  payment_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExpenseAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ExpenseAvgOrderByAggregateInput> = z.object({
  expenseType_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExpenseMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ExpenseMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  residence_id: z.lazy(() => SortOrderSchema).optional(),
  emitingDate: z.lazy(() => SortOrderSchema).optional(),
  expireDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  expenseType_id: z.lazy(() => SortOrderSchema).optional(),
  payment_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExpenseMinOrderByAggregateInputSchema: z.ZodType<Prisma.ExpenseMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  residence_id: z.lazy(() => SortOrderSchema).optional(),
  emitingDate: z.lazy(() => SortOrderSchema).optional(),
  expireDate: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  expenseType_id: z.lazy(() => SortOrderSchema).optional(),
  payment_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExpenseSumOrderByAggregateInputSchema: z.ZodType<Prisma.ExpenseSumOrderByAggregateInput> = z.object({
  expenseType_id: z.lazy(() => SortOrderSchema).optional()
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

export const DecimalFilterSchema: z.ZodType<Prisma.DecimalFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const AccountRelationFilterSchema: z.ZodType<Prisma.AccountRelationFilter> = z.object({
  is: z.lazy(() => AccountWhereInputSchema).optional(),
  isNot: z.lazy(() => AccountWhereInputSchema).optional()
}).strict();

export const PaymentCountOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  registerDate: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  owner_id: z.lazy(() => SortOrderSchema).optional(),
  voucherImage: z.lazy(() => SortOrderSchema).optional(),
  isEmailSend: z.lazy(() => SortOrderSchema).optional(),
  account_id: z.lazy(() => SortOrderSchema).optional(),
  created_by: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PaymentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentAvgOrderByAggregateInput> = z.object({
  amount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PaymentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  registerDate: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  owner_id: z.lazy(() => SortOrderSchema).optional(),
  voucherImage: z.lazy(() => SortOrderSchema).optional(),
  isEmailSend: z.lazy(() => SortOrderSchema).optional(),
  account_id: z.lazy(() => SortOrderSchema).optional(),
  created_by: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PaymentMinOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  registerDate: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  owner_id: z.lazy(() => SortOrderSchema).optional(),
  voucherImage: z.lazy(() => SortOrderSchema).optional(),
  isEmailSend: z.lazy(() => SortOrderSchema).optional(),
  account_id: z.lazy(() => SortOrderSchema).optional(),
  created_by: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PaymentSumOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentSumOrderByAggregateInput> = z.object({
  amount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DecimalWithAggregatesFilterSchema: z.ZodType<Prisma.DecimalWithAggregatesFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalFilterSchema).optional()
}).strict();

export const ProviderRelationFilterSchema: z.ZodType<Prisma.ProviderRelationFilter> = z.object({
  is: z.lazy(() => ProviderWhereInputSchema).optional(),
  isNot: z.lazy(() => ProviderWhereInputSchema).optional()
}).strict();

export const CashoutCountOrderByAggregateInputSchema: z.ZodType<Prisma.CashoutCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  provider_id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  billImage: z.lazy(() => SortOrderSchema).optional(),
  account_id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  registerDate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CashoutAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CashoutAvgOrderByAggregateInput> = z.object({
  amount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CashoutMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CashoutMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  provider_id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  billImage: z.lazy(() => SortOrderSchema).optional(),
  account_id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  registerDate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CashoutMinOrderByAggregateInputSchema: z.ZodType<Prisma.CashoutMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  provider_id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  billImage: z.lazy(() => SortOrderSchema).optional(),
  account_id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  registerDate: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CashoutSumOrderByAggregateInputSchema: z.ZodType<Prisma.CashoutSumOrderByAggregateInput> = z.object({
  amount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExpenseTypeCountOrderByAggregateInputSchema: z.ZodType<Prisma.ExpenseTypeCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  residenceType_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExpenseTypeAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ExpenseTypeAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  residenceType_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExpenseTypeMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ExpenseTypeMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  residenceType_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExpenseTypeMinOrderByAggregateInputSchema: z.ZodType<Prisma.ExpenseTypeMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  residenceType_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ExpenseTypeSumOrderByAggregateInputSchema: z.ZodType<Prisma.ExpenseTypeSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  residenceType_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BigIntFilterSchema: z.ZodType<Prisma.BigIntFilter> = z.object({
  equals: z.bigint().optional(),
  in: z.bigint().array().optional(),
  notIn: z.bigint().array().optional(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntFilterSchema) ]).optional(),
}).strict();

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AccountAvgOrderByAggregateInput> = z.object({
  balance: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  community_id: z.lazy(() => SortOrderSchema).optional(),
  balance: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AccountSumOrderByAggregateInputSchema: z.ZodType<Prisma.AccountSumOrderByAggregateInput> = z.object({
  balance: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BigIntWithAggregatesFilterSchema: z.ZodType<Prisma.BigIntWithAggregatesFilter> = z.object({
  equals: z.bigint().optional(),
  in: z.bigint().array().optional(),
  notIn: z.bigint().array().optional(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _max: z.lazy(() => NestedBigIntFilterSchema).optional()
}).strict();

export const ResidenceCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceCreateWithoutCommunityInputSchema).array(),z.lazy(() => ResidenceUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResidenceCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => ResidenceCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResidenceCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProviderCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.ProviderCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => ProviderCreateWithoutCommunityInputSchema),z.lazy(() => ProviderCreateWithoutCommunityInputSchema).array(),z.lazy(() => ProviderUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => ProviderUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProviderCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => ProviderCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProviderCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProviderWhereUniqueInputSchema),z.lazy(() => ProviderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.UserCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCommunityInputSchema),z.lazy(() => UserCreateWithoutCommunityInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => UserUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => UserCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AccountCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.AccountCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutCommunityInputSchema),z.lazy(() => AccountCreateWithoutCommunityInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => AccountUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => AccountCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ResidenceTypeCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceTypeCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceTypeCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeCreateWithoutCommunityInputSchema).array(),z.lazy(() => ResidenceTypeUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResidenceTypeCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResidenceTypeCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResidenceTypeWhereUniqueInputSchema),z.lazy(() => ResidenceTypeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ResidenceUncheckedCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceUncheckedCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceCreateWithoutCommunityInputSchema).array(),z.lazy(() => ResidenceUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResidenceCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => ResidenceCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResidenceCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProviderUncheckedCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.ProviderUncheckedCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => ProviderCreateWithoutCommunityInputSchema),z.lazy(() => ProviderCreateWithoutCommunityInputSchema).array(),z.lazy(() => ProviderUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => ProviderUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProviderCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => ProviderCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProviderCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProviderWhereUniqueInputSchema),z.lazy(() => ProviderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCommunityInputSchema),z.lazy(() => UserCreateWithoutCommunityInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => UserUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => UserCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutCommunityInputSchema),z.lazy(() => AccountCreateWithoutCommunityInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => AccountUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => AccountCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ResidenceTypeUncheckedCreateNestedManyWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceTypeUncheckedCreateNestedManyWithoutCommunityInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceTypeCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeCreateWithoutCommunityInputSchema).array(),z.lazy(() => ResidenceTypeUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResidenceTypeCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResidenceTypeCreateManyCommunityInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResidenceTypeWhereUniqueInputSchema),z.lazy(() => ResidenceTypeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const ResidenceUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.ResidenceUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceCreateWithoutCommunityInputSchema).array(),z.lazy(() => ResidenceUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResidenceCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => ResidenceCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResidenceUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => ResidenceUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResidenceCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResidenceUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => ResidenceUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResidenceUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => ResidenceUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResidenceScalarWhereInputSchema),z.lazy(() => ResidenceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProviderUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.ProviderUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProviderCreateWithoutCommunityInputSchema),z.lazy(() => ProviderCreateWithoutCommunityInputSchema).array(),z.lazy(() => ProviderUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => ProviderUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProviderCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => ProviderCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProviderUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => ProviderUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProviderCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProviderWhereUniqueInputSchema),z.lazy(() => ProviderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProviderWhereUniqueInputSchema),z.lazy(() => ProviderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProviderWhereUniqueInputSchema),z.lazy(() => ProviderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProviderWhereUniqueInputSchema),z.lazy(() => ProviderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProviderUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => ProviderUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProviderUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => ProviderUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProviderScalarWhereInputSchema),z.lazy(() => ProviderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.UserUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCommunityInputSchema),z.lazy(() => UserCreateWithoutCommunityInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => UserUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => UserCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AccountUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.AccountUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutCommunityInputSchema),z.lazy(() => AccountCreateWithoutCommunityInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => AccountUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => AccountCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ResidenceTypeUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.ResidenceTypeUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceTypeCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeCreateWithoutCommunityInputSchema).array(),z.lazy(() => ResidenceTypeUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResidenceTypeCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResidenceTypeUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResidenceTypeCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResidenceTypeWhereUniqueInputSchema),z.lazy(() => ResidenceTypeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResidenceTypeWhereUniqueInputSchema),z.lazy(() => ResidenceTypeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResidenceTypeWhereUniqueInputSchema),z.lazy(() => ResidenceTypeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResidenceTypeWhereUniqueInputSchema),z.lazy(() => ResidenceTypeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResidenceTypeUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResidenceTypeUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResidenceTypeScalarWhereInputSchema),z.lazy(() => ResidenceTypeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ResidenceUncheckedUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.ResidenceUncheckedUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceCreateWithoutCommunityInputSchema).array(),z.lazy(() => ResidenceUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResidenceCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => ResidenceCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResidenceUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => ResidenceUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResidenceCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResidenceUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => ResidenceUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResidenceUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => ResidenceUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResidenceScalarWhereInputSchema),z.lazy(() => ResidenceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProviderUncheckedUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.ProviderUncheckedUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProviderCreateWithoutCommunityInputSchema),z.lazy(() => ProviderCreateWithoutCommunityInputSchema).array(),z.lazy(() => ProviderUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => ProviderUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProviderCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => ProviderCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProviderUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => ProviderUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProviderCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProviderWhereUniqueInputSchema),z.lazy(() => ProviderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProviderWhereUniqueInputSchema),z.lazy(() => ProviderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProviderWhereUniqueInputSchema),z.lazy(() => ProviderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProviderWhereUniqueInputSchema),z.lazy(() => ProviderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProviderUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => ProviderUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProviderUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => ProviderUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProviderScalarWhereInputSchema),z.lazy(() => ProviderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCommunityInputSchema),z.lazy(() => UserCreateWithoutCommunityInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => UserUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => UserCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AccountUncheckedUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutCommunityInputSchema),z.lazy(() => AccountCreateWithoutCommunityInputSchema).array(),z.lazy(() => AccountUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => AccountUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AccountCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => AccountCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AccountUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => AccountUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AccountCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AccountWhereUniqueInputSchema),z.lazy(() => AccountWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AccountUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => AccountUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AccountUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => AccountUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ResidenceTypeUncheckedUpdateManyWithoutCommunityNestedInputSchema: z.ZodType<Prisma.ResidenceTypeUncheckedUpdateManyWithoutCommunityNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceTypeCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeCreateWithoutCommunityInputSchema).array(),z.lazy(() => ResidenceTypeUncheckedCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeUncheckedCreateWithoutCommunityInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResidenceTypeCreateOrConnectWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeCreateOrConnectWithoutCommunityInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResidenceTypeUpsertWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeUpsertWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResidenceTypeCreateManyCommunityInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResidenceTypeWhereUniqueInputSchema),z.lazy(() => ResidenceTypeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResidenceTypeWhereUniqueInputSchema),z.lazy(() => ResidenceTypeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResidenceTypeWhereUniqueInputSchema),z.lazy(() => ResidenceTypeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResidenceTypeWhereUniqueInputSchema),z.lazy(() => ResidenceTypeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResidenceTypeUpdateWithWhereUniqueWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeUpdateWithWhereUniqueWithoutCommunityInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResidenceTypeUpdateManyWithWhereWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeUpdateManyWithWhereWithoutCommunityInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResidenceTypeScalarWhereInputSchema),z.lazy(() => ResidenceTypeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CommunityCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.CommunityCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutUserInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional()
}).strict();

export const RoleCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.RoleCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => RoleCreateWithoutUserInputSchema),z.lazy(() => RoleUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoleCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => RoleWhereUniqueInputSchema).optional()
}).strict();

export const PaymentCreateNestedManyWithoutAdminInputSchema: z.ZodType<Prisma.PaymentCreateNestedManyWithoutAdminInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutAdminInputSchema),z.lazy(() => PaymentCreateWithoutAdminInputSchema).array(),z.lazy(() => PaymentUncheckedCreateWithoutAdminInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutAdminInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentCreateOrConnectWithoutAdminInputSchema),z.lazy(() => PaymentCreateOrConnectWithoutAdminInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentCreateManyAdminInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PaymentCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.PaymentCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutUserInputSchema),z.lazy(() => PaymentCreateWithoutUserInputSchema).array(),z.lazy(() => PaymentUncheckedCreateWithoutUserInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentCreateOrConnectWithoutUserInputSchema),z.lazy(() => PaymentCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ResidenceCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.ResidenceCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutOwnerInputSchema),z.lazy(() => ResidenceCreateWithoutOwnerInputSchema).array(),z.lazy(() => ResidenceUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResidenceCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => ResidenceCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResidenceCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ResidenceCreateNestedOneWithoutResidentInputSchema: z.ZodType<Prisma.ResidenceCreateNestedOneWithoutResidentInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutResidentInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutResidentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResidenceCreateOrConnectWithoutResidentInputSchema).optional(),
  connect: z.lazy(() => ResidenceWhereUniqueInputSchema).optional()
}).strict();

export const PaymentUncheckedCreateNestedManyWithoutAdminInputSchema: z.ZodType<Prisma.PaymentUncheckedCreateNestedManyWithoutAdminInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutAdminInputSchema),z.lazy(() => PaymentCreateWithoutAdminInputSchema).array(),z.lazy(() => PaymentUncheckedCreateWithoutAdminInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutAdminInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentCreateOrConnectWithoutAdminInputSchema),z.lazy(() => PaymentCreateOrConnectWithoutAdminInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentCreateManyAdminInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PaymentUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.PaymentUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutUserInputSchema),z.lazy(() => PaymentCreateWithoutUserInputSchema).array(),z.lazy(() => PaymentUncheckedCreateWithoutUserInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentCreateOrConnectWithoutUserInputSchema),z.lazy(() => PaymentCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ResidenceUncheckedCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.ResidenceUncheckedCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutOwnerInputSchema),z.lazy(() => ResidenceCreateWithoutOwnerInputSchema).array(),z.lazy(() => ResidenceUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResidenceCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => ResidenceCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResidenceCreateManyOwnerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const NullableBoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableBoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional().nullable()
}).strict();

export const CommunityUpdateOneRequiredWithoutUserNestedInputSchema: z.ZodType<Prisma.CommunityUpdateOneRequiredWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutUserInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => CommunityUpsertWithoutUserInputSchema).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CommunityUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => CommunityUpdateWithoutUserInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const RoleUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.RoleUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => RoleCreateWithoutUserInputSchema),z.lazy(() => RoleUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RoleCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => RoleUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => RoleWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => RoleWhereInputSchema) ]).optional(),
  connect: z.lazy(() => RoleWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RoleUpdateToOneWithWhereWithoutUserInputSchema),z.lazy(() => RoleUpdateWithoutUserInputSchema),z.lazy(() => RoleUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const PaymentUpdateManyWithoutAdminNestedInputSchema: z.ZodType<Prisma.PaymentUpdateManyWithoutAdminNestedInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutAdminInputSchema),z.lazy(() => PaymentCreateWithoutAdminInputSchema).array(),z.lazy(() => PaymentUncheckedCreateWithoutAdminInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutAdminInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentCreateOrConnectWithoutAdminInputSchema),z.lazy(() => PaymentCreateOrConnectWithoutAdminInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PaymentUpsertWithWhereUniqueWithoutAdminInputSchema),z.lazy(() => PaymentUpsertWithWhereUniqueWithoutAdminInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentCreateManyAdminInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PaymentUpdateWithWhereUniqueWithoutAdminInputSchema),z.lazy(() => PaymentUpdateWithWhereUniqueWithoutAdminInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PaymentUpdateManyWithWhereWithoutAdminInputSchema),z.lazy(() => PaymentUpdateManyWithWhereWithoutAdminInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PaymentScalarWhereInputSchema),z.lazy(() => PaymentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PaymentUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.PaymentUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutUserInputSchema),z.lazy(() => PaymentCreateWithoutUserInputSchema).array(),z.lazy(() => PaymentUncheckedCreateWithoutUserInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentCreateOrConnectWithoutUserInputSchema),z.lazy(() => PaymentCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PaymentUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PaymentUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PaymentUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PaymentUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PaymentUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => PaymentUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PaymentScalarWhereInputSchema),z.lazy(() => PaymentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ResidenceUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.ResidenceUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutOwnerInputSchema),z.lazy(() => ResidenceCreateWithoutOwnerInputSchema).array(),z.lazy(() => ResidenceUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResidenceCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => ResidenceCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResidenceUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => ResidenceUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResidenceCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResidenceUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => ResidenceUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResidenceUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => ResidenceUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResidenceScalarWhereInputSchema),z.lazy(() => ResidenceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ResidenceUpdateOneWithoutResidentNestedInputSchema: z.ZodType<Prisma.ResidenceUpdateOneWithoutResidentNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutResidentInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutResidentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResidenceCreateOrConnectWithoutResidentInputSchema).optional(),
  upsert: z.lazy(() => ResidenceUpsertWithoutResidentInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ResidenceWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ResidenceWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ResidenceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ResidenceUpdateToOneWithWhereWithoutResidentInputSchema),z.lazy(() => ResidenceUpdateWithoutResidentInputSchema),z.lazy(() => ResidenceUncheckedUpdateWithoutResidentInputSchema) ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const PaymentUncheckedUpdateManyWithoutAdminNestedInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateManyWithoutAdminNestedInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutAdminInputSchema),z.lazy(() => PaymentCreateWithoutAdminInputSchema).array(),z.lazy(() => PaymentUncheckedCreateWithoutAdminInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutAdminInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentCreateOrConnectWithoutAdminInputSchema),z.lazy(() => PaymentCreateOrConnectWithoutAdminInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PaymentUpsertWithWhereUniqueWithoutAdminInputSchema),z.lazy(() => PaymentUpsertWithWhereUniqueWithoutAdminInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentCreateManyAdminInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PaymentUpdateWithWhereUniqueWithoutAdminInputSchema),z.lazy(() => PaymentUpdateWithWhereUniqueWithoutAdminInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PaymentUpdateManyWithWhereWithoutAdminInputSchema),z.lazy(() => PaymentUpdateManyWithWhereWithoutAdminInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PaymentScalarWhereInputSchema),z.lazy(() => PaymentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PaymentUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutUserInputSchema),z.lazy(() => PaymentCreateWithoutUserInputSchema).array(),z.lazy(() => PaymentUncheckedCreateWithoutUserInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentCreateOrConnectWithoutUserInputSchema),z.lazy(() => PaymentCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PaymentUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PaymentUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PaymentUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => PaymentUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PaymentUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => PaymentUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PaymentScalarWhereInputSchema),z.lazy(() => PaymentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ResidenceUncheckedUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.ResidenceUncheckedUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutOwnerInputSchema),z.lazy(() => ResidenceCreateWithoutOwnerInputSchema).array(),z.lazy(() => ResidenceUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResidenceCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => ResidenceCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResidenceUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => ResidenceUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResidenceCreateManyOwnerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResidenceUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => ResidenceUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResidenceUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => ResidenceUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResidenceScalarWhereInputSchema),z.lazy(() => ResidenceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutResidenceInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutResidenceInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutResidenceInputSchema),z.lazy(() => UserUncheckedCreateWithoutResidenceInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutResidenceInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const CommunityCreateNestedOneWithoutResidenceInputSchema: z.ZodType<Prisma.CommunityCreateNestedOneWithoutResidenceInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutResidenceInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutResidenceInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutResidenceInputSchema).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional()
}).strict();

export const ResidenceTypeCreateNestedOneWithoutResidenceInputSchema: z.ZodType<Prisma.ResidenceTypeCreateNestedOneWithoutResidenceInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceTypeCreateWithoutResidenceInputSchema),z.lazy(() => ResidenceTypeUncheckedCreateWithoutResidenceInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResidenceTypeCreateOrConnectWithoutResidenceInputSchema).optional(),
  connect: z.lazy(() => ResidenceTypeWhereUniqueInputSchema).optional()
}).strict();

export const ParkingSlotCreateNestedManyWithoutResidenceInputSchema: z.ZodType<Prisma.ParkingSlotCreateNestedManyWithoutResidenceInput> = z.object({
  create: z.union([ z.lazy(() => ParkingSlotCreateWithoutResidenceInputSchema),z.lazy(() => ParkingSlotCreateWithoutResidenceInputSchema).array(),z.lazy(() => ParkingSlotUncheckedCreateWithoutResidenceInputSchema),z.lazy(() => ParkingSlotUncheckedCreateWithoutResidenceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParkingSlotCreateOrConnectWithoutResidenceInputSchema),z.lazy(() => ParkingSlotCreateOrConnectWithoutResidenceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ParkingSlotCreateManyResidenceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ParkingSlotWhereUniqueInputSchema),z.lazy(() => ParkingSlotWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ExpenseCreateNestedManyWithoutResidenceInputSchema: z.ZodType<Prisma.ExpenseCreateNestedManyWithoutResidenceInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutResidenceInputSchema),z.lazy(() => ExpenseCreateWithoutResidenceInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutResidenceInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutResidenceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutResidenceInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutResidenceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyResidenceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedManyWithoutResidentInInputSchema: z.ZodType<Prisma.UserCreateNestedManyWithoutResidentInInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutResidentInInputSchema),z.lazy(() => UserCreateWithoutResidentInInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutResidentInInputSchema),z.lazy(() => UserUncheckedCreateWithoutResidentInInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutResidentInInputSchema),z.lazy(() => UserCreateOrConnectWithoutResidentInInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyResidentInInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ParkingSlotUncheckedCreateNestedManyWithoutResidenceInputSchema: z.ZodType<Prisma.ParkingSlotUncheckedCreateNestedManyWithoutResidenceInput> = z.object({
  create: z.union([ z.lazy(() => ParkingSlotCreateWithoutResidenceInputSchema),z.lazy(() => ParkingSlotCreateWithoutResidenceInputSchema).array(),z.lazy(() => ParkingSlotUncheckedCreateWithoutResidenceInputSchema),z.lazy(() => ParkingSlotUncheckedCreateWithoutResidenceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParkingSlotCreateOrConnectWithoutResidenceInputSchema),z.lazy(() => ParkingSlotCreateOrConnectWithoutResidenceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ParkingSlotCreateManyResidenceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ParkingSlotWhereUniqueInputSchema),z.lazy(() => ParkingSlotWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ExpenseUncheckedCreateNestedManyWithoutResidenceInputSchema: z.ZodType<Prisma.ExpenseUncheckedCreateNestedManyWithoutResidenceInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutResidenceInputSchema),z.lazy(() => ExpenseCreateWithoutResidenceInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutResidenceInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutResidenceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutResidenceInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutResidenceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyResidenceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedCreateNestedManyWithoutResidentInInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutResidentInInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutResidentInInputSchema),z.lazy(() => UserCreateWithoutResidentInInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutResidentInInputSchema),z.lazy(() => UserUncheckedCreateWithoutResidentInInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutResidentInInputSchema),z.lazy(() => UserCreateOrConnectWithoutResidentInInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyResidentInInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneWithoutResidenceNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutResidenceNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutResidenceInputSchema),z.lazy(() => UserUncheckedCreateWithoutResidenceInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutResidenceInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutResidenceInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutResidenceInputSchema),z.lazy(() => UserUpdateWithoutResidenceInputSchema),z.lazy(() => UserUncheckedUpdateWithoutResidenceInputSchema) ]).optional(),
}).strict();

export const CommunityUpdateOneRequiredWithoutResidenceNestedInputSchema: z.ZodType<Prisma.CommunityUpdateOneRequiredWithoutResidenceNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutResidenceInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutResidenceInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutResidenceInputSchema).optional(),
  upsert: z.lazy(() => CommunityUpsertWithoutResidenceInputSchema).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CommunityUpdateToOneWithWhereWithoutResidenceInputSchema),z.lazy(() => CommunityUpdateWithoutResidenceInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutResidenceInputSchema) ]).optional(),
}).strict();

export const ResidenceTypeUpdateOneRequiredWithoutResidenceNestedInputSchema: z.ZodType<Prisma.ResidenceTypeUpdateOneRequiredWithoutResidenceNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceTypeCreateWithoutResidenceInputSchema),z.lazy(() => ResidenceTypeUncheckedCreateWithoutResidenceInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResidenceTypeCreateOrConnectWithoutResidenceInputSchema).optional(),
  upsert: z.lazy(() => ResidenceTypeUpsertWithoutResidenceInputSchema).optional(),
  connect: z.lazy(() => ResidenceTypeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ResidenceTypeUpdateToOneWithWhereWithoutResidenceInputSchema),z.lazy(() => ResidenceTypeUpdateWithoutResidenceInputSchema),z.lazy(() => ResidenceTypeUncheckedUpdateWithoutResidenceInputSchema) ]).optional(),
}).strict();

export const ParkingSlotUpdateManyWithoutResidenceNestedInputSchema: z.ZodType<Prisma.ParkingSlotUpdateManyWithoutResidenceNestedInput> = z.object({
  create: z.union([ z.lazy(() => ParkingSlotCreateWithoutResidenceInputSchema),z.lazy(() => ParkingSlotCreateWithoutResidenceInputSchema).array(),z.lazy(() => ParkingSlotUncheckedCreateWithoutResidenceInputSchema),z.lazy(() => ParkingSlotUncheckedCreateWithoutResidenceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParkingSlotCreateOrConnectWithoutResidenceInputSchema),z.lazy(() => ParkingSlotCreateOrConnectWithoutResidenceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ParkingSlotUpsertWithWhereUniqueWithoutResidenceInputSchema),z.lazy(() => ParkingSlotUpsertWithWhereUniqueWithoutResidenceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ParkingSlotCreateManyResidenceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ParkingSlotWhereUniqueInputSchema),z.lazy(() => ParkingSlotWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ParkingSlotWhereUniqueInputSchema),z.lazy(() => ParkingSlotWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ParkingSlotWhereUniqueInputSchema),z.lazy(() => ParkingSlotWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ParkingSlotWhereUniqueInputSchema),z.lazy(() => ParkingSlotWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ParkingSlotUpdateWithWhereUniqueWithoutResidenceInputSchema),z.lazy(() => ParkingSlotUpdateWithWhereUniqueWithoutResidenceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ParkingSlotUpdateManyWithWhereWithoutResidenceInputSchema),z.lazy(() => ParkingSlotUpdateManyWithWhereWithoutResidenceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ParkingSlotScalarWhereInputSchema),z.lazy(() => ParkingSlotScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ExpenseUpdateManyWithoutResidenceNestedInputSchema: z.ZodType<Prisma.ExpenseUpdateManyWithoutResidenceNestedInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutResidenceInputSchema),z.lazy(() => ExpenseCreateWithoutResidenceInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutResidenceInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutResidenceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutResidenceInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutResidenceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutResidenceInputSchema),z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutResidenceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyResidenceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutResidenceInputSchema),z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutResidenceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExpenseUpdateManyWithWhereWithoutResidenceInputSchema),z.lazy(() => ExpenseUpdateManyWithWhereWithoutResidenceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExpenseScalarWhereInputSchema),z.lazy(() => ExpenseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateManyWithoutResidentInNestedInputSchema: z.ZodType<Prisma.UserUpdateManyWithoutResidentInNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutResidentInInputSchema),z.lazy(() => UserCreateWithoutResidentInInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutResidentInInputSchema),z.lazy(() => UserUncheckedCreateWithoutResidentInInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutResidentInInputSchema),z.lazy(() => UserCreateOrConnectWithoutResidentInInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutResidentInInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutResidentInInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyResidentInInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutResidentInInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutResidentInInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutResidentInInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutResidentInInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ParkingSlotUncheckedUpdateManyWithoutResidenceNestedInputSchema: z.ZodType<Prisma.ParkingSlotUncheckedUpdateManyWithoutResidenceNestedInput> = z.object({
  create: z.union([ z.lazy(() => ParkingSlotCreateWithoutResidenceInputSchema),z.lazy(() => ParkingSlotCreateWithoutResidenceInputSchema).array(),z.lazy(() => ParkingSlotUncheckedCreateWithoutResidenceInputSchema),z.lazy(() => ParkingSlotUncheckedCreateWithoutResidenceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParkingSlotCreateOrConnectWithoutResidenceInputSchema),z.lazy(() => ParkingSlotCreateOrConnectWithoutResidenceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ParkingSlotUpsertWithWhereUniqueWithoutResidenceInputSchema),z.lazy(() => ParkingSlotUpsertWithWhereUniqueWithoutResidenceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ParkingSlotCreateManyResidenceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ParkingSlotWhereUniqueInputSchema),z.lazy(() => ParkingSlotWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ParkingSlotWhereUniqueInputSchema),z.lazy(() => ParkingSlotWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ParkingSlotWhereUniqueInputSchema),z.lazy(() => ParkingSlotWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ParkingSlotWhereUniqueInputSchema),z.lazy(() => ParkingSlotWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ParkingSlotUpdateWithWhereUniqueWithoutResidenceInputSchema),z.lazy(() => ParkingSlotUpdateWithWhereUniqueWithoutResidenceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ParkingSlotUpdateManyWithWhereWithoutResidenceInputSchema),z.lazy(() => ParkingSlotUpdateManyWithWhereWithoutResidenceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ParkingSlotScalarWhereInputSchema),z.lazy(() => ParkingSlotScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ExpenseUncheckedUpdateManyWithoutResidenceNestedInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateManyWithoutResidenceNestedInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutResidenceInputSchema),z.lazy(() => ExpenseCreateWithoutResidenceInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutResidenceInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutResidenceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutResidenceInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutResidenceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutResidenceInputSchema),z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutResidenceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyResidenceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutResidenceInputSchema),z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutResidenceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExpenseUpdateManyWithWhereWithoutResidenceInputSchema),z.lazy(() => ExpenseUpdateManyWithWhereWithoutResidenceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExpenseScalarWhereInputSchema),z.lazy(() => ExpenseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedUpdateManyWithoutResidentInNestedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutResidentInNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutResidentInInputSchema),z.lazy(() => UserCreateWithoutResidentInInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutResidentInInputSchema),z.lazy(() => UserUncheckedCreateWithoutResidentInInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutResidentInInputSchema),z.lazy(() => UserCreateOrConnectWithoutResidentInInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutResidentInInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutResidentInInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyResidentInInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutResidentInInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutResidentInInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutResidentInInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutResidentInInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ResidenceCreateNestedOneWithoutParkingSlotInputSchema: z.ZodType<Prisma.ResidenceCreateNestedOneWithoutParkingSlotInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutParkingSlotInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutParkingSlotInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResidenceCreateOrConnectWithoutParkingSlotInputSchema).optional(),
  connect: z.lazy(() => ResidenceWhereUniqueInputSchema).optional()
}).strict();

export const ResidenceUpdateOneRequiredWithoutParkingSlotNestedInputSchema: z.ZodType<Prisma.ResidenceUpdateOneRequiredWithoutParkingSlotNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutParkingSlotInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutParkingSlotInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResidenceCreateOrConnectWithoutParkingSlotInputSchema).optional(),
  upsert: z.lazy(() => ResidenceUpsertWithoutParkingSlotInputSchema).optional(),
  connect: z.lazy(() => ResidenceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ResidenceUpdateToOneWithWhereWithoutParkingSlotInputSchema),z.lazy(() => ResidenceUpdateWithoutParkingSlotInputSchema),z.lazy(() => ResidenceUncheckedUpdateWithoutParkingSlotInputSchema) ]).optional(),
}).strict();

export const ResidenceCreateNestedManyWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ResidenceCreateNestedManyWithoutResidenceTypeInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceCreateWithoutResidenceTypeInputSchema).array(),z.lazy(() => ResidenceUncheckedCreateWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutResidenceTypeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResidenceCreateOrConnectWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceCreateOrConnectWithoutResidenceTypeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResidenceCreateManyResidenceTypeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ExpenseTypeCreateNestedManyWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ExpenseTypeCreateNestedManyWithoutResidenceTypeInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseTypeCreateWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeCreateWithoutResidenceTypeInputSchema).array(),z.lazy(() => ExpenseTypeUncheckedCreateWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeUncheckedCreateWithoutResidenceTypeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseTypeCreateOrConnectWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeCreateOrConnectWithoutResidenceTypeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseTypeCreateManyResidenceTypeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExpenseTypeWhereUniqueInputSchema),z.lazy(() => ExpenseTypeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CommunityCreateNestedOneWithoutResidenceTypeInputSchema: z.ZodType<Prisma.CommunityCreateNestedOneWithoutResidenceTypeInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutResidenceTypeInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutResidenceTypeInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutResidenceTypeInputSchema).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional()
}).strict();

export const ResidenceUncheckedCreateNestedManyWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ResidenceUncheckedCreateNestedManyWithoutResidenceTypeInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceCreateWithoutResidenceTypeInputSchema).array(),z.lazy(() => ResidenceUncheckedCreateWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutResidenceTypeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResidenceCreateOrConnectWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceCreateOrConnectWithoutResidenceTypeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResidenceCreateManyResidenceTypeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ExpenseTypeUncheckedCreateNestedManyWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ExpenseTypeUncheckedCreateNestedManyWithoutResidenceTypeInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseTypeCreateWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeCreateWithoutResidenceTypeInputSchema).array(),z.lazy(() => ExpenseTypeUncheckedCreateWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeUncheckedCreateWithoutResidenceTypeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseTypeCreateOrConnectWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeCreateOrConnectWithoutResidenceTypeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseTypeCreateManyResidenceTypeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExpenseTypeWhereUniqueInputSchema),z.lazy(() => ExpenseTypeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ResidenceUpdateManyWithoutResidenceTypeNestedInputSchema: z.ZodType<Prisma.ResidenceUpdateManyWithoutResidenceTypeNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceCreateWithoutResidenceTypeInputSchema).array(),z.lazy(() => ResidenceUncheckedCreateWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutResidenceTypeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResidenceCreateOrConnectWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceCreateOrConnectWithoutResidenceTypeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResidenceUpsertWithWhereUniqueWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceUpsertWithWhereUniqueWithoutResidenceTypeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResidenceCreateManyResidenceTypeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResidenceUpdateWithWhereUniqueWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceUpdateWithWhereUniqueWithoutResidenceTypeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResidenceUpdateManyWithWhereWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceUpdateManyWithWhereWithoutResidenceTypeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResidenceScalarWhereInputSchema),z.lazy(() => ResidenceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ExpenseTypeUpdateManyWithoutResidenceTypeNestedInputSchema: z.ZodType<Prisma.ExpenseTypeUpdateManyWithoutResidenceTypeNestedInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseTypeCreateWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeCreateWithoutResidenceTypeInputSchema).array(),z.lazy(() => ExpenseTypeUncheckedCreateWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeUncheckedCreateWithoutResidenceTypeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseTypeCreateOrConnectWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeCreateOrConnectWithoutResidenceTypeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExpenseTypeUpsertWithWhereUniqueWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeUpsertWithWhereUniqueWithoutResidenceTypeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseTypeCreateManyResidenceTypeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExpenseTypeWhereUniqueInputSchema),z.lazy(() => ExpenseTypeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExpenseTypeWhereUniqueInputSchema),z.lazy(() => ExpenseTypeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExpenseTypeWhereUniqueInputSchema),z.lazy(() => ExpenseTypeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExpenseTypeWhereUniqueInputSchema),z.lazy(() => ExpenseTypeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExpenseTypeUpdateWithWhereUniqueWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeUpdateWithWhereUniqueWithoutResidenceTypeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExpenseTypeUpdateManyWithWhereWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeUpdateManyWithWhereWithoutResidenceTypeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExpenseTypeScalarWhereInputSchema),z.lazy(() => ExpenseTypeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CommunityUpdateOneRequiredWithoutResidenceTypeNestedInputSchema: z.ZodType<Prisma.CommunityUpdateOneRequiredWithoutResidenceTypeNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutResidenceTypeInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutResidenceTypeInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutResidenceTypeInputSchema).optional(),
  upsert: z.lazy(() => CommunityUpsertWithoutResidenceTypeInputSchema).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CommunityUpdateToOneWithWhereWithoutResidenceTypeInputSchema),z.lazy(() => CommunityUpdateWithoutResidenceTypeInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutResidenceTypeInputSchema) ]).optional(),
}).strict();

export const ResidenceUncheckedUpdateManyWithoutResidenceTypeNestedInputSchema: z.ZodType<Prisma.ResidenceUncheckedUpdateManyWithoutResidenceTypeNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceCreateWithoutResidenceTypeInputSchema).array(),z.lazy(() => ResidenceUncheckedCreateWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutResidenceTypeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResidenceCreateOrConnectWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceCreateOrConnectWithoutResidenceTypeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResidenceUpsertWithWhereUniqueWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceUpsertWithWhereUniqueWithoutResidenceTypeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResidenceCreateManyResidenceTypeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResidenceWhereUniqueInputSchema),z.lazy(() => ResidenceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResidenceUpdateWithWhereUniqueWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceUpdateWithWhereUniqueWithoutResidenceTypeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResidenceUpdateManyWithWhereWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceUpdateManyWithWhereWithoutResidenceTypeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResidenceScalarWhereInputSchema),z.lazy(() => ResidenceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ExpenseTypeUncheckedUpdateManyWithoutResidenceTypeNestedInputSchema: z.ZodType<Prisma.ExpenseTypeUncheckedUpdateManyWithoutResidenceTypeNestedInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseTypeCreateWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeCreateWithoutResidenceTypeInputSchema).array(),z.lazy(() => ExpenseTypeUncheckedCreateWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeUncheckedCreateWithoutResidenceTypeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseTypeCreateOrConnectWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeCreateOrConnectWithoutResidenceTypeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExpenseTypeUpsertWithWhereUniqueWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeUpsertWithWhereUniqueWithoutResidenceTypeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseTypeCreateManyResidenceTypeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExpenseTypeWhereUniqueInputSchema),z.lazy(() => ExpenseTypeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExpenseTypeWhereUniqueInputSchema),z.lazy(() => ExpenseTypeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExpenseTypeWhereUniqueInputSchema),z.lazy(() => ExpenseTypeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExpenseTypeWhereUniqueInputSchema),z.lazy(() => ExpenseTypeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExpenseTypeUpdateWithWhereUniqueWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeUpdateWithWhereUniqueWithoutResidenceTypeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExpenseTypeUpdateManyWithWhereWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeUpdateManyWithWhereWithoutResidenceTypeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExpenseTypeScalarWhereInputSchema),z.lazy(() => ExpenseTypeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CommunityCreateNestedOneWithoutProviderInputSchema: z.ZodType<Prisma.CommunityCreateNestedOneWithoutProviderInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutProviderInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutProviderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutProviderInputSchema).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional()
}).strict();

export const CashoutCreateNestedManyWithoutProviderInputSchema: z.ZodType<Prisma.CashoutCreateNestedManyWithoutProviderInput> = z.object({
  create: z.union([ z.lazy(() => CashoutCreateWithoutProviderInputSchema),z.lazy(() => CashoutCreateWithoutProviderInputSchema).array(),z.lazy(() => CashoutUncheckedCreateWithoutProviderInputSchema),z.lazy(() => CashoutUncheckedCreateWithoutProviderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CashoutCreateOrConnectWithoutProviderInputSchema),z.lazy(() => CashoutCreateOrConnectWithoutProviderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CashoutCreateManyProviderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CashoutUncheckedCreateNestedManyWithoutProviderInputSchema: z.ZodType<Prisma.CashoutUncheckedCreateNestedManyWithoutProviderInput> = z.object({
  create: z.union([ z.lazy(() => CashoutCreateWithoutProviderInputSchema),z.lazy(() => CashoutCreateWithoutProviderInputSchema).array(),z.lazy(() => CashoutUncheckedCreateWithoutProviderInputSchema),z.lazy(() => CashoutUncheckedCreateWithoutProviderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CashoutCreateOrConnectWithoutProviderInputSchema),z.lazy(() => CashoutCreateOrConnectWithoutProviderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CashoutCreateManyProviderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const CommunityUpdateOneRequiredWithoutProviderNestedInputSchema: z.ZodType<Prisma.CommunityUpdateOneRequiredWithoutProviderNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutProviderInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutProviderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutProviderInputSchema).optional(),
  upsert: z.lazy(() => CommunityUpsertWithoutProviderInputSchema).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CommunityUpdateToOneWithWhereWithoutProviderInputSchema),z.lazy(() => CommunityUpdateWithoutProviderInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutProviderInputSchema) ]).optional(),
}).strict();

export const CashoutUpdateManyWithoutProviderNestedInputSchema: z.ZodType<Prisma.CashoutUpdateManyWithoutProviderNestedInput> = z.object({
  create: z.union([ z.lazy(() => CashoutCreateWithoutProviderInputSchema),z.lazy(() => CashoutCreateWithoutProviderInputSchema).array(),z.lazy(() => CashoutUncheckedCreateWithoutProviderInputSchema),z.lazy(() => CashoutUncheckedCreateWithoutProviderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CashoutCreateOrConnectWithoutProviderInputSchema),z.lazy(() => CashoutCreateOrConnectWithoutProviderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CashoutUpsertWithWhereUniqueWithoutProviderInputSchema),z.lazy(() => CashoutUpsertWithWhereUniqueWithoutProviderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CashoutCreateManyProviderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CashoutUpdateWithWhereUniqueWithoutProviderInputSchema),z.lazy(() => CashoutUpdateWithWhereUniqueWithoutProviderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CashoutUpdateManyWithWhereWithoutProviderInputSchema),z.lazy(() => CashoutUpdateManyWithWhereWithoutProviderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CashoutScalarWhereInputSchema),z.lazy(() => CashoutScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CashoutUncheckedUpdateManyWithoutProviderNestedInputSchema: z.ZodType<Prisma.CashoutUncheckedUpdateManyWithoutProviderNestedInput> = z.object({
  create: z.union([ z.lazy(() => CashoutCreateWithoutProviderInputSchema),z.lazy(() => CashoutCreateWithoutProviderInputSchema).array(),z.lazy(() => CashoutUncheckedCreateWithoutProviderInputSchema),z.lazy(() => CashoutUncheckedCreateWithoutProviderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CashoutCreateOrConnectWithoutProviderInputSchema),z.lazy(() => CashoutCreateOrConnectWithoutProviderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CashoutUpsertWithWhereUniqueWithoutProviderInputSchema),z.lazy(() => CashoutUpsertWithWhereUniqueWithoutProviderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CashoutCreateManyProviderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CashoutUpdateWithWhereUniqueWithoutProviderInputSchema),z.lazy(() => CashoutUpdateWithWhereUniqueWithoutProviderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CashoutUpdateManyWithWhereWithoutProviderInputSchema),z.lazy(() => CashoutUpdateManyWithWhereWithoutProviderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CashoutScalarWhereInputSchema),z.lazy(() => CashoutScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedManyWithoutRoleInputSchema: z.ZodType<Prisma.UserCreateNestedManyWithoutRoleInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutRoleInputSchema),z.lazy(() => UserCreateWithoutRoleInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutRoleInputSchema),z.lazy(() => UserUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutRoleInputSchema),z.lazy(() => UserCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyRoleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedCreateNestedManyWithoutRoleInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutRoleInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutRoleInputSchema),z.lazy(() => UserCreateWithoutRoleInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutRoleInputSchema),z.lazy(() => UserUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutRoleInputSchema),z.lazy(() => UserCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyRoleInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateManyWithoutRoleNestedInputSchema: z.ZodType<Prisma.UserUpdateManyWithoutRoleNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutRoleInputSchema),z.lazy(() => UserCreateWithoutRoleInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutRoleInputSchema),z.lazy(() => UserUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutRoleInputSchema),z.lazy(() => UserCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyRoleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutRoleInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutRoleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUncheckedUpdateManyWithoutRoleNestedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutRoleNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutRoleInputSchema),z.lazy(() => UserCreateWithoutRoleInputSchema).array(),z.lazy(() => UserUncheckedCreateWithoutRoleInputSchema),z.lazy(() => UserUncheckedCreateWithoutRoleInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutRoleInputSchema),z.lazy(() => UserCreateOrConnectWithoutRoleInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => UserUpsertWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserCreateManyRoleInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema),z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutRoleInputSchema),z.lazy(() => UserUpdateWithWhereUniqueWithoutRoleInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutRoleInputSchema),z.lazy(() => UserUpdateManyWithWhereWithoutRoleInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ResidenceCreateNestedOneWithoutExpenseInputSchema: z.ZodType<Prisma.ResidenceCreateNestedOneWithoutExpenseInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutExpenseInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutExpenseInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResidenceCreateOrConnectWithoutExpenseInputSchema).optional(),
  connect: z.lazy(() => ResidenceWhereUniqueInputSchema).optional()
}).strict();

export const ExpenseTypeCreateNestedOneWithoutExpenseInputSchema: z.ZodType<Prisma.ExpenseTypeCreateNestedOneWithoutExpenseInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseTypeCreateWithoutExpenseInputSchema),z.lazy(() => ExpenseTypeUncheckedCreateWithoutExpenseInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ExpenseTypeCreateOrConnectWithoutExpenseInputSchema).optional(),
  connect: z.lazy(() => ExpenseTypeWhereUniqueInputSchema).optional()
}).strict();

export const PaymentCreateNestedOneWithoutExpenseInputSchema: z.ZodType<Prisma.PaymentCreateNestedOneWithoutExpenseInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutExpenseInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutExpenseInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PaymentCreateOrConnectWithoutExpenseInputSchema).optional(),
  connect: z.lazy(() => PaymentWhereUniqueInputSchema).optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const ResidenceUpdateOneRequiredWithoutExpenseNestedInputSchema: z.ZodType<Prisma.ResidenceUpdateOneRequiredWithoutExpenseNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceCreateWithoutExpenseInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutExpenseInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResidenceCreateOrConnectWithoutExpenseInputSchema).optional(),
  upsert: z.lazy(() => ResidenceUpsertWithoutExpenseInputSchema).optional(),
  connect: z.lazy(() => ResidenceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ResidenceUpdateToOneWithWhereWithoutExpenseInputSchema),z.lazy(() => ResidenceUpdateWithoutExpenseInputSchema),z.lazy(() => ResidenceUncheckedUpdateWithoutExpenseInputSchema) ]).optional(),
}).strict();

export const ExpenseTypeUpdateOneRequiredWithoutExpenseNestedInputSchema: z.ZodType<Prisma.ExpenseTypeUpdateOneRequiredWithoutExpenseNestedInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseTypeCreateWithoutExpenseInputSchema),z.lazy(() => ExpenseTypeUncheckedCreateWithoutExpenseInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ExpenseTypeCreateOrConnectWithoutExpenseInputSchema).optional(),
  upsert: z.lazy(() => ExpenseTypeUpsertWithoutExpenseInputSchema).optional(),
  connect: z.lazy(() => ExpenseTypeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ExpenseTypeUpdateToOneWithWhereWithoutExpenseInputSchema),z.lazy(() => ExpenseTypeUpdateWithoutExpenseInputSchema),z.lazy(() => ExpenseTypeUncheckedUpdateWithoutExpenseInputSchema) ]).optional(),
}).strict();

export const PaymentUpdateOneRequiredWithoutExpenseNestedInputSchema: z.ZodType<Prisma.PaymentUpdateOneRequiredWithoutExpenseNestedInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutExpenseInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutExpenseInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PaymentCreateOrConnectWithoutExpenseInputSchema).optional(),
  upsert: z.lazy(() => PaymentUpsertWithoutExpenseInputSchema).optional(),
  connect: z.lazy(() => PaymentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PaymentUpdateToOneWithWhereWithoutExpenseInputSchema),z.lazy(() => PaymentUpdateWithoutExpenseInputSchema),z.lazy(() => PaymentUncheckedUpdateWithoutExpenseInputSchema) ]).optional(),
}).strict();

export const ExpenseCreateNestedManyWithoutPaymentInputSchema: z.ZodType<Prisma.ExpenseCreateNestedManyWithoutPaymentInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutPaymentInputSchema),z.lazy(() => ExpenseCreateWithoutPaymentInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutPaymentInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutPaymentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutPaymentInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutPaymentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyPaymentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutPaymentsMadeInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutPaymentsMadeInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPaymentsMadeInputSchema),z.lazy(() => UserUncheckedCreateWithoutPaymentsMadeInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPaymentsMadeInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const AccountCreateNestedOneWithoutPaymentInputSchema: z.ZodType<Prisma.AccountCreateNestedOneWithoutPaymentInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutPaymentInputSchema),z.lazy(() => AccountUncheckedCreateWithoutPaymentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccountCreateOrConnectWithoutPaymentInputSchema).optional(),
  connect: z.lazy(() => AccountWhereUniqueInputSchema).optional()
}).strict();

export const UserCreateNestedOneWithoutPaymentsCreatedInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutPaymentsCreatedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPaymentsCreatedInputSchema),z.lazy(() => UserUncheckedCreateWithoutPaymentsCreatedInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPaymentsCreatedInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const ExpenseUncheckedCreateNestedManyWithoutPaymentInputSchema: z.ZodType<Prisma.ExpenseUncheckedCreateNestedManyWithoutPaymentInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutPaymentInputSchema),z.lazy(() => ExpenseCreateWithoutPaymentInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutPaymentInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutPaymentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutPaymentInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutPaymentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyPaymentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DecimalFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DecimalFieldUpdateOperationsInput> = z.object({
  set: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  increment: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  decrement: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  multiply: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  divide: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional()
}).strict();

export const ExpenseUpdateManyWithoutPaymentNestedInputSchema: z.ZodType<Prisma.ExpenseUpdateManyWithoutPaymentNestedInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutPaymentInputSchema),z.lazy(() => ExpenseCreateWithoutPaymentInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutPaymentInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutPaymentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutPaymentInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutPaymentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutPaymentInputSchema),z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutPaymentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyPaymentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutPaymentInputSchema),z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutPaymentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExpenseUpdateManyWithWhereWithoutPaymentInputSchema),z.lazy(() => ExpenseUpdateManyWithWhereWithoutPaymentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExpenseScalarWhereInputSchema),z.lazy(() => ExpenseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutPaymentsMadeNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutPaymentsMadeNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPaymentsMadeInputSchema),z.lazy(() => UserUncheckedCreateWithoutPaymentsMadeInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPaymentsMadeInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutPaymentsMadeInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutPaymentsMadeInputSchema),z.lazy(() => UserUpdateWithoutPaymentsMadeInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPaymentsMadeInputSchema) ]).optional(),
}).strict();

export const AccountUpdateOneRequiredWithoutPaymentNestedInputSchema: z.ZodType<Prisma.AccountUpdateOneRequiredWithoutPaymentNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutPaymentInputSchema),z.lazy(() => AccountUncheckedCreateWithoutPaymentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccountCreateOrConnectWithoutPaymentInputSchema).optional(),
  upsert: z.lazy(() => AccountUpsertWithoutPaymentInputSchema).optional(),
  connect: z.lazy(() => AccountWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AccountUpdateToOneWithWhereWithoutPaymentInputSchema),z.lazy(() => AccountUpdateWithoutPaymentInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutPaymentInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutPaymentsCreatedNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutPaymentsCreatedNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutPaymentsCreatedInputSchema),z.lazy(() => UserUncheckedCreateWithoutPaymentsCreatedInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutPaymentsCreatedInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutPaymentsCreatedInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutPaymentsCreatedInputSchema),z.lazy(() => UserUpdateWithoutPaymentsCreatedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPaymentsCreatedInputSchema) ]).optional(),
}).strict();

export const ExpenseUncheckedUpdateManyWithoutPaymentNestedInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateManyWithoutPaymentNestedInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutPaymentInputSchema),z.lazy(() => ExpenseCreateWithoutPaymentInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutPaymentInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutPaymentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutPaymentInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutPaymentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutPaymentInputSchema),z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutPaymentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyPaymentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutPaymentInputSchema),z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutPaymentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExpenseUpdateManyWithWhereWithoutPaymentInputSchema),z.lazy(() => ExpenseUpdateManyWithWhereWithoutPaymentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExpenseScalarWhereInputSchema),z.lazy(() => ExpenseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProviderCreateNestedOneWithoutCashoutInputSchema: z.ZodType<Prisma.ProviderCreateNestedOneWithoutCashoutInput> = z.object({
  create: z.union([ z.lazy(() => ProviderCreateWithoutCashoutInputSchema),z.lazy(() => ProviderUncheckedCreateWithoutCashoutInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProviderCreateOrConnectWithoutCashoutInputSchema).optional(),
  connect: z.lazy(() => ProviderWhereUniqueInputSchema).optional()
}).strict();

export const AccountCreateNestedOneWithoutCashoutInputSchema: z.ZodType<Prisma.AccountCreateNestedOneWithoutCashoutInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutCashoutInputSchema),z.lazy(() => AccountUncheckedCreateWithoutCashoutInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccountCreateOrConnectWithoutCashoutInputSchema).optional(),
  connect: z.lazy(() => AccountWhereUniqueInputSchema).optional()
}).strict();

export const ProviderUpdateOneRequiredWithoutCashoutNestedInputSchema: z.ZodType<Prisma.ProviderUpdateOneRequiredWithoutCashoutNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProviderCreateWithoutCashoutInputSchema),z.lazy(() => ProviderUncheckedCreateWithoutCashoutInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProviderCreateOrConnectWithoutCashoutInputSchema).optional(),
  upsert: z.lazy(() => ProviderUpsertWithoutCashoutInputSchema).optional(),
  connect: z.lazy(() => ProviderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProviderUpdateToOneWithWhereWithoutCashoutInputSchema),z.lazy(() => ProviderUpdateWithoutCashoutInputSchema),z.lazy(() => ProviderUncheckedUpdateWithoutCashoutInputSchema) ]).optional(),
}).strict();

export const AccountUpdateOneRequiredWithoutCashoutNestedInputSchema: z.ZodType<Prisma.AccountUpdateOneRequiredWithoutCashoutNestedInput> = z.object({
  create: z.union([ z.lazy(() => AccountCreateWithoutCashoutInputSchema),z.lazy(() => AccountUncheckedCreateWithoutCashoutInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AccountCreateOrConnectWithoutCashoutInputSchema).optional(),
  upsert: z.lazy(() => AccountUpsertWithoutCashoutInputSchema).optional(),
  connect: z.lazy(() => AccountWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AccountUpdateToOneWithWhereWithoutCashoutInputSchema),z.lazy(() => AccountUpdateWithoutCashoutInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutCashoutInputSchema) ]).optional(),
}).strict();

export const ResidenceTypeCreateNestedOneWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ResidenceTypeCreateNestedOneWithoutExpenseTypeInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceTypeCreateWithoutExpenseTypeInputSchema),z.lazy(() => ResidenceTypeUncheckedCreateWithoutExpenseTypeInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResidenceTypeCreateOrConnectWithoutExpenseTypeInputSchema).optional(),
  connect: z.lazy(() => ResidenceTypeWhereUniqueInputSchema).optional()
}).strict();

export const ExpenseCreateNestedManyWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ExpenseCreateNestedManyWithoutExpenseTypeInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseCreateWithoutExpenseTypeInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutExpenseTypeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutExpenseTypeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyExpenseTypeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ExpenseUncheckedCreateNestedManyWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ExpenseUncheckedCreateNestedManyWithoutExpenseTypeInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseCreateWithoutExpenseTypeInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutExpenseTypeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutExpenseTypeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyExpenseTypeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ResidenceTypeUpdateOneRequiredWithoutExpenseTypeNestedInputSchema: z.ZodType<Prisma.ResidenceTypeUpdateOneRequiredWithoutExpenseTypeNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResidenceTypeCreateWithoutExpenseTypeInputSchema),z.lazy(() => ResidenceTypeUncheckedCreateWithoutExpenseTypeInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResidenceTypeCreateOrConnectWithoutExpenseTypeInputSchema).optional(),
  upsert: z.lazy(() => ResidenceTypeUpsertWithoutExpenseTypeInputSchema).optional(),
  connect: z.lazy(() => ResidenceTypeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ResidenceTypeUpdateToOneWithWhereWithoutExpenseTypeInputSchema),z.lazy(() => ResidenceTypeUpdateWithoutExpenseTypeInputSchema),z.lazy(() => ResidenceTypeUncheckedUpdateWithoutExpenseTypeInputSchema) ]).optional(),
}).strict();

export const ExpenseUpdateManyWithoutExpenseTypeNestedInputSchema: z.ZodType<Prisma.ExpenseUpdateManyWithoutExpenseTypeNestedInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseCreateWithoutExpenseTypeInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutExpenseTypeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutExpenseTypeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutExpenseTypeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyExpenseTypeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutExpenseTypeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExpenseUpdateManyWithWhereWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseUpdateManyWithWhereWithoutExpenseTypeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExpenseScalarWhereInputSchema),z.lazy(() => ExpenseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ExpenseUncheckedUpdateManyWithoutExpenseTypeNestedInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateManyWithoutExpenseTypeNestedInput> = z.object({
  create: z.union([ z.lazy(() => ExpenseCreateWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseCreateWithoutExpenseTypeInputSchema).array(),z.lazy(() => ExpenseUncheckedCreateWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutExpenseTypeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ExpenseCreateOrConnectWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseCreateOrConnectWithoutExpenseTypeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseUpsertWithWhereUniqueWithoutExpenseTypeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ExpenseCreateManyExpenseTypeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ExpenseWhereUniqueInputSchema),z.lazy(() => ExpenseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseUpdateWithWhereUniqueWithoutExpenseTypeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ExpenseUpdateManyWithWhereWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseUpdateManyWithWhereWithoutExpenseTypeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ExpenseScalarWhereInputSchema),z.lazy(() => ExpenseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CommunityCreateNestedOneWithoutAccountInputSchema: z.ZodType<Prisma.CommunityCreateNestedOneWithoutAccountInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutAccountInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutAccountInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutAccountInputSchema).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional()
}).strict();

export const PaymentCreateNestedManyWithoutAccountInputSchema: z.ZodType<Prisma.PaymentCreateNestedManyWithoutAccountInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutAccountInputSchema),z.lazy(() => PaymentCreateWithoutAccountInputSchema).array(),z.lazy(() => PaymentUncheckedCreateWithoutAccountInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutAccountInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentCreateOrConnectWithoutAccountInputSchema),z.lazy(() => PaymentCreateOrConnectWithoutAccountInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentCreateManyAccountInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CashoutCreateNestedManyWithoutAccountInputSchema: z.ZodType<Prisma.CashoutCreateNestedManyWithoutAccountInput> = z.object({
  create: z.union([ z.lazy(() => CashoutCreateWithoutAccountInputSchema),z.lazy(() => CashoutCreateWithoutAccountInputSchema).array(),z.lazy(() => CashoutUncheckedCreateWithoutAccountInputSchema),z.lazy(() => CashoutUncheckedCreateWithoutAccountInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CashoutCreateOrConnectWithoutAccountInputSchema),z.lazy(() => CashoutCreateOrConnectWithoutAccountInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CashoutCreateManyAccountInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PaymentUncheckedCreateNestedManyWithoutAccountInputSchema: z.ZodType<Prisma.PaymentUncheckedCreateNestedManyWithoutAccountInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutAccountInputSchema),z.lazy(() => PaymentCreateWithoutAccountInputSchema).array(),z.lazy(() => PaymentUncheckedCreateWithoutAccountInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutAccountInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentCreateOrConnectWithoutAccountInputSchema),z.lazy(() => PaymentCreateOrConnectWithoutAccountInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentCreateManyAccountInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CashoutUncheckedCreateNestedManyWithoutAccountInputSchema: z.ZodType<Prisma.CashoutUncheckedCreateNestedManyWithoutAccountInput> = z.object({
  create: z.union([ z.lazy(() => CashoutCreateWithoutAccountInputSchema),z.lazy(() => CashoutCreateWithoutAccountInputSchema).array(),z.lazy(() => CashoutUncheckedCreateWithoutAccountInputSchema),z.lazy(() => CashoutUncheckedCreateWithoutAccountInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CashoutCreateOrConnectWithoutAccountInputSchema),z.lazy(() => CashoutCreateOrConnectWithoutAccountInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CashoutCreateManyAccountInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BigIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BigIntFieldUpdateOperationsInput> = z.object({
  set: z.bigint().optional(),
  increment: z.bigint().optional(),
  decrement: z.bigint().optional(),
  multiply: z.bigint().optional(),
  divide: z.bigint().optional()
}).strict();

export const CommunityUpdateOneRequiredWithoutAccountNestedInputSchema: z.ZodType<Prisma.CommunityUpdateOneRequiredWithoutAccountNestedInput> = z.object({
  create: z.union([ z.lazy(() => CommunityCreateWithoutAccountInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutAccountInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CommunityCreateOrConnectWithoutAccountInputSchema).optional(),
  upsert: z.lazy(() => CommunityUpsertWithoutAccountInputSchema).optional(),
  connect: z.lazy(() => CommunityWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CommunityUpdateToOneWithWhereWithoutAccountInputSchema),z.lazy(() => CommunityUpdateWithoutAccountInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutAccountInputSchema) ]).optional(),
}).strict();

export const PaymentUpdateManyWithoutAccountNestedInputSchema: z.ZodType<Prisma.PaymentUpdateManyWithoutAccountNestedInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutAccountInputSchema),z.lazy(() => PaymentCreateWithoutAccountInputSchema).array(),z.lazy(() => PaymentUncheckedCreateWithoutAccountInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutAccountInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentCreateOrConnectWithoutAccountInputSchema),z.lazy(() => PaymentCreateOrConnectWithoutAccountInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PaymentUpsertWithWhereUniqueWithoutAccountInputSchema),z.lazy(() => PaymentUpsertWithWhereUniqueWithoutAccountInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentCreateManyAccountInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PaymentUpdateWithWhereUniqueWithoutAccountInputSchema),z.lazy(() => PaymentUpdateWithWhereUniqueWithoutAccountInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PaymentUpdateManyWithWhereWithoutAccountInputSchema),z.lazy(() => PaymentUpdateManyWithWhereWithoutAccountInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PaymentScalarWhereInputSchema),z.lazy(() => PaymentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CashoutUpdateManyWithoutAccountNestedInputSchema: z.ZodType<Prisma.CashoutUpdateManyWithoutAccountNestedInput> = z.object({
  create: z.union([ z.lazy(() => CashoutCreateWithoutAccountInputSchema),z.lazy(() => CashoutCreateWithoutAccountInputSchema).array(),z.lazy(() => CashoutUncheckedCreateWithoutAccountInputSchema),z.lazy(() => CashoutUncheckedCreateWithoutAccountInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CashoutCreateOrConnectWithoutAccountInputSchema),z.lazy(() => CashoutCreateOrConnectWithoutAccountInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CashoutUpsertWithWhereUniqueWithoutAccountInputSchema),z.lazy(() => CashoutUpsertWithWhereUniqueWithoutAccountInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CashoutCreateManyAccountInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CashoutUpdateWithWhereUniqueWithoutAccountInputSchema),z.lazy(() => CashoutUpdateWithWhereUniqueWithoutAccountInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CashoutUpdateManyWithWhereWithoutAccountInputSchema),z.lazy(() => CashoutUpdateManyWithWhereWithoutAccountInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CashoutScalarWhereInputSchema),z.lazy(() => CashoutScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PaymentUncheckedUpdateManyWithoutAccountNestedInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateManyWithoutAccountNestedInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutAccountInputSchema),z.lazy(() => PaymentCreateWithoutAccountInputSchema).array(),z.lazy(() => PaymentUncheckedCreateWithoutAccountInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutAccountInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentCreateOrConnectWithoutAccountInputSchema),z.lazy(() => PaymentCreateOrConnectWithoutAccountInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PaymentUpsertWithWhereUniqueWithoutAccountInputSchema),z.lazy(() => PaymentUpsertWithWhereUniqueWithoutAccountInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentCreateManyAccountInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PaymentUpdateWithWhereUniqueWithoutAccountInputSchema),z.lazy(() => PaymentUpdateWithWhereUniqueWithoutAccountInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PaymentUpdateManyWithWhereWithoutAccountInputSchema),z.lazy(() => PaymentUpdateManyWithWhereWithoutAccountInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PaymentScalarWhereInputSchema),z.lazy(() => PaymentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CashoutUncheckedUpdateManyWithoutAccountNestedInputSchema: z.ZodType<Prisma.CashoutUncheckedUpdateManyWithoutAccountNestedInput> = z.object({
  create: z.union([ z.lazy(() => CashoutCreateWithoutAccountInputSchema),z.lazy(() => CashoutCreateWithoutAccountInputSchema).array(),z.lazy(() => CashoutUncheckedCreateWithoutAccountInputSchema),z.lazy(() => CashoutUncheckedCreateWithoutAccountInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CashoutCreateOrConnectWithoutAccountInputSchema),z.lazy(() => CashoutCreateOrConnectWithoutAccountInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CashoutUpsertWithWhereUniqueWithoutAccountInputSchema),z.lazy(() => CashoutUpsertWithWhereUniqueWithoutAccountInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CashoutCreateManyAccountInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CashoutWhereUniqueInputSchema),z.lazy(() => CashoutWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CashoutUpdateWithWhereUniqueWithoutAccountInputSchema),z.lazy(() => CashoutUpdateWithWhereUniqueWithoutAccountInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CashoutUpdateManyWithWhereWithoutAccountInputSchema),z.lazy(() => CashoutUpdateManyWithWhereWithoutAccountInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CashoutScalarWhereInputSchema),z.lazy(() => CashoutScalarWhereInputSchema).array() ]).optional(),
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

export const NestedBoolNullableFilterSchema: z.ZodType<Prisma.NestedBoolNullableFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableFilterSchema) ]).optional().nullable(),
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

export const NestedBoolNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolNullableWithAggregatesFilter> = z.object({
  equals: z.boolean().optional().nullable(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolNullableFilterSchema).optional()
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

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
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

export const NestedDecimalFilterSchema: z.ZodType<Prisma.NestedDecimalFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
}).strict();

export const NestedDecimalWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDecimalWithAggregatesFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalFilterSchema).optional()
}).strict();

export const NestedBigIntFilterSchema: z.ZodType<Prisma.NestedBigIntFilter> = z.object({
  equals: z.bigint().optional(),
  in: z.bigint().array().optional(),
  notIn: z.bigint().array().optional(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntFilterSchema) ]).optional(),
}).strict();

export const NestedBigIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBigIntWithAggregatesFilter> = z.object({
  equals: z.bigint().optional(),
  in: z.bigint().array().optional(),
  notIn: z.bigint().array().optional(),
  lt: z.bigint().optional(),
  lte: z.bigint().optional(),
  gt: z.bigint().optional(),
  gte: z.bigint().optional(),
  not: z.union([ z.bigint(),z.lazy(() => NestedBigIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBigIntFilterSchema).optional(),
  _max: z.lazy(() => NestedBigIntFilterSchema).optional()
}).strict();

export const ResidenceCreateWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceCreateWithoutCommunityInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  Owner: z.lazy(() => UserCreateNestedOneWithoutResidenceInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeCreateNestedOneWithoutResidenceInputSchema),
  ParkingSlot: z.lazy(() => ParkingSlotCreateNestedManyWithoutResidenceInputSchema).optional(),
  Expense: z.lazy(() => ExpenseCreateNestedManyWithoutResidenceInputSchema).optional(),
  Resident: z.lazy(() => UserCreateNestedManyWithoutResidentInInputSchema).optional()
}).strict();

export const ResidenceUncheckedCreateWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceUncheckedCreateWithoutCommunityInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  owner_id: z.string().optional().nullable(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.number().int(),
  ParkingSlot: z.lazy(() => ParkingSlotUncheckedCreateNestedManyWithoutResidenceInputSchema).optional(),
  Expense: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutResidenceInputSchema).optional(),
  Resident: z.lazy(() => UserUncheckedCreateNestedManyWithoutResidentInInputSchema).optional()
}).strict();

export const ResidenceCreateOrConnectWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceCreateOrConnectWithoutCommunityInput> = z.object({
  where: z.lazy(() => ResidenceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResidenceCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const ResidenceCreateManyCommunityInputEnvelopeSchema: z.ZodType<Prisma.ResidenceCreateManyCommunityInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ResidenceCreateManyCommunityInputSchema),z.lazy(() => ResidenceCreateManyCommunityInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProviderCreateWithoutCommunityInputSchema: z.ZodType<Prisma.ProviderCreateWithoutCommunityInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  contactName: z.string(),
  description: z.string(),
  phone: z.string(),
  email: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  active: z.boolean(),
  Cashout: z.lazy(() => CashoutCreateNestedManyWithoutProviderInputSchema).optional()
}).strict();

export const ProviderUncheckedCreateWithoutCommunityInputSchema: z.ZodType<Prisma.ProviderUncheckedCreateWithoutCommunityInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  contactName: z.string(),
  description: z.string(),
  phone: z.string(),
  email: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  active: z.boolean(),
  Cashout: z.lazy(() => CashoutUncheckedCreateNestedManyWithoutProviderInputSchema).optional()
}).strict();

export const ProviderCreateOrConnectWithoutCommunityInputSchema: z.ZodType<Prisma.ProviderCreateOrConnectWithoutCommunityInput> = z.object({
  where: z.lazy(() => ProviderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProviderCreateWithoutCommunityInputSchema),z.lazy(() => ProviderUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const ProviderCreateManyCommunityInputEnvelopeSchema: z.ZodType<Prisma.ProviderCreateManyCommunityInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProviderCreateManyCommunityInputSchema),z.lazy(() => ProviderCreateManyCommunityInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserCreateWithoutCommunityInputSchema: z.ZodType<Prisma.UserCreateWithoutCommunityInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  Role: z.lazy(() => RoleCreateNestedOneWithoutUserInputSchema).optional(),
  paymentsCreated: z.lazy(() => PaymentCreateNestedManyWithoutAdminInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentCreateNestedManyWithoutUserInputSchema).optional(),
  Residence: z.lazy(() => ResidenceCreateNestedManyWithoutOwnerInputSchema).optional(),
  ResidentIn: z.lazy(() => ResidenceCreateNestedOneWithoutResidentInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutCommunityInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutCommunityInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  role_id: z.number().int(),
  residence_id: z.string().optional().nullable(),
  paymentsCreated: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutAdminInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutCommunityInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCommunityInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutCommunityInputSchema),z.lazy(() => UserUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const UserCreateManyCommunityInputEnvelopeSchema: z.ZodType<Prisma.UserCreateManyCommunityInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserCreateManyCommunityInputSchema),z.lazy(() => UserCreateManyCommunityInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AccountCreateWithoutCommunityInputSchema: z.ZodType<Prisma.AccountCreateWithoutCommunityInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  active: z.boolean(),
  balance: z.bigint(),
  Payment: z.lazy(() => PaymentCreateNestedManyWithoutAccountInputSchema).optional(),
  Cashout: z.lazy(() => CashoutCreateNestedManyWithoutAccountInputSchema).optional()
}).strict();

export const AccountUncheckedCreateWithoutCommunityInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutCommunityInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  active: z.boolean(),
  balance: z.bigint(),
  Payment: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutAccountInputSchema).optional(),
  Cashout: z.lazy(() => CashoutUncheckedCreateNestedManyWithoutAccountInputSchema).optional()
}).strict();

export const AccountCreateOrConnectWithoutCommunityInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutCommunityInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccountCreateWithoutCommunityInputSchema),z.lazy(() => AccountUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const AccountCreateManyCommunityInputEnvelopeSchema: z.ZodType<Prisma.AccountCreateManyCommunityInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AccountCreateManyCommunityInputSchema),z.lazy(() => AccountCreateManyCommunityInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ResidenceTypeCreateWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceTypeCreateWithoutCommunityInput> = z.object({
  title: z.string(),
  description: z.string(),
  Residence: z.lazy(() => ResidenceCreateNestedManyWithoutResidenceTypeInputSchema).optional(),
  ExpenseType: z.lazy(() => ExpenseTypeCreateNestedManyWithoutResidenceTypeInputSchema).optional()
}).strict();

export const ResidenceTypeUncheckedCreateWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceTypeUncheckedCreateWithoutCommunityInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  description: z.string(),
  Residence: z.lazy(() => ResidenceUncheckedCreateNestedManyWithoutResidenceTypeInputSchema).optional(),
  ExpenseType: z.lazy(() => ExpenseTypeUncheckedCreateNestedManyWithoutResidenceTypeInputSchema).optional()
}).strict();

export const ResidenceTypeCreateOrConnectWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceTypeCreateOrConnectWithoutCommunityInput> = z.object({
  where: z.lazy(() => ResidenceTypeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResidenceTypeCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const ResidenceTypeCreateManyCommunityInputEnvelopeSchema: z.ZodType<Prisma.ResidenceTypeCreateManyCommunityInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ResidenceTypeCreateManyCommunityInputSchema),z.lazy(() => ResidenceTypeCreateManyCommunityInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ResidenceUpsertWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceUpsertWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => ResidenceWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResidenceUpdateWithoutCommunityInputSchema),z.lazy(() => ResidenceUncheckedUpdateWithoutCommunityInputSchema) ]),
  create: z.union([ z.lazy(() => ResidenceCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const ResidenceUpdateWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceUpdateWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => ResidenceWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResidenceUpdateWithoutCommunityInputSchema),z.lazy(() => ResidenceUncheckedUpdateWithoutCommunityInputSchema) ]),
}).strict();

export const ResidenceUpdateManyWithWhereWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceUpdateManyWithWhereWithoutCommunityInput> = z.object({
  where: z.lazy(() => ResidenceScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResidenceUpdateManyMutationInputSchema),z.lazy(() => ResidenceUncheckedUpdateManyWithoutCommunityInputSchema) ]),
}).strict();

export const ResidenceScalarWhereInputSchema: z.ZodType<Prisma.ResidenceScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ResidenceScalarWhereInputSchema),z.lazy(() => ResidenceScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResidenceScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResidenceScalarWhereInputSchema),z.lazy(() => ResidenceScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  owner_id: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  community_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contacts: z.lazy(() => JsonNullableFilterSchema).optional(),
  residenceType_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const ProviderUpsertWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.ProviderUpsertWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => ProviderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProviderUpdateWithoutCommunityInputSchema),z.lazy(() => ProviderUncheckedUpdateWithoutCommunityInputSchema) ]),
  create: z.union([ z.lazy(() => ProviderCreateWithoutCommunityInputSchema),z.lazy(() => ProviderUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const ProviderUpdateWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.ProviderUpdateWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => ProviderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProviderUpdateWithoutCommunityInputSchema),z.lazy(() => ProviderUncheckedUpdateWithoutCommunityInputSchema) ]),
}).strict();

export const ProviderUpdateManyWithWhereWithoutCommunityInputSchema: z.ZodType<Prisma.ProviderUpdateManyWithWhereWithoutCommunityInput> = z.object({
  where: z.lazy(() => ProviderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProviderUpdateManyMutationInputSchema),z.lazy(() => ProviderUncheckedUpdateManyWithoutCommunityInputSchema) ]),
}).strict();

export const ProviderScalarWhereInputSchema: z.ZodType<Prisma.ProviderScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProviderScalarWhereInputSchema),z.lazy(() => ProviderScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProviderScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProviderScalarWhereInputSchema),z.lazy(() => ProviderScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contactName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  website: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  community_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const UserUpsertWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserUpdateWithoutCommunityInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCommunityInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutCommunityInputSchema),z.lazy(() => UserUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const UserUpdateWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserUpdateWithoutCommunityInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCommunityInputSchema) ]),
}).strict();

export const UserUpdateManyWithWhereWithoutCommunityInputSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutCommunityInput> = z.object({
  where: z.lazy(() => UserScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserUpdateManyMutationInputSchema),z.lazy(() => UserUncheckedUpdateManyWithoutCommunityInputSchema) ]),
}).strict();

export const UserScalarWhereInputSchema: z.ZodType<Prisma.UserScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereInputSchema),z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  identification: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  firstName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  lastName: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isVerified: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  isActive: z.union([ z.lazy(() => BoolNullableFilterSchema),z.boolean() ]).optional().nullable(),
  community_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  role_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  residence_id: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const AccountUpsertWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AccountUpdateWithoutCommunityInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutCommunityInputSchema) ]),
  create: z.union([ z.lazy(() => AccountCreateWithoutCommunityInputSchema),z.lazy(() => AccountUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const AccountUpdateWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateWithoutCommunityInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutCommunityInputSchema) ]),
}).strict();

export const AccountUpdateManyWithWhereWithoutCommunityInputSchema: z.ZodType<Prisma.AccountUpdateManyWithWhereWithoutCommunityInput> = z.object({
  where: z.lazy(() => AccountScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AccountUpdateManyMutationInputSchema),z.lazy(() => AccountUncheckedUpdateManyWithoutCommunityInputSchema) ]),
}).strict();

export const AccountScalarWhereInputSchema: z.ZodType<Prisma.AccountScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AccountScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AccountScalarWhereInputSchema),z.lazy(() => AccountScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  community_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  balance: z.union([ z.lazy(() => BigIntFilterSchema),z.bigint() ]).optional(),
}).strict();

export const ResidenceTypeUpsertWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceTypeUpsertWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => ResidenceTypeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResidenceTypeUpdateWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeUncheckedUpdateWithoutCommunityInputSchema) ]),
  create: z.union([ z.lazy(() => ResidenceTypeCreateWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeUncheckedCreateWithoutCommunityInputSchema) ]),
}).strict();

export const ResidenceTypeUpdateWithWhereUniqueWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceTypeUpdateWithWhereUniqueWithoutCommunityInput> = z.object({
  where: z.lazy(() => ResidenceTypeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResidenceTypeUpdateWithoutCommunityInputSchema),z.lazy(() => ResidenceTypeUncheckedUpdateWithoutCommunityInputSchema) ]),
}).strict();

export const ResidenceTypeUpdateManyWithWhereWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceTypeUpdateManyWithWhereWithoutCommunityInput> = z.object({
  where: z.lazy(() => ResidenceTypeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResidenceTypeUpdateManyMutationInputSchema),z.lazy(() => ResidenceTypeUncheckedUpdateManyWithoutCommunityInputSchema) ]),
}).strict();

export const ResidenceTypeScalarWhereInputSchema: z.ZodType<Prisma.ResidenceTypeScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ResidenceTypeScalarWhereInputSchema),z.lazy(() => ResidenceTypeScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResidenceTypeScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResidenceTypeScalarWhereInputSchema),z.lazy(() => ResidenceTypeScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  community_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const CommunityCreateWithoutUserInputSchema: z.ZodType<Prisma.CommunityCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  address: z.string(),
  Residence: z.lazy(() => ResidenceCreateNestedManyWithoutCommunityInputSchema).optional(),
  Provider: z.lazy(() => ProviderCreateNestedManyWithoutCommunityInputSchema).optional(),
  Account: z.lazy(() => AccountCreateNestedManyWithoutCommunityInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.CommunityUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  address: z.string(),
  Residence: z.lazy(() => ResidenceUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  Provider: z.lazy(() => ProviderUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  Account: z.lazy(() => AccountUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUncheckedCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.CommunityCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => CommunityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CommunityCreateWithoutUserInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const RoleCreateWithoutUserInputSchema: z.ZodType<Prisma.RoleCreateWithoutUserInput> = z.object({
  title: z.string(),
  description: z.string(),
  modules: z.string()
}).strict();

export const RoleUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.RoleUncheckedCreateWithoutUserInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  description: z.string(),
  modules: z.string()
}).strict();

export const RoleCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.RoleCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => RoleWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RoleCreateWithoutUserInputSchema),z.lazy(() => RoleUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const PaymentCreateWithoutAdminInputSchema: z.ZodType<Prisma.PaymentCreateWithoutAdminInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  registerDate: z.coerce.date(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  voucherImage: z.string(),
  isEmailSend: z.boolean(),
  Expense: z.lazy(() => ExpenseCreateNestedManyWithoutPaymentInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedOneWithoutPaymentsMadeInputSchema),
  Account: z.lazy(() => AccountCreateNestedOneWithoutPaymentInputSchema)
}).strict();

export const PaymentUncheckedCreateWithoutAdminInputSchema: z.ZodType<Prisma.PaymentUncheckedCreateWithoutAdminInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  registerDate: z.coerce.date(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  owner_id: z.string(),
  voucherImage: z.string(),
  isEmailSend: z.boolean(),
  account_id: z.string(),
  Expense: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutPaymentInputSchema).optional()
}).strict();

export const PaymentCreateOrConnectWithoutAdminInputSchema: z.ZodType<Prisma.PaymentCreateOrConnectWithoutAdminInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PaymentCreateWithoutAdminInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutAdminInputSchema) ]),
}).strict();

export const PaymentCreateManyAdminInputEnvelopeSchema: z.ZodType<Prisma.PaymentCreateManyAdminInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PaymentCreateManyAdminInputSchema),z.lazy(() => PaymentCreateManyAdminInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PaymentCreateWithoutUserInputSchema: z.ZodType<Prisma.PaymentCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  registerDate: z.coerce.date(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  voucherImage: z.string(),
  isEmailSend: z.boolean(),
  Expense: z.lazy(() => ExpenseCreateNestedManyWithoutPaymentInputSchema).optional(),
  Account: z.lazy(() => AccountCreateNestedOneWithoutPaymentInputSchema),
  Admin: z.lazy(() => UserCreateNestedOneWithoutPaymentsCreatedInputSchema)
}).strict();

export const PaymentUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.PaymentUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  registerDate: z.coerce.date(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  voucherImage: z.string(),
  isEmailSend: z.boolean(),
  account_id: z.string(),
  created_by: z.string(),
  Expense: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutPaymentInputSchema).optional()
}).strict();

export const PaymentCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.PaymentCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PaymentCreateWithoutUserInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const PaymentCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.PaymentCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PaymentCreateManyUserInputSchema),z.lazy(() => PaymentCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ResidenceCreateWithoutOwnerInputSchema: z.ZodType<Prisma.ResidenceCreateWithoutOwnerInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutResidenceInputSchema),
  ResidenceType: z.lazy(() => ResidenceTypeCreateNestedOneWithoutResidenceInputSchema),
  ParkingSlot: z.lazy(() => ParkingSlotCreateNestedManyWithoutResidenceInputSchema).optional(),
  Expense: z.lazy(() => ExpenseCreateNestedManyWithoutResidenceInputSchema).optional(),
  Resident: z.lazy(() => UserCreateNestedManyWithoutResidentInInputSchema).optional()
}).strict();

export const ResidenceUncheckedCreateWithoutOwnerInputSchema: z.ZodType<Prisma.ResidenceUncheckedCreateWithoutOwnerInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  community_id: z.string(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.number().int(),
  ParkingSlot: z.lazy(() => ParkingSlotUncheckedCreateNestedManyWithoutResidenceInputSchema).optional(),
  Expense: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutResidenceInputSchema).optional(),
  Resident: z.lazy(() => UserUncheckedCreateNestedManyWithoutResidentInInputSchema).optional()
}).strict();

export const ResidenceCreateOrConnectWithoutOwnerInputSchema: z.ZodType<Prisma.ResidenceCreateOrConnectWithoutOwnerInput> = z.object({
  where: z.lazy(() => ResidenceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResidenceCreateWithoutOwnerInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const ResidenceCreateManyOwnerInputEnvelopeSchema: z.ZodType<Prisma.ResidenceCreateManyOwnerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ResidenceCreateManyOwnerInputSchema),z.lazy(() => ResidenceCreateManyOwnerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ResidenceCreateWithoutResidentInputSchema: z.ZodType<Prisma.ResidenceCreateWithoutResidentInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  Owner: z.lazy(() => UserCreateNestedOneWithoutResidenceInputSchema).optional(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutResidenceInputSchema),
  ResidenceType: z.lazy(() => ResidenceTypeCreateNestedOneWithoutResidenceInputSchema),
  ParkingSlot: z.lazy(() => ParkingSlotCreateNestedManyWithoutResidenceInputSchema).optional(),
  Expense: z.lazy(() => ExpenseCreateNestedManyWithoutResidenceInputSchema).optional()
}).strict();

export const ResidenceUncheckedCreateWithoutResidentInputSchema: z.ZodType<Prisma.ResidenceUncheckedCreateWithoutResidentInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  owner_id: z.string().optional().nullable(),
  community_id: z.string(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.number().int(),
  ParkingSlot: z.lazy(() => ParkingSlotUncheckedCreateNestedManyWithoutResidenceInputSchema).optional(),
  Expense: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutResidenceInputSchema).optional()
}).strict();

export const ResidenceCreateOrConnectWithoutResidentInputSchema: z.ZodType<Prisma.ResidenceCreateOrConnectWithoutResidentInput> = z.object({
  where: z.lazy(() => ResidenceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResidenceCreateWithoutResidentInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutResidentInputSchema) ]),
}).strict();

export const CommunityUpsertWithoutUserInputSchema: z.ZodType<Prisma.CommunityUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => CommunityUpdateWithoutUserInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => CommunityCreateWithoutUserInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => CommunityWhereInputSchema).optional()
}).strict();

export const CommunityUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.CommunityUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => CommunityWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CommunityUpdateWithoutUserInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const CommunityUpdateWithoutUserInputSchema: z.ZodType<Prisma.CommunityUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Provider: z.lazy(() => ProviderUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Account: z.lazy(() => AccountUpdateManyWithoutCommunityNestedInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const CommunityUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.CommunityUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Provider: z.lazy(() => ProviderUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Account: z.lazy(() => AccountUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const RoleUpsertWithoutUserInputSchema: z.ZodType<Prisma.RoleUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => RoleUpdateWithoutUserInputSchema),z.lazy(() => RoleUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => RoleCreateWithoutUserInputSchema),z.lazy(() => RoleUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => RoleWhereInputSchema).optional()
}).strict();

export const RoleUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.RoleUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => RoleWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RoleUpdateWithoutUserInputSchema),z.lazy(() => RoleUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const RoleUpdateWithoutUserInputSchema: z.ZodType<Prisma.RoleUpdateWithoutUserInput> = z.object({
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  modules: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RoleUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.RoleUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  modules: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentUpsertWithWhereUniqueWithoutAdminInputSchema: z.ZodType<Prisma.PaymentUpsertWithWhereUniqueWithoutAdminInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PaymentUpdateWithoutAdminInputSchema),z.lazy(() => PaymentUncheckedUpdateWithoutAdminInputSchema) ]),
  create: z.union([ z.lazy(() => PaymentCreateWithoutAdminInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutAdminInputSchema) ]),
}).strict();

export const PaymentUpdateWithWhereUniqueWithoutAdminInputSchema: z.ZodType<Prisma.PaymentUpdateWithWhereUniqueWithoutAdminInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PaymentUpdateWithoutAdminInputSchema),z.lazy(() => PaymentUncheckedUpdateWithoutAdminInputSchema) ]),
}).strict();

export const PaymentUpdateManyWithWhereWithoutAdminInputSchema: z.ZodType<Prisma.PaymentUpdateManyWithWhereWithoutAdminInput> = z.object({
  where: z.lazy(() => PaymentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PaymentUpdateManyMutationInputSchema),z.lazy(() => PaymentUncheckedUpdateManyWithoutAdminInputSchema) ]),
}).strict();

export const PaymentScalarWhereInputSchema: z.ZodType<Prisma.PaymentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PaymentScalarWhereInputSchema),z.lazy(() => PaymentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentScalarWhereInputSchema),z.lazy(() => PaymentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  registerDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  amount: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  owner_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  voucherImage: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isEmailSend: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  account_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  created_by: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const PaymentUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.PaymentUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PaymentUpdateWithoutUserInputSchema),z.lazy(() => PaymentUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => PaymentCreateWithoutUserInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const PaymentUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.PaymentUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PaymentUpdateWithoutUserInputSchema),z.lazy(() => PaymentUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const PaymentUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.PaymentUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => PaymentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PaymentUpdateManyMutationInputSchema),z.lazy(() => PaymentUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ResidenceUpsertWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.ResidenceUpsertWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => ResidenceWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResidenceUpdateWithoutOwnerInputSchema),z.lazy(() => ResidenceUncheckedUpdateWithoutOwnerInputSchema) ]),
  create: z.union([ z.lazy(() => ResidenceCreateWithoutOwnerInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict();

export const ResidenceUpdateWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.ResidenceUpdateWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => ResidenceWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResidenceUpdateWithoutOwnerInputSchema),z.lazy(() => ResidenceUncheckedUpdateWithoutOwnerInputSchema) ]),
}).strict();

export const ResidenceUpdateManyWithWhereWithoutOwnerInputSchema: z.ZodType<Prisma.ResidenceUpdateManyWithWhereWithoutOwnerInput> = z.object({
  where: z.lazy(() => ResidenceScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResidenceUpdateManyMutationInputSchema),z.lazy(() => ResidenceUncheckedUpdateManyWithoutOwnerInputSchema) ]),
}).strict();

export const ResidenceUpsertWithoutResidentInputSchema: z.ZodType<Prisma.ResidenceUpsertWithoutResidentInput> = z.object({
  update: z.union([ z.lazy(() => ResidenceUpdateWithoutResidentInputSchema),z.lazy(() => ResidenceUncheckedUpdateWithoutResidentInputSchema) ]),
  create: z.union([ z.lazy(() => ResidenceCreateWithoutResidentInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutResidentInputSchema) ]),
  where: z.lazy(() => ResidenceWhereInputSchema).optional()
}).strict();

export const ResidenceUpdateToOneWithWhereWithoutResidentInputSchema: z.ZodType<Prisma.ResidenceUpdateToOneWithWhereWithoutResidentInput> = z.object({
  where: z.lazy(() => ResidenceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ResidenceUpdateWithoutResidentInputSchema),z.lazy(() => ResidenceUncheckedUpdateWithoutResidentInputSchema) ]),
}).strict();

export const ResidenceUpdateWithoutResidentInputSchema: z.ZodType<Prisma.ResidenceUpdateWithoutResidentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  Owner: z.lazy(() => UserUpdateOneWithoutResidenceNestedInputSchema).optional(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutResidenceNestedInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUpdateOneRequiredWithoutResidenceNestedInputSchema).optional(),
  ParkingSlot: z.lazy(() => ParkingSlotUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Expense: z.lazy(() => ExpenseUpdateManyWithoutResidenceNestedInputSchema).optional()
}).strict();

export const ResidenceUncheckedUpdateWithoutResidentInputSchema: z.ZodType<Prisma.ResidenceUncheckedUpdateWithoutResidentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ParkingSlot: z.lazy(() => ParkingSlotUncheckedUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Expense: z.lazy(() => ExpenseUncheckedUpdateManyWithoutResidenceNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutResidenceInputSchema: z.ZodType<Prisma.UserCreateWithoutResidenceInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutUserInputSchema).optional(),
  Role: z.lazy(() => RoleCreateNestedOneWithoutUserInputSchema).optional(),
  paymentsCreated: z.lazy(() => PaymentCreateNestedManyWithoutAdminInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentCreateNestedManyWithoutUserInputSchema).optional(),
  ResidentIn: z.lazy(() => ResidenceCreateNestedOneWithoutResidentInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutResidenceInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutResidenceInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  community_id: z.string().optional(),
  role_id: z.number().int(),
  residence_id: z.string().optional().nullable(),
  paymentsCreated: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutAdminInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutResidenceInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutResidenceInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutResidenceInputSchema),z.lazy(() => UserUncheckedCreateWithoutResidenceInputSchema) ]),
}).strict();

export const CommunityCreateWithoutResidenceInputSchema: z.ZodType<Prisma.CommunityCreateWithoutResidenceInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  address: z.string(),
  Provider: z.lazy(() => ProviderCreateNestedManyWithoutCommunityInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutCommunityInputSchema).optional(),
  Account: z.lazy(() => AccountCreateNestedManyWithoutCommunityInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityUncheckedCreateWithoutResidenceInputSchema: z.ZodType<Prisma.CommunityUncheckedCreateWithoutResidenceInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  address: z.string(),
  Provider: z.lazy(() => ProviderUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  Account: z.lazy(() => AccountUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUncheckedCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityCreateOrConnectWithoutResidenceInputSchema: z.ZodType<Prisma.CommunityCreateOrConnectWithoutResidenceInput> = z.object({
  where: z.lazy(() => CommunityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CommunityCreateWithoutResidenceInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutResidenceInputSchema) ]),
}).strict();

export const ResidenceTypeCreateWithoutResidenceInputSchema: z.ZodType<Prisma.ResidenceTypeCreateWithoutResidenceInput> = z.object({
  title: z.string(),
  description: z.string(),
  ExpenseType: z.lazy(() => ExpenseTypeCreateNestedManyWithoutResidenceTypeInputSchema).optional(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutResidenceTypeInputSchema)
}).strict();

export const ResidenceTypeUncheckedCreateWithoutResidenceInputSchema: z.ZodType<Prisma.ResidenceTypeUncheckedCreateWithoutResidenceInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  description: z.string(),
  community_id: z.string(),
  ExpenseType: z.lazy(() => ExpenseTypeUncheckedCreateNestedManyWithoutResidenceTypeInputSchema).optional()
}).strict();

export const ResidenceTypeCreateOrConnectWithoutResidenceInputSchema: z.ZodType<Prisma.ResidenceTypeCreateOrConnectWithoutResidenceInput> = z.object({
  where: z.lazy(() => ResidenceTypeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResidenceTypeCreateWithoutResidenceInputSchema),z.lazy(() => ResidenceTypeUncheckedCreateWithoutResidenceInputSchema) ]),
}).strict();

export const ParkingSlotCreateWithoutResidenceInputSchema: z.ZodType<Prisma.ParkingSlotCreateWithoutResidenceInput> = z.object({
  id: z.string().optional(),
  number: z.number().int()
}).strict();

export const ParkingSlotUncheckedCreateWithoutResidenceInputSchema: z.ZodType<Prisma.ParkingSlotUncheckedCreateWithoutResidenceInput> = z.object({
  id: z.string().optional(),
  number: z.number().int()
}).strict();

export const ParkingSlotCreateOrConnectWithoutResidenceInputSchema: z.ZodType<Prisma.ParkingSlotCreateOrConnectWithoutResidenceInput> = z.object({
  where: z.lazy(() => ParkingSlotWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ParkingSlotCreateWithoutResidenceInputSchema),z.lazy(() => ParkingSlotUncheckedCreateWithoutResidenceInputSchema) ]),
}).strict();

export const ParkingSlotCreateManyResidenceInputEnvelopeSchema: z.ZodType<Prisma.ParkingSlotCreateManyResidenceInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ParkingSlotCreateManyResidenceInputSchema),z.lazy(() => ParkingSlotCreateManyResidenceInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ExpenseCreateWithoutResidenceInputSchema: z.ZodType<Prisma.ExpenseCreateWithoutResidenceInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  emitingDate: z.coerce.date(),
  expireDate: z.coerce.date(),
  status: z.string(),
  ExpenseType: z.lazy(() => ExpenseTypeCreateNestedOneWithoutExpenseInputSchema),
  Payment: z.lazy(() => PaymentCreateNestedOneWithoutExpenseInputSchema)
}).strict();

export const ExpenseUncheckedCreateWithoutResidenceInputSchema: z.ZodType<Prisma.ExpenseUncheckedCreateWithoutResidenceInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  emitingDate: z.coerce.date(),
  expireDate: z.coerce.date(),
  status: z.string(),
  expenseType_id: z.number().int(),
  payment_id: z.string()
}).strict();

export const ExpenseCreateOrConnectWithoutResidenceInputSchema: z.ZodType<Prisma.ExpenseCreateOrConnectWithoutResidenceInput> = z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ExpenseCreateWithoutResidenceInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutResidenceInputSchema) ]),
}).strict();

export const ExpenseCreateManyResidenceInputEnvelopeSchema: z.ZodType<Prisma.ExpenseCreateManyResidenceInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ExpenseCreateManyResidenceInputSchema),z.lazy(() => ExpenseCreateManyResidenceInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserCreateWithoutResidentInInputSchema: z.ZodType<Prisma.UserCreateWithoutResidentInInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutUserInputSchema).optional(),
  Role: z.lazy(() => RoleCreateNestedOneWithoutUserInputSchema).optional(),
  paymentsCreated: z.lazy(() => PaymentCreateNestedManyWithoutAdminInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentCreateNestedManyWithoutUserInputSchema).optional(),
  Residence: z.lazy(() => ResidenceCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutResidentInInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutResidentInInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  community_id: z.string().optional(),
  role_id: z.number().int(),
  paymentsCreated: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutAdminInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutResidentInInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutResidentInInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutResidentInInputSchema),z.lazy(() => UserUncheckedCreateWithoutResidentInInputSchema) ]),
}).strict();

export const UserCreateManyResidentInInputEnvelopeSchema: z.ZodType<Prisma.UserCreateManyResidentInInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserCreateManyResidentInInputSchema),z.lazy(() => UserCreateManyResidentInInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutResidenceInputSchema: z.ZodType<Prisma.UserUpsertWithoutResidenceInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutResidenceInputSchema),z.lazy(() => UserUncheckedUpdateWithoutResidenceInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutResidenceInputSchema),z.lazy(() => UserUncheckedCreateWithoutResidenceInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutResidenceInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutResidenceInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutResidenceInputSchema),z.lazy(() => UserUncheckedUpdateWithoutResidenceInputSchema) ]),
}).strict();

export const UserUpdateWithoutResidenceInputSchema: z.ZodType<Prisma.UserUpdateWithoutResidenceInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateOneWithoutUserNestedInputSchema).optional(),
  paymentsCreated: z.lazy(() => PaymentUpdateManyWithoutAdminNestedInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentUpdateManyWithoutUserNestedInputSchema).optional(),
  ResidentIn: z.lazy(() => ResidenceUpdateOneWithoutResidentNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutResidenceInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutResidenceInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  residence_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentsCreated: z.lazy(() => PaymentUncheckedUpdateManyWithoutAdminNestedInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const CommunityUpsertWithoutResidenceInputSchema: z.ZodType<Prisma.CommunityUpsertWithoutResidenceInput> = z.object({
  update: z.union([ z.lazy(() => CommunityUpdateWithoutResidenceInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutResidenceInputSchema) ]),
  create: z.union([ z.lazy(() => CommunityCreateWithoutResidenceInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutResidenceInputSchema) ]),
  where: z.lazy(() => CommunityWhereInputSchema).optional()
}).strict();

export const CommunityUpdateToOneWithWhereWithoutResidenceInputSchema: z.ZodType<Prisma.CommunityUpdateToOneWithWhereWithoutResidenceInput> = z.object({
  where: z.lazy(() => CommunityWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CommunityUpdateWithoutResidenceInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutResidenceInputSchema) ]),
}).strict();

export const CommunityUpdateWithoutResidenceInputSchema: z.ZodType<Prisma.CommunityUpdateWithoutResidenceInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Provider: z.lazy(() => ProviderUpdateManyWithoutCommunityNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Account: z.lazy(() => AccountUpdateManyWithoutCommunityNestedInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const CommunityUncheckedUpdateWithoutResidenceInputSchema: z.ZodType<Prisma.CommunityUncheckedUpdateWithoutResidenceInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Provider: z.lazy(() => ProviderUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Account: z.lazy(() => AccountUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const ResidenceTypeUpsertWithoutResidenceInputSchema: z.ZodType<Prisma.ResidenceTypeUpsertWithoutResidenceInput> = z.object({
  update: z.union([ z.lazy(() => ResidenceTypeUpdateWithoutResidenceInputSchema),z.lazy(() => ResidenceTypeUncheckedUpdateWithoutResidenceInputSchema) ]),
  create: z.union([ z.lazy(() => ResidenceTypeCreateWithoutResidenceInputSchema),z.lazy(() => ResidenceTypeUncheckedCreateWithoutResidenceInputSchema) ]),
  where: z.lazy(() => ResidenceTypeWhereInputSchema).optional()
}).strict();

export const ResidenceTypeUpdateToOneWithWhereWithoutResidenceInputSchema: z.ZodType<Prisma.ResidenceTypeUpdateToOneWithWhereWithoutResidenceInput> = z.object({
  where: z.lazy(() => ResidenceTypeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ResidenceTypeUpdateWithoutResidenceInputSchema),z.lazy(() => ResidenceTypeUncheckedUpdateWithoutResidenceInputSchema) ]),
}).strict();

export const ResidenceTypeUpdateWithoutResidenceInputSchema: z.ZodType<Prisma.ResidenceTypeUpdateWithoutResidenceInput> = z.object({
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ExpenseType: z.lazy(() => ExpenseTypeUpdateManyWithoutResidenceTypeNestedInputSchema).optional(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutResidenceTypeNestedInputSchema).optional()
}).strict();

export const ResidenceTypeUncheckedUpdateWithoutResidenceInputSchema: z.ZodType<Prisma.ResidenceTypeUncheckedUpdateWithoutResidenceInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ExpenseType: z.lazy(() => ExpenseTypeUncheckedUpdateManyWithoutResidenceTypeNestedInputSchema).optional()
}).strict();

export const ParkingSlotUpsertWithWhereUniqueWithoutResidenceInputSchema: z.ZodType<Prisma.ParkingSlotUpsertWithWhereUniqueWithoutResidenceInput> = z.object({
  where: z.lazy(() => ParkingSlotWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ParkingSlotUpdateWithoutResidenceInputSchema),z.lazy(() => ParkingSlotUncheckedUpdateWithoutResidenceInputSchema) ]),
  create: z.union([ z.lazy(() => ParkingSlotCreateWithoutResidenceInputSchema),z.lazy(() => ParkingSlotUncheckedCreateWithoutResidenceInputSchema) ]),
}).strict();

export const ParkingSlotUpdateWithWhereUniqueWithoutResidenceInputSchema: z.ZodType<Prisma.ParkingSlotUpdateWithWhereUniqueWithoutResidenceInput> = z.object({
  where: z.lazy(() => ParkingSlotWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ParkingSlotUpdateWithoutResidenceInputSchema),z.lazy(() => ParkingSlotUncheckedUpdateWithoutResidenceInputSchema) ]),
}).strict();

export const ParkingSlotUpdateManyWithWhereWithoutResidenceInputSchema: z.ZodType<Prisma.ParkingSlotUpdateManyWithWhereWithoutResidenceInput> = z.object({
  where: z.lazy(() => ParkingSlotScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ParkingSlotUpdateManyMutationInputSchema),z.lazy(() => ParkingSlotUncheckedUpdateManyWithoutResidenceInputSchema) ]),
}).strict();

export const ParkingSlotScalarWhereInputSchema: z.ZodType<Prisma.ParkingSlotScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ParkingSlotScalarWhereInputSchema),z.lazy(() => ParkingSlotScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ParkingSlotScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ParkingSlotScalarWhereInputSchema),z.lazy(() => ParkingSlotScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  number: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  residence_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const ExpenseUpsertWithWhereUniqueWithoutResidenceInputSchema: z.ZodType<Prisma.ExpenseUpsertWithWhereUniqueWithoutResidenceInput> = z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ExpenseUpdateWithoutResidenceInputSchema),z.lazy(() => ExpenseUncheckedUpdateWithoutResidenceInputSchema) ]),
  create: z.union([ z.lazy(() => ExpenseCreateWithoutResidenceInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutResidenceInputSchema) ]),
}).strict();

export const ExpenseUpdateWithWhereUniqueWithoutResidenceInputSchema: z.ZodType<Prisma.ExpenseUpdateWithWhereUniqueWithoutResidenceInput> = z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ExpenseUpdateWithoutResidenceInputSchema),z.lazy(() => ExpenseUncheckedUpdateWithoutResidenceInputSchema) ]),
}).strict();

export const ExpenseUpdateManyWithWhereWithoutResidenceInputSchema: z.ZodType<Prisma.ExpenseUpdateManyWithWhereWithoutResidenceInput> = z.object({
  where: z.lazy(() => ExpenseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ExpenseUpdateManyMutationInputSchema),z.lazy(() => ExpenseUncheckedUpdateManyWithoutResidenceInputSchema) ]),
}).strict();

export const ExpenseScalarWhereInputSchema: z.ZodType<Prisma.ExpenseScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ExpenseScalarWhereInputSchema),z.lazy(() => ExpenseScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExpenseScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExpenseScalarWhereInputSchema),z.lazy(() => ExpenseScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  residence_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  emitingDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  expireDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  expenseType_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  payment_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const UserUpsertWithWhereUniqueWithoutResidentInInputSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutResidentInInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserUpdateWithoutResidentInInputSchema),z.lazy(() => UserUncheckedUpdateWithoutResidentInInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutResidentInInputSchema),z.lazy(() => UserUncheckedCreateWithoutResidentInInputSchema) ]),
}).strict();

export const UserUpdateWithWhereUniqueWithoutResidentInInputSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutResidentInInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserUpdateWithoutResidentInInputSchema),z.lazy(() => UserUncheckedUpdateWithoutResidentInInputSchema) ]),
}).strict();

export const UserUpdateManyWithWhereWithoutResidentInInputSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutResidentInInput> = z.object({
  where: z.lazy(() => UserScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserUpdateManyMutationInputSchema),z.lazy(() => UserUncheckedUpdateManyWithoutResidentInInputSchema) ]),
}).strict();

export const ResidenceCreateWithoutParkingSlotInputSchema: z.ZodType<Prisma.ResidenceCreateWithoutParkingSlotInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  Owner: z.lazy(() => UserCreateNestedOneWithoutResidenceInputSchema).optional(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutResidenceInputSchema),
  ResidenceType: z.lazy(() => ResidenceTypeCreateNestedOneWithoutResidenceInputSchema),
  Expense: z.lazy(() => ExpenseCreateNestedManyWithoutResidenceInputSchema).optional(),
  Resident: z.lazy(() => UserCreateNestedManyWithoutResidentInInputSchema).optional()
}).strict();

export const ResidenceUncheckedCreateWithoutParkingSlotInputSchema: z.ZodType<Prisma.ResidenceUncheckedCreateWithoutParkingSlotInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  owner_id: z.string().optional().nullable(),
  community_id: z.string(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.number().int(),
  Expense: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutResidenceInputSchema).optional(),
  Resident: z.lazy(() => UserUncheckedCreateNestedManyWithoutResidentInInputSchema).optional()
}).strict();

export const ResidenceCreateOrConnectWithoutParkingSlotInputSchema: z.ZodType<Prisma.ResidenceCreateOrConnectWithoutParkingSlotInput> = z.object({
  where: z.lazy(() => ResidenceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResidenceCreateWithoutParkingSlotInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutParkingSlotInputSchema) ]),
}).strict();

export const ResidenceUpsertWithoutParkingSlotInputSchema: z.ZodType<Prisma.ResidenceUpsertWithoutParkingSlotInput> = z.object({
  update: z.union([ z.lazy(() => ResidenceUpdateWithoutParkingSlotInputSchema),z.lazy(() => ResidenceUncheckedUpdateWithoutParkingSlotInputSchema) ]),
  create: z.union([ z.lazy(() => ResidenceCreateWithoutParkingSlotInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutParkingSlotInputSchema) ]),
  where: z.lazy(() => ResidenceWhereInputSchema).optional()
}).strict();

export const ResidenceUpdateToOneWithWhereWithoutParkingSlotInputSchema: z.ZodType<Prisma.ResidenceUpdateToOneWithWhereWithoutParkingSlotInput> = z.object({
  where: z.lazy(() => ResidenceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ResidenceUpdateWithoutParkingSlotInputSchema),z.lazy(() => ResidenceUncheckedUpdateWithoutParkingSlotInputSchema) ]),
}).strict();

export const ResidenceUpdateWithoutParkingSlotInputSchema: z.ZodType<Prisma.ResidenceUpdateWithoutParkingSlotInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  Owner: z.lazy(() => UserUpdateOneWithoutResidenceNestedInputSchema).optional(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutResidenceNestedInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUpdateOneRequiredWithoutResidenceNestedInputSchema).optional(),
  Expense: z.lazy(() => ExpenseUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Resident: z.lazy(() => UserUpdateManyWithoutResidentInNestedInputSchema).optional()
}).strict();

export const ResidenceUncheckedUpdateWithoutParkingSlotInputSchema: z.ZodType<Prisma.ResidenceUncheckedUpdateWithoutParkingSlotInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  Expense: z.lazy(() => ExpenseUncheckedUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Resident: z.lazy(() => UserUncheckedUpdateManyWithoutResidentInNestedInputSchema).optional()
}).strict();

export const ResidenceCreateWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ResidenceCreateWithoutResidenceTypeInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  Owner: z.lazy(() => UserCreateNestedOneWithoutResidenceInputSchema).optional(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutResidenceInputSchema),
  ParkingSlot: z.lazy(() => ParkingSlotCreateNestedManyWithoutResidenceInputSchema).optional(),
  Expense: z.lazy(() => ExpenseCreateNestedManyWithoutResidenceInputSchema).optional(),
  Resident: z.lazy(() => UserCreateNestedManyWithoutResidentInInputSchema).optional()
}).strict();

export const ResidenceUncheckedCreateWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ResidenceUncheckedCreateWithoutResidenceTypeInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  owner_id: z.string().optional().nullable(),
  community_id: z.string(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ParkingSlot: z.lazy(() => ParkingSlotUncheckedCreateNestedManyWithoutResidenceInputSchema).optional(),
  Expense: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutResidenceInputSchema).optional(),
  Resident: z.lazy(() => UserUncheckedCreateNestedManyWithoutResidentInInputSchema).optional()
}).strict();

export const ResidenceCreateOrConnectWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ResidenceCreateOrConnectWithoutResidenceTypeInput> = z.object({
  where: z.lazy(() => ResidenceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResidenceCreateWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutResidenceTypeInputSchema) ]),
}).strict();

export const ResidenceCreateManyResidenceTypeInputEnvelopeSchema: z.ZodType<Prisma.ResidenceCreateManyResidenceTypeInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ResidenceCreateManyResidenceTypeInputSchema),z.lazy(() => ResidenceCreateManyResidenceTypeInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ExpenseTypeCreateWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ExpenseTypeCreateWithoutResidenceTypeInput> = z.object({
  title: z.string(),
  value: z.number().int(),
  Expense: z.lazy(() => ExpenseCreateNestedManyWithoutExpenseTypeInputSchema).optional()
}).strict();

export const ExpenseTypeUncheckedCreateWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ExpenseTypeUncheckedCreateWithoutResidenceTypeInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  value: z.number().int(),
  Expense: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutExpenseTypeInputSchema).optional()
}).strict();

export const ExpenseTypeCreateOrConnectWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ExpenseTypeCreateOrConnectWithoutResidenceTypeInput> = z.object({
  where: z.lazy(() => ExpenseTypeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ExpenseTypeCreateWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeUncheckedCreateWithoutResidenceTypeInputSchema) ]),
}).strict();

export const ExpenseTypeCreateManyResidenceTypeInputEnvelopeSchema: z.ZodType<Prisma.ExpenseTypeCreateManyResidenceTypeInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ExpenseTypeCreateManyResidenceTypeInputSchema),z.lazy(() => ExpenseTypeCreateManyResidenceTypeInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CommunityCreateWithoutResidenceTypeInputSchema: z.ZodType<Prisma.CommunityCreateWithoutResidenceTypeInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  address: z.string(),
  Residence: z.lazy(() => ResidenceCreateNestedManyWithoutCommunityInputSchema).optional(),
  Provider: z.lazy(() => ProviderCreateNestedManyWithoutCommunityInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutCommunityInputSchema).optional(),
  Account: z.lazy(() => AccountCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityUncheckedCreateWithoutResidenceTypeInputSchema: z.ZodType<Prisma.CommunityUncheckedCreateWithoutResidenceTypeInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  address: z.string(),
  Residence: z.lazy(() => ResidenceUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  Provider: z.lazy(() => ProviderUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  Account: z.lazy(() => AccountUncheckedCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityCreateOrConnectWithoutResidenceTypeInputSchema: z.ZodType<Prisma.CommunityCreateOrConnectWithoutResidenceTypeInput> = z.object({
  where: z.lazy(() => CommunityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CommunityCreateWithoutResidenceTypeInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutResidenceTypeInputSchema) ]),
}).strict();

export const ResidenceUpsertWithWhereUniqueWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ResidenceUpsertWithWhereUniqueWithoutResidenceTypeInput> = z.object({
  where: z.lazy(() => ResidenceWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResidenceUpdateWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceUncheckedUpdateWithoutResidenceTypeInputSchema) ]),
  create: z.union([ z.lazy(() => ResidenceCreateWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutResidenceTypeInputSchema) ]),
}).strict();

export const ResidenceUpdateWithWhereUniqueWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ResidenceUpdateWithWhereUniqueWithoutResidenceTypeInput> = z.object({
  where: z.lazy(() => ResidenceWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResidenceUpdateWithoutResidenceTypeInputSchema),z.lazy(() => ResidenceUncheckedUpdateWithoutResidenceTypeInputSchema) ]),
}).strict();

export const ResidenceUpdateManyWithWhereWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ResidenceUpdateManyWithWhereWithoutResidenceTypeInput> = z.object({
  where: z.lazy(() => ResidenceScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResidenceUpdateManyMutationInputSchema),z.lazy(() => ResidenceUncheckedUpdateManyWithoutResidenceTypeInputSchema) ]),
}).strict();

export const ExpenseTypeUpsertWithWhereUniqueWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ExpenseTypeUpsertWithWhereUniqueWithoutResidenceTypeInput> = z.object({
  where: z.lazy(() => ExpenseTypeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ExpenseTypeUpdateWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeUncheckedUpdateWithoutResidenceTypeInputSchema) ]),
  create: z.union([ z.lazy(() => ExpenseTypeCreateWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeUncheckedCreateWithoutResidenceTypeInputSchema) ]),
}).strict();

export const ExpenseTypeUpdateWithWhereUniqueWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ExpenseTypeUpdateWithWhereUniqueWithoutResidenceTypeInput> = z.object({
  where: z.lazy(() => ExpenseTypeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ExpenseTypeUpdateWithoutResidenceTypeInputSchema),z.lazy(() => ExpenseTypeUncheckedUpdateWithoutResidenceTypeInputSchema) ]),
}).strict();

export const ExpenseTypeUpdateManyWithWhereWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ExpenseTypeUpdateManyWithWhereWithoutResidenceTypeInput> = z.object({
  where: z.lazy(() => ExpenseTypeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ExpenseTypeUpdateManyMutationInputSchema),z.lazy(() => ExpenseTypeUncheckedUpdateManyWithoutResidenceTypeInputSchema) ]),
}).strict();

export const ExpenseTypeScalarWhereInputSchema: z.ZodType<Prisma.ExpenseTypeScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ExpenseTypeScalarWhereInputSchema),z.lazy(() => ExpenseTypeScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ExpenseTypeScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ExpenseTypeScalarWhereInputSchema),z.lazy(() => ExpenseTypeScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  value: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  residenceType_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const CommunityUpsertWithoutResidenceTypeInputSchema: z.ZodType<Prisma.CommunityUpsertWithoutResidenceTypeInput> = z.object({
  update: z.union([ z.lazy(() => CommunityUpdateWithoutResidenceTypeInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutResidenceTypeInputSchema) ]),
  create: z.union([ z.lazy(() => CommunityCreateWithoutResidenceTypeInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutResidenceTypeInputSchema) ]),
  where: z.lazy(() => CommunityWhereInputSchema).optional()
}).strict();

export const CommunityUpdateToOneWithWhereWithoutResidenceTypeInputSchema: z.ZodType<Prisma.CommunityUpdateToOneWithWhereWithoutResidenceTypeInput> = z.object({
  where: z.lazy(() => CommunityWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CommunityUpdateWithoutResidenceTypeInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutResidenceTypeInputSchema) ]),
}).strict();

export const CommunityUpdateWithoutResidenceTypeInputSchema: z.ZodType<Prisma.CommunityUpdateWithoutResidenceTypeInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Provider: z.lazy(() => ProviderUpdateManyWithoutCommunityNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Account: z.lazy(() => AccountUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const CommunityUncheckedUpdateWithoutResidenceTypeInputSchema: z.ZodType<Prisma.CommunityUncheckedUpdateWithoutResidenceTypeInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Provider: z.lazy(() => ProviderUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Account: z.lazy(() => AccountUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const CommunityCreateWithoutProviderInputSchema: z.ZodType<Prisma.CommunityCreateWithoutProviderInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  address: z.string(),
  Residence: z.lazy(() => ResidenceCreateNestedManyWithoutCommunityInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutCommunityInputSchema).optional(),
  Account: z.lazy(() => AccountCreateNestedManyWithoutCommunityInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityUncheckedCreateWithoutProviderInputSchema: z.ZodType<Prisma.CommunityUncheckedCreateWithoutProviderInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  address: z.string(),
  Residence: z.lazy(() => ResidenceUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  Account: z.lazy(() => AccountUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUncheckedCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityCreateOrConnectWithoutProviderInputSchema: z.ZodType<Prisma.CommunityCreateOrConnectWithoutProviderInput> = z.object({
  where: z.lazy(() => CommunityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CommunityCreateWithoutProviderInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutProviderInputSchema) ]),
}).strict();

export const CashoutCreateWithoutProviderInputSchema: z.ZodType<Prisma.CashoutCreateWithoutProviderInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  billImage: z.string(),
  status: z.string(),
  registerDate: z.coerce.date(),
  Account: z.lazy(() => AccountCreateNestedOneWithoutCashoutInputSchema)
}).strict();

export const CashoutUncheckedCreateWithoutProviderInputSchema: z.ZodType<Prisma.CashoutUncheckedCreateWithoutProviderInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  billImage: z.string(),
  account_id: z.string(),
  status: z.string(),
  registerDate: z.coerce.date()
}).strict();

export const CashoutCreateOrConnectWithoutProviderInputSchema: z.ZodType<Prisma.CashoutCreateOrConnectWithoutProviderInput> = z.object({
  where: z.lazy(() => CashoutWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CashoutCreateWithoutProviderInputSchema),z.lazy(() => CashoutUncheckedCreateWithoutProviderInputSchema) ]),
}).strict();

export const CashoutCreateManyProviderInputEnvelopeSchema: z.ZodType<Prisma.CashoutCreateManyProviderInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CashoutCreateManyProviderInputSchema),z.lazy(() => CashoutCreateManyProviderInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CommunityUpsertWithoutProviderInputSchema: z.ZodType<Prisma.CommunityUpsertWithoutProviderInput> = z.object({
  update: z.union([ z.lazy(() => CommunityUpdateWithoutProviderInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutProviderInputSchema) ]),
  create: z.union([ z.lazy(() => CommunityCreateWithoutProviderInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutProviderInputSchema) ]),
  where: z.lazy(() => CommunityWhereInputSchema).optional()
}).strict();

export const CommunityUpdateToOneWithWhereWithoutProviderInputSchema: z.ZodType<Prisma.CommunityUpdateToOneWithWhereWithoutProviderInput> = z.object({
  where: z.lazy(() => CommunityWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CommunityUpdateWithoutProviderInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutProviderInputSchema) ]),
}).strict();

export const CommunityUpdateWithoutProviderInputSchema: z.ZodType<Prisma.CommunityUpdateWithoutProviderInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUpdateManyWithoutCommunityNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Account: z.lazy(() => AccountUpdateManyWithoutCommunityNestedInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const CommunityUncheckedUpdateWithoutProviderInputSchema: z.ZodType<Prisma.CommunityUncheckedUpdateWithoutProviderInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Account: z.lazy(() => AccountUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const CashoutUpsertWithWhereUniqueWithoutProviderInputSchema: z.ZodType<Prisma.CashoutUpsertWithWhereUniqueWithoutProviderInput> = z.object({
  where: z.lazy(() => CashoutWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CashoutUpdateWithoutProviderInputSchema),z.lazy(() => CashoutUncheckedUpdateWithoutProviderInputSchema) ]),
  create: z.union([ z.lazy(() => CashoutCreateWithoutProviderInputSchema),z.lazy(() => CashoutUncheckedCreateWithoutProviderInputSchema) ]),
}).strict();

export const CashoutUpdateWithWhereUniqueWithoutProviderInputSchema: z.ZodType<Prisma.CashoutUpdateWithWhereUniqueWithoutProviderInput> = z.object({
  where: z.lazy(() => CashoutWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CashoutUpdateWithoutProviderInputSchema),z.lazy(() => CashoutUncheckedUpdateWithoutProviderInputSchema) ]),
}).strict();

export const CashoutUpdateManyWithWhereWithoutProviderInputSchema: z.ZodType<Prisma.CashoutUpdateManyWithWhereWithoutProviderInput> = z.object({
  where: z.lazy(() => CashoutScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CashoutUpdateManyMutationInputSchema),z.lazy(() => CashoutUncheckedUpdateManyWithoutProviderInputSchema) ]),
}).strict();

export const CashoutScalarWhereInputSchema: z.ZodType<Prisma.CashoutScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CashoutScalarWhereInputSchema),z.lazy(() => CashoutScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CashoutScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CashoutScalarWhereInputSchema),z.lazy(() => CashoutScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  provider_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  amount: z.union([ z.lazy(() => DecimalFilterSchema),z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  billImage: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  account_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  registerDate: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutRoleInputSchema: z.ZodType<Prisma.UserCreateWithoutRoleInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutUserInputSchema).optional(),
  paymentsCreated: z.lazy(() => PaymentCreateNestedManyWithoutAdminInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentCreateNestedManyWithoutUserInputSchema).optional(),
  Residence: z.lazy(() => ResidenceCreateNestedManyWithoutOwnerInputSchema).optional(),
  ResidentIn: z.lazy(() => ResidenceCreateNestedOneWithoutResidentInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutRoleInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutRoleInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  community_id: z.string().optional(),
  residence_id: z.string().optional().nullable(),
  paymentsCreated: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutAdminInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutRoleInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutRoleInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutRoleInputSchema),z.lazy(() => UserUncheckedCreateWithoutRoleInputSchema) ]),
}).strict();

export const UserCreateManyRoleInputEnvelopeSchema: z.ZodType<Prisma.UserCreateManyRoleInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserCreateManyRoleInputSchema),z.lazy(() => UserCreateManyRoleInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithWhereUniqueWithoutRoleInputSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutRoleInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserUpdateWithoutRoleInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRoleInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutRoleInputSchema),z.lazy(() => UserUncheckedCreateWithoutRoleInputSchema) ]),
}).strict();

export const UserUpdateWithWhereUniqueWithoutRoleInputSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutRoleInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserUpdateWithoutRoleInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRoleInputSchema) ]),
}).strict();

export const UserUpdateManyWithWhereWithoutRoleInputSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutRoleInput> = z.object({
  where: z.lazy(() => UserScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserUpdateManyMutationInputSchema),z.lazy(() => UserUncheckedUpdateManyWithoutRoleInputSchema) ]),
}).strict();

export const ResidenceCreateWithoutExpenseInputSchema: z.ZodType<Prisma.ResidenceCreateWithoutExpenseInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  Owner: z.lazy(() => UserCreateNestedOneWithoutResidenceInputSchema).optional(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutResidenceInputSchema),
  ResidenceType: z.lazy(() => ResidenceTypeCreateNestedOneWithoutResidenceInputSchema),
  ParkingSlot: z.lazy(() => ParkingSlotCreateNestedManyWithoutResidenceInputSchema).optional(),
  Resident: z.lazy(() => UserCreateNestedManyWithoutResidentInInputSchema).optional()
}).strict();

export const ResidenceUncheckedCreateWithoutExpenseInputSchema: z.ZodType<Prisma.ResidenceUncheckedCreateWithoutExpenseInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  owner_id: z.string().optional().nullable(),
  community_id: z.string(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.number().int(),
  ParkingSlot: z.lazy(() => ParkingSlotUncheckedCreateNestedManyWithoutResidenceInputSchema).optional(),
  Resident: z.lazy(() => UserUncheckedCreateNestedManyWithoutResidentInInputSchema).optional()
}).strict();

export const ResidenceCreateOrConnectWithoutExpenseInputSchema: z.ZodType<Prisma.ResidenceCreateOrConnectWithoutExpenseInput> = z.object({
  where: z.lazy(() => ResidenceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResidenceCreateWithoutExpenseInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutExpenseInputSchema) ]),
}).strict();

export const ExpenseTypeCreateWithoutExpenseInputSchema: z.ZodType<Prisma.ExpenseTypeCreateWithoutExpenseInput> = z.object({
  title: z.string(),
  value: z.number().int(),
  ResidenceType: z.lazy(() => ResidenceTypeCreateNestedOneWithoutExpenseTypeInputSchema)
}).strict();

export const ExpenseTypeUncheckedCreateWithoutExpenseInputSchema: z.ZodType<Prisma.ExpenseTypeUncheckedCreateWithoutExpenseInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  value: z.number().int(),
  residenceType_id: z.number().int()
}).strict();

export const ExpenseTypeCreateOrConnectWithoutExpenseInputSchema: z.ZodType<Prisma.ExpenseTypeCreateOrConnectWithoutExpenseInput> = z.object({
  where: z.lazy(() => ExpenseTypeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ExpenseTypeCreateWithoutExpenseInputSchema),z.lazy(() => ExpenseTypeUncheckedCreateWithoutExpenseInputSchema) ]),
}).strict();

export const PaymentCreateWithoutExpenseInputSchema: z.ZodType<Prisma.PaymentCreateWithoutExpenseInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  registerDate: z.coerce.date(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  voucherImage: z.string(),
  isEmailSend: z.boolean(),
  User: z.lazy(() => UserCreateNestedOneWithoutPaymentsMadeInputSchema),
  Account: z.lazy(() => AccountCreateNestedOneWithoutPaymentInputSchema),
  Admin: z.lazy(() => UserCreateNestedOneWithoutPaymentsCreatedInputSchema)
}).strict();

export const PaymentUncheckedCreateWithoutExpenseInputSchema: z.ZodType<Prisma.PaymentUncheckedCreateWithoutExpenseInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  registerDate: z.coerce.date(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  owner_id: z.string(),
  voucherImage: z.string(),
  isEmailSend: z.boolean(),
  account_id: z.string(),
  created_by: z.string()
}).strict();

export const PaymentCreateOrConnectWithoutExpenseInputSchema: z.ZodType<Prisma.PaymentCreateOrConnectWithoutExpenseInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PaymentCreateWithoutExpenseInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutExpenseInputSchema) ]),
}).strict();

export const ResidenceUpsertWithoutExpenseInputSchema: z.ZodType<Prisma.ResidenceUpsertWithoutExpenseInput> = z.object({
  update: z.union([ z.lazy(() => ResidenceUpdateWithoutExpenseInputSchema),z.lazy(() => ResidenceUncheckedUpdateWithoutExpenseInputSchema) ]),
  create: z.union([ z.lazy(() => ResidenceCreateWithoutExpenseInputSchema),z.lazy(() => ResidenceUncheckedCreateWithoutExpenseInputSchema) ]),
  where: z.lazy(() => ResidenceWhereInputSchema).optional()
}).strict();

export const ResidenceUpdateToOneWithWhereWithoutExpenseInputSchema: z.ZodType<Prisma.ResidenceUpdateToOneWithWhereWithoutExpenseInput> = z.object({
  where: z.lazy(() => ResidenceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ResidenceUpdateWithoutExpenseInputSchema),z.lazy(() => ResidenceUncheckedUpdateWithoutExpenseInputSchema) ]),
}).strict();

export const ResidenceUpdateWithoutExpenseInputSchema: z.ZodType<Prisma.ResidenceUpdateWithoutExpenseInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  Owner: z.lazy(() => UserUpdateOneWithoutResidenceNestedInputSchema).optional(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutResidenceNestedInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUpdateOneRequiredWithoutResidenceNestedInputSchema).optional(),
  ParkingSlot: z.lazy(() => ParkingSlotUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Resident: z.lazy(() => UserUpdateManyWithoutResidentInNestedInputSchema).optional()
}).strict();

export const ResidenceUncheckedUpdateWithoutExpenseInputSchema: z.ZodType<Prisma.ResidenceUncheckedUpdateWithoutExpenseInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ParkingSlot: z.lazy(() => ParkingSlotUncheckedUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Resident: z.lazy(() => UserUncheckedUpdateManyWithoutResidentInNestedInputSchema).optional()
}).strict();

export const ExpenseTypeUpsertWithoutExpenseInputSchema: z.ZodType<Prisma.ExpenseTypeUpsertWithoutExpenseInput> = z.object({
  update: z.union([ z.lazy(() => ExpenseTypeUpdateWithoutExpenseInputSchema),z.lazy(() => ExpenseTypeUncheckedUpdateWithoutExpenseInputSchema) ]),
  create: z.union([ z.lazy(() => ExpenseTypeCreateWithoutExpenseInputSchema),z.lazy(() => ExpenseTypeUncheckedCreateWithoutExpenseInputSchema) ]),
  where: z.lazy(() => ExpenseTypeWhereInputSchema).optional()
}).strict();

export const ExpenseTypeUpdateToOneWithWhereWithoutExpenseInputSchema: z.ZodType<Prisma.ExpenseTypeUpdateToOneWithWhereWithoutExpenseInput> = z.object({
  where: z.lazy(() => ExpenseTypeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ExpenseTypeUpdateWithoutExpenseInputSchema),z.lazy(() => ExpenseTypeUncheckedUpdateWithoutExpenseInputSchema) ]),
}).strict();

export const ExpenseTypeUpdateWithoutExpenseInputSchema: z.ZodType<Prisma.ExpenseTypeUpdateWithoutExpenseInput> = z.object({
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUpdateOneRequiredWithoutExpenseTypeNestedInputSchema).optional()
}).strict();

export const ExpenseTypeUncheckedUpdateWithoutExpenseInputSchema: z.ZodType<Prisma.ExpenseTypeUncheckedUpdateWithoutExpenseInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  residenceType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentUpsertWithoutExpenseInputSchema: z.ZodType<Prisma.PaymentUpsertWithoutExpenseInput> = z.object({
  update: z.union([ z.lazy(() => PaymentUpdateWithoutExpenseInputSchema),z.lazy(() => PaymentUncheckedUpdateWithoutExpenseInputSchema) ]),
  create: z.union([ z.lazy(() => PaymentCreateWithoutExpenseInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutExpenseInputSchema) ]),
  where: z.lazy(() => PaymentWhereInputSchema).optional()
}).strict();

export const PaymentUpdateToOneWithWhereWithoutExpenseInputSchema: z.ZodType<Prisma.PaymentUpdateToOneWithWhereWithoutExpenseInput> = z.object({
  where: z.lazy(() => PaymentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PaymentUpdateWithoutExpenseInputSchema),z.lazy(() => PaymentUncheckedUpdateWithoutExpenseInputSchema) ]),
}).strict();

export const PaymentUpdateWithoutExpenseInputSchema: z.ZodType<Prisma.PaymentUpdateWithoutExpenseInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  voucherImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isEmailSend: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  User: z.lazy(() => UserUpdateOneRequiredWithoutPaymentsMadeNestedInputSchema).optional(),
  Account: z.lazy(() => AccountUpdateOneRequiredWithoutPaymentNestedInputSchema).optional(),
  Admin: z.lazy(() => UserUpdateOneRequiredWithoutPaymentsCreatedNestedInputSchema).optional()
}).strict();

export const PaymentUncheckedUpdateWithoutExpenseInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateWithoutExpenseInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  voucherImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isEmailSend: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  account_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_by: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExpenseCreateWithoutPaymentInputSchema: z.ZodType<Prisma.ExpenseCreateWithoutPaymentInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  emitingDate: z.coerce.date(),
  expireDate: z.coerce.date(),
  status: z.string(),
  Residence: z.lazy(() => ResidenceCreateNestedOneWithoutExpenseInputSchema),
  ExpenseType: z.lazy(() => ExpenseTypeCreateNestedOneWithoutExpenseInputSchema)
}).strict();

export const ExpenseUncheckedCreateWithoutPaymentInputSchema: z.ZodType<Prisma.ExpenseUncheckedCreateWithoutPaymentInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  residence_id: z.string(),
  emitingDate: z.coerce.date(),
  expireDate: z.coerce.date(),
  status: z.string(),
  expenseType_id: z.number().int()
}).strict();

export const ExpenseCreateOrConnectWithoutPaymentInputSchema: z.ZodType<Prisma.ExpenseCreateOrConnectWithoutPaymentInput> = z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ExpenseCreateWithoutPaymentInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutPaymentInputSchema) ]),
}).strict();

export const ExpenseCreateManyPaymentInputEnvelopeSchema: z.ZodType<Prisma.ExpenseCreateManyPaymentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ExpenseCreateManyPaymentInputSchema),z.lazy(() => ExpenseCreateManyPaymentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserCreateWithoutPaymentsMadeInputSchema: z.ZodType<Prisma.UserCreateWithoutPaymentsMadeInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutUserInputSchema).optional(),
  Role: z.lazy(() => RoleCreateNestedOneWithoutUserInputSchema).optional(),
  paymentsCreated: z.lazy(() => PaymentCreateNestedManyWithoutAdminInputSchema).optional(),
  Residence: z.lazy(() => ResidenceCreateNestedManyWithoutOwnerInputSchema).optional(),
  ResidentIn: z.lazy(() => ResidenceCreateNestedOneWithoutResidentInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutPaymentsMadeInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutPaymentsMadeInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  community_id: z.string().optional(),
  role_id: z.number().int(),
  residence_id: z.string().optional().nullable(),
  paymentsCreated: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutAdminInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutPaymentsMadeInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutPaymentsMadeInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutPaymentsMadeInputSchema),z.lazy(() => UserUncheckedCreateWithoutPaymentsMadeInputSchema) ]),
}).strict();

export const AccountCreateWithoutPaymentInputSchema: z.ZodType<Prisma.AccountCreateWithoutPaymentInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  active: z.boolean(),
  balance: z.bigint(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutAccountInputSchema),
  Cashout: z.lazy(() => CashoutCreateNestedManyWithoutAccountInputSchema).optional()
}).strict();

export const AccountUncheckedCreateWithoutPaymentInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutPaymentInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  active: z.boolean(),
  community_id: z.string(),
  balance: z.bigint(),
  Cashout: z.lazy(() => CashoutUncheckedCreateNestedManyWithoutAccountInputSchema).optional()
}).strict();

export const AccountCreateOrConnectWithoutPaymentInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutPaymentInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccountCreateWithoutPaymentInputSchema),z.lazy(() => AccountUncheckedCreateWithoutPaymentInputSchema) ]),
}).strict();

export const UserCreateWithoutPaymentsCreatedInputSchema: z.ZodType<Prisma.UserCreateWithoutPaymentsCreatedInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutUserInputSchema).optional(),
  Role: z.lazy(() => RoleCreateNestedOneWithoutUserInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentCreateNestedManyWithoutUserInputSchema).optional(),
  Residence: z.lazy(() => ResidenceCreateNestedManyWithoutOwnerInputSchema).optional(),
  ResidentIn: z.lazy(() => ResidenceCreateNestedOneWithoutResidentInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutPaymentsCreatedInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutPaymentsCreatedInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  community_id: z.string().optional(),
  role_id: z.number().int(),
  residence_id: z.string().optional().nullable(),
  paymentsMade: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutPaymentsCreatedInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutPaymentsCreatedInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutPaymentsCreatedInputSchema),z.lazy(() => UserUncheckedCreateWithoutPaymentsCreatedInputSchema) ]),
}).strict();

export const ExpenseUpsertWithWhereUniqueWithoutPaymentInputSchema: z.ZodType<Prisma.ExpenseUpsertWithWhereUniqueWithoutPaymentInput> = z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ExpenseUpdateWithoutPaymentInputSchema),z.lazy(() => ExpenseUncheckedUpdateWithoutPaymentInputSchema) ]),
  create: z.union([ z.lazy(() => ExpenseCreateWithoutPaymentInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutPaymentInputSchema) ]),
}).strict();

export const ExpenseUpdateWithWhereUniqueWithoutPaymentInputSchema: z.ZodType<Prisma.ExpenseUpdateWithWhereUniqueWithoutPaymentInput> = z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ExpenseUpdateWithoutPaymentInputSchema),z.lazy(() => ExpenseUncheckedUpdateWithoutPaymentInputSchema) ]),
}).strict();

export const ExpenseUpdateManyWithWhereWithoutPaymentInputSchema: z.ZodType<Prisma.ExpenseUpdateManyWithWhereWithoutPaymentInput> = z.object({
  where: z.lazy(() => ExpenseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ExpenseUpdateManyMutationInputSchema),z.lazy(() => ExpenseUncheckedUpdateManyWithoutPaymentInputSchema) ]),
}).strict();

export const UserUpsertWithoutPaymentsMadeInputSchema: z.ZodType<Prisma.UserUpsertWithoutPaymentsMadeInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutPaymentsMadeInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPaymentsMadeInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutPaymentsMadeInputSchema),z.lazy(() => UserUncheckedCreateWithoutPaymentsMadeInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutPaymentsMadeInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPaymentsMadeInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutPaymentsMadeInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPaymentsMadeInputSchema) ]),
}).strict();

export const UserUpdateWithoutPaymentsMadeInputSchema: z.ZodType<Prisma.UserUpdateWithoutPaymentsMadeInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateOneWithoutUserNestedInputSchema).optional(),
  paymentsCreated: z.lazy(() => PaymentUpdateManyWithoutAdminNestedInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUpdateManyWithoutOwnerNestedInputSchema).optional(),
  ResidentIn: z.lazy(() => ResidenceUpdateOneWithoutResidentNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutPaymentsMadeInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutPaymentsMadeInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  residence_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentsCreated: z.lazy(() => PaymentUncheckedUpdateManyWithoutAdminNestedInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const AccountUpsertWithoutPaymentInputSchema: z.ZodType<Prisma.AccountUpsertWithoutPaymentInput> = z.object({
  update: z.union([ z.lazy(() => AccountUpdateWithoutPaymentInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutPaymentInputSchema) ]),
  create: z.union([ z.lazy(() => AccountCreateWithoutPaymentInputSchema),z.lazy(() => AccountUncheckedCreateWithoutPaymentInputSchema) ]),
  where: z.lazy(() => AccountWhereInputSchema).optional()
}).strict();

export const AccountUpdateToOneWithWhereWithoutPaymentInputSchema: z.ZodType<Prisma.AccountUpdateToOneWithWhereWithoutPaymentInput> = z.object({
  where: z.lazy(() => AccountWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AccountUpdateWithoutPaymentInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutPaymentInputSchema) ]),
}).strict();

export const AccountUpdateWithoutPaymentInputSchema: z.ZodType<Prisma.AccountUpdateWithoutPaymentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutAccountNestedInputSchema).optional(),
  Cashout: z.lazy(() => CashoutUpdateManyWithoutAccountNestedInputSchema).optional()
}).strict();

export const AccountUncheckedUpdateWithoutPaymentInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutPaymentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  Cashout: z.lazy(() => CashoutUncheckedUpdateManyWithoutAccountNestedInputSchema).optional()
}).strict();

export const UserUpsertWithoutPaymentsCreatedInputSchema: z.ZodType<Prisma.UserUpsertWithoutPaymentsCreatedInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutPaymentsCreatedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPaymentsCreatedInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutPaymentsCreatedInputSchema),z.lazy(() => UserUncheckedCreateWithoutPaymentsCreatedInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutPaymentsCreatedInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutPaymentsCreatedInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutPaymentsCreatedInputSchema),z.lazy(() => UserUncheckedUpdateWithoutPaymentsCreatedInputSchema) ]),
}).strict();

export const UserUpdateWithoutPaymentsCreatedInputSchema: z.ZodType<Prisma.UserUpdateWithoutPaymentsCreatedInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateOneWithoutUserNestedInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentUpdateManyWithoutUserNestedInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUpdateManyWithoutOwnerNestedInputSchema).optional(),
  ResidentIn: z.lazy(() => ResidenceUpdateOneWithoutResidentNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutPaymentsCreatedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutPaymentsCreatedInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  residence_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentsMade: z.lazy(() => PaymentUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const ProviderCreateWithoutCashoutInputSchema: z.ZodType<Prisma.ProviderCreateWithoutCashoutInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  contactName: z.string(),
  description: z.string(),
  phone: z.string(),
  email: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  active: z.boolean(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutProviderInputSchema)
}).strict();

export const ProviderUncheckedCreateWithoutCashoutInputSchema: z.ZodType<Prisma.ProviderUncheckedCreateWithoutCashoutInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  contactName: z.string(),
  description: z.string(),
  phone: z.string(),
  email: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  active: z.boolean(),
  community_id: z.string()
}).strict();

export const ProviderCreateOrConnectWithoutCashoutInputSchema: z.ZodType<Prisma.ProviderCreateOrConnectWithoutCashoutInput> = z.object({
  where: z.lazy(() => ProviderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProviderCreateWithoutCashoutInputSchema),z.lazy(() => ProviderUncheckedCreateWithoutCashoutInputSchema) ]),
}).strict();

export const AccountCreateWithoutCashoutInputSchema: z.ZodType<Prisma.AccountCreateWithoutCashoutInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  active: z.boolean(),
  balance: z.bigint(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutAccountInputSchema),
  Payment: z.lazy(() => PaymentCreateNestedManyWithoutAccountInputSchema).optional()
}).strict();

export const AccountUncheckedCreateWithoutCashoutInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutCashoutInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  active: z.boolean(),
  community_id: z.string(),
  balance: z.bigint(),
  Payment: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutAccountInputSchema).optional()
}).strict();

export const AccountCreateOrConnectWithoutCashoutInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutCashoutInput> = z.object({
  where: z.lazy(() => AccountWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AccountCreateWithoutCashoutInputSchema),z.lazy(() => AccountUncheckedCreateWithoutCashoutInputSchema) ]),
}).strict();

export const ProviderUpsertWithoutCashoutInputSchema: z.ZodType<Prisma.ProviderUpsertWithoutCashoutInput> = z.object({
  update: z.union([ z.lazy(() => ProviderUpdateWithoutCashoutInputSchema),z.lazy(() => ProviderUncheckedUpdateWithoutCashoutInputSchema) ]),
  create: z.union([ z.lazy(() => ProviderCreateWithoutCashoutInputSchema),z.lazy(() => ProviderUncheckedCreateWithoutCashoutInputSchema) ]),
  where: z.lazy(() => ProviderWhereInputSchema).optional()
}).strict();

export const ProviderUpdateToOneWithWhereWithoutCashoutInputSchema: z.ZodType<Prisma.ProviderUpdateToOneWithWhereWithoutCashoutInput> = z.object({
  where: z.lazy(() => ProviderWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProviderUpdateWithoutCashoutInputSchema),z.lazy(() => ProviderUncheckedUpdateWithoutCashoutInputSchema) ]),
}).strict();

export const ProviderUpdateWithoutCashoutInputSchema: z.ZodType<Prisma.ProviderUpdateWithoutCashoutInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contactName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutProviderNestedInputSchema).optional()
}).strict();

export const ProviderUncheckedUpdateWithoutCashoutInputSchema: z.ZodType<Prisma.ProviderUncheckedUpdateWithoutCashoutInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contactName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AccountUpsertWithoutCashoutInputSchema: z.ZodType<Prisma.AccountUpsertWithoutCashoutInput> = z.object({
  update: z.union([ z.lazy(() => AccountUpdateWithoutCashoutInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutCashoutInputSchema) ]),
  create: z.union([ z.lazy(() => AccountCreateWithoutCashoutInputSchema),z.lazy(() => AccountUncheckedCreateWithoutCashoutInputSchema) ]),
  where: z.lazy(() => AccountWhereInputSchema).optional()
}).strict();

export const AccountUpdateToOneWithWhereWithoutCashoutInputSchema: z.ZodType<Prisma.AccountUpdateToOneWithWhereWithoutCashoutInput> = z.object({
  where: z.lazy(() => AccountWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AccountUpdateWithoutCashoutInputSchema),z.lazy(() => AccountUncheckedUpdateWithoutCashoutInputSchema) ]),
}).strict();

export const AccountUpdateWithoutCashoutInputSchema: z.ZodType<Prisma.AccountUpdateWithoutCashoutInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutAccountNestedInputSchema).optional(),
  Payment: z.lazy(() => PaymentUpdateManyWithoutAccountNestedInputSchema).optional()
}).strict();

export const AccountUncheckedUpdateWithoutCashoutInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutCashoutInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  Payment: z.lazy(() => PaymentUncheckedUpdateManyWithoutAccountNestedInputSchema).optional()
}).strict();

export const ResidenceTypeCreateWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ResidenceTypeCreateWithoutExpenseTypeInput> = z.object({
  title: z.string(),
  description: z.string(),
  Residence: z.lazy(() => ResidenceCreateNestedManyWithoutResidenceTypeInputSchema).optional(),
  Community: z.lazy(() => CommunityCreateNestedOneWithoutResidenceTypeInputSchema)
}).strict();

export const ResidenceTypeUncheckedCreateWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ResidenceTypeUncheckedCreateWithoutExpenseTypeInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  description: z.string(),
  community_id: z.string(),
  Residence: z.lazy(() => ResidenceUncheckedCreateNestedManyWithoutResidenceTypeInputSchema).optional()
}).strict();

export const ResidenceTypeCreateOrConnectWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ResidenceTypeCreateOrConnectWithoutExpenseTypeInput> = z.object({
  where: z.lazy(() => ResidenceTypeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResidenceTypeCreateWithoutExpenseTypeInputSchema),z.lazy(() => ResidenceTypeUncheckedCreateWithoutExpenseTypeInputSchema) ]),
}).strict();

export const ExpenseCreateWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ExpenseCreateWithoutExpenseTypeInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  emitingDate: z.coerce.date(),
  expireDate: z.coerce.date(),
  status: z.string(),
  Residence: z.lazy(() => ResidenceCreateNestedOneWithoutExpenseInputSchema),
  Payment: z.lazy(() => PaymentCreateNestedOneWithoutExpenseInputSchema)
}).strict();

export const ExpenseUncheckedCreateWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ExpenseUncheckedCreateWithoutExpenseTypeInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  residence_id: z.string(),
  emitingDate: z.coerce.date(),
  expireDate: z.coerce.date(),
  status: z.string(),
  payment_id: z.string()
}).strict();

export const ExpenseCreateOrConnectWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ExpenseCreateOrConnectWithoutExpenseTypeInput> = z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ExpenseCreateWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutExpenseTypeInputSchema) ]),
}).strict();

export const ExpenseCreateManyExpenseTypeInputEnvelopeSchema: z.ZodType<Prisma.ExpenseCreateManyExpenseTypeInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ExpenseCreateManyExpenseTypeInputSchema),z.lazy(() => ExpenseCreateManyExpenseTypeInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ResidenceTypeUpsertWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ResidenceTypeUpsertWithoutExpenseTypeInput> = z.object({
  update: z.union([ z.lazy(() => ResidenceTypeUpdateWithoutExpenseTypeInputSchema),z.lazy(() => ResidenceTypeUncheckedUpdateWithoutExpenseTypeInputSchema) ]),
  create: z.union([ z.lazy(() => ResidenceTypeCreateWithoutExpenseTypeInputSchema),z.lazy(() => ResidenceTypeUncheckedCreateWithoutExpenseTypeInputSchema) ]),
  where: z.lazy(() => ResidenceTypeWhereInputSchema).optional()
}).strict();

export const ResidenceTypeUpdateToOneWithWhereWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ResidenceTypeUpdateToOneWithWhereWithoutExpenseTypeInput> = z.object({
  where: z.lazy(() => ResidenceTypeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ResidenceTypeUpdateWithoutExpenseTypeInputSchema),z.lazy(() => ResidenceTypeUncheckedUpdateWithoutExpenseTypeInputSchema) ]),
}).strict();

export const ResidenceTypeUpdateWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ResidenceTypeUpdateWithoutExpenseTypeInput> = z.object({
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUpdateManyWithoutResidenceTypeNestedInputSchema).optional(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutResidenceTypeNestedInputSchema).optional()
}).strict();

export const ResidenceTypeUncheckedUpdateWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ResidenceTypeUncheckedUpdateWithoutExpenseTypeInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUncheckedUpdateManyWithoutResidenceTypeNestedInputSchema).optional()
}).strict();

export const ExpenseUpsertWithWhereUniqueWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ExpenseUpsertWithWhereUniqueWithoutExpenseTypeInput> = z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ExpenseUpdateWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseUncheckedUpdateWithoutExpenseTypeInputSchema) ]),
  create: z.union([ z.lazy(() => ExpenseCreateWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseUncheckedCreateWithoutExpenseTypeInputSchema) ]),
}).strict();

export const ExpenseUpdateWithWhereUniqueWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ExpenseUpdateWithWhereUniqueWithoutExpenseTypeInput> = z.object({
  where: z.lazy(() => ExpenseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ExpenseUpdateWithoutExpenseTypeInputSchema),z.lazy(() => ExpenseUncheckedUpdateWithoutExpenseTypeInputSchema) ]),
}).strict();

export const ExpenseUpdateManyWithWhereWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ExpenseUpdateManyWithWhereWithoutExpenseTypeInput> = z.object({
  where: z.lazy(() => ExpenseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ExpenseUpdateManyMutationInputSchema),z.lazy(() => ExpenseUncheckedUpdateManyWithoutExpenseTypeInputSchema) ]),
}).strict();

export const CommunityCreateWithoutAccountInputSchema: z.ZodType<Prisma.CommunityCreateWithoutAccountInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  address: z.string(),
  Residence: z.lazy(() => ResidenceCreateNestedManyWithoutCommunityInputSchema).optional(),
  Provider: z.lazy(() => ProviderCreateNestedManyWithoutCommunityInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedManyWithoutCommunityInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityUncheckedCreateWithoutAccountInputSchema: z.ZodType<Prisma.CommunityUncheckedCreateWithoutAccountInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  address: z.string(),
  Residence: z.lazy(() => ResidenceUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  Provider: z.lazy(() => ProviderUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  User: z.lazy(() => UserUncheckedCreateNestedManyWithoutCommunityInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUncheckedCreateNestedManyWithoutCommunityInputSchema).optional()
}).strict();

export const CommunityCreateOrConnectWithoutAccountInputSchema: z.ZodType<Prisma.CommunityCreateOrConnectWithoutAccountInput> = z.object({
  where: z.lazy(() => CommunityWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CommunityCreateWithoutAccountInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutAccountInputSchema) ]),
}).strict();

export const PaymentCreateWithoutAccountInputSchema: z.ZodType<Prisma.PaymentCreateWithoutAccountInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  registerDate: z.coerce.date(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  voucherImage: z.string(),
  isEmailSend: z.boolean(),
  Expense: z.lazy(() => ExpenseCreateNestedManyWithoutPaymentInputSchema).optional(),
  User: z.lazy(() => UserCreateNestedOneWithoutPaymentsMadeInputSchema),
  Admin: z.lazy(() => UserCreateNestedOneWithoutPaymentsCreatedInputSchema)
}).strict();

export const PaymentUncheckedCreateWithoutAccountInputSchema: z.ZodType<Prisma.PaymentUncheckedCreateWithoutAccountInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  registerDate: z.coerce.date(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  owner_id: z.string(),
  voucherImage: z.string(),
  isEmailSend: z.boolean(),
  created_by: z.string(),
  Expense: z.lazy(() => ExpenseUncheckedCreateNestedManyWithoutPaymentInputSchema).optional()
}).strict();

export const PaymentCreateOrConnectWithoutAccountInputSchema: z.ZodType<Prisma.PaymentCreateOrConnectWithoutAccountInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PaymentCreateWithoutAccountInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutAccountInputSchema) ]),
}).strict();

export const PaymentCreateManyAccountInputEnvelopeSchema: z.ZodType<Prisma.PaymentCreateManyAccountInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PaymentCreateManyAccountInputSchema),z.lazy(() => PaymentCreateManyAccountInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CashoutCreateWithoutAccountInputSchema: z.ZodType<Prisma.CashoutCreateWithoutAccountInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  billImage: z.string(),
  status: z.string(),
  registerDate: z.coerce.date(),
  Provider: z.lazy(() => ProviderCreateNestedOneWithoutCashoutInputSchema)
}).strict();

export const CashoutUncheckedCreateWithoutAccountInputSchema: z.ZodType<Prisma.CashoutUncheckedCreateWithoutAccountInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  provider_id: z.string(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  billImage: z.string(),
  status: z.string(),
  registerDate: z.coerce.date()
}).strict();

export const CashoutCreateOrConnectWithoutAccountInputSchema: z.ZodType<Prisma.CashoutCreateOrConnectWithoutAccountInput> = z.object({
  where: z.lazy(() => CashoutWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CashoutCreateWithoutAccountInputSchema),z.lazy(() => CashoutUncheckedCreateWithoutAccountInputSchema) ]),
}).strict();

export const CashoutCreateManyAccountInputEnvelopeSchema: z.ZodType<Prisma.CashoutCreateManyAccountInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CashoutCreateManyAccountInputSchema),z.lazy(() => CashoutCreateManyAccountInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CommunityUpsertWithoutAccountInputSchema: z.ZodType<Prisma.CommunityUpsertWithoutAccountInput> = z.object({
  update: z.union([ z.lazy(() => CommunityUpdateWithoutAccountInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutAccountInputSchema) ]),
  create: z.union([ z.lazy(() => CommunityCreateWithoutAccountInputSchema),z.lazy(() => CommunityUncheckedCreateWithoutAccountInputSchema) ]),
  where: z.lazy(() => CommunityWhereInputSchema).optional()
}).strict();

export const CommunityUpdateToOneWithWhereWithoutAccountInputSchema: z.ZodType<Prisma.CommunityUpdateToOneWithWhereWithoutAccountInput> = z.object({
  where: z.lazy(() => CommunityWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CommunityUpdateWithoutAccountInputSchema),z.lazy(() => CommunityUncheckedUpdateWithoutAccountInputSchema) ]),
}).strict();

export const CommunityUpdateWithoutAccountInputSchema: z.ZodType<Prisma.CommunityUpdateWithoutAccountInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Provider: z.lazy(() => ProviderUpdateManyWithoutCommunityNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateManyWithoutCommunityNestedInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const CommunityUncheckedUpdateWithoutAccountInputSchema: z.ZodType<Prisma.CommunityUncheckedUpdateWithoutAccountInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  Provider: z.lazy(() => ProviderUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  User: z.lazy(() => UserUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUncheckedUpdateManyWithoutCommunityNestedInputSchema).optional()
}).strict();

export const PaymentUpsertWithWhereUniqueWithoutAccountInputSchema: z.ZodType<Prisma.PaymentUpsertWithWhereUniqueWithoutAccountInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PaymentUpdateWithoutAccountInputSchema),z.lazy(() => PaymentUncheckedUpdateWithoutAccountInputSchema) ]),
  create: z.union([ z.lazy(() => PaymentCreateWithoutAccountInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutAccountInputSchema) ]),
}).strict();

export const PaymentUpdateWithWhereUniqueWithoutAccountInputSchema: z.ZodType<Prisma.PaymentUpdateWithWhereUniqueWithoutAccountInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PaymentUpdateWithoutAccountInputSchema),z.lazy(() => PaymentUncheckedUpdateWithoutAccountInputSchema) ]),
}).strict();

export const PaymentUpdateManyWithWhereWithoutAccountInputSchema: z.ZodType<Prisma.PaymentUpdateManyWithWhereWithoutAccountInput> = z.object({
  where: z.lazy(() => PaymentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PaymentUpdateManyMutationInputSchema),z.lazy(() => PaymentUncheckedUpdateManyWithoutAccountInputSchema) ]),
}).strict();

export const CashoutUpsertWithWhereUniqueWithoutAccountInputSchema: z.ZodType<Prisma.CashoutUpsertWithWhereUniqueWithoutAccountInput> = z.object({
  where: z.lazy(() => CashoutWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CashoutUpdateWithoutAccountInputSchema),z.lazy(() => CashoutUncheckedUpdateWithoutAccountInputSchema) ]),
  create: z.union([ z.lazy(() => CashoutCreateWithoutAccountInputSchema),z.lazy(() => CashoutUncheckedCreateWithoutAccountInputSchema) ]),
}).strict();

export const CashoutUpdateWithWhereUniqueWithoutAccountInputSchema: z.ZodType<Prisma.CashoutUpdateWithWhereUniqueWithoutAccountInput> = z.object({
  where: z.lazy(() => CashoutWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CashoutUpdateWithoutAccountInputSchema),z.lazy(() => CashoutUncheckedUpdateWithoutAccountInputSchema) ]),
}).strict();

export const CashoutUpdateManyWithWhereWithoutAccountInputSchema: z.ZodType<Prisma.CashoutUpdateManyWithWhereWithoutAccountInput> = z.object({
  where: z.lazy(() => CashoutScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CashoutUpdateManyMutationInputSchema),z.lazy(() => CashoutUncheckedUpdateManyWithoutAccountInputSchema) ]),
}).strict();

export const ResidenceCreateManyCommunityInputSchema: z.ZodType<Prisma.ResidenceCreateManyCommunityInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  owner_id: z.string().optional().nullable(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.number().int()
}).strict();

export const ProviderCreateManyCommunityInputSchema: z.ZodType<Prisma.ProviderCreateManyCommunityInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  contactName: z.string(),
  description: z.string(),
  phone: z.string(),
  email: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  active: z.boolean()
}).strict();

export const UserCreateManyCommunityInputSchema: z.ZodType<Prisma.UserCreateManyCommunityInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  role_id: z.number().int(),
  residence_id: z.string().optional().nullable()
}).strict();

export const AccountCreateManyCommunityInputSchema: z.ZodType<Prisma.AccountCreateManyCommunityInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  active: z.boolean(),
  balance: z.bigint()
}).strict();

export const ResidenceTypeCreateManyCommunityInputSchema: z.ZodType<Prisma.ResidenceTypeCreateManyCommunityInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  description: z.string()
}).strict();

export const ResidenceUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  Owner: z.lazy(() => UserUpdateOneWithoutResidenceNestedInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUpdateOneRequiredWithoutResidenceNestedInputSchema).optional(),
  ParkingSlot: z.lazy(() => ParkingSlotUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Expense: z.lazy(() => ExpenseUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Resident: z.lazy(() => UserUpdateManyWithoutResidentInNestedInputSchema).optional()
}).strict();

export const ResidenceUncheckedUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceUncheckedUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ParkingSlot: z.lazy(() => ParkingSlotUncheckedUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Expense: z.lazy(() => ExpenseUncheckedUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Resident: z.lazy(() => UserUncheckedUpdateManyWithoutResidentInNestedInputSchema).optional()
}).strict();

export const ResidenceUncheckedUpdateManyWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceUncheckedUpdateManyWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProviderUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.ProviderUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contactName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Cashout: z.lazy(() => CashoutUpdateManyWithoutProviderNestedInputSchema).optional()
}).strict();

export const ProviderUncheckedUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.ProviderUncheckedUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contactName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Cashout: z.lazy(() => CashoutUncheckedUpdateManyWithoutProviderNestedInputSchema).optional()
}).strict();

export const ProviderUncheckedUpdateManyWithoutCommunityInputSchema: z.ZodType<Prisma.ProviderUncheckedUpdateManyWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contactName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  website: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.UserUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  Role: z.lazy(() => RoleUpdateOneWithoutUserNestedInputSchema).optional(),
  paymentsCreated: z.lazy(() => PaymentUpdateManyWithoutAdminNestedInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentUpdateManyWithoutUserNestedInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUpdateManyWithoutOwnerNestedInputSchema).optional(),
  ResidentIn: z.lazy(() => ResidenceUpdateOneWithoutResidentNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  residence_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentsCreated: z.lazy(() => PaymentUncheckedUpdateManyWithoutAdminNestedInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateManyWithoutCommunityInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  role_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  residence_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AccountUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.AccountUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  Payment: z.lazy(() => PaymentUpdateManyWithoutAccountNestedInputSchema).optional(),
  Cashout: z.lazy(() => CashoutUpdateManyWithoutAccountNestedInputSchema).optional()
}).strict();

export const AccountUncheckedUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
  Payment: z.lazy(() => PaymentUncheckedUpdateManyWithoutAccountNestedInputSchema).optional(),
  Cashout: z.lazy(() => CashoutUncheckedUpdateManyWithoutAccountNestedInputSchema).optional()
}).strict();

export const AccountUncheckedUpdateManyWithoutCommunityInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutCommunityInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  balance: z.union([ z.bigint(),z.lazy(() => BigIntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ResidenceTypeUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceTypeUpdateWithoutCommunityInput> = z.object({
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUpdateManyWithoutResidenceTypeNestedInputSchema).optional(),
  ExpenseType: z.lazy(() => ExpenseTypeUpdateManyWithoutResidenceTypeNestedInputSchema).optional()
}).strict();

export const ResidenceTypeUncheckedUpdateWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceTypeUncheckedUpdateWithoutCommunityInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUncheckedUpdateManyWithoutResidenceTypeNestedInputSchema).optional(),
  ExpenseType: z.lazy(() => ExpenseTypeUncheckedUpdateManyWithoutResidenceTypeNestedInputSchema).optional()
}).strict();

export const ResidenceTypeUncheckedUpdateManyWithoutCommunityInputSchema: z.ZodType<Prisma.ResidenceTypeUncheckedUpdateManyWithoutCommunityInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentCreateManyAdminInputSchema: z.ZodType<Prisma.PaymentCreateManyAdminInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  registerDate: z.coerce.date(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  owner_id: z.string(),
  voucherImage: z.string(),
  isEmailSend: z.boolean(),
  account_id: z.string()
}).strict();

export const PaymentCreateManyUserInputSchema: z.ZodType<Prisma.PaymentCreateManyUserInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  registerDate: z.coerce.date(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  voucherImage: z.string(),
  isEmailSend: z.boolean(),
  account_id: z.string(),
  created_by: z.string()
}).strict();

export const ResidenceCreateManyOwnerInputSchema: z.ZodType<Prisma.ResidenceCreateManyOwnerInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  community_id: z.string(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.number().int()
}).strict();

export const PaymentUpdateWithoutAdminInputSchema: z.ZodType<Prisma.PaymentUpdateWithoutAdminInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  voucherImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isEmailSend: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Expense: z.lazy(() => ExpenseUpdateManyWithoutPaymentNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateOneRequiredWithoutPaymentsMadeNestedInputSchema).optional(),
  Account: z.lazy(() => AccountUpdateOneRequiredWithoutPaymentNestedInputSchema).optional()
}).strict();

export const PaymentUncheckedUpdateWithoutAdminInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateWithoutAdminInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  voucherImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isEmailSend: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  account_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Expense: z.lazy(() => ExpenseUncheckedUpdateManyWithoutPaymentNestedInputSchema).optional()
}).strict();

export const PaymentUncheckedUpdateManyWithoutAdminInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateManyWithoutAdminInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  voucherImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isEmailSend: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  account_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentUpdateWithoutUserInputSchema: z.ZodType<Prisma.PaymentUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  voucherImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isEmailSend: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Expense: z.lazy(() => ExpenseUpdateManyWithoutPaymentNestedInputSchema).optional(),
  Account: z.lazy(() => AccountUpdateOneRequiredWithoutPaymentNestedInputSchema).optional(),
  Admin: z.lazy(() => UserUpdateOneRequiredWithoutPaymentsCreatedNestedInputSchema).optional()
}).strict();

export const PaymentUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  voucherImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isEmailSend: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  account_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_by: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Expense: z.lazy(() => ExpenseUncheckedUpdateManyWithoutPaymentNestedInputSchema).optional()
}).strict();

export const PaymentUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  voucherImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isEmailSend: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  account_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  created_by: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ResidenceUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.ResidenceUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutResidenceNestedInputSchema).optional(),
  ResidenceType: z.lazy(() => ResidenceTypeUpdateOneRequiredWithoutResidenceNestedInputSchema).optional(),
  ParkingSlot: z.lazy(() => ParkingSlotUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Expense: z.lazy(() => ExpenseUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Resident: z.lazy(() => UserUpdateManyWithoutResidentInNestedInputSchema).optional()
}).strict();

export const ResidenceUncheckedUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.ResidenceUncheckedUpdateWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ParkingSlot: z.lazy(() => ParkingSlotUncheckedUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Expense: z.lazy(() => ExpenseUncheckedUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Resident: z.lazy(() => UserUncheckedUpdateManyWithoutResidentInNestedInputSchema).optional()
}).strict();

export const ResidenceUncheckedUpdateManyWithoutOwnerInputSchema: z.ZodType<Prisma.ResidenceUncheckedUpdateManyWithoutOwnerInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  residenceType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ParkingSlotCreateManyResidenceInputSchema: z.ZodType<Prisma.ParkingSlotCreateManyResidenceInput> = z.object({
  id: z.string().optional(),
  number: z.number().int()
}).strict();

export const ExpenseCreateManyResidenceInputSchema: z.ZodType<Prisma.ExpenseCreateManyResidenceInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  emitingDate: z.coerce.date(),
  expireDate: z.coerce.date(),
  status: z.string(),
  expenseType_id: z.number().int(),
  payment_id: z.string()
}).strict();

export const UserCreateManyResidentInInputSchema: z.ZodType<Prisma.UserCreateManyResidentInInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  community_id: z.string().optional(),
  role_id: z.number().int()
}).strict();

export const ParkingSlotUpdateWithoutResidenceInputSchema: z.ZodType<Prisma.ParkingSlotUpdateWithoutResidenceInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ParkingSlotUncheckedUpdateWithoutResidenceInputSchema: z.ZodType<Prisma.ParkingSlotUncheckedUpdateWithoutResidenceInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ParkingSlotUncheckedUpdateManyWithoutResidenceInputSchema: z.ZodType<Prisma.ParkingSlotUncheckedUpdateManyWithoutResidenceInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExpenseUpdateWithoutResidenceInputSchema: z.ZodType<Prisma.ExpenseUpdateWithoutResidenceInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emitingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expireDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ExpenseType: z.lazy(() => ExpenseTypeUpdateOneRequiredWithoutExpenseNestedInputSchema).optional(),
  Payment: z.lazy(() => PaymentUpdateOneRequiredWithoutExpenseNestedInputSchema).optional()
}).strict();

export const ExpenseUncheckedUpdateWithoutResidenceInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateWithoutResidenceInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emitingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expireDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expenseType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  payment_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExpenseUncheckedUpdateManyWithoutResidenceInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateManyWithoutResidenceInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emitingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expireDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expenseType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  payment_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUpdateWithoutResidentInInputSchema: z.ZodType<Prisma.UserUpdateWithoutResidentInInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  Role: z.lazy(() => RoleUpdateOneWithoutUserNestedInputSchema).optional(),
  paymentsCreated: z.lazy(() => PaymentUpdateManyWithoutAdminNestedInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentUpdateManyWithoutUserNestedInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutResidentInInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutResidentInInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  paymentsCreated: z.lazy(() => PaymentUncheckedUpdateManyWithoutAdminNestedInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateManyWithoutResidentInInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutResidentInInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ResidenceCreateManyResidenceTypeInputSchema: z.ZodType<Prisma.ResidenceCreateManyResidenceTypeInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  owner_id: z.string().optional().nullable(),
  community_id: z.string(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const ExpenseTypeCreateManyResidenceTypeInputSchema: z.ZodType<Prisma.ExpenseTypeCreateManyResidenceTypeInput> = z.object({
  id: z.number().int().optional(),
  title: z.string(),
  value: z.number().int()
}).strict();

export const ResidenceUpdateWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ResidenceUpdateWithoutResidenceTypeInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  Owner: z.lazy(() => UserUpdateOneWithoutResidenceNestedInputSchema).optional(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutResidenceNestedInputSchema).optional(),
  ParkingSlot: z.lazy(() => ParkingSlotUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Expense: z.lazy(() => ExpenseUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Resident: z.lazy(() => UserUpdateManyWithoutResidentInNestedInputSchema).optional()
}).strict();

export const ResidenceUncheckedUpdateWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ResidenceUncheckedUpdateWithoutResidenceTypeInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ParkingSlot: z.lazy(() => ParkingSlotUncheckedUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Expense: z.lazy(() => ExpenseUncheckedUpdateManyWithoutResidenceNestedInputSchema).optional(),
  Resident: z.lazy(() => UserUncheckedUpdateManyWithoutResidentInNestedInputSchema).optional()
}).strict();

export const ResidenceUncheckedUpdateManyWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ResidenceUncheckedUpdateManyWithoutResidenceTypeInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contacts: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const ExpenseTypeUpdateWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ExpenseTypeUpdateWithoutResidenceTypeInput> = z.object({
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  Expense: z.lazy(() => ExpenseUpdateManyWithoutExpenseTypeNestedInputSchema).optional()
}).strict();

export const ExpenseTypeUncheckedUpdateWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ExpenseTypeUncheckedUpdateWithoutResidenceTypeInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  Expense: z.lazy(() => ExpenseUncheckedUpdateManyWithoutExpenseTypeNestedInputSchema).optional()
}).strict();

export const ExpenseTypeUncheckedUpdateManyWithoutResidenceTypeInputSchema: z.ZodType<Prisma.ExpenseTypeUncheckedUpdateManyWithoutResidenceTypeInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CashoutCreateManyProviderInputSchema: z.ZodType<Prisma.CashoutCreateManyProviderInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  billImage: z.string(),
  account_id: z.string(),
  status: z.string(),
  registerDate: z.coerce.date()
}).strict();

export const CashoutUpdateWithoutProviderInputSchema: z.ZodType<Prisma.CashoutUpdateWithoutProviderInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  billImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Account: z.lazy(() => AccountUpdateOneRequiredWithoutCashoutNestedInputSchema).optional()
}).strict();

export const CashoutUncheckedUpdateWithoutProviderInputSchema: z.ZodType<Prisma.CashoutUncheckedUpdateWithoutProviderInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  billImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  account_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CashoutUncheckedUpdateManyWithoutProviderInputSchema: z.ZodType<Prisma.CashoutUncheckedUpdateManyWithoutProviderInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  billImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  account_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateManyRoleInputSchema: z.ZodType<Prisma.UserCreateManyRoleInput> = z.object({
  id: z.string().optional(),
  userName: z.string(),
  email: z.string(),
  password: z.string().optional().nullable(),
  identification: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  isVerified: z.boolean().optional().nullable(),
  isActive: z.boolean().optional().nullable(),
  community_id: z.string().optional(),
  residence_id: z.string().optional().nullable()
}).strict();

export const UserUpdateWithoutRoleInputSchema: z.ZodType<Prisma.UserUpdateWithoutRoleInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  Community: z.lazy(() => CommunityUpdateOneRequiredWithoutUserNestedInputSchema).optional(),
  paymentsCreated: z.lazy(() => PaymentUpdateManyWithoutAdminNestedInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentUpdateManyWithoutUserNestedInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUpdateManyWithoutOwnerNestedInputSchema).optional(),
  ResidentIn: z.lazy(() => ResidenceUpdateOneWithoutResidentNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutRoleInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutRoleInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  residence_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentsCreated: z.lazy(() => PaymentUncheckedUpdateManyWithoutAdminNestedInputSchema).optional(),
  paymentsMade: z.lazy(() => PaymentUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  Residence: z.lazy(() => ResidenceUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateManyWithoutRoleInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutRoleInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  identification: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => NullableBoolFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  community_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  residence_id: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ExpenseCreateManyPaymentInputSchema: z.ZodType<Prisma.ExpenseCreateManyPaymentInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  residence_id: z.string(),
  emitingDate: z.coerce.date(),
  expireDate: z.coerce.date(),
  status: z.string(),
  expenseType_id: z.number().int()
}).strict();

export const ExpenseUpdateWithoutPaymentInputSchema: z.ZodType<Prisma.ExpenseUpdateWithoutPaymentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emitingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expireDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUpdateOneRequiredWithoutExpenseNestedInputSchema).optional(),
  ExpenseType: z.lazy(() => ExpenseTypeUpdateOneRequiredWithoutExpenseNestedInputSchema).optional()
}).strict();

export const ExpenseUncheckedUpdateWithoutPaymentInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateWithoutPaymentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  residence_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emitingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expireDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expenseType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExpenseUncheckedUpdateManyWithoutPaymentInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateManyWithoutPaymentInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  residence_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emitingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expireDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  expenseType_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExpenseCreateManyExpenseTypeInputSchema: z.ZodType<Prisma.ExpenseCreateManyExpenseTypeInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  residence_id: z.string(),
  emitingDate: z.coerce.date(),
  expireDate: z.coerce.date(),
  status: z.string(),
  payment_id: z.string()
}).strict();

export const ExpenseUpdateWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ExpenseUpdateWithoutExpenseTypeInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emitingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expireDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Residence: z.lazy(() => ResidenceUpdateOneRequiredWithoutExpenseNestedInputSchema).optional(),
  Payment: z.lazy(() => PaymentUpdateOneRequiredWithoutExpenseNestedInputSchema).optional()
}).strict();

export const ExpenseUncheckedUpdateWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateWithoutExpenseTypeInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  residence_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emitingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expireDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  payment_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ExpenseUncheckedUpdateManyWithoutExpenseTypeInputSchema: z.ZodType<Prisma.ExpenseUncheckedUpdateManyWithoutExpenseTypeInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  residence_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emitingDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expireDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  payment_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentCreateManyAccountInputSchema: z.ZodType<Prisma.PaymentCreateManyAccountInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  registerDate: z.coerce.date(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  owner_id: z.string(),
  voucherImage: z.string(),
  isEmailSend: z.boolean(),
  created_by: z.string()
}).strict();

export const CashoutCreateManyAccountInputSchema: z.ZodType<Prisma.CashoutCreateManyAccountInput> = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  provider_id: z.string(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  billImage: z.string(),
  status: z.string(),
  registerDate: z.coerce.date()
}).strict();

export const PaymentUpdateWithoutAccountInputSchema: z.ZodType<Prisma.PaymentUpdateWithoutAccountInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  voucherImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isEmailSend: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  Expense: z.lazy(() => ExpenseUpdateManyWithoutPaymentNestedInputSchema).optional(),
  User: z.lazy(() => UserUpdateOneRequiredWithoutPaymentsMadeNestedInputSchema).optional(),
  Admin: z.lazy(() => UserUpdateOneRequiredWithoutPaymentsCreatedNestedInputSchema).optional()
}).strict();

export const PaymentUncheckedUpdateWithoutAccountInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateWithoutAccountInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  voucherImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isEmailSend: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  created_by: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Expense: z.lazy(() => ExpenseUncheckedUpdateManyWithoutPaymentNestedInputSchema).optional()
}).strict();

export const PaymentUncheckedUpdateManyWithoutAccountInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateManyWithoutAccountInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  voucherImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isEmailSend: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  created_by: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CashoutUpdateWithoutAccountInputSchema: z.ZodType<Prisma.CashoutUpdateWithoutAccountInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  billImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  Provider: z.lazy(() => ProviderUpdateOneRequiredWithoutCashoutNestedInputSchema).optional()
}).strict();

export const CashoutUncheckedUpdateWithoutAccountInputSchema: z.ZodType<Prisma.CashoutUncheckedUpdateWithoutAccountInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  billImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CashoutUncheckedUpdateManyWithoutAccountInputSchema: z.ZodType<Prisma.CashoutUncheckedUpdateManyWithoutAccountInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  provider_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  billImage: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  registerDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const CommunityFindFirstArgsSchema: z.ZodType<Prisma.CommunityFindFirstArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  where: CommunityWhereInputSchema.optional(),
  orderBy: z.union([ CommunityOrderByWithRelationInputSchema.array(),CommunityOrderByWithRelationInputSchema ]).optional(),
  cursor: CommunityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CommunityScalarFieldEnumSchema,CommunityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CommunityFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CommunityFindFirstOrThrowArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  where: CommunityWhereInputSchema.optional(),
  orderBy: z.union([ CommunityOrderByWithRelationInputSchema.array(),CommunityOrderByWithRelationInputSchema ]).optional(),
  cursor: CommunityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CommunityScalarFieldEnumSchema,CommunityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CommunityFindManyArgsSchema: z.ZodType<Prisma.CommunityFindManyArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  where: CommunityWhereInputSchema.optional(),
  orderBy: z.union([ CommunityOrderByWithRelationInputSchema.array(),CommunityOrderByWithRelationInputSchema ]).optional(),
  cursor: CommunityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CommunityScalarFieldEnumSchema,CommunityScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CommunityAggregateArgsSchema: z.ZodType<Prisma.CommunityAggregateArgs> = z.object({
  where: CommunityWhereInputSchema.optional(),
  orderBy: z.union([ CommunityOrderByWithRelationInputSchema.array(),CommunityOrderByWithRelationInputSchema ]).optional(),
  cursor: CommunityWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CommunityGroupByArgsSchema: z.ZodType<Prisma.CommunityGroupByArgs> = z.object({
  where: CommunityWhereInputSchema.optional(),
  orderBy: z.union([ CommunityOrderByWithAggregationInputSchema.array(),CommunityOrderByWithAggregationInputSchema ]).optional(),
  by: CommunityScalarFieldEnumSchema.array(),
  having: CommunityScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CommunityFindUniqueArgsSchema: z.ZodType<Prisma.CommunityFindUniqueArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  where: CommunityWhereUniqueInputSchema,
}).strict() ;

export const CommunityFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CommunityFindUniqueOrThrowArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  where: CommunityWhereUniqueInputSchema,
}).strict() ;

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const ResidenceFindFirstArgsSchema: z.ZodType<Prisma.ResidenceFindFirstArgs> = z.object({
  select: ResidenceSelectSchema.optional(),
  include: ResidenceIncludeSchema.optional(),
  where: ResidenceWhereInputSchema.optional(),
  orderBy: z.union([ ResidenceOrderByWithRelationInputSchema.array(),ResidenceOrderByWithRelationInputSchema ]).optional(),
  cursor: ResidenceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResidenceScalarFieldEnumSchema,ResidenceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ResidenceFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ResidenceFindFirstOrThrowArgs> = z.object({
  select: ResidenceSelectSchema.optional(),
  include: ResidenceIncludeSchema.optional(),
  where: ResidenceWhereInputSchema.optional(),
  orderBy: z.union([ ResidenceOrderByWithRelationInputSchema.array(),ResidenceOrderByWithRelationInputSchema ]).optional(),
  cursor: ResidenceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResidenceScalarFieldEnumSchema,ResidenceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ResidenceFindManyArgsSchema: z.ZodType<Prisma.ResidenceFindManyArgs> = z.object({
  select: ResidenceSelectSchema.optional(),
  include: ResidenceIncludeSchema.optional(),
  where: ResidenceWhereInputSchema.optional(),
  orderBy: z.union([ ResidenceOrderByWithRelationInputSchema.array(),ResidenceOrderByWithRelationInputSchema ]).optional(),
  cursor: ResidenceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResidenceScalarFieldEnumSchema,ResidenceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ResidenceAggregateArgsSchema: z.ZodType<Prisma.ResidenceAggregateArgs> = z.object({
  where: ResidenceWhereInputSchema.optional(),
  orderBy: z.union([ ResidenceOrderByWithRelationInputSchema.array(),ResidenceOrderByWithRelationInputSchema ]).optional(),
  cursor: ResidenceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ResidenceGroupByArgsSchema: z.ZodType<Prisma.ResidenceGroupByArgs> = z.object({
  where: ResidenceWhereInputSchema.optional(),
  orderBy: z.union([ ResidenceOrderByWithAggregationInputSchema.array(),ResidenceOrderByWithAggregationInputSchema ]).optional(),
  by: ResidenceScalarFieldEnumSchema.array(),
  having: ResidenceScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ResidenceFindUniqueArgsSchema: z.ZodType<Prisma.ResidenceFindUniqueArgs> = z.object({
  select: ResidenceSelectSchema.optional(),
  include: ResidenceIncludeSchema.optional(),
  where: ResidenceWhereUniqueInputSchema,
}).strict() ;

export const ResidenceFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ResidenceFindUniqueOrThrowArgs> = z.object({
  select: ResidenceSelectSchema.optional(),
  include: ResidenceIncludeSchema.optional(),
  where: ResidenceWhereUniqueInputSchema,
}).strict() ;

export const ParkingSlotFindFirstArgsSchema: z.ZodType<Prisma.ParkingSlotFindFirstArgs> = z.object({
  select: ParkingSlotSelectSchema.optional(),
  include: ParkingSlotIncludeSchema.optional(),
  where: ParkingSlotWhereInputSchema.optional(),
  orderBy: z.union([ ParkingSlotOrderByWithRelationInputSchema.array(),ParkingSlotOrderByWithRelationInputSchema ]).optional(),
  cursor: ParkingSlotWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ParkingSlotScalarFieldEnumSchema,ParkingSlotScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ParkingSlotFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ParkingSlotFindFirstOrThrowArgs> = z.object({
  select: ParkingSlotSelectSchema.optional(),
  include: ParkingSlotIncludeSchema.optional(),
  where: ParkingSlotWhereInputSchema.optional(),
  orderBy: z.union([ ParkingSlotOrderByWithRelationInputSchema.array(),ParkingSlotOrderByWithRelationInputSchema ]).optional(),
  cursor: ParkingSlotWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ParkingSlotScalarFieldEnumSchema,ParkingSlotScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ParkingSlotFindManyArgsSchema: z.ZodType<Prisma.ParkingSlotFindManyArgs> = z.object({
  select: ParkingSlotSelectSchema.optional(),
  include: ParkingSlotIncludeSchema.optional(),
  where: ParkingSlotWhereInputSchema.optional(),
  orderBy: z.union([ ParkingSlotOrderByWithRelationInputSchema.array(),ParkingSlotOrderByWithRelationInputSchema ]).optional(),
  cursor: ParkingSlotWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ParkingSlotScalarFieldEnumSchema,ParkingSlotScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ParkingSlotAggregateArgsSchema: z.ZodType<Prisma.ParkingSlotAggregateArgs> = z.object({
  where: ParkingSlotWhereInputSchema.optional(),
  orderBy: z.union([ ParkingSlotOrderByWithRelationInputSchema.array(),ParkingSlotOrderByWithRelationInputSchema ]).optional(),
  cursor: ParkingSlotWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ParkingSlotGroupByArgsSchema: z.ZodType<Prisma.ParkingSlotGroupByArgs> = z.object({
  where: ParkingSlotWhereInputSchema.optional(),
  orderBy: z.union([ ParkingSlotOrderByWithAggregationInputSchema.array(),ParkingSlotOrderByWithAggregationInputSchema ]).optional(),
  by: ParkingSlotScalarFieldEnumSchema.array(),
  having: ParkingSlotScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ParkingSlotFindUniqueArgsSchema: z.ZodType<Prisma.ParkingSlotFindUniqueArgs> = z.object({
  select: ParkingSlotSelectSchema.optional(),
  include: ParkingSlotIncludeSchema.optional(),
  where: ParkingSlotWhereUniqueInputSchema,
}).strict() ;

export const ParkingSlotFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ParkingSlotFindUniqueOrThrowArgs> = z.object({
  select: ParkingSlotSelectSchema.optional(),
  include: ParkingSlotIncludeSchema.optional(),
  where: ParkingSlotWhereUniqueInputSchema,
}).strict() ;

export const ResidenceTypeFindFirstArgsSchema: z.ZodType<Prisma.ResidenceTypeFindFirstArgs> = z.object({
  select: ResidenceTypeSelectSchema.optional(),
  include: ResidenceTypeIncludeSchema.optional(),
  where: ResidenceTypeWhereInputSchema.optional(),
  orderBy: z.union([ ResidenceTypeOrderByWithRelationInputSchema.array(),ResidenceTypeOrderByWithRelationInputSchema ]).optional(),
  cursor: ResidenceTypeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResidenceTypeScalarFieldEnumSchema,ResidenceTypeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ResidenceTypeFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ResidenceTypeFindFirstOrThrowArgs> = z.object({
  select: ResidenceTypeSelectSchema.optional(),
  include: ResidenceTypeIncludeSchema.optional(),
  where: ResidenceTypeWhereInputSchema.optional(),
  orderBy: z.union([ ResidenceTypeOrderByWithRelationInputSchema.array(),ResidenceTypeOrderByWithRelationInputSchema ]).optional(),
  cursor: ResidenceTypeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResidenceTypeScalarFieldEnumSchema,ResidenceTypeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ResidenceTypeFindManyArgsSchema: z.ZodType<Prisma.ResidenceTypeFindManyArgs> = z.object({
  select: ResidenceTypeSelectSchema.optional(),
  include: ResidenceTypeIncludeSchema.optional(),
  where: ResidenceTypeWhereInputSchema.optional(),
  orderBy: z.union([ ResidenceTypeOrderByWithRelationInputSchema.array(),ResidenceTypeOrderByWithRelationInputSchema ]).optional(),
  cursor: ResidenceTypeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResidenceTypeScalarFieldEnumSchema,ResidenceTypeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ResidenceTypeAggregateArgsSchema: z.ZodType<Prisma.ResidenceTypeAggregateArgs> = z.object({
  where: ResidenceTypeWhereInputSchema.optional(),
  orderBy: z.union([ ResidenceTypeOrderByWithRelationInputSchema.array(),ResidenceTypeOrderByWithRelationInputSchema ]).optional(),
  cursor: ResidenceTypeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ResidenceTypeGroupByArgsSchema: z.ZodType<Prisma.ResidenceTypeGroupByArgs> = z.object({
  where: ResidenceTypeWhereInputSchema.optional(),
  orderBy: z.union([ ResidenceTypeOrderByWithAggregationInputSchema.array(),ResidenceTypeOrderByWithAggregationInputSchema ]).optional(),
  by: ResidenceTypeScalarFieldEnumSchema.array(),
  having: ResidenceTypeScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ResidenceTypeFindUniqueArgsSchema: z.ZodType<Prisma.ResidenceTypeFindUniqueArgs> = z.object({
  select: ResidenceTypeSelectSchema.optional(),
  include: ResidenceTypeIncludeSchema.optional(),
  where: ResidenceTypeWhereUniqueInputSchema,
}).strict() ;

export const ResidenceTypeFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ResidenceTypeFindUniqueOrThrowArgs> = z.object({
  select: ResidenceTypeSelectSchema.optional(),
  include: ResidenceTypeIncludeSchema.optional(),
  where: ResidenceTypeWhereUniqueInputSchema,
}).strict() ;

export const ProviderFindFirstArgsSchema: z.ZodType<Prisma.ProviderFindFirstArgs> = z.object({
  select: ProviderSelectSchema.optional(),
  include: ProviderIncludeSchema.optional(),
  where: ProviderWhereInputSchema.optional(),
  orderBy: z.union([ ProviderOrderByWithRelationInputSchema.array(),ProviderOrderByWithRelationInputSchema ]).optional(),
  cursor: ProviderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProviderScalarFieldEnumSchema,ProviderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProviderFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProviderFindFirstOrThrowArgs> = z.object({
  select: ProviderSelectSchema.optional(),
  include: ProviderIncludeSchema.optional(),
  where: ProviderWhereInputSchema.optional(),
  orderBy: z.union([ ProviderOrderByWithRelationInputSchema.array(),ProviderOrderByWithRelationInputSchema ]).optional(),
  cursor: ProviderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProviderScalarFieldEnumSchema,ProviderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProviderFindManyArgsSchema: z.ZodType<Prisma.ProviderFindManyArgs> = z.object({
  select: ProviderSelectSchema.optional(),
  include: ProviderIncludeSchema.optional(),
  where: ProviderWhereInputSchema.optional(),
  orderBy: z.union([ ProviderOrderByWithRelationInputSchema.array(),ProviderOrderByWithRelationInputSchema ]).optional(),
  cursor: ProviderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProviderScalarFieldEnumSchema,ProviderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProviderAggregateArgsSchema: z.ZodType<Prisma.ProviderAggregateArgs> = z.object({
  where: ProviderWhereInputSchema.optional(),
  orderBy: z.union([ ProviderOrderByWithRelationInputSchema.array(),ProviderOrderByWithRelationInputSchema ]).optional(),
  cursor: ProviderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProviderGroupByArgsSchema: z.ZodType<Prisma.ProviderGroupByArgs> = z.object({
  where: ProviderWhereInputSchema.optional(),
  orderBy: z.union([ ProviderOrderByWithAggregationInputSchema.array(),ProviderOrderByWithAggregationInputSchema ]).optional(),
  by: ProviderScalarFieldEnumSchema.array(),
  having: ProviderScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProviderFindUniqueArgsSchema: z.ZodType<Prisma.ProviderFindUniqueArgs> = z.object({
  select: ProviderSelectSchema.optional(),
  include: ProviderIncludeSchema.optional(),
  where: ProviderWhereUniqueInputSchema,
}).strict() ;

export const ProviderFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProviderFindUniqueOrThrowArgs> = z.object({
  select: ProviderSelectSchema.optional(),
  include: ProviderIncludeSchema.optional(),
  where: ProviderWhereUniqueInputSchema,
}).strict() ;

export const RoleFindFirstArgsSchema: z.ZodType<Prisma.RoleFindFirstArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereInputSchema.optional(),
  orderBy: z.union([ RoleOrderByWithRelationInputSchema.array(),RoleOrderByWithRelationInputSchema ]).optional(),
  cursor: RoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoleScalarFieldEnumSchema,RoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoleFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RoleFindFirstOrThrowArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereInputSchema.optional(),
  orderBy: z.union([ RoleOrderByWithRelationInputSchema.array(),RoleOrderByWithRelationInputSchema ]).optional(),
  cursor: RoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoleScalarFieldEnumSchema,RoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoleFindManyArgsSchema: z.ZodType<Prisma.RoleFindManyArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereInputSchema.optional(),
  orderBy: z.union([ RoleOrderByWithRelationInputSchema.array(),RoleOrderByWithRelationInputSchema ]).optional(),
  cursor: RoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RoleScalarFieldEnumSchema,RoleScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RoleAggregateArgsSchema: z.ZodType<Prisma.RoleAggregateArgs> = z.object({
  where: RoleWhereInputSchema.optional(),
  orderBy: z.union([ RoleOrderByWithRelationInputSchema.array(),RoleOrderByWithRelationInputSchema ]).optional(),
  cursor: RoleWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RoleGroupByArgsSchema: z.ZodType<Prisma.RoleGroupByArgs> = z.object({
  where: RoleWhereInputSchema.optional(),
  orderBy: z.union([ RoleOrderByWithAggregationInputSchema.array(),RoleOrderByWithAggregationInputSchema ]).optional(),
  by: RoleScalarFieldEnumSchema.array(),
  having: RoleScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RoleFindUniqueArgsSchema: z.ZodType<Prisma.RoleFindUniqueArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereUniqueInputSchema,
}).strict() ;

export const RoleFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RoleFindUniqueOrThrowArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereUniqueInputSchema,
}).strict() ;

export const ExpenseFindFirstArgsSchema: z.ZodType<Prisma.ExpenseFindFirstArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  where: ExpenseWhereInputSchema.optional(),
  orderBy: z.union([ ExpenseOrderByWithRelationInputSchema.array(),ExpenseOrderByWithRelationInputSchema ]).optional(),
  cursor: ExpenseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExpenseScalarFieldEnumSchema,ExpenseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ExpenseFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ExpenseFindFirstOrThrowArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  where: ExpenseWhereInputSchema.optional(),
  orderBy: z.union([ ExpenseOrderByWithRelationInputSchema.array(),ExpenseOrderByWithRelationInputSchema ]).optional(),
  cursor: ExpenseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExpenseScalarFieldEnumSchema,ExpenseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ExpenseFindManyArgsSchema: z.ZodType<Prisma.ExpenseFindManyArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  where: ExpenseWhereInputSchema.optional(),
  orderBy: z.union([ ExpenseOrderByWithRelationInputSchema.array(),ExpenseOrderByWithRelationInputSchema ]).optional(),
  cursor: ExpenseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExpenseScalarFieldEnumSchema,ExpenseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ExpenseAggregateArgsSchema: z.ZodType<Prisma.ExpenseAggregateArgs> = z.object({
  where: ExpenseWhereInputSchema.optional(),
  orderBy: z.union([ ExpenseOrderByWithRelationInputSchema.array(),ExpenseOrderByWithRelationInputSchema ]).optional(),
  cursor: ExpenseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ExpenseGroupByArgsSchema: z.ZodType<Prisma.ExpenseGroupByArgs> = z.object({
  where: ExpenseWhereInputSchema.optional(),
  orderBy: z.union([ ExpenseOrderByWithAggregationInputSchema.array(),ExpenseOrderByWithAggregationInputSchema ]).optional(),
  by: ExpenseScalarFieldEnumSchema.array(),
  having: ExpenseScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ExpenseFindUniqueArgsSchema: z.ZodType<Prisma.ExpenseFindUniqueArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  where: ExpenseWhereUniqueInputSchema,
}).strict() ;

export const ExpenseFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ExpenseFindUniqueOrThrowArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  where: ExpenseWhereUniqueInputSchema,
}).strict() ;

export const PaymentFindFirstArgsSchema: z.ZodType<Prisma.PaymentFindFirstArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereInputSchema.optional(),
  orderBy: z.union([ PaymentOrderByWithRelationInputSchema.array(),PaymentOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaymentScalarFieldEnumSchema,PaymentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PaymentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PaymentFindFirstOrThrowArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereInputSchema.optional(),
  orderBy: z.union([ PaymentOrderByWithRelationInputSchema.array(),PaymentOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaymentScalarFieldEnumSchema,PaymentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PaymentFindManyArgsSchema: z.ZodType<Prisma.PaymentFindManyArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereInputSchema.optional(),
  orderBy: z.union([ PaymentOrderByWithRelationInputSchema.array(),PaymentOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaymentScalarFieldEnumSchema,PaymentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PaymentAggregateArgsSchema: z.ZodType<Prisma.PaymentAggregateArgs> = z.object({
  where: PaymentWhereInputSchema.optional(),
  orderBy: z.union([ PaymentOrderByWithRelationInputSchema.array(),PaymentOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PaymentGroupByArgsSchema: z.ZodType<Prisma.PaymentGroupByArgs> = z.object({
  where: PaymentWhereInputSchema.optional(),
  orderBy: z.union([ PaymentOrderByWithAggregationInputSchema.array(),PaymentOrderByWithAggregationInputSchema ]).optional(),
  by: PaymentScalarFieldEnumSchema.array(),
  having: PaymentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PaymentFindUniqueArgsSchema: z.ZodType<Prisma.PaymentFindUniqueArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereUniqueInputSchema,
}).strict() ;

export const PaymentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PaymentFindUniqueOrThrowArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereUniqueInputSchema,
}).strict() ;

export const CashoutFindFirstArgsSchema: z.ZodType<Prisma.CashoutFindFirstArgs> = z.object({
  select: CashoutSelectSchema.optional(),
  include: CashoutIncludeSchema.optional(),
  where: CashoutWhereInputSchema.optional(),
  orderBy: z.union([ CashoutOrderByWithRelationInputSchema.array(),CashoutOrderByWithRelationInputSchema ]).optional(),
  cursor: CashoutWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CashoutScalarFieldEnumSchema,CashoutScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CashoutFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CashoutFindFirstOrThrowArgs> = z.object({
  select: CashoutSelectSchema.optional(),
  include: CashoutIncludeSchema.optional(),
  where: CashoutWhereInputSchema.optional(),
  orderBy: z.union([ CashoutOrderByWithRelationInputSchema.array(),CashoutOrderByWithRelationInputSchema ]).optional(),
  cursor: CashoutWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CashoutScalarFieldEnumSchema,CashoutScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CashoutFindManyArgsSchema: z.ZodType<Prisma.CashoutFindManyArgs> = z.object({
  select: CashoutSelectSchema.optional(),
  include: CashoutIncludeSchema.optional(),
  where: CashoutWhereInputSchema.optional(),
  orderBy: z.union([ CashoutOrderByWithRelationInputSchema.array(),CashoutOrderByWithRelationInputSchema ]).optional(),
  cursor: CashoutWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CashoutScalarFieldEnumSchema,CashoutScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CashoutAggregateArgsSchema: z.ZodType<Prisma.CashoutAggregateArgs> = z.object({
  where: CashoutWhereInputSchema.optional(),
  orderBy: z.union([ CashoutOrderByWithRelationInputSchema.array(),CashoutOrderByWithRelationInputSchema ]).optional(),
  cursor: CashoutWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CashoutGroupByArgsSchema: z.ZodType<Prisma.CashoutGroupByArgs> = z.object({
  where: CashoutWhereInputSchema.optional(),
  orderBy: z.union([ CashoutOrderByWithAggregationInputSchema.array(),CashoutOrderByWithAggregationInputSchema ]).optional(),
  by: CashoutScalarFieldEnumSchema.array(),
  having: CashoutScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CashoutFindUniqueArgsSchema: z.ZodType<Prisma.CashoutFindUniqueArgs> = z.object({
  select: CashoutSelectSchema.optional(),
  include: CashoutIncludeSchema.optional(),
  where: CashoutWhereUniqueInputSchema,
}).strict() ;

export const CashoutFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CashoutFindUniqueOrThrowArgs> = z.object({
  select: CashoutSelectSchema.optional(),
  include: CashoutIncludeSchema.optional(),
  where: CashoutWhereUniqueInputSchema,
}).strict() ;

export const ExpenseTypeFindFirstArgsSchema: z.ZodType<Prisma.ExpenseTypeFindFirstArgs> = z.object({
  select: ExpenseTypeSelectSchema.optional(),
  include: ExpenseTypeIncludeSchema.optional(),
  where: ExpenseTypeWhereInputSchema.optional(),
  orderBy: z.union([ ExpenseTypeOrderByWithRelationInputSchema.array(),ExpenseTypeOrderByWithRelationInputSchema ]).optional(),
  cursor: ExpenseTypeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExpenseTypeScalarFieldEnumSchema,ExpenseTypeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ExpenseTypeFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ExpenseTypeFindFirstOrThrowArgs> = z.object({
  select: ExpenseTypeSelectSchema.optional(),
  include: ExpenseTypeIncludeSchema.optional(),
  where: ExpenseTypeWhereInputSchema.optional(),
  orderBy: z.union([ ExpenseTypeOrderByWithRelationInputSchema.array(),ExpenseTypeOrderByWithRelationInputSchema ]).optional(),
  cursor: ExpenseTypeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExpenseTypeScalarFieldEnumSchema,ExpenseTypeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ExpenseTypeFindManyArgsSchema: z.ZodType<Prisma.ExpenseTypeFindManyArgs> = z.object({
  select: ExpenseTypeSelectSchema.optional(),
  include: ExpenseTypeIncludeSchema.optional(),
  where: ExpenseTypeWhereInputSchema.optional(),
  orderBy: z.union([ ExpenseTypeOrderByWithRelationInputSchema.array(),ExpenseTypeOrderByWithRelationInputSchema ]).optional(),
  cursor: ExpenseTypeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ExpenseTypeScalarFieldEnumSchema,ExpenseTypeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ExpenseTypeAggregateArgsSchema: z.ZodType<Prisma.ExpenseTypeAggregateArgs> = z.object({
  where: ExpenseTypeWhereInputSchema.optional(),
  orderBy: z.union([ ExpenseTypeOrderByWithRelationInputSchema.array(),ExpenseTypeOrderByWithRelationInputSchema ]).optional(),
  cursor: ExpenseTypeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ExpenseTypeGroupByArgsSchema: z.ZodType<Prisma.ExpenseTypeGroupByArgs> = z.object({
  where: ExpenseTypeWhereInputSchema.optional(),
  orderBy: z.union([ ExpenseTypeOrderByWithAggregationInputSchema.array(),ExpenseTypeOrderByWithAggregationInputSchema ]).optional(),
  by: ExpenseTypeScalarFieldEnumSchema.array(),
  having: ExpenseTypeScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ExpenseTypeFindUniqueArgsSchema: z.ZodType<Prisma.ExpenseTypeFindUniqueArgs> = z.object({
  select: ExpenseTypeSelectSchema.optional(),
  include: ExpenseTypeIncludeSchema.optional(),
  where: ExpenseTypeWhereUniqueInputSchema,
}).strict() ;

export const ExpenseTypeFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ExpenseTypeFindUniqueOrThrowArgs> = z.object({
  select: ExpenseTypeSelectSchema.optional(),
  include: ExpenseTypeIncludeSchema.optional(),
  where: ExpenseTypeWhereUniqueInputSchema,
}).strict() ;

export const AccountFindFirstArgsSchema: z.ZodType<Prisma.AccountFindFirstArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountFindManyArgsSchema: z.ZodType<Prisma.AccountFindManyArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AccountScalarFieldEnumSchema,AccountScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AccountAggregateArgsSchema: z.ZodType<Prisma.AccountAggregateArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithRelationInputSchema.array(),AccountOrderByWithRelationInputSchema ]).optional(),
  cursor: AccountWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountGroupByArgsSchema: z.ZodType<Prisma.AccountGroupByArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
  orderBy: z.union([ AccountOrderByWithAggregationInputSchema.array(),AccountOrderByWithAggregationInputSchema ]).optional(),
  by: AccountScalarFieldEnumSchema.array(),
  having: AccountScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AccountFindUniqueArgsSchema: z.ZodType<Prisma.AccountFindUniqueArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const CommunityCreateArgsSchema: z.ZodType<Prisma.CommunityCreateArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  data: z.union([ CommunityCreateInputSchema,CommunityUncheckedCreateInputSchema ]),
}).strict() ;

export const CommunityUpsertArgsSchema: z.ZodType<Prisma.CommunityUpsertArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  where: CommunityWhereUniqueInputSchema,
  create: z.union([ CommunityCreateInputSchema,CommunityUncheckedCreateInputSchema ]),
  update: z.union([ CommunityUpdateInputSchema,CommunityUncheckedUpdateInputSchema ]),
}).strict() ;

export const CommunityCreateManyArgsSchema: z.ZodType<Prisma.CommunityCreateManyArgs> = z.object({
  data: z.union([ CommunityCreateManyInputSchema,CommunityCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CommunityCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CommunityCreateManyAndReturnArgs> = z.object({
  data: z.union([ CommunityCreateManyInputSchema,CommunityCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CommunityDeleteArgsSchema: z.ZodType<Prisma.CommunityDeleteArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  where: CommunityWhereUniqueInputSchema,
}).strict() ;

export const CommunityUpdateArgsSchema: z.ZodType<Prisma.CommunityUpdateArgs> = z.object({
  select: CommunitySelectSchema.optional(),
  include: CommunityIncludeSchema.optional(),
  data: z.union([ CommunityUpdateInputSchema,CommunityUncheckedUpdateInputSchema ]),
  where: CommunityWhereUniqueInputSchema,
}).strict() ;

export const CommunityUpdateManyArgsSchema: z.ZodType<Prisma.CommunityUpdateManyArgs> = z.object({
  data: z.union([ CommunityUpdateManyMutationInputSchema,CommunityUncheckedUpdateManyInputSchema ]),
  where: CommunityWhereInputSchema.optional(),
}).strict() ;

export const CommunityDeleteManyArgsSchema: z.ZodType<Prisma.CommunityDeleteManyArgs> = z.object({
  where: CommunityWhereInputSchema.optional(),
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const ResidenceCreateArgsSchema: z.ZodType<Prisma.ResidenceCreateArgs> = z.object({
  select: ResidenceSelectSchema.optional(),
  include: ResidenceIncludeSchema.optional(),
  data: z.union([ ResidenceCreateInputSchema,ResidenceUncheckedCreateInputSchema ]),
}).strict() ;

export const ResidenceUpsertArgsSchema: z.ZodType<Prisma.ResidenceUpsertArgs> = z.object({
  select: ResidenceSelectSchema.optional(),
  include: ResidenceIncludeSchema.optional(),
  where: ResidenceWhereUniqueInputSchema,
  create: z.union([ ResidenceCreateInputSchema,ResidenceUncheckedCreateInputSchema ]),
  update: z.union([ ResidenceUpdateInputSchema,ResidenceUncheckedUpdateInputSchema ]),
}).strict() ;

export const ResidenceCreateManyArgsSchema: z.ZodType<Prisma.ResidenceCreateManyArgs> = z.object({
  data: z.union([ ResidenceCreateManyInputSchema,ResidenceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ResidenceCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ResidenceCreateManyAndReturnArgs> = z.object({
  data: z.union([ ResidenceCreateManyInputSchema,ResidenceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ResidenceDeleteArgsSchema: z.ZodType<Prisma.ResidenceDeleteArgs> = z.object({
  select: ResidenceSelectSchema.optional(),
  include: ResidenceIncludeSchema.optional(),
  where: ResidenceWhereUniqueInputSchema,
}).strict() ;

export const ResidenceUpdateArgsSchema: z.ZodType<Prisma.ResidenceUpdateArgs> = z.object({
  select: ResidenceSelectSchema.optional(),
  include: ResidenceIncludeSchema.optional(),
  data: z.union([ ResidenceUpdateInputSchema,ResidenceUncheckedUpdateInputSchema ]),
  where: ResidenceWhereUniqueInputSchema,
}).strict() ;

export const ResidenceUpdateManyArgsSchema: z.ZodType<Prisma.ResidenceUpdateManyArgs> = z.object({
  data: z.union([ ResidenceUpdateManyMutationInputSchema,ResidenceUncheckedUpdateManyInputSchema ]),
  where: ResidenceWhereInputSchema.optional(),
}).strict() ;

export const ResidenceDeleteManyArgsSchema: z.ZodType<Prisma.ResidenceDeleteManyArgs> = z.object({
  where: ResidenceWhereInputSchema.optional(),
}).strict() ;

export const ParkingSlotCreateArgsSchema: z.ZodType<Prisma.ParkingSlotCreateArgs> = z.object({
  select: ParkingSlotSelectSchema.optional(),
  include: ParkingSlotIncludeSchema.optional(),
  data: z.union([ ParkingSlotCreateInputSchema,ParkingSlotUncheckedCreateInputSchema ]),
}).strict() ;

export const ParkingSlotUpsertArgsSchema: z.ZodType<Prisma.ParkingSlotUpsertArgs> = z.object({
  select: ParkingSlotSelectSchema.optional(),
  include: ParkingSlotIncludeSchema.optional(),
  where: ParkingSlotWhereUniqueInputSchema,
  create: z.union([ ParkingSlotCreateInputSchema,ParkingSlotUncheckedCreateInputSchema ]),
  update: z.union([ ParkingSlotUpdateInputSchema,ParkingSlotUncheckedUpdateInputSchema ]),
}).strict() ;

export const ParkingSlotCreateManyArgsSchema: z.ZodType<Prisma.ParkingSlotCreateManyArgs> = z.object({
  data: z.union([ ParkingSlotCreateManyInputSchema,ParkingSlotCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ParkingSlotCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ParkingSlotCreateManyAndReturnArgs> = z.object({
  data: z.union([ ParkingSlotCreateManyInputSchema,ParkingSlotCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ParkingSlotDeleteArgsSchema: z.ZodType<Prisma.ParkingSlotDeleteArgs> = z.object({
  select: ParkingSlotSelectSchema.optional(),
  include: ParkingSlotIncludeSchema.optional(),
  where: ParkingSlotWhereUniqueInputSchema,
}).strict() ;

export const ParkingSlotUpdateArgsSchema: z.ZodType<Prisma.ParkingSlotUpdateArgs> = z.object({
  select: ParkingSlotSelectSchema.optional(),
  include: ParkingSlotIncludeSchema.optional(),
  data: z.union([ ParkingSlotUpdateInputSchema,ParkingSlotUncheckedUpdateInputSchema ]),
  where: ParkingSlotWhereUniqueInputSchema,
}).strict() ;

export const ParkingSlotUpdateManyArgsSchema: z.ZodType<Prisma.ParkingSlotUpdateManyArgs> = z.object({
  data: z.union([ ParkingSlotUpdateManyMutationInputSchema,ParkingSlotUncheckedUpdateManyInputSchema ]),
  where: ParkingSlotWhereInputSchema.optional(),
}).strict() ;

export const ParkingSlotDeleteManyArgsSchema: z.ZodType<Prisma.ParkingSlotDeleteManyArgs> = z.object({
  where: ParkingSlotWhereInputSchema.optional(),
}).strict() ;

export const ResidenceTypeCreateArgsSchema: z.ZodType<Prisma.ResidenceTypeCreateArgs> = z.object({
  select: ResidenceTypeSelectSchema.optional(),
  include: ResidenceTypeIncludeSchema.optional(),
  data: z.union([ ResidenceTypeCreateInputSchema,ResidenceTypeUncheckedCreateInputSchema ]),
}).strict() ;

export const ResidenceTypeUpsertArgsSchema: z.ZodType<Prisma.ResidenceTypeUpsertArgs> = z.object({
  select: ResidenceTypeSelectSchema.optional(),
  include: ResidenceTypeIncludeSchema.optional(),
  where: ResidenceTypeWhereUniqueInputSchema,
  create: z.union([ ResidenceTypeCreateInputSchema,ResidenceTypeUncheckedCreateInputSchema ]),
  update: z.union([ ResidenceTypeUpdateInputSchema,ResidenceTypeUncheckedUpdateInputSchema ]),
}).strict() ;

export const ResidenceTypeCreateManyArgsSchema: z.ZodType<Prisma.ResidenceTypeCreateManyArgs> = z.object({
  data: z.union([ ResidenceTypeCreateManyInputSchema,ResidenceTypeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ResidenceTypeCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ResidenceTypeCreateManyAndReturnArgs> = z.object({
  data: z.union([ ResidenceTypeCreateManyInputSchema,ResidenceTypeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ResidenceTypeDeleteArgsSchema: z.ZodType<Prisma.ResidenceTypeDeleteArgs> = z.object({
  select: ResidenceTypeSelectSchema.optional(),
  include: ResidenceTypeIncludeSchema.optional(),
  where: ResidenceTypeWhereUniqueInputSchema,
}).strict() ;

export const ResidenceTypeUpdateArgsSchema: z.ZodType<Prisma.ResidenceTypeUpdateArgs> = z.object({
  select: ResidenceTypeSelectSchema.optional(),
  include: ResidenceTypeIncludeSchema.optional(),
  data: z.union([ ResidenceTypeUpdateInputSchema,ResidenceTypeUncheckedUpdateInputSchema ]),
  where: ResidenceTypeWhereUniqueInputSchema,
}).strict() ;

export const ResidenceTypeUpdateManyArgsSchema: z.ZodType<Prisma.ResidenceTypeUpdateManyArgs> = z.object({
  data: z.union([ ResidenceTypeUpdateManyMutationInputSchema,ResidenceTypeUncheckedUpdateManyInputSchema ]),
  where: ResidenceTypeWhereInputSchema.optional(),
}).strict() ;

export const ResidenceTypeDeleteManyArgsSchema: z.ZodType<Prisma.ResidenceTypeDeleteManyArgs> = z.object({
  where: ResidenceTypeWhereInputSchema.optional(),
}).strict() ;

export const ProviderCreateArgsSchema: z.ZodType<Prisma.ProviderCreateArgs> = z.object({
  select: ProviderSelectSchema.optional(),
  include: ProviderIncludeSchema.optional(),
  data: z.union([ ProviderCreateInputSchema,ProviderUncheckedCreateInputSchema ]),
}).strict() ;

export const ProviderUpsertArgsSchema: z.ZodType<Prisma.ProviderUpsertArgs> = z.object({
  select: ProviderSelectSchema.optional(),
  include: ProviderIncludeSchema.optional(),
  where: ProviderWhereUniqueInputSchema,
  create: z.union([ ProviderCreateInputSchema,ProviderUncheckedCreateInputSchema ]),
  update: z.union([ ProviderUpdateInputSchema,ProviderUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProviderCreateManyArgsSchema: z.ZodType<Prisma.ProviderCreateManyArgs> = z.object({
  data: z.union([ ProviderCreateManyInputSchema,ProviderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProviderCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProviderCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProviderCreateManyInputSchema,ProviderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProviderDeleteArgsSchema: z.ZodType<Prisma.ProviderDeleteArgs> = z.object({
  select: ProviderSelectSchema.optional(),
  include: ProviderIncludeSchema.optional(),
  where: ProviderWhereUniqueInputSchema,
}).strict() ;

export const ProviderUpdateArgsSchema: z.ZodType<Prisma.ProviderUpdateArgs> = z.object({
  select: ProviderSelectSchema.optional(),
  include: ProviderIncludeSchema.optional(),
  data: z.union([ ProviderUpdateInputSchema,ProviderUncheckedUpdateInputSchema ]),
  where: ProviderWhereUniqueInputSchema,
}).strict() ;

export const ProviderUpdateManyArgsSchema: z.ZodType<Prisma.ProviderUpdateManyArgs> = z.object({
  data: z.union([ ProviderUpdateManyMutationInputSchema,ProviderUncheckedUpdateManyInputSchema ]),
  where: ProviderWhereInputSchema.optional(),
}).strict() ;

export const ProviderDeleteManyArgsSchema: z.ZodType<Prisma.ProviderDeleteManyArgs> = z.object({
  where: ProviderWhereInputSchema.optional(),
}).strict() ;

export const RoleCreateArgsSchema: z.ZodType<Prisma.RoleCreateArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  data: z.union([ RoleCreateInputSchema,RoleUncheckedCreateInputSchema ]),
}).strict() ;

export const RoleUpsertArgsSchema: z.ZodType<Prisma.RoleUpsertArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereUniqueInputSchema,
  create: z.union([ RoleCreateInputSchema,RoleUncheckedCreateInputSchema ]),
  update: z.union([ RoleUpdateInputSchema,RoleUncheckedUpdateInputSchema ]),
}).strict() ;

export const RoleCreateManyArgsSchema: z.ZodType<Prisma.RoleCreateManyArgs> = z.object({
  data: z.union([ RoleCreateManyInputSchema,RoleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RoleCreateManyAndReturnArgsSchema: z.ZodType<Prisma.RoleCreateManyAndReturnArgs> = z.object({
  data: z.union([ RoleCreateManyInputSchema,RoleCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RoleDeleteArgsSchema: z.ZodType<Prisma.RoleDeleteArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  where: RoleWhereUniqueInputSchema,
}).strict() ;

export const RoleUpdateArgsSchema: z.ZodType<Prisma.RoleUpdateArgs> = z.object({
  select: RoleSelectSchema.optional(),
  include: RoleIncludeSchema.optional(),
  data: z.union([ RoleUpdateInputSchema,RoleUncheckedUpdateInputSchema ]),
  where: RoleWhereUniqueInputSchema,
}).strict() ;

export const RoleUpdateManyArgsSchema: z.ZodType<Prisma.RoleUpdateManyArgs> = z.object({
  data: z.union([ RoleUpdateManyMutationInputSchema,RoleUncheckedUpdateManyInputSchema ]),
  where: RoleWhereInputSchema.optional(),
}).strict() ;

export const RoleDeleteManyArgsSchema: z.ZodType<Prisma.RoleDeleteManyArgs> = z.object({
  where: RoleWhereInputSchema.optional(),
}).strict() ;

export const ExpenseCreateArgsSchema: z.ZodType<Prisma.ExpenseCreateArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  data: z.union([ ExpenseCreateInputSchema,ExpenseUncheckedCreateInputSchema ]),
}).strict() ;

export const ExpenseUpsertArgsSchema: z.ZodType<Prisma.ExpenseUpsertArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  where: ExpenseWhereUniqueInputSchema,
  create: z.union([ ExpenseCreateInputSchema,ExpenseUncheckedCreateInputSchema ]),
  update: z.union([ ExpenseUpdateInputSchema,ExpenseUncheckedUpdateInputSchema ]),
}).strict() ;

export const ExpenseCreateManyArgsSchema: z.ZodType<Prisma.ExpenseCreateManyArgs> = z.object({
  data: z.union([ ExpenseCreateManyInputSchema,ExpenseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ExpenseCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ExpenseCreateManyAndReturnArgs> = z.object({
  data: z.union([ ExpenseCreateManyInputSchema,ExpenseCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ExpenseDeleteArgsSchema: z.ZodType<Prisma.ExpenseDeleteArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  where: ExpenseWhereUniqueInputSchema,
}).strict() ;

export const ExpenseUpdateArgsSchema: z.ZodType<Prisma.ExpenseUpdateArgs> = z.object({
  select: ExpenseSelectSchema.optional(),
  include: ExpenseIncludeSchema.optional(),
  data: z.union([ ExpenseUpdateInputSchema,ExpenseUncheckedUpdateInputSchema ]),
  where: ExpenseWhereUniqueInputSchema,
}).strict() ;

export const ExpenseUpdateManyArgsSchema: z.ZodType<Prisma.ExpenseUpdateManyArgs> = z.object({
  data: z.union([ ExpenseUpdateManyMutationInputSchema,ExpenseUncheckedUpdateManyInputSchema ]),
  where: ExpenseWhereInputSchema.optional(),
}).strict() ;

export const ExpenseDeleteManyArgsSchema: z.ZodType<Prisma.ExpenseDeleteManyArgs> = z.object({
  where: ExpenseWhereInputSchema.optional(),
}).strict() ;

export const PaymentCreateArgsSchema: z.ZodType<Prisma.PaymentCreateArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  data: z.union([ PaymentCreateInputSchema,PaymentUncheckedCreateInputSchema ]),
}).strict() ;

export const PaymentUpsertArgsSchema: z.ZodType<Prisma.PaymentUpsertArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereUniqueInputSchema,
  create: z.union([ PaymentCreateInputSchema,PaymentUncheckedCreateInputSchema ]),
  update: z.union([ PaymentUpdateInputSchema,PaymentUncheckedUpdateInputSchema ]),
}).strict() ;

export const PaymentCreateManyArgsSchema: z.ZodType<Prisma.PaymentCreateManyArgs> = z.object({
  data: z.union([ PaymentCreateManyInputSchema,PaymentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PaymentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PaymentCreateManyAndReturnArgs> = z.object({
  data: z.union([ PaymentCreateManyInputSchema,PaymentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PaymentDeleteArgsSchema: z.ZodType<Prisma.PaymentDeleteArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereUniqueInputSchema,
}).strict() ;

export const PaymentUpdateArgsSchema: z.ZodType<Prisma.PaymentUpdateArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  data: z.union([ PaymentUpdateInputSchema,PaymentUncheckedUpdateInputSchema ]),
  where: PaymentWhereUniqueInputSchema,
}).strict() ;

export const PaymentUpdateManyArgsSchema: z.ZodType<Prisma.PaymentUpdateManyArgs> = z.object({
  data: z.union([ PaymentUpdateManyMutationInputSchema,PaymentUncheckedUpdateManyInputSchema ]),
  where: PaymentWhereInputSchema.optional(),
}).strict() ;

export const PaymentDeleteManyArgsSchema: z.ZodType<Prisma.PaymentDeleteManyArgs> = z.object({
  where: PaymentWhereInputSchema.optional(),
}).strict() ;

export const CashoutCreateArgsSchema: z.ZodType<Prisma.CashoutCreateArgs> = z.object({
  select: CashoutSelectSchema.optional(),
  include: CashoutIncludeSchema.optional(),
  data: z.union([ CashoutCreateInputSchema,CashoutUncheckedCreateInputSchema ]),
}).strict() ;

export const CashoutUpsertArgsSchema: z.ZodType<Prisma.CashoutUpsertArgs> = z.object({
  select: CashoutSelectSchema.optional(),
  include: CashoutIncludeSchema.optional(),
  where: CashoutWhereUniqueInputSchema,
  create: z.union([ CashoutCreateInputSchema,CashoutUncheckedCreateInputSchema ]),
  update: z.union([ CashoutUpdateInputSchema,CashoutUncheckedUpdateInputSchema ]),
}).strict() ;

export const CashoutCreateManyArgsSchema: z.ZodType<Prisma.CashoutCreateManyArgs> = z.object({
  data: z.union([ CashoutCreateManyInputSchema,CashoutCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CashoutCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CashoutCreateManyAndReturnArgs> = z.object({
  data: z.union([ CashoutCreateManyInputSchema,CashoutCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CashoutDeleteArgsSchema: z.ZodType<Prisma.CashoutDeleteArgs> = z.object({
  select: CashoutSelectSchema.optional(),
  include: CashoutIncludeSchema.optional(),
  where: CashoutWhereUniqueInputSchema,
}).strict() ;

export const CashoutUpdateArgsSchema: z.ZodType<Prisma.CashoutUpdateArgs> = z.object({
  select: CashoutSelectSchema.optional(),
  include: CashoutIncludeSchema.optional(),
  data: z.union([ CashoutUpdateInputSchema,CashoutUncheckedUpdateInputSchema ]),
  where: CashoutWhereUniqueInputSchema,
}).strict() ;

export const CashoutUpdateManyArgsSchema: z.ZodType<Prisma.CashoutUpdateManyArgs> = z.object({
  data: z.union([ CashoutUpdateManyMutationInputSchema,CashoutUncheckedUpdateManyInputSchema ]),
  where: CashoutWhereInputSchema.optional(),
}).strict() ;

export const CashoutDeleteManyArgsSchema: z.ZodType<Prisma.CashoutDeleteManyArgs> = z.object({
  where: CashoutWhereInputSchema.optional(),
}).strict() ;

export const ExpenseTypeCreateArgsSchema: z.ZodType<Prisma.ExpenseTypeCreateArgs> = z.object({
  select: ExpenseTypeSelectSchema.optional(),
  include: ExpenseTypeIncludeSchema.optional(),
  data: z.union([ ExpenseTypeCreateInputSchema,ExpenseTypeUncheckedCreateInputSchema ]),
}).strict() ;

export const ExpenseTypeUpsertArgsSchema: z.ZodType<Prisma.ExpenseTypeUpsertArgs> = z.object({
  select: ExpenseTypeSelectSchema.optional(),
  include: ExpenseTypeIncludeSchema.optional(),
  where: ExpenseTypeWhereUniqueInputSchema,
  create: z.union([ ExpenseTypeCreateInputSchema,ExpenseTypeUncheckedCreateInputSchema ]),
  update: z.union([ ExpenseTypeUpdateInputSchema,ExpenseTypeUncheckedUpdateInputSchema ]),
}).strict() ;

export const ExpenseTypeCreateManyArgsSchema: z.ZodType<Prisma.ExpenseTypeCreateManyArgs> = z.object({
  data: z.union([ ExpenseTypeCreateManyInputSchema,ExpenseTypeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ExpenseTypeCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ExpenseTypeCreateManyAndReturnArgs> = z.object({
  data: z.union([ ExpenseTypeCreateManyInputSchema,ExpenseTypeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ExpenseTypeDeleteArgsSchema: z.ZodType<Prisma.ExpenseTypeDeleteArgs> = z.object({
  select: ExpenseTypeSelectSchema.optional(),
  include: ExpenseTypeIncludeSchema.optional(),
  where: ExpenseTypeWhereUniqueInputSchema,
}).strict() ;

export const ExpenseTypeUpdateArgsSchema: z.ZodType<Prisma.ExpenseTypeUpdateArgs> = z.object({
  select: ExpenseTypeSelectSchema.optional(),
  include: ExpenseTypeIncludeSchema.optional(),
  data: z.union([ ExpenseTypeUpdateInputSchema,ExpenseTypeUncheckedUpdateInputSchema ]),
  where: ExpenseTypeWhereUniqueInputSchema,
}).strict() ;

export const ExpenseTypeUpdateManyArgsSchema: z.ZodType<Prisma.ExpenseTypeUpdateManyArgs> = z.object({
  data: z.union([ ExpenseTypeUpdateManyMutationInputSchema,ExpenseTypeUncheckedUpdateManyInputSchema ]),
  where: ExpenseTypeWhereInputSchema.optional(),
}).strict() ;

export const ExpenseTypeDeleteManyArgsSchema: z.ZodType<Prisma.ExpenseTypeDeleteManyArgs> = z.object({
  where: ExpenseTypeWhereInputSchema.optional(),
}).strict() ;

export const AccountCreateArgsSchema: z.ZodType<Prisma.AccountCreateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
}).strict() ;

export const AccountUpsertArgsSchema: z.ZodType<Prisma.AccountUpsertArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
  create: z.union([ AccountCreateInputSchema,AccountUncheckedCreateInputSchema ]),
  update: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
}).strict() ;

export const AccountCreateManyArgsSchema: z.ZodType<Prisma.AccountCreateManyArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema,AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccountCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountCreateManyAndReturnArgs> = z.object({
  data: z.union([ AccountCreateManyInputSchema,AccountCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AccountDeleteArgsSchema: z.ZodType<Prisma.AccountDeleteArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountUpdateArgsSchema: z.ZodType<Prisma.AccountUpdateArgs> = z.object({
  select: AccountSelectSchema.optional(),
  include: AccountIncludeSchema.optional(),
  data: z.union([ AccountUpdateInputSchema,AccountUncheckedUpdateInputSchema ]),
  where: AccountWhereUniqueInputSchema,
}).strict() ;

export const AccountUpdateManyArgsSchema: z.ZodType<Prisma.AccountUpdateManyArgs> = z.object({
  data: z.union([ AccountUpdateManyMutationInputSchema,AccountUncheckedUpdateManyInputSchema ]),
  where: AccountWhereInputSchema.optional(),
}).strict() ;

export const AccountDeleteManyArgsSchema: z.ZodType<Prisma.AccountDeleteManyArgs> = z.object({
  where: AccountWhereInputSchema.optional(),
}).strict() ;