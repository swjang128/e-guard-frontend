// List API 기준 원본 Entity
// export type SettingEntity
type SettingEntity = {
  settingId: number;
  companyId: number;
  companyName: string;
  maxFactoriesPerCompany: number; // 한 업체당 최대 생성 가능 공장수
  maxAreasPerFactory: number; // 한 공장당 최대 생성 가능 구역수
  maxEmployeesPerFactory: number; // 한 공장당 최대 생성 가능 근로자수
  maxWorksPerArea: number; // 한 구역당 최대 생성 가능 작업수
  maxEmployeesPerWork: number; // 한 작업당 최대 할당 가능 근로자수
  twoFactorAuthenticationEnabled: boolean; // 관리자 로그인시 2Factor 사용여부
  twoFactorAuthenticationMethod: 'EMAIL' | 'SMS'; // 2Factor 사용 방식
  createdAt: string;
  updatedAt: string;
};

// DataTable - list 표시용 Entity
// export type SettingListEntity
type SettingListEntity = SettingEntity & {
  twoFactorAuthenticationEnabledText: string;
};

// Modal - add - hook form 표시 및 submit용 Entity - zod 미 사용 버전
// export type SettingAddEntity
type SettingAddEntity = Pick<
  SettingEntity,
  | 'companyId'
  | 'maxFactoriesPerCompany'
  | 'maxAreasPerFactory'
  | 'maxEmployeesPerFactory'
  | 'maxWorksPerArea'
  | 'maxEmployeesPerWork'
  | 'twoFactorAuthenticationEnabled'
  | 'twoFactorAuthenticationMethod'
>;

// Modal - edit - hook form 표시 및 submit용 Entity - zod 미 사용 버전
// export type SettingEditEntity
type SettingEditEntity = SettingAddEntity & Pick<SettingEntity, 'settingId'>;

// Entity Validation
// export const SettingValidationRules
const SettingValidationRules = {
  maxFactoriesPerCompany: {
    required: { value: true, message: '최대 공장수를 입력하세요.' },
    max: {
      value: 100,
      message: '1 ~ 100의 범위로 입력하세요.',
    },
    min: {
      value: 1,
      message: '1 ~ 100의 범위로 입력하세요.',
    },
    // ...
  },
  maxAreasPerFactory: {
    required: { value: true, message: '최대 구역수를 입력하세요.' },
    max: {
      value: 100,
      message: '1 ~ 100의 범위로 입력하세요.',
    },
    min: {
      value: 1,
      message: '1 ~ 100의 범위로 입력하세요.',
    },
    // ...
  },
  // ...
};
