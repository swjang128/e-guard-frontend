export type AreaEntity = {
  areaId: number;
  areaName: string;
  areaLocation: string;
  areaUsableSize: number;
  areaLatitude: number;
  areaLongitude: number;
  areaMemo: string;
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
  factoryId: number;
  factoryName: string;
  eventName: string;
  areaPlan2DFilePath: string;
  areaPlan3DFilePath: string;
  createdAt: string;
  updatedAt: string;
};

// 확장 Entity
export type AreaExtendEntity = AreaEntity & {
  companyId: number;
};

export const AreaEntityValidationRules = {
  areaName: {
    required: { value: true, message: '구역명을 입력하세요.' },
    // ...
  },
  areaLocation: {
    required: { value: true, message: '위치를 입력하세요.' },
    // ...
  },
  areaUsableSize: {
    required: { value: true, message: '사용 면적을 입력하세요.' },
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
  areaLatitude: {
    required: {
      value: true,
      message: '지도상의 위도 좌표 (LAT)를 입력하세요.',
    },
    max: {
      value: 90,
      message: '-90 ~ 90의 범위로 입력하세요. (소숫점 최대 7자리까지 허용)',
    },
    min: {
      value: -90,
      message: '-90 ~ 90의 범위로 입력하세요. (소숫점 최대 7자리까지 허용)',
    },
    // ...
  },
  areaLongitude: {
    required: {
      value: true,
      message: '지도상의 경도 좌표 (LNG)를 입력하세요.',
    },
    max: {
      value: 180,
      message: '-180 ~ 180의 범위로 입력하세요. (소숫점 최대 7자리까지 허용)',
    },
    min: {
      value: -180,
      message: '-180 ~ 180의 범위로 입력하세요. (소숫점 최대 7자리까지 허용)',
    },
    // ...
  },
  areaPlan2DFilePath: {
    required: { value: true, message: '2D 도면도 파일을 첨부하세요.' },
    // ...
  },
  areaPlan3DFilePath: {
    required: { value: true, message: '3D 도면도 파일을 첨부하세요.' },
    // ...
  },
};
