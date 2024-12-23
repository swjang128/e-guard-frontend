import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { t } from 'i18next';
import {
  WorkEmployeeEntity,
  WorkEntity,
  WorkEntityValidationRules,
} from '../../types/WorkEntity';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import CloseButton from '../../components/Buttons/CloseButton';
import ChipButton from '../../components/Buttons/ChipButton';
import queries from '../../hooks/queries/queries';
import { EmployeeEntity } from '../../types/EmployeeEntity';
import _, { Dictionary } from 'lodash';
import { AreaEntity } from '../../types/AreaEntity';
import ConfirmCancelModal from '../../components/ConfirmCancelModal';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { FactoryEntityValidationRules } from '../../types/FactoryEntity';

interface EditWorkProps {
  info: WorkEntity;
  onSave: (updatedInfo: WorkEntity | Omit<WorkEntity, 'areaId'>) => void; // 'areaId' 필드 제외 가능
  onClose: () => void;
  mode: 'add' | 'edit';
}

// FormValues는 WorkEntity의 일부 속성들만을 사용
interface FormValues
  extends Pick<
    WorkEntity,
    'workId' | 'workName' | 'workStatus' | 'employees' | 'areaId'
  > {}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const EditWork: React.FC<EditWorkProps> = ({ info, onSave, onClose, mode }) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const { useAreaList, useWorkerEmployeeList } = queries();
  const {
    data: areaListData,
    error: areaListDataError,
    isLoading: areaListIsLoading,
  } = useAreaList(loggedInUser?.factoryId || 0);
  const {
    data: employeeListData,
    error: employeeListDataError,
    isLoading: employeeListIsLoading,
  } = useWorkerEmployeeList(loggedInUser?.factoryId || 0);

  const [areaList, setAreaList] = useState<AreaEntity[]>([]);
  const [selectedArea, setSelectedArea] = useState<AreaEntity>();
  const [currentWorkEmployeeList, setCurrentWorkEmployeeList] = useState<
    WorkEmployeeEntity[]
  >([]); // 현재 작업 근로자 리스트
  const [notAssignedEmployeeList, setNotAssignedEmployeeList] = useState<
    WorkEmployeeEntity[]
  >([]); // 작업이 할당되지 않은 근로자 리스트
  const [confirmModal, setConfirmModal] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    getValues,
    trigger,
  } = useForm<FormValues>({
    defaultValues: {
      areaId: info.areaId,
      workId: info.workId,
      workName: info.workName,
      workStatus: info.workStatus,
      employees: info.employees,
    },
  });

  useEffect(() => {
    if (areaListData) {
      setAreaList(areaListData);
      setSelectedArea(
        selectedArea || mode === 'add'
          ? areaListData[0]
          : areaListData.find((area: AreaEntity) => area.areaId === info.areaId)
      );
    }
  }, [areaListData]);

  useEffect(() => {
    if (employeeListData) {
      const mapKeysEmployeeDictonary = _.mapKeys(
        info.employees,
        'employeeId'
      ) as Dictionary<WorkEmployeeEntity>;
      if (mode === 'edit') {
        setCurrentWorkEmployeeList(Object.values(mapKeysEmployeeDictonary));
      }
      setNotAssignedEmployeeList(
        employeeListData.filter(
          (employee: EmployeeEntity) =>
            !!employee.workId === false && employee.healthStatus === 'NORMAL'
        )
      );
    }
  }, [employeeListData]);

  useEffect(() => {
    if (errors.employees && currentWorkEmployeeList.length > 0) {
      clearErrors('employees');
    }
  }, [currentWorkEmployeeList]);

  // 선택 구역 변경
  const changeArea = (area: AreaEntity) => {
    setSelectedArea(area);
    setValue('areaId', area.areaId);
  };

  // 작업 할당
  const assign = (employeeId: number) => {
    const changedNotAssignedEmployeeDictonary = _.omit(
      _.mapKeys(notAssignedEmployeeList, 'employeeId'),
      employeeId
    );
    setNotAssignedEmployeeList(
      Object.values(changedNotAssignedEmployeeDictonary)
    ); // 선택한 객체는 미할당 리스트에서 빠진다.

    const changedCurrentWorkEmployeeDictonary = _.assign(
      {},
      _.mapKeys(currentWorkEmployeeList, 'employeeId'),
      {
        [employeeId]: employeeListData.find(
          (employee: WorkEmployeeEntity) => employee.employeeId === employeeId
        ),
      }
    );
    setCurrentWorkEmployeeList(
      Object.values(changedCurrentWorkEmployeeDictonary)
    ); // 미할당 리스트에서 빠진 객체는 할당 리스트에 들어온다.

    // 각 리스트 교체가 완료되면 employee에 setValue
    setValue('employees', Object.values(changedCurrentWorkEmployeeDictonary));
  };

  // 작업 할당 해제
  const unassign = (employeeId: number) => {
    const changedCurrentWorkEmployeeDictonary = _.omit(
      _.mapKeys(currentWorkEmployeeList, 'employeeId'),
      employeeId
    );
    setCurrentWorkEmployeeList(
      Object.values(changedCurrentWorkEmployeeDictonary)
    ); // 선택한 객체는 할당 리스트에서 빠진다.
    const changedNotAssignedEmployeeDictonary = _.assign(
      {},
      _.mapKeys(notAssignedEmployeeList, 'employeeId'),
      {
        [employeeId]: employeeListData.find(
          (employee: WorkEmployeeEntity) => employee.employeeId === employeeId
        ),
      }
    );
    setNotAssignedEmployeeList(
      Object.values(changedNotAssignedEmployeeDictonary)
    ); // 할당 리스트에서 빠진 객체는 미할당 리스트에 들어온다.

    // 각 리스트 교체가 완료되면 employee에 setValue
    setValue('employees', Object.values(changedCurrentWorkEmployeeDictonary));
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: any) => {
    if (selectedArea?.areaIncident !== 'NORMAL') {
      setConfirmModal(true);
    } else {
      sumbit(data);
    }
  };

  const sumbit = (data: any) => {
    const submitData = {
      ...data,
      employeeIds: data.employees.map((employee: WorkEmployeeEntity) => {
        return employee.employeeId;
      }),
    };

    const { employees, ...finalSubmitData } = submitData;
    onSave(finalSubmitData);
    onClose();
  };

  return (
    <div className="">
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark ">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {mode === 'add' ? '작업 추가' : `${info.workName} 작업 수정`}
        </h3>
      </div>
      {(info.workStatus === 'COMPLETED' || info.workStatus === 'CANCELLED') && (
        <p className="px-5 py-4">
          * 작업 상태가 'COMPLETED', 'CANCELLED' 인 경우에는 작업 정보의 수정이
          불가능합니다.
        </p>
      )}
      <div className="grid-row grid gap-4 px-5 py-4">
        <form onSubmit={handleSubmit(onSubmit)} className="grid-row grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                구역명
              </label>
              <Controller
                name="areaId"
                control={control}
                rules={WorkEntityValidationRules.areaId}
                render={({ field }) => (
                  <select
                    {...field}
                    id="areaId"
                    className={`max-h-12 w-full rounded border border-stroke bg-transparent px-5 py-3 outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
                    ${
                      errors.areaId
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                    onChange={(e) => {
                      const targetAreaId = Number(e.target.value);
                      const targetSelectedArea = areaList.find(
                        (area) => area.areaId === targetAreaId
                      );
                      targetSelectedArea && changeArea(targetSelectedArea);
                    }}
                    disabled={
                      info.workStatus === 'CANCELLED' ||
                      info.workStatus === 'COMPLETED'
                    }
                  >
                    <option value="" disabled={true} className="text-slate-400">
                      작업이 진행되는 구역을 선택합니다.
                    </option>
                    {areaList &&
                      areaList.map((area, index: number) => (
                        <option
                          key={index}
                          value={area.areaId}
                          selected={
                            selectedArea && selectedArea.areaId === area.areaId
                          }
                        >
                          {area.areaName}
                        </option>
                      ))}
                  </select>
                )}
              />
              {errors.areaId && (
                <Error message={t(`${errors.areaId.message}`)} />
              )}
            </div>

            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                구역 상태 (참고 사항)
              </label>
              {selectedArea &&
                (selectedArea.areaIncident === 'NORMAL' ? (
                  <div className="max-h-12 rounded border border-stroke bg-gray-2 px-5 py-3">
                    <p className="text-eguard-green">
                      특이사항 없음. 정상 구역입니다.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-12 rounded border border-eguard-red bg-gray-2 px-5 py-3">
                    <p className="text-eguard-red">
                      사고 발생 구역입니다. 작업 등록에 주의를 요합니다.
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                작업명
              </label>
              <Controller
                name="workName"
                control={control}
                rules={WorkEntityValidationRules.workName}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="workName"
                    placeholder="작업명을 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.workName
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                    disabled={
                      info.workStatus === 'CANCELLED' ||
                      info.workStatus === 'COMPLETED'
                    }
                  />
                )}
              />
              {errors.workName && (
                <Error message={t(`${errors.workName.message}`)} />
              )}
            </div>

            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                작업 상태
              </label>
              <Controller
                name="workStatus"
                control={control}
                rules={{
                  ...FactoryEntityValidationRules.factoryName,
                  onChange: FactoryEntityValidationRules.factoryName.onChange(), // onChange를 그대로 호출
                }}
                render={({ field }) => (
                  <select
                    {...field}
                    id="workStatus"
                    className={`max-h-12 w-full rounded border border-stroke bg-transparent px-5 py-3 outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
                    ${
                      errors.workStatus
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                    disabled={
                      info.workStatus === 'CANCELLED' ||
                      info.workStatus === 'COMPLETED'
                    }
                  >
                    <option value="" disabled={true} className="text-slate-400">
                      작업의 상태를 선택합니다.
                    </option>
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                )}
              />
              {errors.workStatus && (
                <Error message={t(`${errors.workStatus.message}`)} />
              )}
            </div>
          </div>

          <div className="w-full">
            <label className="mb-2 block font-semibold text-black dark:text-white">
              근로자 할당
            </label>
            <Controller
              name="employees"
              control={control}
              rules={{
                ...WorkEntityValidationRules.employees,
                validate: (value) =>
                  WorkEntityValidationRules.employees.validate(
                    value,
                    getValues
                  ),
              }}
              render={({ field }) => (
                <div
                  {...field}
                  className={`grid-row grid gap-2 rounded border px-5 py-3 outline-none transition ${
                    errors.employees ? 'border-eguard-red' : 'border-stroke'
                  }`}
                >
                  <p className="font-semibold">할당된 근로자</p>
                  <div className="flex min-h-16 flex-wrap items-center gap-2 rounded border border-stroke bg-gray-2 px-5 py-1">
                    {currentWorkEmployeeList.length === 0 ? (
                      <p className="text-slate-400">
                        할당된 근로자가 없습니다.
                      </p>
                    ) : (
                      currentWorkEmployeeList.map(
                        (currentWorkEmployee, index: number) => (
                          <ChipButton
                            key={index}
                            text={currentWorkEmployee.employeeNumber}
                            selected={true}
                            disabled={
                              info.workStatus === 'CANCELLED' ||
                              info.workStatus === 'COMPLETED'
                            }
                            onClick={() =>
                              info.workStatus === 'CANCELLED' ||
                              info.workStatus === 'COMPLETED'
                                ? null
                                : unassign(currentWorkEmployee.employeeId)
                            }
                          />
                        )
                      )
                    )}
                  </div>
                  <p className="font-semibold">할당 가능 근로자</p>
                  <div className="flex min-h-16 flex-wrap items-center gap-2 rounded border border-stroke bg-gray-2 px-5 py-1">
                    {notAssignedEmployeeList.length === 0 ? (
                      <p className="text-slate-400">
                        할당 가능 근로자가 없습니다. 근로자분들의 휴가 및 건강
                        상태를 확인해 주세요.
                      </p>
                    ) : (
                      notAssignedEmployeeList.map(
                        (notAssignedEmployee, index: number) => (
                          <ChipButton
                            key={index}
                            text={notAssignedEmployee.employeeNumber}
                            disabled={
                              info.workStatus === 'CANCELLED' ||
                              info.workStatus === 'COMPLETED'
                            }
                            onClick={() =>
                              info.workStatus === 'CANCELLED' ||
                              info.workStatus === 'COMPLETED'
                                ? null
                                : assign(notAssignedEmployee.employeeId)
                            }
                          />
                        )
                      )
                    )}
                  </div>
                </div>
              )}
            />
            {errors.employees && (
              <Error message={t(`${errors.employees.message}`)} />
            )}
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {info.workStatus !== 'CANCELLED' &&
              info.workStatus !== 'COMPLETED' && (
                <PrimaryButton
                  text="저장"
                  size="md"
                  outline={false}
                  additionalClasses="h-10"
                />
              )}
            <CloseButton
              text="닫기"
              size="md"
              additionalClasses="h-10"
              onClick={onClose}
            />
          </div>
          <ConfirmCancelModal
            isOpen={confirmModal}
            onClose={onClose}
            onConfirm={handleSubmit(sumbit)}
            title="사고 발생 구역 포함 알림"
            message="사고 발생 구역입니다. 그래도 저장하시겠습니까?"
          />
        </form>
      </div>
    </div>
  );
};

export default EditWork;
