import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { showToast, ToastType } from '../../ToastContainer';
import { WorkEntity } from '../../types/WorkEntity';

interface MainMonitoringAreaWorkSummaryProps {
  workList: WorkEntity[];
}

const MainMonitoringAreaWorkSummary: React.FC<
  MainMonitoringAreaWorkSummaryProps
> = ({ workList }) => {
  const callEmployee = (employeeNumber: string) => {
    // call 로직
    // 차후 작성

    // call 이후
    showToast({
      message: `${employeeNumber}를 호출하였습니다.`,
      type: ToastType.WARNING,
    });
  };

  return workList.length === 0 ? (
    <div className="w-full rounded border border-stroke px-4 py-2 shadow-1">
      <h4 className="text-lg font-semibold text-black dark:text-white">
        작업 현황
      </h4>
      <div className="grid-row grid gap-1 py-2">
        <div className="grid-row grid gap-1 bg-gray-2 px-2 py-2">
          <div className="flex items-baseline gap-2 font-semibold text-black">
            <span>진행중인 작업이 없습니다.</span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full rounded border border-stroke px-4 py-2 shadow-1">
      <h4 className="text-lg font-semibold text-black dark:text-white">
        작업 현황
      </h4>
      <div className="grid-row grid gap-1 py-2">
        {workList &&
          workList.map((work, index: number) => {
            const workEmployeeList = work.employees;
            const normalEmployeeList = workEmployeeList.filter(
              (employee) => employee.healthStatus === 'NORMAL'
            );
            const onLeaveEmployeeList = workEmployeeList.filter(
              (employee) => employee.healthStatus === 'ON_LEAVE'
            );
            const vacancyEmployeeList = workEmployeeList.filter(
              (employee) =>
                employee.healthStatus !== 'NORMAL' &&
                employee.healthStatus !== 'ON_LEAVE'
            );
            return (
              <div
                key={index}
                className="grid-row grid gap-1 bg-gray-2 px-2 py-2"
              >
                <div className="flex items-baseline gap-2 font-semibold text-black">
                  <span>{work.workName}</span>
                  <ul className="flex">
                    <li className="before:content-['('] after:content-['/']">
                      <span className={`text-black`}>
                        {workEmployeeList.length}
                      </span>
                    </li>
                    <li className="after:content-['/']">
                      <span className="text-eguard-green">
                        {normalEmployeeList.length}
                      </span>
                    </li>
                    <li className="after:content-['/']">
                      <span className="text-eguard-orange">
                        {vacancyEmployeeList.length}
                      </span>
                    </li>
                    <li className="after:content-[')']">
                      <span className={`text-slate-400`}>
                        {onLeaveEmployeeList.length}
                      </span>
                    </li>
                  </ul>
                </div>
                {normalEmployeeList &&
                  normalEmployeeList.map((normal, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <span className="h-4 w-4 rounded-full bg-gradient-to-r from-eguard-sidebar-end to-eguard-green"></span>
                        <span className="text-eguard-green">
                          {normal.employeeNumber}
                        </span>
                      </div>
                      <PrimaryButton
                        text="호출"
                        size="sm"
                        additionalClasses="hidden md:block"
                        onClick={() => callEmployee(normal.employeeNumber)}
                      />
                    </div>
                  ))}
                {vacancyEmployeeList &&
                  vacancyEmployeeList.map((vacancy, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <span className="h-4 w-4 rounded-full bg-gradient-to-r from-eguard-red to-eguard-orange"></span>
                        <span className="text-eguard-orange">
                          {vacancy.employeeNumber}
                        </span>
                      </div>
                      <PrimaryButton
                        text="호출"
                        size="sm"
                        additionalClasses="hidden md:block"
                        onClick={() => callEmployee(vacancy.employeeNumber)}
                      />
                    </div>
                  ))}
                {onLeaveEmployeeList &&
                  onLeaveEmployeeList.map((onLeave, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <span className="h-4 w-4 rounded-full bg-gradient-to-r from-black to-slate-400"></span>
                        <span className={`text-slate-400`}>
                          {onLeave.employeeNumber}
                        </span>
                      </div>
                      <PrimaryButton
                        text="호출"
                        size="sm"
                        additionalClasses="hidden md:block"
                        onClick={() => callEmployee(onLeave.employeeNumber)}
                      />
                    </div>
                  ))}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MainMonitoringAreaWorkSummary;
