export type EventEntity = {
  eventId: number;
  employeeId: number;
  employeeName: string;
  employeeNumber: string;
  employeeIncident:
    | 'INJURY'
    | 'CRITICAL_HEALTH_ISSUE'
    | 'MINOR_HEALTH_ISSUE'
    | 'ON_LEAVE'
    | 'NORMAL';
  areaId: number;
  areaName: string;
  areaLocation: string;
  areaIncident:
    | 'GAS_LEAK'
    | 'FIRE'
    | 'ELECTRICAL_HAZARD'
    | 'FLOOD'
    | 'EVACUATION'
    | 'EQUIPMENT_FAILURE'
    | 'STRUCTURAL_DAMAGE'
    | 'AIR_QUALITY_ISSUE'
    | 'MINOR_EQUIPMENT_ISSUE'
    | 'MINOR_WORKSPACE_INTRUSION'
    | 'MINOR_ENERGY_CONSUMPTION_ISSUE'
    | 'NOISE_ISSUE'
    | 'MINOR_ENVIRONMENTAL_ISSUE'
    | 'NORMAL';
  incidentName: string;
  incidentPriority: 'CRITICAL' | 'ALERT' | 'WARNING';
  incidentMessage: string;
  eventResolved: boolean;
  createdAt: string;
  updatedAt: string;
};

// pick Entity
export type IncidentAreaEventEntity = Pick<
  EventEntity,
  'eventId' | 'areaId' | 'areaName' | 'areaIncident' | 'eventResolved'
>;

// pick Entity
export type IncidentWorkerEmployeeEventEntity = Pick<
  EventEntity,
  | 'eventId'
  | 'employeeId'
  | 'employeeNumber'
  | 'employeeIncident'
  | 'eventResolved'
>;

// 확장 Entity
export type EventExtendEntity = EventEntity & {
  eventResolvedMessage: string;
};

export type FactoryEventScoreEntity = {
  factoryId: number;
  factoryName: string;
  factoryAddress: string;
  safetyScore: number;
  safetyGrade: string;
  criticalIncidentCount: number;
  alertIncidentCount: number;
  warningIncidentCount: number;
  areaSafetyScores: AreaEventScoreEntity[];
};

export type AreaEventScoreEntity = {
  areaId: number;
  areaName: string;
  areaLocation: string;
  safetyScore: number;
  safetyGrade: string;
  criticalIncidentCount: number;
  alertIncidentCount: number;
  warningIncidentCount: number;
};

export type EventSafetyGradesEntity = {
  grade: string;
  message: string;
  min: number;
  max: number;
};

// 확장 Entity
export type EventSafetyGradesExtendEntity = EventSafetyGradesEntity & {
  color: string;
};

export const EventEntityValidationRules = {
  areaId: {
    required: { value: true, message: '구역을 선택하세요.' },
    // ...
  },
  areaIncident: {
    required: { value: true, message: '사고유형을 선택하세요.' },
    // ...
  },
  employeeNumber: {
    required: { value: true, message: '근로자를 선택하세요.' },
    // ...
  },
  employeeIncident: {
    required: { value: true, message: '사고유형을 선택하세요.' },
    // ...
  },
  eventResolved: {
    required: { value: true, message: '해결여부를 선택하세요.' },
    // ...
  },
};
