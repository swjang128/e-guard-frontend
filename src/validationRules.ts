export const validationRules = {
  employeeEmail: {
    required: { value: true, message: '이메일을 입력하세요.' },
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '이메일을 올바른 패턴으로 입력하세요.',
    },
  },
  password: {
    required: { value: true, message: '비밀번호를 입력하세요.' },
    pattern: {
      value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/,
      message:
        '비밀번호는 8~16자로 영문 대소문자 및 숫자와 특수문자를 1개 이상 포함하여 주세요.',
    },
    onChange: (trigger: (name: string) => void) => {
      return () => {
        trigger('confirmPassword');
      };
    },
  },
  confirmPassword: {
    required: { value: true, message: '비밀번호를 한번 더 입력하세요.' },
    validate: (value: string, getValues: (password: any) => any) =>
      value === getValues('password') || '비밀번호가 일치하지 않습니다.',
  },
  currentPassword: {
    // 비밀번호 수정에 쓰이는 password로서 초기화 한 후 수행해야 할 수도 있으므로 pattern체크는 제외한다.
    required: { value: true, message: '현재 비밀번호를 입력하세요.' },
    onChange: (trigger: (name: string) => void) => {
      return () => {
        trigger('confirmPassword');
      };
    },
  },
  newPassword: {
    required: { value: true, message: '새 비밀번호를 입력하세요.' },
    pattern: {
      value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/,
      message:
        '비밀번호는 영문 대소문자 및 숫자와 특수문자를 1개 이상 포함하여 8~16자리로 입력하세요.',
    },
    onChange: (trigger: (name: string) => void) => {
      return () => {
        trigger('confirmNewPassword');
      };
    },
  },
  confirmNewPassword: {
    required: { value: true, message: '비밀번호를 한번 더 입력하세요.' },
    validate: (value: string, getValues: (password: any) => any) =>
      value === getValues('newPassword') || '비밀번호가 일치하지 않습니다.',
  },
  phone: {
    required: '휴대전화 번호를 입력하세요.',
    pattern: {
      value: /^010[0-9]{7,8}$/,
      message: `010으로 시작되는 10~11자리의 숫자를 입력하세요. ('-' 미포함)`,
    },
    // Korea: {
    //   required: 'Phone number is required',
    //   pattern: {
    //     value: /^010[0-9]{7,8}$/,
    //     message: 'Please enter 10 to 11 digits starting with 010 (no dashes)',
    //   },
    // },
    // USA: {
    //   required: 'Phone number is required',
    //   pattern: {
    //     value: /^[2-9][0-9]{2}[0-9]{7}$/,
    //     message: 'Please enter 10 digits starting from 2 to 9 (no dashes)',
    //   },
    // },
    // Thailand: {
    //   required: 'Phone number is required',
    //   pattern: {
    //     value: /^0[89][0-9]{8}$/,
    //     message: 'Please enter 10 digits starting with 08X or 09X (no dashes)',
    //   },
    // },
    // Vietnam: {
    //   required: 'Phone number is required',
    //   pattern: {
    //     value: /^0[89][0-9]{8}$/,
    //     message: 'Please enter 10 digits starting with 08X or 09X (no dashes)',
    //   },
    // },
  },
  authCode: {
    required: { value: true, message: '인증번호를 입력하세요.' },
    pattern: {
      value: /^\d{6}$/,
      message: '인증번호를 6자리 숫자로 입력하세요.',
    },
  },
  name: {
    required: { value: true, message: 'Enter your name' },
  },
  companyId: {
    required: { value: true, message: 'Selecting a Company is required' },
  },
  role: {
    required: { value: true, message: 'Selecting a Role is required' },
  },
  companyType: {
    required: {
      value: true,
      message: `Selecting a Company's Type is required`,
    },
  },
  countryId: {
    required: {
      value: true,
      message: `Selecting a Company's Country is required`,
    },
  },
  address: {
    required: { value: true, message: `Company's Address is required` },
  },
  tel: {
    required: { value: true, message: `Company's Tel number is required` },
    pattern: {
      value: /^\d{8,11}$/,
      message: 'Enter 8~11 digits including numbers',
    },
  },
  fax: {
    required: { value: true, message: `Company's Fax number is required` },
    pattern: {
      value: /^\d{8,11}$/,
      message: 'Enter 8~11 digits including numbers',
    },
  },
};
