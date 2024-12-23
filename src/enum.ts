// 자주 사용하는 공통 enum, const 모음
export enum E_API_METHOD_TYPES {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum E_PRIORITY_TYPES {
  HIGH = 'HIGH',
  MIDDLE = 'MIDDLE',
  LOW = 'LOW',
}

export enum E_DATE_TYPES {
  YEAR = 'year',
  MONTH = 'month',
  DATE = 'date',
  DAY = 'day',
  HOUR = 'hour',
  MINUTE = 'minute',
  SECOND = 'second',
}

export enum E_ROLE_TYPES {
  WORKER = 'WORKER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

export enum E_SUBSCRIPTION_STATUS_TYPES {
  SUBSCRIBED = 'S',
  CANCELED = 'C',
  UNSUBSCRIBED = 'U',
}

// custom 용
// 각 항목의 STATUS를 COLOR로 나타낸다.
enum E_COLOR_SAFETY_GRADE {
  GOOD = 'eguard-green', // 양호
  CAUTION = 'eguard-orange', // 주의
  SERIOUS = 'eguard-red', // 심각
}
enum E_COLOR_EMPLOYEE {
  TOTAL = 'black', // 근로자(총합)
  NORMAL = 'eguard-green', // 근로자(정상)
  VACANCY = 'eguard-orange', // 근로자(결원 = 건강 이상 + 부상)
  ON_LEAVE = 'slate-400', // 근로자(휴가)
}
enum E_COLOR_INCIDENT_EVENT {
  CRITICAL = 'eguard-red', // 사고(CRITICAL)
  ALERT = 'eguard-brown', // 사고(ALERT)
  WARNING = 'eguard-yellow', // 사고(WARNING)
}

export const E_COLOR_TYPES = {
  SAFETY_GRADE: E_COLOR_SAFETY_GRADE,
  EMPLOYEE: E_COLOR_EMPLOYEE,
  INCIDENT_EVENT: E_COLOR_INCIDENT_EVENT,
} as const;
