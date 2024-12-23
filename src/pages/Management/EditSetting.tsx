import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  SettingAddEntity,
  SettingAddSchema,
  SettingEditSchema,
} from '../../types/SettingEntity';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import CloseButton from '../../components/Buttons/CloseButton';
import { z } from 'zod';

interface EditSettingProps {
  info: SettingAddEntity | SettingEditEntity;
  onSave: (updatedInfo: SettingAddEntity | SettingEditEntity) => void;
  onClose: () => void;
  mode: 'add' | 'edit';
}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const EditSetting: React.FC<EditSettingProps> = ({
  info,
  onSave,
  onClose,
  mode,
}) => {
  const schema = mode === 'add' ? SettingAddSchema : SettingEditSchema;
  type FormType = z.infer<typeof schema>;

  const [enabled, setEnabled] = useState<boolean>(
    info?.twoFactorAuthenticationEnabled
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    getValues,
    trigger,
  } = useForm<FormType>({
    resolver: zodResolver(schema), // zodResolver 추가
    defaultValues: info, // defaultValues는 info로 세팅
  });

  // 폼 제출 핸들러
  const onSubmit: SubmitHandler<FormType> = async (data) => {
    onSave(data);
    onClose();
  };

  return (
    <div className="">
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark ">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {mode === 'add' ? '설정 정보 추가' : '설정 정보 수정'}
        </h3>
      </div>
      <div className="grid-row grid gap-4 px-5 py-4">
        <form onSubmit={handleSubmit(onSubmit)} className="grid-row grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                업체별 최대 공장수
              </label>
              <Controller
                name="maxFactoriesPerCompany"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min={0}
                    id="maxFactoriesPerCompany"
                    placeholder="최대 공장수를 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.maxFactoriesPerCompany
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.maxFactoriesPerCompany && (
                <Error message={errors.maxFactoriesPerCompany.message} />
              )}
            </div>
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                공장별 최대 구역수
              </label>
              <Controller
                name="maxAreasPerFactory"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min={0}
                    id="maxAreasPerFactory"
                    placeholder="최대 구역수를 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.maxAreasPerFactory
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.maxAreasPerFactory && (
                <Error message={errors.maxAreasPerFactory.message} />
              )}
            </div>
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                공장별 최대 근로자수
              </label>
              <Controller
                name="maxEmployeesPerFactory"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min={0}
                    id="maxEmployeesPerFactory"
                    placeholder="최대 근로자수를 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.maxEmployeesPerFactory
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.maxEmployeesPerFactory && (
                <Error message={errors.maxEmployeesPerFactory.message} />
              )}
            </div>
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                구역별 최대 작업수
              </label>
              <Controller
                name="maxWorksPerArea"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min={0}
                    id="maxWorksPerArea"
                    placeholder="최대 작업수를 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.maxWorksPerArea
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.maxWorksPerArea && (
                <Error message={errors.maxWorksPerArea.message} />
              )}
            </div>
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                작업별 최대 할당 근로자수
              </label>
              <Controller
                name="maxEmployeesPerWork"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min={0}
                    id="maxEmployeesPerWork"
                    placeholder="최대 할당 근로자수를 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.maxEmployeesPerWork
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.maxEmployeesPerWork && (
                <Error message={errors.maxEmployeesPerWork.message} />
              )}
            </div>
            <div className="w-full">
              <div>
                <span className="mb-2 block font-semibold text-black dark:text-white">
                  2차 인증
                </span>
              </div>
              <div className="grid-row grid items-baseline gap-2 border border-stroke px-4 py-4 shadow-2">
                <div className="flex items-center gap-3">
                  <label className="mb-2 block font-semibold text-black dark:text-white">
                    사용 여부
                  </label>
                  <Controller
                    name="twoFactorAuthenticationEnabled"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label
                          htmlFor="toggle"
                          className="flex cursor-pointer select-none items-center"
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              id="toggle"
                              className="sr-only"
                              onChange={() => {
                                setEnabled(!enabled);
                                setValue(
                                  'twoFactorAuthenticationEnabled',
                                  !field.value
                                );
                              }}
                            />
                            <div
                              className={`block h-8 w-14 rounded-full ${
                                enabled ? 'bg-primary' : 'bg-zinc-200'
                              }`}
                            ></div>
                            <div
                              className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                                enabled && '!right-1 !translate-x-full'
                              }`}
                            ></div>
                          </div>
                        </label>
                      </div>
                    )}
                  />
                  {errors.twoFactorAuthenticationEnabled && (
                    <Error
                      message={errors.twoFactorAuthenticationEnabled.message}
                    />
                  )}
                </div>
                <div className="w-full">
                  <label className="mb-2 block font-semibold text-black dark:text-white">
                    인증번호 발송방식
                  </label>
                  <Controller
                    name="twoFactorAuthenticationMethod"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        id="twoFactorAuthenticationMethod"
                        className={`max-h-12 w-full rounded border border-stroke bg-transparent px-5 py-3 outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
                    ${
                      errors.twoFactorAuthenticationMethod
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                        disabled={!getValues('twoFactorAuthenticationEnabled')}
                      >
                        <option
                          value=""
                          disabled={true}
                          className="text-slate-400"
                        >
                          인증번호 발송방식을 선택합니다.
                        </option>
                        <option value="EMAIL">이메일</option>
                        <option value="SMS" disabled className="text-slate-400">
                          SMS (추후 제공됩니다.)
                        </option>
                      </select>
                    )}
                  />
                  {errors.twoFactorAuthenticationMethod && (
                    <Error
                      message={errors.twoFactorAuthenticationMethod.message}
                    />
                  )}
                </div>
              </div>
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

export default EditSetting;
