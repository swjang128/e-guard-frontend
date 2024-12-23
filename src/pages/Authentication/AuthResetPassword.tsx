import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { validationRules } from '../../validationRules';
import MailIcon from '../../path/MailIcon';
import { LoggedInUser } from '../../types/EmployeeEntity';

interface AuthResetPasswordProps {
  onSave: (passwords: { password: string; newPassword: string }) => void;
  onClose: () => void;
}

// FormValues는 LoggedInUser의 일부 속성들만을 사용
interface FormValues extends Pick<LoggedInUser, 'employeeEmail'> {}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const AuthResetPassword: React.FC<AuthResetPasswordProps> = ({
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
          비밀번호 초기화
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

export default AuthResetPassword;
