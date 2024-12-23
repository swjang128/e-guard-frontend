import { AreaEntity } from '../../types/AreaEntity';
import { useEffect, useState } from 'react';
import { EventEntity } from '../../types/EventEntity';
import { fetchData } from '../../api';
import { WorkEmployeeEntity, WorkEntity } from '../../types/WorkEntity';
import AreaImageMap from '../../components/ImageMap/Map/AreaImageMap';
import AreaKakaoApiMap from '../../components/ApiMap/Map/AreaKakaoApiMap';
import AreaTDViewer from '../../components/TDViewer/AreaTDViewer';
import MainMonitoringAreaMenu from '../MainMonitoringArea/MainMonitoringAreaMenu';
import MainMonitoringAreaIncidentSummary from '../MainMonitoringArea/MainMonitoringAreaIncidentSummary';
import MainMonitoringAreaWorkSummary from '../MainMonitoringArea/MainMonitroingAreaWorkSummary';
import MainMonitoringAreaMemo from '../MainMonitoringArea/MainMonitoringAreaMemo';

interface MainMonitoringAreaContentsWrapperProps {
  factoryAreaList: AreaEntity[];
  selectedArea: AreaEntity;
  setSelectedArea: (seletedArea: AreaEntity) => void;
}

interface MovingsState {
  [key: string]: {
    x: number;
    y: number;
  }[];
}

const MainMonitoringAreaContentsWrapper: React.FC<
  MainMonitoringAreaContentsWrapperProps
> = ({ factoryAreaList, selectedArea, setSelectedArea }) => {
  const [viewType, setViewType] = useState<string>('2D'); // 2D = ImageMap / 3D = 3DAreaViewer / Map = API Map
  const [movings, setMovings] = useState<MovingsState>({}); // workEmployee들의 움직임 임의 생성
  const [incidentEventList, setIncidentEventList] = useState<EventEntity[]>([]);
  const [workList, setWorkList] = useState<WorkEntity[]>([]);
  const [workEmployeeList, setWorkEmployeeList] = useState<
    WorkEmployeeEntity[]
  >([]);

  useEffect(() => {
    // 선택된 구역 사고 리스트, 미해결 건만 가져온다.
    const getIncidentEventList = async () => {
      try {
        const data = await fetchData(
          `/event?areaId=${selectedArea.areaId}&resolved=false`
        );
        setIncidentEventList(data.data.eventList);
      } catch (error) {
        console.error('Error while logging in:', error);
        // 에러 처리
      }
    };
    getIncidentEventList();

    // 선택된 구역 작업 리스트, workStatus가 PENDING, IN_PROGRESS만 포함
    const getWorkList = async () => {
      try {
        const data = await fetchData(
          `/work?areaId=${selectedArea.areaId}&workStatus=PENDING,IN_PROGRESS`
        );
        setWorkList(data.data.workList);
      } catch (error) {
        console.error('Error while logging in:', error);
        // 에러 처리
      }
    };
    getWorkList();
  }, [selectedArea]);

  useEffect(() => {
    const getEmployeeList = async (workList: WorkEntity[]) => {
      try {
        const areaEmployeeList: any[] = [];
        workList.forEach((work) =>
          work.employees.forEach((workEmployee: WorkEmployeeEntity) => {
            movings[workEmployee.employeeNumber] = [
              {
                x: workEmployee.employeeId * 10 + 100, // movings 임의 생성
                y: workEmployee.employeeId * 10 + 200, // movings 임의 생성
              },
            ];
            areaEmployeeList.push(workEmployee);
          })
        );

        setWorkEmployeeList(areaEmployeeList);
      } catch (error) {
        console.error('Error while logging in:', error);
        // 에러 처리
      }
    };

    if (workList) {
      getEmployeeList(workList);
    }
  }, [workList]);

  return (
    <div className="flex flex-col gap-4 2.5xl:flex-row">
      <div className="h-full w-full rounded border border-stroke p-4 shadow-1 2.5xl:w-3/4">
        <div className="relative">
          {/* Area Monitoring Header Menu */}
          {/* ImageMap = viewType2D / 3DAreaViewer = viewType3D / API Map = viewTypeMap */}
          <MainMonitoringAreaMenu
            viewType={viewType}
            setViewType={setViewType}
            factoryAreaList={factoryAreaList}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
          />
          {/* Area Monitoring Contents */}
          {/* ImageMap = viewType2D / 3DAreaViewer = viewType3D / API Map = viewTypeMap */}
          {viewType === '2D' && selectedArea ? (
            <AreaImageMap
              selectedArea={selectedArea}
              markers={workEmployeeList}
              movings={movings}
            />
          ) : viewType === '3D' && selectedArea ? (
            <AreaTDViewer selectedArea={selectedArea} />
          ) : viewType === 'Map' && selectedArea ? (
            <AreaKakaoApiMap
              factoryAreaList={factoryAreaList}
              selectedArea={selectedArea}
            />
          ) : null}
        </div>
      </div>
      <div className="w-full 2.5xl:w-1/4">
        <div className="2.5xl:grid-col flex gap-2 2.5xl:grid">
          <MainMonitoringAreaIncidentSummary
            incidentEventList={incidentEventList}
          />
          <MainMonitoringAreaWorkSummary workList={workList} />
          <MainMonitoringAreaMemo selectedArea={selectedArea} />
        </div>
      </div>
    </div>
  );
};
export default MainMonitoringAreaContentsWrapper;
