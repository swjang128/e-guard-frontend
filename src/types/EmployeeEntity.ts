import { E_ROLE_TYPES } from '../enum';

export type EmployeeEntity = {
  employeeId: number;
  companyId: number;
  companyName: string;
  companyAddress: string;
  companyBusinessNumber: string;
  factoryId: number;
  factoryName: string;
  employeeName: string;
  employeeEmail: string;
  employeePhoneNumber: string;
  role: E_ROLE_TYPES;
  healthStatus:
    | 'INJURY'
    | 'CRITICAL_HEALTH_ISSUE'
    | 'MINOR_HEALTH_ISSUE'
    | 'ON_LEAVE'
    | 'NORMAL';
  authenticationStatus:
    | 'ACTIVE'
    | 'INACTIVE'
    | 'SUSPENDED'
    | 'LOCKED'
    | 'PASSWORD_RESET'
    | 'WITHDRAWN'
    | 'DELETED';
  accessibleMenuIds: number[];
  employeeNumber: string;
  workId: number;
  workName: string;
  createdAt: string;
  updatedAt: string;
};

// pick Entity
// LoggedInUser = 현재 로그인한 사용자의 정보 Entity. EmployeeEntity에서 일정 부분 겹치는 게 있어 pick Entity로 처리함
export type LoggedInUser = Pick<
  EmployeeEntity,
  | 'employeeId'
  | 'companyId'
  | 'companyName'
  | 'companyAddress'
  | 'companyBusinessNumber'
  | 'factoryId'
  | 'factoryName'
  | 'employeeName'
  | 'employeeEmail'
  | 'employeePhoneNumber'
  | 'role'
  | 'healthStatus'
  | 'authenticationStatus'
  | 'accessibleMenuIds'
>;

export const EmployeeEntityValidationRules = {
  employeeName: {
    required: { value: true, message: '작업자 이름을 입력하세요.' },
    // ...
  },
  employeeNumber: {
    required: { value: true, message: '작업자 태그를 입력하세요' },
  },
};
