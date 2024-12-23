import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { t } from 'i18next';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import CloseButton from '../../components/Buttons/CloseButton';
import queries from '../../hooks/queries/queries';
import {
  EventEntityValidationRules,
  IncidentWorkerEmployeeEventEntity,
} from '../../types/EventEntity';
import { EmployeeEntity } from '../../types/EmployeeEntity';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';

interface EditIncidentWorkerEmployeeProps {
  info: IncidentWorkerEmployeeEventEntity;
  onSave: (
    updatedInfo:
      | IncidentWorkerEmployeeEventEntity
      | Omit<IncidentWorkerEmployeeEventEntity, 'eventId'>
  ) => void; // 'eventId' 필드 제외 가능
  onClose: () => void;
  mode: 'add' | 'edit';
}

// FormValues는 workerEmployeeExtendEntity의 일부 속성들만을 사용
interface FormValues
  extends Pick<
    IncidentWorkerEmployeeEventEntity,
    | 'eventId'
    | 'employeeId'
    | 'employeeNumber'
    | 'employeeIncident'
    | 'eventResolved'
  > {}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const EditIncidentWorkerEmployee: React.FC<EditIncidentWorkerEmployeeProps> = ({
  info,
  onSave,
  onClose,
  mode,
}) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const { useWorkerEmployeeList } = queries();
  const {
    data: workerEmployeeListData,
    error: workerEmployeeListDataError,
    isLoading: workerEmployeeListIsLoading,
  } = useWorkerEmployeeList(loggedInUser?.factoryId || 0);

  const [workerEmployeeList, setWorkerEmployeeList] = useState<
    EmployeeEntity[]
  >([]);
  const [selectedWorkerEmployee, setSelectedWorkerEmployee] =
    useState<EmployeeEntity>();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      eventId: info.eventId,
      employeeId: info.employeeId,
      employeeNumber: info.employeeNumber,
      employeeIncident: info.employeeIncident,
      eventResolved: info.eventResolved,
    },
  });

  useEffect(() => {
    if (workerEmployeeListData) {
      setWorkerEmployeeList(workerEmployeeListData);
      setSelectedWorkerEmployee(
        selectedWorkerEmployee || mode === 'add'
          ? workerEmployeeListData[0]
          : workerEmployeeListData.find(
              (workerEmployee: EmployeeEntity) =>
                workerEmployee.employeeNumber === info.employeeNumber
            )
      );
    }
  }, [workerEmployeeListData]);

  // 선택 근로자 변경
  const changeworkerEmployee = (workerEmployee: EmployeeEntity) => {
    setSelectedWorkerEmployee(workerEmployee);
    setValue('employeeNumber', workerEmployee.employeeNumber);
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: any) => {
    onSave(data);
    onClose();
  };

  return (
    <div className="">
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark ">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {mode === 'add'
            ? '근로자 사건 정보 추가'
            : `${info.employeeNumber} 사건 정보 수정`}
        </h3>
      </div>
      <div className="grid-row grid gap-4 px-5 py-4">
        <form onSubmit={handleSubmit(onSubmit)} className="grid-row grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                근로자
              </label>
              <Controller
                name="employeeNumber"
                control={control}
                rules={EventEntityValidationRules.employeeNumber}
                render={({ field }) => (
                  <select
                    {...field}
                    id="employeeNumber"
                    className={`max-h-12 w-full rounded border border-stroke bg-transparent px-5 py-3 outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
                    ${
                      errors.employeeNumber
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                    onChange={(e) => {
                      const targetWorkerEmployeeNumber = e.target.value;
                      const targetSelectedWorkerEmployee =
                        workerEmployeeList.find(
                          (workerEmployee) =>
                            workerEmployee.employeeNumber ===
                            targetWorkerEmployeeNumber
                        );
                      targetSelectedWorkerEmployee &&
                        changeworkerEmployee(targetSelectedWorkerEmployee);
                    }}
                  >
                    <option value="" disabled={true} className="text-slate-400">
                      사건이 발생한 근로자를 선택합니다.
                    </option>
                    {workerEmployeeList &&
                      workerEmployeeList.map(
                        (workerEmployee, index: number) => (
                          <option
                            key={index}
                            value={workerEmployee.employeeId}
                            selected={
                              selectedWorkerEmployee &&
                              selectedWorkerEmployee.employeeId ===
                                workerEmployee.employeeId
                            }
                          >
                            {workerEmployee.employeeNumber}
                          </option>
                        )
                      )}
                  </select>
                )}
              />
            </div>

            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                사건 유형
              </label>
              <Controller
                name="employeeIncident"
                control={control}
                rules={EventEntityValidationRules.employeeIncident}
                render={({ field }) => (
                  <select
                    {...field}
                    id="employeeIncident"
                    className={`max-h-12 w-full rounded border border-stroke bg-transparent px-5 py-3 outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
                    ${
                      errors.employeeIncident
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  >
                    <option value="" disabled={true} className="text-slate-400">
                      사건 유형을 선택합니다.
                    </option>
                    <option value="INJURY">부상</option>
                    <option value="CRITICAL_HEALTH_ISSUE">
                      중대한 건강 이상
                    </option>
                    <option value="MINOR_HEALTH_ISSUE">경미한 건강 이상</option>
                    <option value="ON_LEAVE">휴가</option>
                  </select>
                )}
              />
              {errors.employeeIncident && (
                <Error message={t(`${errors.employeeIncident.message}`)} />
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <PrimaryButton
              text="저장"
              size="md"
              outline={false}
              additionalClasses="h-10"
            />
            <CloseButton
              text="닫기"
              size="md"
              additionalClasses="h-10"
              onClick={onClose}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIncidentWorkerEmployee;
