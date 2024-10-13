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

export const CommunityScalarFieldEnumSchema = z.enum(['id','title','address','initSerialNumber']);

export const UserScalarFieldEnumSchema = z.enum(['id','userName','email','password','identification','firstName','lastName','phone','isVerified','isActive','community_id','role_id','residence_id','createdAt']);

export const ResidenceScalarFieldEnumSchema = z.enum(['id','title','owner_id','community_id','contacts','residenceType_id','createdAt']);

export const ParkingSlotScalarFieldEnumSchema = z.enum(['id','number','user_id','community_id','createdAt']);

export const ResidenceTypeScalarFieldEnumSchema = z.enum(['id','title','description','community_id','createdAt']);

export const VehicleScalarFieldEnumSchema = z.enum(['id','plate','model','color','user_id','createdAt']);

export const ProviderScalarFieldEnumSchema = z.enum(['id','title','contactName','description','phone','email','address','website','active','community_id','createdAt']);

export const RoleScalarFieldEnumSchema = z.enum(['id','title','description','modules','createdAt']);

export const ExpenseScalarFieldEnumSchema = z.enum(['id','title','residence_id','createdAt','emitingDate','dayPayment','value','owedValue','payment_id','isRecurrent']);

export const PaymentScalarFieldEnumSchema = z.enum(['id','title','description','registerDate','amount','whoPay','voucherImage','isEmailSend','account_id','created_by','status','serial','paymentMethod','createdAt']);

export const CashoutScalarFieldEnumSchema = z.enum(['id','title','description','provider_id','amount','billImage','account_id','toAccount_id','status','registerDate','createdAt']);

export const AccountScalarFieldEnumSchema = z.enum(['id','title','description','active','community_id','balance','image','Responsable','accountNumber','bank','createdAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const StatusPaymentSchema = z.enum(['Pending','Paid']);

export type StatusPaymentType = `${z.infer<typeof StatusPaymentSchema>}`

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
  initSerialNumber: z.number().int(),
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
  createdAt: z.coerce.date(),
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
  createdAt: z.coerce.date(),
})

export type Residence = z.infer<typeof ResidenceSchema>

/////////////////////////////////////////
// PARKING SLOT SCHEMA
/////////////////////////////////////////

export const ParkingSlotSchema = z.object({
  id: z.string(),
  number: z.number().int(),
  user_id: z.string().nullable(),
  community_id: z.string(),
  createdAt: z.coerce.date(),
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
  createdAt: z.coerce.date(),
})

export type ResidenceType = z.infer<typeof ResidenceTypeSchema>

/////////////////////////////////////////
// VEHICLE SCHEMA
/////////////////////////////////////////

export const VehicleSchema = z.object({
  id: z.number().int(),
  plate: z.string(),
  model: z.string(),
  color: z.string(),
  user_id: z.string(),
  createdAt: z.coerce.date(),
})

export type Vehicle = z.infer<typeof VehicleSchema>

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
  createdAt: z.coerce.date(),
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
  createdAt: z.coerce.date(),
})

export type Role = z.infer<typeof RoleSchema>

/////////////////////////////////////////
// EXPENSE SCHEMA
/////////////////////////////////////////

export const ExpenseSchema = z.object({
  id: z.string(),
  title: z.string(),
  residence_id: z.string(),
  createdAt: z.coerce.date(),
  emitingDate: z.coerce.date().nullable(),
  dayPayment: z.coerce.date().nullable(),
  value: z.instanceof(Prisma.Decimal, { message: "Field 'value' must be a Decimal. Location: ['Models', 'Expense']"}),
  owedValue: z.instanceof(Prisma.Decimal, { message: "Field 'owedValue' must be a Decimal. Location: ['Models', 'Expense']"}),
  payment_id: z.string().nullable(),
  isRecurrent: z.boolean(),
})

export type Expense = z.infer<typeof ExpenseSchema>

/////////////////////////////////////////
// PAYMENT SCHEMA
/////////////////////////////////////////

export const PaymentSchema = z.object({
  status: StatusPaymentSchema,
  id: z.string(),
  title: z.string(),
  description: z.string(),
  registerDate: z.coerce.date(),
  amount: z.instanceof(Prisma.Decimal, { message: "Field 'amount' must be a Decimal. Location: ['Models', 'Payment']"}),
  whoPay: z.string().nullable(),
  voucherImage: z.string().nullable(),
  isEmailSend: z.boolean(),
  account_id: z.string(),
  created_by: z.string(),
  serial: z.number().int().nullable(),
  paymentMethod: z.string(),
  createdAt: z.coerce.date(),
})

export type Payment = z.infer<typeof PaymentSchema>

/////////////////////////////////////////
// CASHOUT SCHEMA
/////////////////////////////////////////

export const CashoutSchema = z.object({
  status: StatusPaymentSchema,
  id: z.string(),
  title: z.string(),
  description: z.string(),
  provider_id: z.string().nullable(),
  amount: z.instanceof(Prisma.Decimal, { message: "Field 'amount' must be a Decimal. Location: ['Models', 'Cashout']"}),
  billImage: z.string(),
  account_id: z.string(),
  toAccount_id: z.string().nullable(),
  registerDate: z.coerce.date(),
  createdAt: z.coerce.date(),
})

export type Cashout = z.infer<typeof CashoutSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  active: z.boolean(),
  community_id: z.string(),
  balance: z.instanceof(Prisma.Decimal, { message: "Field 'balance' must be a Decimal. Location: ['Models', 'Account']"}),
  image: z.string().nullable(),
  Responsable: z.string().nullable(),
  accountNumber: z.string().nullable(),
  bank: z.string().nullable(),
  createdAt: z.coerce.date(),
})

export type Account = z.infer<typeof AccountSchema>
