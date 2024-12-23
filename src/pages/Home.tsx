import React, { useEffect, useState } from 'react';
import Card from '../components/Card/Card';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import MainFactorySafetySummaryContentsWrapper from './ContentsWrapper/MainFactorySafetySummaryContentsWrapper';
import MainAreaSafetySummaryContentsWrapper from './ContentsWrapper/MainAreaSafetySummaryContentsWrapper';
import queries from '../hooks/queries/queries';
import { FactoryEntity } from '../types/FactoryEntity';
import { AreaEntity } from '../types/AreaEntity';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../store/loggedInUserAtom';
import MainMonitoringAreaContentsWrapper from './ContentsWrapper/MainMonitoringAreaContentsWrapper';
import MainSummaryCard from '../components/Card/MainSummaryCard';

export interface Workers {
  idTag: string;
  isAccident?: boolean;
  accidentInfo?: string;
  speed?: number;
}

const Home: React.FC = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const { useAuthFactoryInfo, useAreaList } = queries();
  const { data: authFactoryInfoData } = useAuthFactoryInfo();
  const { data: factoryAreaListData } = useAreaList(
    loggedInUser?.factoryId || 0
  );

  // 내 소속 공장 정보
  const [authFactoryInfo, setAuthFactoryInfo] = useState<FactoryEntity>();
  useEffect(() => {
    if (authFactoryInfoData) {
      setAuthFactoryInfo(authFactoryInfoData);
    }
  }, [authFactoryInfoData]);

  // 공장에 속한 area 정보
  // area[0] 기본 selected
  const [factoryAreaList, setFactoryAreaList] = useState<AreaEntity[]>([]);
  const [selectedArea, setSelectedArea] = useState<AreaEntity>();
  useEffect(() => {
    if (factoryAreaListData) {
      setFactoryAreaList(factoryAreaListData);
      setSelectedArea(selectedArea || factoryAreaListData[0]);
    }
  }, [factoryAreaListData]);

  return (
    <>
      <div className="relative">
        <Breadcrumb pageName="메인" />

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <MainSummaryCard authFactoryInfo={authFactoryInfo} />
          <Card
            id="mainFactorySafetySummary"
            title="우리 공장 안전등급"
            size="sm"
          >
            <MainFactorySafetySummaryContentsWrapper />
          </Card>
          {selectedArea && (
            <>
              <Card
                id="mainAreaSafetySummary"
                title={`선택 구역 안전등급 (${selectedArea.areaName})`}
                size="sm"
              >
                <MainAreaSafetySummaryContentsWrapper
                  selectedArea={selectedArea}
                />
              </Card>
              <Card
                id="mainMap"
                title={`구역 모니터링 (${selectedArea.areaName})`}
                size="lg"
              >
                <MainMonitoringAreaContentsWrapper
                  factoryAreaList={factoryAreaList}
                  selectedArea={selectedArea}
                  setSelectedArea={setSelectedArea}
                />
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
