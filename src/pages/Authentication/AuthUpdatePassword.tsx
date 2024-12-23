import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { validationRules } from '../../validationRules';
import MailIcon from '../../path/MailIcon';
import LockIcon from '../../path/LockIcon';
import { LoggedInUser } from '../../types/EmployeeEntity';

interface AuthUpdatePasswordProps {
  onSave: (passwords: { password: string; newPassword: string }) => void;
  onClose: () => void;
}

// FormValues는 LoggedInUser의 일부 속성들만을 사용
interface FormValues extends Pick<LoggedInUser, 'employeeEmail'> {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const AuthUpdatePassword: React.FC<AuthUpdatePasswordProps> = ({
  onSave,
  onClose,
}) => {
  // Form Validation
  const {
    control,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      employeeEmail: '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  // 폼 제출 핸들러
  const onSubmit = async (data: any) => {
    onSave(data);
    onClose();
  };

  return (
    <div className="bg-whiten">
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark ">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          비밀번호 수정
        </h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5">
        <div className="relative h-25">
          <label
            htmlFor="employeeEmail"
            className="label flex items-center gap-2"
          >
            <span>이메일</span>
          </label>
          <span className="icon-wrapper">
            <MailIcon />
          </span>
          <Controller
            name="employeeEmail"
            control={control}
            rules={validationRules.employeeEmail}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                name="employeeEmail"
                placeholder="이메일을 입력하세요."
                className="input-style col-span-12 bg-white"
              />
            )}
          />
          {errors.employeeEmail && (
            <Error message={errors.employeeEmail.message} />
          )}
        </div>
        <div className="relative h-25">
          <label htmlFor="password" className="label flex items-center gap-2">
            <span>현재 비밀번호</span>
          </label>
          <span className="icon-wrapper">
            <LockIcon />
          </span>
          <Controller
            name="currentPassword"
            control={control}
            rules={validationRules.currentPassword}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                name="currentPassword"
                placeholder="현재 비밀번호를 입력하세요."
                className="input-style col-span-12 bg-white"
              />
            )}
          />
          {errors.currentPassword && (
            <Error message={errors.currentPassword.message} />
          )}
        </div>
        <div className="relative h-25">
          <label
            htmlFor="newPassword"
            className="label flex items-center gap-2"
          >
            <span>새 비밀번호</span>
          </label>
          <span className="icon-wrapper">
            <LockIcon />
          </span>
          <Controller
            name="newPassword"
            control={control}
            rules={{
              ...validationRules.newPassword,
              onChange: validationRules.newPassword.onChange(() =>
                trigger('confirmNewPassword')
              ),
            }}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                name="newPassword"
                placeholder="새 비밀번호를 입력하세요."
                className="input-style col-span-12 bg-white"
              />
            )}
          />
          {errors.newPassword && <Error message={errors.newPassword.message} />}
        </div>
        <div className="relative h-25">
          <label
            htmlFor="confirmNewPassword"
            className="label flex items-center gap-2"
          >
            <span>새 비밀번호 확인</span>
          </label>
          <span className="icon-wrapper">
            <LockIcon />
          </span>
          <Controller
            name="confirmNewPassword"
            control={control}
            rules={{
              ...validationRules.confirmNewPassword,
              validate: (value) =>
                validationRules.confirmNewPassword.validate(value, getValues),
            }}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                name="confirmNewPassword"
                placeholder="새 비밀번호를 한번 더 입력하세요."
                className="input-style col-span-12 bg-white"
              />
            )}
          />
          {errors.confirmNewPassword && (
            <Error message={errors.confirmNewPassword.message} />
          )}
        </div>
        <button
          type="submit"
          className="from-e_green to-e_blue mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-gradient-to-r p-2 text-white hover:brightness-90"
        >
          실행
        </button>
      </form>
    </div>
  );
};

export default AuthUpdatePassword;
