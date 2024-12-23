export type AlarmEntity = {
  alarmId: number;
  employeeId: number;
  employeeName: string;
  eventId: number;
  employeeIncident:
    | 'INJURY'
    | 'CRITICAL_HEALTH_ISSUE'
    | 'MINOR_HEALTH_ISSUE'
    | 'ON_LEAVE'
    | 'NORMAL';
  eventEmployeeId: number;
  eventEmployeeName: string;
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
  eventAreaId: number;
  eventAreaName: string;
  eventAreaLocation: string;
  eventResolved: boolean;
  alarmMessage: string;
  alarmRead: boolean;
  createdAt: string;
  updatedAt: string;
};
