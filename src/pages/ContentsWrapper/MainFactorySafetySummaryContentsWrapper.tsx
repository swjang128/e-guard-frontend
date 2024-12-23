import { useEffect, useState } from 'react';
import SeriesIsLoading from '../../components/Charts/SeriesLoading';
import LevelRadialBarChart from '../../components/Charts/LevelRadialBarChart';
import MultiRadialBarChart from '../../components/Charts/MultiRadialBarChart';
import queries from '../../hooks/queries/queries';
import {
  EventSafetyGradesEntity,
  EventSafetyGradesExtendEntity,
} from '../../types/EventEntity';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';

const MainFactorySafetySummaryContentsWrapper: React.FC = () => {
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
      const score = eventScoreData.factorySafetyScore.safetyScore;
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
        eventScoreData.factorySafetyScore.criticalIncidentCount,
        eventScoreData.factorySafetyScore.alertIncidentCount,
        eventScoreData.factorySafetyScore.warningIncidentCount,
      ];
      setIncidentSeries(countsArr);
    }
  }, [eventScoreData]);

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
              />
            </div>
            <div className="w-1/2">
              <MultiRadialBarChart
                height={300}
                colors={incidentColors}
                labels={incidentLabels}
                series={incidentSeries}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default MainFactorySafetySummaryContentsWrapper;
