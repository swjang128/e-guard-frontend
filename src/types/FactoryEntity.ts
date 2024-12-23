export type FactoryEntity = {
  factoryId: number;
  factoryName: string;
  factoryAddress: string;
  factoryAddressDetail: string;
  factoryTotalSize: number;
  factoryStructureSize: number;
  factoryIndustryType:
    | 'MANUFACTURING'
    | 'CHEMICAL'
    | 'ELECTRONICS'
    | 'FOOD_AND_BEVERAGE'
    | 'AUTOMOTIVE'
    | 'CONSTRUCTION'
    | 'ENERGY'
    | 'TEXTILE'
    | 'LOGISTICS'
    | 'OTHER';
  companyId: number;
  companyName: string;
  companyPhoneNumber: string;
  companyAddress: string;
  createdAt: string;
  updatedAt: string;
};

// 확장 Entity
export type FactoryExtendEntity = FactoryEntity & {
  factoryFullAddress: string;
};

export type FactorySummaryEntity = {
  factoryName: string;
  totalEmployees: number;
  injuryEmployees: number;
  criticalHealthIssueEmployees: number;
  minorHealthIssueEmployees: number;
  onLeaveEmployees: number;
  normalEmployees: number;
  unassignedEmployees: number;
};

export const FactoryEntityValidationRules = {
  factoryName: {
    required: { value: true, message: '공장명을 입력하세요.' },
    onChange: () => {
      return () => {
        console.log('공장이 변경되었습니다.'); // 필요하면 로그 또는 다른 동작 추가
      };
    },
  },
  factoryIndustryType: {
    required: { value: true, message: '업종을 선택하세요.' },
    // ...
  },
  factoryTotalSize: {
    required: { value: true, message: '전체 면적을 입력하세요.' },
    max: {
      value: 999999,
      message: '1 ~ 999,999의 범위로 입력하세요.',
    },
    min: {
      value: 1,
      message: '1 ~ 999,999의 범위로 입력하세요.',
    },
    // ...
  },
  factoryStructureSize: {
    required: { value: true, message: '건물 면적을 입력하세요.' },
    max: {
      value: 999999,
      message: '1 ~ 999,999의 범위로 입력하세요.',
    },
    min: {
      value: 1,
      message: '1 ~ 999,999의 범위로 입력하세요.',
    },
    // ...
  },
  factoryAddress: {
    required: { value: true, message: '버튼을 눌러 주소를 검색하세요.' },
    // ...
  },
  // factoryAddressDetail은 필수값이 아님.
  // factoryAddressDetail: {
  //   required: { value: true, message: '상세 주소를 입력하세요.' },
  //   // ...
  // },
};
