import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  CompanyEntity,
  CompanyEntityValidationRules,
} from '../../types/CompanyEntity';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import CloseButton from '../../components/Buttons/CloseButton';
import Modal from '../../Modal';
import ApiSearchAddressPopup from '../../components/ApiSearchAddressPopup/ApiSearchAddressPopup';

interface EditCompanyProps {
  info: CompanyEntity;
  onSave: (
    updatedInfo: CompanyEntity | Omit<CompanyEntity, 'companyId'>
  ) => void; // 'companyId' 필드 제외 가능
  onClose: () => void;
  mode: 'add' | 'edit';
}

// FormValues는 CompanyEntity의 일부 속성들만을 사용
interface FormValues
  extends Pick<
    CompanyEntity,
    | 'companyId'
    | 'companyName'
    | 'businessNumber'
    | 'companyEmail'
    | 'companyPhoneNumber'
    | 'companyAddress'
    | 'companyAddressDetail'
  > {}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const EditCompany: React.FC<EditCompanyProps> = ({
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
      companyName: info.companyName,
      businessNumber: info.businessNumber,
      companyEmail: info.companyEmail,
      companyPhoneNumber: info.companyPhoneNumber,
      companyAddress: info.companyAddress,
      companyAddressDetail: info.companyAddressDetail,
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
          {mode === 'add' ? '업체 정보 추가' : `${info.companyName} 정보 수정`}
        </h3>
      </div>
      <div className="grid-row grid gap-4 px-5 py-4">
        <form onSubmit={handleSubmit(onSubmit)} className="grid-row grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                업체명
              </label>
              <Controller
                name="companyName"
                control={control}
                rules={CompanyEntityValidationRules.companyName}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="companyName"
                    placeholder="업체명을 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.companyName
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.companyName && (
                <Error message={errors.companyName.message} />
              )}
            </div>

            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                사업자 등록번호
              </label>
              <Controller
                name="businessNumber"
                control={control}
                rules={CompanyEntityValidationRules.businessNumber}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="businessNumber"
                    placeholder="사업자 등록번호를 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.businessNumber
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.businessNumber && (
                <Error message={errors.businessNumber.message} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                대표 이메일
              </label>
              <Controller
                name="companyEmail"
                control={control}
                rules={CompanyEntityValidationRules.companyEmail}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="companyEmail"
                    placeholder="대표 이메일을 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.companyEmail
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.companyEmail && (
                <Error message={errors.companyEmail.message} />
              )}
            </div>

            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                대표 전화번호
              </label>
              <Controller
                name="companyPhoneNumber"
                control={control}
                rules={CompanyEntityValidationRules.companyPhoneNumber}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="companyPhoneNumber"
                    placeholder="대표 전화번호를 입력하세요."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.companyPhoneNumber
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  />
                )}
              />
              {errors.companyPhoneNumber && (
                <Error message={errors.companyPhoneNumber.message} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                업체 주소
              </label>
              <Controller
                name="companyAddress"
                control={control}
                rules={CompanyEntityValidationRules.companyAddress}
                render={({ field }) => (
                  <div
                    {...field}
                    className={`flex max-h-12 w-full flex-row items-center justify-between rounded border bg-transparent py-3 pl-5 pr-1 outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.companyAddress
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  >
                    <div>
                      <span
                        className={`${
                          getValues('companyAddress').length > 20
                            ? 'text-sm'
                            : 'text'
                        }`}
                      >
                        {getValues('companyAddress') ||
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
              {errors.companyAddress && (
                <Error message={errors.companyAddress.message} />
              )}
            </div>

            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                상세 주소
              </label>
              <Controller
                name="companyAddressDetail"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="companyAddressDetail"
                    placeholder="주소를 검색 후 필요시 상세 주소를 입력할 수 있습니다."
                    className={`max-h-12 w-full rounded border bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
                      errors.companyAddressDetail
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                    disabled={getValues('companyAddress').length === 0}
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
              setValue('companyAddress', result);
              clearErrors('companyAddress');
            } else {
              setValue('companyAddress', '');
            }
          }}
          onClose={() => setSeachAddressModal(false)}
        />
      </Modal>
    </div>
  );
};

export default EditCompany;
