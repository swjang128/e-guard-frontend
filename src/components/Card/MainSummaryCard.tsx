import { useEffect, useState } from 'react';
import RadialBarChart from '../Charts/RadialBarChart';
import { useRecoilValue } from 'recoil';
import SeriesIsLoading from '../Charts/SeriesLoading';
import {
  getCurrentDate,
  getCurrentDateDetails,
} from '../../hooks/getStringedDate';
import moment from 'moment';
import queries from '../../hooks/queries/queries';
import { t } from 'i18next';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import { FactorySummaryEntity } from '../../types/FactoryEntity';
import { loggedInUserState } from '../../store/loggedInUserAtom';

interface MainSummaryCardProps {
  authFactoryInfo: any;
}

const MainSummaryCard: React.FC<MainSummaryCardProps> = ({
  authFactoryInfo,
}) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const usableLanguages = useRecoilValue(usableLanguagesState);

  const { useFactoryWorkerEmployeeSummary } = queries();
  const {
    data: factorySummaryData,
    error,
    isLoading,
  } = useFactoryWorkerEmployeeSummary(loggedInUser?.factoryId || 0);
  const [factorySummary, setFactorySummary] = useState<FactorySummaryEntity>();

  useEffect(() => {
    if (factorySummaryData) {
      setFactorySummary(factorySummaryData);
    }
  }, [factorySummaryData]);

  const currentDate = getCurrentDate(usableLanguages);
  const [currentDateTime, setCurrentDateTime] = useState(
    getCurrentDateDetails(usableLanguages)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(getCurrentDateDetails(usableLanguages));
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="col-span-12 flex-row rounded bg-white text-black shadow-default dark:bg-boxdark dark:text-white xl:col-span-4">
      <div className="h-12 rounded-t bg-gradient-to-r from-eguard-green to-eguard-darkgreen px-7 py-2 text-center text-title-md text-white">
        <h3>{moment(currentDate).format('YYYY-MM-DD')} 근로자 현황</h3>
      </div>
      <div className="grid-row grid gap-4 px-7 py-6">
        <div className="text-center">
          <span className="text-title-md font-semibold">
            {authFactoryInfo?.factoryName}
          </span>
        </div>
        <div className="flex items-end justify-end">
          <div className="flex gap-2">
            <span>현재시간</span>
            <span className="font-semibold">{`${currentDateTime.time}`}</span>
          </div>
        </div>
        <div>
          <div className="grid-row grid gap-2 border-t border-stroke pt-2">
            <div className="flex justify-between">
              <span>총원</span>
              <span className="font-semibold">
                {factorySummary?.totalEmployees || 0}명
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-eguard-orange">결원</span>
              <span className="font-semibold text-eguard-orange">
                {(factorySummary?.injuryEmployees || 0) +
                  (factorySummary?.criticalHealthIssueEmployees || 0) +
                  (factorySummary?.minorHealthIssueEmployees || 0) +
                  (factorySummary?.onLeaveEmployees || 0) +
                  (factorySummary?.unassignedEmployees || 0)}
                명
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-eguard-green">작업 중</span>
              <span className="font-semibold text-eguard-green">
                {(factorySummary?.totalEmployees || 0) -
                  (factorySummary?.injuryEmployees || 0) -
                  (factorySummary?.criticalHealthIssueEmployees || 0) -
                  (factorySummary?.minorHealthIssueEmployees || 0) -
                  (factorySummary?.onLeaveEmployees || 0) -
                  (factorySummary?.unassignedEmployees || 0)}
                명
              </span>
            </div>
          </div>
        </div>
        <div>
          <div className="grid-row grid gap-2 border-t border-stroke pt-2">
            <div>
              <span>결원 사유</span>
            </div>
            <div className="flex justify-between">
              <span className="pl-2 text-eguard-orange">부상</span>
              <span className="font-semibold text-eguard-orange">
                {factorySummary?.injuryEmployees || 0}명
              </span>
            </div>
            <div className="flex justify-between">
              <span className="pl-2 text-eguard-orange">건강 이상</span>
              <span className="font-semibold text-eguard-orange">
                {(factorySummary?.criticalHealthIssueEmployees || 0) +
                  (factorySummary?.minorHealthIssueEmployees || 0)}
                명
              </span>
            </div>
            <div className="flex justify-between">
              <span className="pl-2 text-slate-400">휴가</span>
              <span className="font-semibold text-slate-400">
                {factorySummary?.onLeaveEmployees || 0}명
              </span>
            </div>
            <div className="flex justify-between">
              <span className="pl-2">작업 미할당</span>
              <span className="font-semibold">
                {factorySummary?.unassignedEmployees || 0}명
              </span>
            </div>
          </div>
        </div>
        <div>
          <div className="grid-row grid gap-2 border-t border-stroke pt-2">
            <div className="flex justify-between">
              <span>그외 특이사항</span>
              <span>없음</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSummaryCard;
