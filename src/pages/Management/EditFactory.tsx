import React, { useState } from 'react';
import {
  FactoryEntity,
  FactoryEntityValidationRules,
} from '../../types/FactoryEntity';
import { Controller, useForm } from 'react-hook-form';
import { t } from 'i18next';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import CloseButton from '../../components/Buttons/CloseButton';
import Modal from '../../Modal';
import ApiSearchAddressPopup from '../../components/ApiSearchAddressPopup/ApiSearchAddressPopup';

interface EditFactoryProps {
  info: FactoryEntity;
  onSave: (
    updatedInfo: FactoryEntity | Omit<FactoryEntity, 'factoryId'>
  ) => void; // 'factoryId' 필드 제외 가능
  onClose: () => void;
  mode: 'add' | 'edit';
}

// FormValues는 FactoryEntity의 일부 속성들만을 사용
interface FormValues
  extends Pick<
    FactoryEntity,
    | 'companyId'
    | 'factoryId'
    | 'factoryName'
    | 'factoryAddress'
    | 'factoryAddressDetail'
    | 'factoryIndustryType'
    | 'factoryStructureSize'
    | 'factoryTotalSize'
  > {}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const EditFactory: React.FC<EditFactoryProps> = ({
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
      companyId: info.companyId,
      factoryId: info.factoryId,
      factoryName: info.factoryName,
      factoryIndustryType: info.factoryIndustryType,
      factoryTotalSize: info.factoryTotalSize,
      factoryStructureSize: info.factoryStructureSize,
      factoryAddress: info.factoryAddress,
      factoryAddressDetail: info.factoryAddressDetail,
    },
  });

  // 검색 modal (주소 찾기)
  const [seachAddressModal, setSeachAddressModal] = useState<boolean>(false);

  // 폼 제출 핸들러
  const onSubmit = async (data: any) => {
    onSave(data);
    onClose();
  };

  return (
    <div className="">
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark ">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {mode === 'add' ? '공장 정보 추가' : `${info.factoryName} 정보 수정`}
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
                업체 주소
              </label>
              <div className="max-h-12 rounded border border-stroke bg-gray-2 px-5 py-3">
                <p>{info.companyAddress}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                공장명
              </label>
              <Controller
                name="factoryName"
                control={control}
                rules={FactoryEntityValidationRules.factoryName}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="factoryName"
                    placeholder="공장명을 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.factoryName
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.factoryName && (
                <Error message={t(`${errors.factoryName.message}`)} />
              )}
            </div>

            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                업종
              </label>
              <Controller
                name="factoryIndustryType"
                control={control}
                rules={FactoryEntityValidationRules.factoryIndustryType}
                render={({ field }) => (
                  <select
                    {...field}
                    id="factoryIndustryType"
                    className={`max-h-12 w-full rounded border border-stroke bg-transparent px-5 py-3 outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
                    ${
                      errors.factoryIndustryType
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  >
                    <option value="" disabled={true} className="text-slate-400">
                      공장의 업종을 선택합니다.
                    </option>
                    <option value="MANUFACTURING">제조업</option>
                    <option value="CHEMICAL">화학 산업</option>
                    <option value="ELECTRONICS">전자 산업</option>
                    <option value="FOOD_AND_BEVERAGE">식음료 제조업</option>
                    <option value="AUTOMOTIVE">자동차 산업</option>
                    <option value="ENERGY">에너지 및 전력 산업</option>
                    <option value="TEXTILE">섬유 및 의류 산업</option>
                    <option value="LOGISTICS">물류 및 유통업</option>
                    <option value="OTHER">기타</option>
                  </select>
                )}
              />
              {errors.factoryIndustryType && (
                <Error message={t(`${errors.factoryIndustryType.message}`)} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                전체 면적 (㎡)
              </label>
              <Controller
                name="factoryTotalSize"
                control={control}
                rules={FactoryEntityValidationRules.factoryTotalSize}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    id="factoryTotalSize"
                    placeholder="전체 면적을 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.factoryTotalSize
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.factoryTotalSize && (
                <Error message={t(`${errors.factoryTotalSize.message}`)} />
              )}
            </div>

            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                건물 면적 (㎡)
              </label>
              <Controller
                name="factoryStructureSize"
                control={control}
                rules={FactoryEntityValidationRules.factoryStructureSize}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    id="factoryStructureSize"
                    placeholder="건물 면적을 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.factoryStructureSize
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.factoryStructureSize && (
                <Error message={t(`${errors.factoryStructureSize.message}`)} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                공장 주소
              </label>
              <Controller
                name="factoryAddress"
                control={control}
                rules={FactoryEntityValidationRules.factoryAddress}
                render={({ field }) => (
                  <div
                    {...field}
                    className={`flex max-h-12 w-full flex-row items-center justify-between rounded border bg-transparent py-3 pl-5 pr-1 outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.factoryAddress
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  >
                    <div>
                      <span
                        className={`${
                          getValues('factoryAddress').length > 25 && 'text-sm'
                        }`}
                      >
                        {getValues('factoryAddress') ||
                          '버튼을 눌러 주소를 검색하세요.'}
                      </span>
                    </div>
                    <button
                      type="button" // hook form submit 방지
                      onClick={() => {
                        setSeachAddressModal(true);
                      }}
                      className="h-10 min-w-24 items-center rounded border border-primary bg-primary px-1 text-center text-white hover:bg-opacity-80 hover:text-white dark:bg-primary dark:text-white"
                    >
                      주소 검색
                    </button>
                  </div>
                )}
              />
              {errors.factoryAddress && (
                <Error message={t(`${errors.factoryAddress.message}`)} />
              )}
            </div>

            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                상세 주소
              </label>
              <Controller
                name="factoryAddressDetail"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="factoryAddressDetail"
                    placeholder="주소를 검색 후 필요시 상세 주소를 입력할 수 있습니다."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.factoryAddressDetail
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                    disabled={getValues('factoryAddress').length === 0}
                  />
                )}
              />
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

      <Modal
        isOpen={seachAddressModal}
        onClose={() => setSeachAddressModal(false)}
      >
        <ApiSearchAddressPopup
          callback={(result) => {
            if (result !== '') {
              setValue('factoryAddress', result);
              clearErrors('factoryAddress');
            } else {
              setValue('factoryAddress', '');
            }
          }}
          onClose={() => setSeachAddressModal(false)}
        />
      </Modal>
    </div>
  );
};

export default EditFactory;
