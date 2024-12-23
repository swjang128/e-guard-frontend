import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo_e_guard from '../../images/logo/logo_e_guard.svg';
import logo_atemos from '../../images/logo/main_logo_wh_width.png';
import back from '../../images/icon/back2.png';
import { Controller, useForm } from 'react-hook-form';
import {
  fetchData,
  login,
  patchData,
  postAuthCodeData,
  resetPasswordData,
} from '../../api'; // Axios를 이용한 API 호출 함수 가져오기
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { LoggedInUser } from '../../types/EmployeeEntity';
import { validationRules } from '../../validationRules';
import MailIcon from '../../path/MailIcon';
import LockIcon from '../../path/LockIcon';
import {
  usableLanguagesState,
  UsableLanguagesType,
} from '../../store/usableLanguagesAtom';
import { selectLanguageState } from '../../store/selectLanguageAtom';
import Modal from '../../Modal';
import { usableMenusState } from '../../store/usableMenusAtom';
import './auth.css';
import EnterAuthCode from './EnterAuthCode';
import AuthUpdatePassword from './AuthUpdatePassword';
import AuthResetPassword from './AuthResetPassword';
import { setAccessTokenCookie, setRefreshTokenCookie } from '../../cookies';
import { getDecodedToken } from '../../tokenDecode';
import { SettingEntity } from '../../types/SettingEntity';

// 폼 데이터의 타입 정의
interface FormValues extends Pick<LoggedInUser, 'employeeEmail'> {
  password: string;
}
export interface PrimaryInput extends FormValues {
  countryId: number;
}

const LogIn: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const usableMenus = useRecoilValue(usableMenusState);
  const resetLoggedInUser = useResetRecoilState(loggedInUserState);
  const resetUsableMenus = useResetRecoilState(usableMenusState);
  const nav = useNavigate();

  const selectLanguage = useRecoilValue(selectLanguageState);

  // 비밀번호 초기화
  const [pwUpdateModal, setPwUpdateModal] = useState(false);
  const [pwResetModal, setPwResetModal] = useState(false);

  // setDatas
  const [usableLanguages, setUsableLanguages] =
    useRecoilState<UsableLanguagesType>(usableLanguagesState);

  // 비밀번호 수정
  const [updatPwdModal, setUpdatPwdModal] = useState(false);

  const [primaryInputData, setPrimaryInputData] = useState<PrimaryInput>();
  // 인증코드 입력모달
  const [editModal, setEditModal] = useState(false);
  // 인증번호 발송중
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // 강제 로그아웃 됐을 경우 recoil state가 남아있으므로 reset을 실행
    if (loggedInUser) {
      resetLoggedInUser();
    }
    if (usableMenus) {
      resetUsableMenus();
    }
  }, []);

  // Form Validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: any) => {
    setSending(true);

    // 2fator 사용 설정을 조회한다.
    const getCurrentSetting = async () => {
      try {
        const response = await fetchData(
          `/setting?employeeEmail=${data.employeeEmail}`
        );
        return response.data.settingList[0];
      } catch (error) {
        console.error('Error while logging in:', error);
        // 에러 처리
      }
    };
    const setting: SettingEntity = await getCurrentSetting();
    if (setting.twoFactorAuthenticationEnabled) {
      // 2Factor 적용 - 2Factor modal 출현
      setPrimaryInputData({
        ...data,
        countryId: usableLanguages[selectLanguage].countryId,
      });
      try {
        const response = await postAuthCodeData('/auth/2fa', {
          employeeEmail: data.employeeEmail,
        });
        if (response.status === 200 && response.data) {
          setEditModal(true);
        }
      } catch (error: any) {
        console.error(error);
      } finally {
        setSending(false);
      }
    } else {
      // 2Factor 미사용 - 바로 로그인 처리
      login('/auth/login', data).then(
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
            nav('/main');
          } catch (error) {
            console.error('error', error);
          } finally {
            setSending(false);
          }
        },
        (err) => {
          console.error('err', err);
          return err?.response?.data;
        }
      );
    }
  };

  // 비밀번호 수정
  const handlePwUpdate = async (updatedInfo: any) => {
    updatedInfo.password = updatedInfo.currentPassword;
    delete updatedInfo.currentPassword;
    delete updatedInfo.confirmNewPassword;
    try {
      await patchData(`/auth/update-password`, updatedInfo);
      setUpdatPwdModal(false);
    } catch (error) {
      console.error('Error while adding member:', error);
    }
  };

  // 비밀번호 초기화
  const handlePwReset = async (resetedInfo: any) => {
    try {
      await resetPasswordData(`/auth/reset-password`, resetedInfo);
      setPwResetModal(false);
    } catch (error) {
      console.error('Error while resetting password:', error);
    }
  };

  return (
    <div className="relative h-screen w-full bg-gradient-to-r from-eguard-green to-eguard-darkgreen p-1 xl:p-10">
      <div className="relative z-50 flex h-full w-full items-center justify-center p-5 text-white">
        <div className="xs:w-1/2 lg:w-1/3">
          <div className="flex flex-col gap-5 pb-7">
            <div>
              <img className="mx-auto" src={logo_e_guard} alt="Logo" />
            </div>
            <div className="flex justify-center gap-2">
              <span className="text-l text-center font-bold">환영합니다 !</span>
              <span className="text-center font-light opacity-80">
                E-GUARD에 로그인하여 주세요.
              </span>
            </div>
          </div>

          {/* submitHandler을 handleSubmit 으로 감쌈 submitHandler하기 전에 handleSubmit 를 우선 작업 */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            {/* email */}
            <div className="relative h-25">
              <label htmlFor="email" className="label">
                이메일
              </label>
              <span className="icon-wrapper">
                <MailIcon fill="#ffffff" />
              </span>
              <Controller
                name="employeeEmail"
                control={control}
                rules={validationRules.employeeEmail}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="employeeEmail"
                    placeholder="이메일을 입력하세요."
                    className="input-style autoFill-custom placeholder-white placeholder-opacity-80 drop-shadow-md placeholder:font-light focus:border-white focus:outline-none"
                    autoComplete="username"
                  />
                )}
              />
              {errors.employeeEmail && (
                <p className="error-message error-message-light">
                  {errors.employeeEmail.message}
                </p>
              )}
            </div>

            {/* password */}
            <div className="relative h-25">
              <Controller
                name="password"
                control={control}
                rules={validationRules.password}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    type="password"
                    id="password"
                    placeholder="비밀번호를 입력하세요."
                    className="input-style autoFill-custom placeholder-white placeholder-opacity-80 drop-shadow-md placeholder:font-light focus:border-white focus:outline-none"
                    autoComplete="current-password"
                  />
                )}
              />
              <label htmlFor="password" className="label">
                비밀번호
              </label>
              <span className="icon-wrapper">
                <LockIcon />
              </span>
              {errors.password && (
                <p className="error-message error-message-light">
                  {errors.password.message}
                </p>
              )}
            </div>

            {editModal === false && (
              <div className="mb-10">
                <button
                  className={`flex w-full ${
                    sending === false
                      ? `cursor-pointer bg-primary hover:brightness-90`
                      : 'cursor-not-allowed bg-slate-400'
                  } items-center justify-center gap-2 rounded-lg  p-2 text-white drop-shadow-md`}
                >
                  {/* {selectLanguage === 'ko-KR' ? (
                    <>{t('Authenticate')}</>
                  ) : (
                    <>{t('Log In')}</>
                  )} */}
                  로그인
                  {sending === true && (
                    <span className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></span>
                  )}
                </button>
              </div>
            )}
            <div className="grid gap-3">
              <div className="flex gap-2">
                <span className="font-extralight">비밀번호를 잊으셨나요?</span>
                <span className="flex items-baseline gap-2 after:content-['/']">
                  <Link
                    className="font-medium underline hover:text-eguard-darkgreen"
                    onClick={() => setPwUpdateModal(true)}
                    to="#"
                  >
                    수정
                  </Link>
                </span>
                <span>
                  <Link
                    className="font-medium underline hover:text-eguard-darkgreen"
                    to="#"
                    onClick={() => setPwResetModal(true)}
                  >
                    초기화
                  </Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Modal isOpen={editModal} onClose={() => setEditModal(false)}>
        {primaryInputData && (
          <EnterAuthCode
            primaryInputData={primaryInputData}
            onClose={() => setEditModal(false)}
          />
        )}
      </Modal>

      <Modal isOpen={pwUpdateModal} onClose={() => setPwUpdateModal(false)}>
        <AuthUpdatePassword
          onSave={handlePwUpdate}
          onClose={() => setPwUpdateModal(false)}
        />
      </Modal>

      <Modal isOpen={pwResetModal} onClose={() => setPwResetModal(false)}>
        <AuthResetPassword
          onSave={handlePwReset}
          onClose={() => setPwResetModal(false)}
        />
      </Modal>

      <div className="absolute bottom-0 right-1/2 z-50 translate-x-1/2 transform px-8 pb-4 lg:right-0 lg:transform-none">
        <img className="w-30" src={logo_atemos} alt="Logo" />
      </div>

      <div className="absolute right-0 top-0 hidden h-full opacity-50 xl:block">
        <img className="h-full" src={back} alt="Logo" />
      </div>
    </div>
  );
};

export default LogIn;
