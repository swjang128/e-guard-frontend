export type WorkEntity = {
  areaId: number;
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
  areaName: string;
  workId: number;
  employees: WorkEmployeeEntity[];
  workName: string;
  workStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
};

export type WorkEmployeeEntity = {
  employeeId: number;
  employeeNumber: string;
  healthStatus:
    | 'INJURY'
    | 'CRITICAL_HEALTH_ISSUE'
    | 'MINOR_HEALTH_ISSUE'
    | 'ON_LEAVE'
    | 'NORMAL';
};

// 확장 Entity
export type WorkExtendEntity = WorkEntity & {
  employeesCount: number;
};

export const WorkEntityValidationRules = {
  areaId: {
    required: { value: true, message: '구역을 선택하세요.' },
    // ...
  },
  workName: {
    required: { value: true, message: '작업명을 입력하세요.' },
    // ...
  },
  workStatus: {
    required: { value: true, message: '작업상태를 선택하세요.' },
    onChange: (trigger: (name: string) => void) => {
      return () => {
        trigger('employees');
      };
    },
  },
  employees: {
    validate: (
      value: WorkEmployeeEntity[],
      getValues: (workStatus: any) => any
    ) =>
      getValues('workStatus') === 'IN_PROGRESS' && value.length === 0
        ? '작업 상태가 IN_PROGRESS 일 때는 반드시 근로자를 할당해야 합니다.'
        : true,
  },
};
