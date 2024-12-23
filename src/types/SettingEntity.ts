import { z } from 'zod';

// List API 기준 원본 Schema
// Zod 사용
export const SettingSchema = z.object({
  settingId: z.number().optional().default(0),
  companyId: z.number().default(0),
  companyName: z.string({ required_error: '업체명을 입력하세요.' }).default(''),
  maxFactoriesPerCompany: z
    .preprocess(
      (value) => (value !== '' ? Number(value) : undefined),
      z
        .number()
        .min(1, { message: '1 ~ 10사이로 입력하세요.' })
        .max(10, { message: '1 ~ 10사이로 입력하세요.' })
    )
    .default(1),
  maxAreasPerFactory: z
    .preprocess(
      (value) => (value !== '' ? Number(value) : undefined),
      z
        .number()
        .min(1, { message: '1 ~ 20사이로 입력하세요.' })
        .max(20, { message: '1 ~ 20사이로 입력하세요.' })
    )
    .default(1),
  maxEmployeesPerFactory: z
    .preprocess(
      (value) => (value !== '' ? Number(value) : undefined),
      z
        .number()
        .min(1, { message: '1 ~ 1000사이로 입력하세요.' })
        .max(1000, { message: '1 ~ 1000사이로 입력하세요.' })
    )
    .default(1),
  maxWorksPerArea: z
    .preprocess(
      (value) => (value !== '' ? Number(value) : undefined),
      z
        .number()
        .min(1, { message: '1 ~ 10사이로 입력하세요.' })
        .max(10, { message: '1 ~ 10사이로 입력하세요.' })
    )
    .default(1),
  maxEmployeesPerWork: z
    .preprocess(
      (value) => (value !== '' ? Number(value) : undefined),
      z
        .number()
        .min(1, { message: '1 ~ 60사이로 입력하세요.' })
        .max(60, { message: '1 ~ 60사이로 입력하세요.' })
    )
    .default(1),
  twoFactorAuthenticationEnabled: z.boolean().default(false),
  twoFactorAuthenticationMethod: z.enum(['EMAIL', 'SMS']).default('EMAIL'),
  createdAt: z.string().default(''),
  updatedAt: z.string().default(''),
});
export type SettingEntity = z.infer<typeof SettingSchema>;

// DataTable - list 표시용 Entity - zod 사용 버전
// SettingSchema를 추론해 만든 SettingEntity타입을 확장한다.
export type SettingListEntity = SettingEntity & {
  twoFactorAuthenticationEnabledText: string;
};

// Modal - add - hook form 표시 및 submit용 Entity - zod 사용 버전
// SettingSchema에서 pick를 하고 type은 infer로 추론한다.
// omit을 써도 됨.
export const SettingAddSchema = SettingSchema.omit({
  settingId: true,
  createdAt: true,
  updatedAt: true,
});
export type SettingAddEntity = z.infer<typeof SettingAddSchema>;

// Modal - edit - hook form 표시 및 submit용 Entity - zod 사용 버전
// SettingAddSchema를 추론해 만든 SettingAddEntity타입을 확장한다.
export const SettingEditSchema = SettingAddSchema.extend({
  settingId: SettingSchema.shape.settingId,
});
export type SettingEditEntity = z.infer<typeof SettingEditSchema>;
