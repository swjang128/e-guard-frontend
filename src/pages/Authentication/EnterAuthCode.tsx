import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { validationRules } from '../../validationRules';
import { PrimaryInput } from './LogIn';
import { login, postAuthCodeData } from '../../api';
import { setAccessTokenCookie, setRefreshTokenCookie } from '../../cookies';
import { getDecodedToken } from '../../tokenDecode';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { useNavigate } from 'react-router-dom';
import LockIcon from '../../path/LockIcon';
import CountdownTimer from './CountdownTimer';
import { LoggedInUser } from '../../types/EmployeeEntity';

interface EnterAuthCodeProps {
  primaryInputData: PrimaryInput;
  onClose: () => void;
}

interface FormValues {
  authCode: string;
}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const EnterAuthCode: React.FC<EnterAuthCodeProps> = ({
  primaryInputData,
  onClose,
}) => {
  const [isActive, setIsActive] = useState(true); // 타이머 활성화 상태
  const [reset, setReset] = useState(false);
  const setLoggedInUser = useSetRecoilState(loggedInUserState);
  const nav = useNavigate();
  const { employeeEmail } = primaryInputData;
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormValues>();

  // useEffect(() => {
  //   trigger('authCode');
  // }, []);

  // 폼 제출 핸들러
  const onSubmit = async (data: any) => {
    requestNotificationPermission();
    const loginSubmitData = {
      ...data,
      ...primaryInputData,
    };
    login('/auth/login', loginSubmitData).then(
      (res: any) => {
        // 받아온 토큰을 쿠키에 저장
        try {
          const { accessToken, refreshToken } = res;
          setAccessTokenCookie(accessToken);
          setRefreshTokenCookie(refreshToken);
          const decodedToken: any = getDecodedToken(accessToken);
          const {
            employeeId,
            companyId,
            companyName,
            companyAddress,
            companyBusinessNumber,
            factoryId,
            factoryName,
            employeeName,
            employeeEmail,
            employeePhoneNumber,
            role,
            healthStatus,
            authenticationStatus,
            accessibleMenuIds,
          } = decodedToken;
          const loggedInUser: LoggedInUser = {
            employeeId,
            companyId,
            companyName,
            companyAddress,
            companyBusinessNumber,
            factoryId,
            factoryName,
            employeeName,
            employeeEmail,
            employeePhoneNumber,
            role,
            healthStatus,
            authenticationStatus,
            accessibleMenuIds,
          };
          setLoggedInUser(loggedInUser);
          onClose();
          nav('/main');
        } catch (error) {
          console.error('error', error);
        }
      },
      (err) => {
        console.error('err', err);
        return err?.response?.data;
      }
    );
  };

  async function requestNotificationPermission() {
    await Notification.requestPermission();
  }

  return (
    <div className="bg-whiten">
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark ">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          인증번호 입력
        </h3>
      </div>
      <p className="pl-4 pt-2 text-sm text-primary">
        * Email : {employeeEmail}
      </p>
      <p className="pl-4 pt-2 text-sm text-primary">
        * 이메일로 발송된 인증번호를 입력하세요.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5">
        <div className="relative h-25">
          <label htmlFor="authCode" className="label flex items-center gap-2">
            <span>인증번호</span>
            {isActive && (
              <CountdownTimer
                reset={reset}
                isActive={isActive}
                setIsActive={setIsActive}
              />
            )}
          </label>
          <span className="icon-wrapper">
            <LockIcon />
          </span>
          <div className="grid grid-cols-12 gap-2">
            <Controller
              name="authCode"
              control={control}
              rules={validationRules.authCode}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="authCode"
                  placeholder="인증번호를 입력하세요."
                  className="input-style col-span-12 bg-white"
                />
              )}
            />
          </div>
          {errors.authCode && <Error message={errors.authCode.message} />}
        </div>
        <button
          type="submit"
          className="from-e_green to-e_blue mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-gradient-to-r p-2 text-white hover:brightness-90"
        >
          로그인
        </button>
      </form>
    </div>
  );
};

export default EnterAuthCode;
