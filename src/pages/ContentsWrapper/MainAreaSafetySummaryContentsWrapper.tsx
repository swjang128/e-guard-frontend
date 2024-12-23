import { useEffect, useState } from 'react';
import SeriesIsLoading from '../../components/Charts/SeriesLoading';
import LevelRadialBarChart from '../../components/Charts/LevelRadialBarChart';
import MultiRadialBarChart from '../../components/Charts/MultiRadialBarChart';
import queries from '../../hooks/queries/queries';
import {
  AreaEventScoreEntity,
  EventSafetyGradesEntity,
  EventSafetyGradesExtendEntity,
} from '../../types/EventEntity';
import { AreaEntity } from '../../types/AreaEntity';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
interface MainAreaSafetySummaryContentsWrapperProps {
  selectedArea?: AreaEntity;
}

const MainAreaSafetySummaryContentsWrapper: React.FC<
  MainAreaSafetySummaryContentsWrapperProps
> = ({ selectedArea }) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const { useEventScore } = queries();
  const {
    data: eventScoreData,
    error,
    isLoading,
  } = useEventScore(loggedInUser?.factoryId || 0);

  // Safety Grade Data
  const [safetyScore, setSafetyScore] = useState<number>(0);
  const [safetyGradeInfo, setSafetyGradeInfo] =
    useState<EventSafetyGradesExtendEntity>();
  const [seriesIsLoading, setSeriesIsLoading] = useState(false);

  const safetyGradeLabels = ['안전등급']; // 고정

  // Incident Data
  const incidentLabels = ['CRITICAL', 'ALERT', 'WARNING'];
  const incidentColors = ['#FF4444', '#9A3412', '#EAB308'];
  const [incidentSeries, setIncidentSeries] = useState<number[]>([]);
  const xAxisDataLength = incidentLabels.length;

  useEffect(() => {
    if (eventScoreData) {
      // 현재 선택 area를 Prop으로 받아서 eventScoreData.factorySafetyScore 에서 조회
      const selectedAreaSafetyInfo =
        eventScoreData.factorySafetyScore.areaSafetyScores.find(
          (data: AreaEventScoreEntity) => data.areaId === selectedArea?.areaId
        );

      if (selectedAreaSafetyInfo) {
        const score = selectedAreaSafetyInfo.safetyScore;
        const safetyGrades: EventSafetyGradesEntity[] =
          eventScoreData.safetyGrades;
        const currentGrade: EventSafetyGradesEntity | undefined =
          safetyGrades.find((item) => item.min <= score && item.max >= score);

        const copiedCurrentGrade = Object.assign(
          {},
          currentGrade
        ) as EventSafetyGradesExtendEntity;
        copiedCurrentGrade.color =
          copiedCurrentGrade.grade === '양호'
            ? '#4CAF50'
            : copiedCurrentGrade.grade === '주의'
            ? '#FF8C00'
            : copiedCurrentGrade.grade === '심각'
            ? '#FF4444'
            : '#FF4444';

        setSafetyScore(score);
        setSafetyGradeInfo(copiedCurrentGrade);

        const countsArr = [
          selectedAreaSafetyInfo.criticalIncidentCount,
          selectedAreaSafetyInfo.alertIncidentCount,
          selectedAreaSafetyInfo.warningIncidentCount,
        ];
        setIncidentSeries(countsArr);
      }
    }
  }, [eventScoreData, selectedArea]);

  useEffect(() => {
    // series 데이터가 있을 때 로딩 상태를 false로 설정
    if (
      safetyGradeInfo &&
      incidentSeries.length > 0 &&
      incidentSeries.length === xAxisDataLength
    ) {
      setSeriesIsLoading(false);
    } else {
      setSeriesIsLoading(true);
    }
  }, [safetyGradeInfo, incidentSeries]);

  return (
    <div className="grid-row grid">
      <div className="flex items-end gap-2">
        <span
          className={`text-title-xxl ${
            safetyGradeInfo?.color === '#FF4444'
              ? 'text-eguard-red'
              : safetyGradeInfo?.color === '#FF8C00'
              ? 'text-eguard-orange'
              : 'text-eguard-green'
          }`}
        >
          {safetyGradeInfo?.grade}
        </span>
        <span
          className={`${
            safetyGradeInfo?.color === '#FF4444'
              ? 'text-eguard-red'
              : safetyGradeInfo?.color === '#FF8C00'
              ? 'text-eguard-orange'
              : 'text-eguard-green'
          }`}
        >
          {safetyGradeInfo?.message}
        </span>
      </div>
      <div className="flex flex-row items-center gap-2">
        {seriesIsLoading ? (
          <div className="w-full">
            <SeriesIsLoading />
          </div>
        ) : (
          <>
            <div className="w-1/2">
              <LevelRadialBarChart
                height={300}
                colors={[safetyGradeInfo?.color || '']}
                labels={safetyGradeLabels}
                series={[safetyScore]}
                level={safetyGradeInfo?.grade || ''}
                changedSeries={!!selectedArea} // changedSeries flag를 'seletedArea가 변경될 때'로 지정
              />
            </div>
            <div className="w-1/2">
              <MultiRadialBarChart
                height={300}
                colors={incidentColors}
                labels={incidentLabels}
                series={incidentSeries}
                changedSeries={!!selectedArea} // changedSeries flag를 'seletedArea가 변경될 때'로 지정
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default MainAreaSafetySummaryContentsWrapper;
