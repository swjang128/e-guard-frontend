import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  EmployeeEntity,
  EmployeeEntityValidationRules,
} from '../../types/EmployeeEntity';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import CloseButton from '../../components/Buttons/CloseButton';
import Modal from '../../Modal';
import ApiSearchAddressPopup from '../../components/ApiSearchAddressPopup/ApiSearchAddressPopup';
import {
  FactoryEntity,
  FactoryEntityValidationRules,
} from '../../types/FactoryEntity';
import { t } from 'i18next';
import queries from '../../hooks/queries/queries';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { E_ROLE_TYPES } from '../../enum';
import { validationRules } from '../../validationRules';

interface EditEmployeeProps {
  info: EmployeeEntity;
  onSave: (
    updatedInfo: EmployeeEntity | Omit<EmployeeEntity, 'companyId'>
  ) => void; // 'companyId' 필드 제외 가능
  onClose: () => void;
  mode: 'add' | 'edit';
}

// FormValues는 EmployeeEntity의 일부 속성들만을 사용
interface FormValues
  extends Pick<
    EmployeeEntity,
    | 'companyName'
    | 'factoryId'
    | 'factoryName'
    | 'employeeName'
    | 'employeeNumber'
    | 'employeeEmail'
    | 'employeePhoneNumber'
    | 'role'
  > {}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const EditEmployee: React.FC<EditEmployeeProps> = ({
  info,
  onSave,
  onClose,
  mode,
}) => {
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
      companyName: info.companyName,
      factoryId: info.factoryId,
      factoryName: info.factoryName,
      employeeName: info.employeeName,
      employeeNumber: info.employeeNumber,
      employeeEmail: info.employeeEmail,
      employeePhoneNumber: info.employeePhoneNumber,
      role: E_ROLE_TYPES.WORKER,
    },
  });

  const loggedInUser = useRecoilValue(loggedInUserState);
  const [factoryList, setFactoryList] = useState<FactoryEntity[]>([]);
  const [selectedFactory, setSelectedFactory] = useState<FactoryEntity>();
  const { useFactoryList } = queries();
  const {
    data: factoryListData,
    error: factoryListDataError,
    isLoading: factoryListIsLoading,
  } = useFactoryList(loggedInUser?.factoryId || 0);

  useEffect(() => {
    if (factoryListData) {
      setFactoryList(factoryListData);
      setSelectedFactory(
        selectedFactory || mode === 'add'
          ? factoryListData[0]
          : factoryListData.find(
              (factory: FactoryEntity) =>
                factory.factoryName === info.factoryName
            )
      );
    }
  }, [factoryListData]);

  // 선택 공장 변경
  const changeFactory = (factory: FactoryEntity) => {
    setSelectedFactory(factory);
    setValue('factoryName', factory.factoryName);
    setValue('factoryId', factory.factoryId);
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
            ? '근로자 정보 추가'
            : `${info.employeeNumber} 정보 수정`}
        </h3>
      </div>
      <div className="grid-row grid gap-4 px-5 py-4">
        <form onSubmit={handleSubmit(onSubmit)} className="grid-row grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                업체명
              </label>
              <div className="max-h-12 rounded border border-stroke bg-gray-2 px-5 py-3">
                <p>{info.companyName}</p>
              </div>
            </div>

            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                공장명
              </label>
              <Controller
                name="factoryName"
                control={control}
                rules={{
                  ...FactoryEntityValidationRules.factoryName,
                  onChange: FactoryEntityValidationRules.factoryName.onChange(),
                }}
                render={({ field }) => (
                  <select
                    {...field}
                    id="factoryName"
                    className={`max-h-12 w-full rounded border border-stroke bg-transparent px-5 py-3 outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
                    ${
                      errors.factoryName
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                    onChange={(e) => {
                      const targetFactoryName = e.target.value;
                      const targetSelectedFacotryName = factoryList.find(
                        (factory) => factory.factoryName === targetFactoryName
                      );
                      targetSelectedFacotryName &&
                        changeFactory(targetSelectedFacotryName);
                    }}
                  >
                    <option value="" disabled={true} className="text-slate-400">
                      공장명을 선택합니다.
                    </option>
                    {factoryList &&
                      factoryList.map((factory, index: number) => (
                        <option
                          key={index}
                          value={factory.factoryName}
                          selected={
                            selectedFactory &&
                            selectedFactory.factoryName === factory.factoryName
                          }
                        >
                          {factory.factoryName}
                        </option>
                      ))}
                  </select>
                )}
              />
              {errors.factoryName && (
                <Error message={t(`${errors.factoryName.message}`)} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                작업자 태그명
              </label>
              <Controller
                name="employeeNumber"
                control={control}
                rules={EmployeeEntityValidationRules.employeeNumber}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="employeeNumber"
                    placeholder="작업자 태그을 입력하세요." //변경 예정
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.employeeNumber
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.employeeNumber && (
                <Error message={errors.employeeNumber.message} />
              )}
            </div>

            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                작업자명
              </label>
              <Controller
                name="employeeName"
                control={control}
                rules={EmployeeEntityValidationRules.employeeName}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="employeeName"
                    placeholder="작업자 이름를 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.employeeName
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.employeeName && (
                <Error message={errors.employeeName.message} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                작업자 이메일
              </label>
              <Controller
                name="employeeEmail"
                control={control}
                rules={validationRules.employeeEmail}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="employeeEmail"
                    placeholder="작업자 이메일을 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.employeeEmail
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.employeeEmail && (
                <Error message={t(`${errors.employeeEmail.message}`)} />
              )}
            </div>

            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                휴대전화
              </label>
              <Controller
                name="employeePhoneNumber"
                control={control}
                rules={validationRules.phone}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="employeePhoneNumber"
                    placeholder="작업자 전화번호를 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.employeePhoneNumber
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.employeePhoneNumber && (
                <Error message={t(`${errors.employeePhoneNumber.message}`)} />
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

export default EditEmployee;
