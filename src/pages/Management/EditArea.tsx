import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { t } from 'i18next';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import CloseButton from '../../components/Buttons/CloseButton';
import {
  AreaEntityValidationRules,
  AreaExtendEntity,
} from '../../types/AreaEntity';
import SingleInputFileTransfer from '../../components/FileTransfer/SingleInputFileTransfer';

interface EditAreaProps {
  info: AreaExtendEntity;
  onSave: (
    updatedInfo: AreaExtendEntity | Omit<AreaExtendEntity, 'factoryId'>
  ) => void; // 'factoryId' 필드 제외 가능
  onClose: () => void;
  mode: 'add' | 'edit';
}

// FormValues는 AreaExtendEntity의 일부 속성들만을 사용
interface FormValues
  extends Pick<
    AreaExtendEntity,
    | 'factoryId'
    | 'areaId'
    | 'areaName'
    | 'areaLocation'
    | 'areaUsableSize'
    | 'areaLatitude'
    | 'areaLongitude'
    | 'areaPlan2DFilePath'
    | 'areaPlan3DFilePath'
  > {}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const EditArea: React.FC<EditAreaProps> = ({ info, onSave, onClose, mode }) => {
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
      factoryId: info.factoryId,
      areaId: info.areaId,
      areaName: info.areaName,
      areaLocation: info.areaLocation,
      areaUsableSize: info.areaUsableSize,
      areaLatitude: info.areaLatitude,
      areaLongitude: info.areaLongitude,
      areaPlan2DFilePath: info.areaPlan2DFilePath,
      areaPlan3DFilePath: info.areaPlan3DFilePath,
    },
  });

  // 폼 제출 핸들러
  const onSubmit = async (data: any) => {
    onSave(data);
    onClose();
  };

  return (
    <div className="">
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark ">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {mode === 'add' ? '구역 정보 추가' : `${info.areaName} 정보 수정`}
        </h3>
      </div>
      <div className="grid-row grid gap-4 px-5 py-4">
        <form onSubmit={handleSubmit(onSubmit)} className="grid-row grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                구역명
              </label>
              <Controller
                name="areaName"
                control={control}
                rules={AreaEntityValidationRules.areaName}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="areaName"
                    placeholder="구역명을 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.areaName
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.areaName && (
                <Error message={t(`${errors.areaName.message}`)} />
              )}
            </div>

            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                구역 위치
              </label>
              <Controller
                name="areaLocation"
                control={control}
                rules={AreaEntityValidationRules.areaLocation}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="areaLocation"
                    placeholder="구역 위치를 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.areaLocation
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.areaLocation && (
                <Error message={t(`${errors.areaLocation.message}`)} />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                사용 면적 (㎡)
              </label>
              <Controller
                name="areaUsableSize"
                control={control}
                rules={AreaEntityValidationRules.areaUsableSize}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    id="areaUsableSize"
                    placeholder="사용 면적을 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.areaUsableSize
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.areaUsableSize && (
                <Error message={t(`${errors.areaUsableSize.message}`)} />
              )}
            </div>
          </div>

          {mode === 'edit' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="w-full">
                <label className="mb-2 block font-semibold text-black dark:text-white">
                  구역 도면도 (2D)
                </label>
                <Controller
                  name="areaPlan2DFilePath"
                  control={control}
                  rules={AreaEntityValidationRules.areaPlan2DFilePath}
                  render={({ field }) => (
                    <div
                      {...field}
                      className={`flex max-h-12 w-full flex-row items-center justify-between rounded border bg-transparent py-3 pl-5 pr-1 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                        errors.areaPlan2DFilePath
                          ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                          : 'border-stroke focus:border-primary active:border-primary'
                      }`}
                    >
                      <SingleInputFileTransfer
                        id="areaPlan2DFilePath"
                        allowFileTypes={['jpeg', 'jpg', 'png']}
                        filePath={
                          getValues('areaPlan2DFilePath') === ''
                            ? `/download/${info.companyId}/${info.factoryId}/${info.areaId}/2DPlan/`
                            : getValues('areaPlan2DFilePath')
                        }
                        callback={(result) => {
                          if (result !== '') {
                            setValue(
                              'areaPlan2DFilePath',
                              `/download/${info.companyId}/${info.factoryId}/${info.areaId}/2DPlan/${result}`
                            );
                          } else {
                            setValue('areaPlan2DFilePath', '');
                          }
                        }}
                      />
                    </div>
                  )}
                />
                {errors.areaPlan2DFilePath && (
                  <Error message={t(`${errors.areaPlan2DFilePath.message}`)} />
                )}
              </div>

              <div className="w-full">
                <label className="mb-2 block font-semibold text-black dark:text-white">
                  구역 도면도 (3D)
                </label>
                <Controller
                  name="areaPlan3DFilePath"
                  control={control}
                  rules={AreaEntityValidationRules.areaPlan3DFilePath}
                  render={({ field }) => (
                    <div
                      {...field}
                      className={`flex max-h-12 w-full flex-row items-center justify-between rounded border bg-transparent py-3 pl-5 pr-1 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                        errors.areaPlan3DFilePath
                          ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                          : 'border-stroke focus:border-primary active:border-primary'
                      }`}
                    >
                      <SingleInputFileTransfer
                        id="areaPlan3DFilePath"
                        allowFileTypes={['glb', 'gltf']}
                        filePath={
                          getValues('areaPlan3DFilePath') === ''
                            ? `/download/${info.companyId}/${info.factoryId}/${info.areaId}/3DPlan/`
                            : getValues('areaPlan3DFilePath')
                        }
                        callback={(result) => {
                          if (result !== '') {
                            setValue(
                              'areaPlan3DFilePath',
                              `/download/${info.companyId}/${info.factoryId}/${info.areaId}/3DPlan/${result}`
                            );
                          } else {
                            setValue('areaPlan3DFilePath', '');
                          }
                        }}
                      />
                    </div>
                  )}
                />
                {errors.areaPlan3DFilePath && (
                  <Error message={t(`${errors.areaPlan3DFilePath.message}`)} />
                )}
              </div>
            </div>
          )}

          {/* 37.49351, 127.1131 */}

          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                위도 좌표 (LAT)
              </label>
              <Controller
                name="areaLatitude"
                control={control}
                rules={AreaEntityValidationRules.areaLatitude}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    step="0.0000001"
                    id="areaLatitude"
                    placeholder="지도상의 위도 좌표 (LAT)를 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.areaLatitude
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.areaLatitude && (
                <Error message={t(`${errors.areaLatitude.message}`)} />
              )}
            </div>

            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                경도 좌표 (LNG)
              </label>
              <Controller
                name="areaLongitude"
                control={control}
                rules={AreaEntityValidationRules.areaLongitude}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    step="0.0000001"
                    id="areaLongitude"
                    placeholder="지도상의 경도 좌표 (LNG)를 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.areaLongitude
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.areaLongitude && (
                <Error message={t(`${errors.areaLongitude.message}`)} />
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

export default EditArea;
