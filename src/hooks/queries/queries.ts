import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { axiosClient } from '../../AxiosClientProvider';
import { E_ROLE_TYPES } from '../../enum';
import { MenuEntity, UsableMenuEntity } from '../../types/MenuEntity';

// GET (Fetching 성 API) 관리
const queries = () => {
  // /menu
  const useMenuList = () => {
    return useQuery({
      queryKey: ['menuList'] as const,
      queryFn: async () =>
        await axiosClient.get('/menu').then((response) => {
          const res = response.data.data;
          return res.map((resData: UsableMenuEntity) => {
            return {
              menuId: resData.menuId,
              menuName: resData.menuName,
              menuUrl: resData.menuUrl,
              parentId: resData.parentId,
              menuDepth: resData.menuDepth,
              accessibleRoles: resData.accessibleRoles,
              children:
                resData.children &&
                resData.children
                  .map((resChildren: UsableMenuEntity) => {
                    return {
                      menuId: resChildren.menuId,
                      menuName: resChildren.menuName,
                      menuUrl: resChildren.menuUrl,
                      parentId: resChildren.parentId,
                      menuDepth: resChildren.menuDepth,
                      accessibleRoles: resChildren.accessibleRoles,
                    } as UsableMenuEntity;
                  })
                  .sort(
                    (
                      a: Pick<UsableMenuEntity, 'menuId'>,
                      b: Pick<UsableMenuEntity, 'menuId'>
                    ) => a.menuId - b.menuId
                  ),
            } as UsableMenuEntity;
          });
        }),
    });
  };

  // /setting
  const useSettingList = () => {
    return useQuery({
      queryKey: ['settingList'] as const,
      queryFn: async () =>
        await axiosClient
          .get('/setting')
          .then((response) => response.data.data.settingList),
    });
  };

  // /company
  const useCompanyList = () => {
    return useQuery({
      queryKey: ['companyList'] as const,
      queryFn: async () =>
        await axiosClient
          .get('/company')
          .then((response) => response.data.data.companyList),
    });
  };

  // /factory
  const useFactoryList = (companyId: number) => {
    return useQuery({
      queryKey: ['factoryList', companyId] as const,
      queryFn: async () =>
        await axiosClient
          .get('/factory', {
            params: {
              companyId,
            },
          })
          .then((response) => response.data.data.factoryList),
      enabled: companyId != 0,
    });
  };

  // /factory/info
  const useAuthFactoryInfo = () => {
    return useQuery({
      queryKey: ['authFactoryInfo'] as const,
      queryFn: async () =>
        await axiosClient
          .get('/factory/info')
          .then((response) => response.data.data),
    });
  };

  // /factory/summary
  // worker 기준
  const useFactoryWorkerEmployeeSummary = (factoryId: number) => {
    return useQuery({
      queryKey: ['factorySummary', factoryId] as const,
      queryFn: async () =>
        await axiosClient
          .get(`/factory/summary/${factoryId}`, {
            params: {
              role: 'WORKER',
            },
          })
          .then((response) => response.data.data),
      enabled: factoryId != 0,
    });
  };

  // /area
  const useAreaList = (factoryId: number) => {
    return useQuery({
      queryKey: ['areaList', factoryId] as const,
      queryFn: async () =>
        await axiosClient
          .get('/area', {
            params: {
              factoryId,
            },
          })
          .then((response) => response.data.data.areaList),
      enabled: factoryId != 0,
    });
  };

  // /event/score
  const useEventScore = (factoryId: number) => {
    return useQuery({
      queryKey: ['eventScore', factoryId] as const,
      queryFn: async () =>
        await axiosClient
          .get('/event/score', {
            params: {
              factoryId,
            },
          })
          .then((response) => response.data.data),
      enabled: factoryId != 0,
    });
  };

  // /work
  const useWorkList = (factoryId?: number, areaId?: number) => {
    return useQuery({
      queryKey: ['workList', factoryId ?? null, areaId ?? null] as const,
      queryFn: async () =>
        await axiosClient
          .get('/work', {
            params: {
              factoryId: factoryId || undefined,
              areaId: areaId || undefined,
            },
          })
          .then((response) => response.data.data.workList),
    });
  };

  // /employee
  // 전체 employee기준 (admin, manager포함)
  const useEmployeeList = (factoryId: number) => {
    return useQuery({
      queryKey: ['employeeList', factoryId] as const,
      queryFn: async () =>
        await axiosClient
          .get('/employee', {
            params: {
              factoryId,
            },
          })
          .then((response) => response.data.data.employeeList),
      enabled: factoryId != 0,
    });
  };

  // /employee
  // worker 기준
  const useWorkerEmployeeList = (factoryId: number) => {
    return useQuery({
      queryKey: ['workerEmployeeList', factoryId] as const,
      queryFn: async () =>
        await axiosClient
          .get('/employee', {
            params: {
              factoryId,
              roles: 'WORKER',
            },
          })
          .then((response) => response.data.data.employeeList),
      enabled: factoryId != 0,
    });
  };

  // /alarm
  const useAlarmList = (factoryId: number) => {
    return useQuery({
      queryKey: ['alarmList', factoryId] as const,
      queryFn: async () =>
        await axiosClient
          .get('/alarm', {
            params: {
              factoryId,
            },
          })
          .then((response) => response.data.data.alarmList),
      enabled: factoryId != 0,
      staleTime: 10000, // 10초
      refetchInterval: 10000, // 10초
    });
  };

  // /event
  // area incident용
  const useIncidentAreaEventList = (factoryId: number) => {
    return useQuery({
      queryKey: ['incidentAreaEventList', factoryId] as const,
      queryFn: async () =>
        await axiosClient
          .get('/event', {
            params: {
              factoryId,
              areaIncident: [
                'GAS_LEAK',
                'FIRE',
                'ELECTRICAL_HAZARD',
                'FLOOD',
                'EVACUATION',
                'EQUIPMENT_FAILURE',
                'STRUCTURAL_DAMAGE',
                'AIR_QUALITY_ISSUE',
                'MINOR_EQUIPMENT_ISSUE',
                'MINOR_WORKSPACE_INTRUSION',
                'MINOR_ENERGY_CONSUMPTION_ISSUE',
                'NOISE_ISSUE',
                'MINOR_ENVIRONMENTAL_ISSUE',
                'NORMAL',
              ].join(','),
            },
          })
          .then((response) => response.data.data.eventList),
      enabled: factoryId != 0,
    });
  };

  // /event
  // worker employee incident용
  const useIncidentWorkerEmployeeEventList = (factoryId: number) => {
    return useQuery({
      queryKey: ['incidentWorkerEmployeeEventList', factoryId] as const,
      queryFn: async () =>
        await axiosClient
          .get('/event', {
            params: {
              factoryId,
              employeeIncident: [
                'INJURY',
                'CRITICAL_HEALTH_ISSUE',
                'MINOR_HEALTH_ISSUE',
                'ON_LEAVE',
                'NORMAL',
              ].join(','),
            },
          })
          .then((response) => response.data.data.eventList),
      enabled: factoryId != 0,
    });
  };

  return {
    useMenuList,
    useSettingList,
    useCompanyList,
    useFactoryList,
    useAuthFactoryInfo,
    useFactoryWorkerEmployeeSummary,
    useAreaList,
    useEventScore,
    useWorkList,
    useEmployeeList,
    useWorkerEmployeeList,
    useAlarmList,
    useIncidentAreaEventList,
    useIncidentWorkerEmployeeEventList,
  };
};

export default queries;
