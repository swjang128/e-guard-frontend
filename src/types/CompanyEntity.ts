export type CompanyEntity = {
  companyId: number;
  businessNumber: '' | number;
  companyName: string;
  companyEmail: string;
  companyPhoneNumber: '' | number;
  companyAddress: string;
  companyAddressDetail: string;
  createdAt: string;
  updatedAt: string;
};

// 확장 Entity
export type CompanyExtendEntity = CompanyEntity & {
  companyFullAddress: string;
};

export const CompanyEntityValidationRules = {
  companyName: {
    required: { value: true, message: '업체명을 입력하세요.' },
    // ...
  },
  businessNumber: {
    required: { value: true, message: '사업자 등록번호를 입력하세요.' },
    pattern: {
      value: /^[0-9]{10}$/,
      message: `10자리의 숫자를 입력하세요. ('-' 미포함)`,
    },
    // ...
  },
  companyEmail: {
    required: { value: true, message: '대표 이메일을 입력하세요.' },
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '이메일을 올바른 패턴으로 입력하세요.',
    },
    // ...
  },
  companyPhoneNumber: {
    required: { value: true, message: '대표 전화번호를 입력하세요.' },
    pattern: {
      value: /^[0-9]{8,11}$/,
      message: `8~11자리의 숫자를 입력하세요. ('-' 미포함)`,
    },
    // ...
  },
  companyAddress: {
    required: { value: true, message: '버튼을 눌러 주소를 검색하세요.' },
    // ...
  },
  // companyAddressDetail은 필수값이 아님.
  // companyAddressDetail: {
  //   required: { value: true, message: '상세 주소를 입력하세요.' },
  //   // ...
  // },
};
