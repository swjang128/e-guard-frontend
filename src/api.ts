// src/api.ts
import { showToast, ToastType } from './ToastContainer';
import './css/ReactToastify.css';
import { axiosClient } from './AxiosClientProvider';
import axios from 'axios';

// GET 요청을 위한 기본 함수
export const fetchData = async (endpoint: string) => {
  try {
    const response = await axiosClient.get(`${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    showToast({
      message: '요청이 실패했습니다. 잠시 후 다시 시도해 주세요.',
      type: ToastType.ERROR,
    });
    throw error;
  }
};

// POST 요청을 위한 기본 함수
export const postData = async (endpoint: string, data: any) => {
  try {
    const response = await axiosClient.post(`${endpoint}`, data);
    response.data &&
      showToast({
        message: '정상 처리 되었습니다.',
        type: ToastType.SUCCESS,
      });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    showToast({
      message: '요청이 실패했습니다. 잠시 후 다시 시도해 주세요.',
      type: ToastType.ERROR,
    });
    throw error;
  }
};

export const postAuthCodeData = async (endpoint: string, data: any) => {
  try {
    const response = await axiosClient.post(`${endpoint}`, data);
    response.data &&
      showToast({
        message: '인증번호를 발송하였습니다. 이메일을 확인해 주세요.',
        type: ToastType.INFO,
      });
    return response.data;
  } catch (error: any) {
    console.error('Error posting data:', error);
    // const errorMessage =
    //   error.response?.data?.data ||
    //   'Failed to execute request. Please try again.';
    showToast({
      message: '요청이 실패했습니다. 잠시 후 다시 시도해 주세요.',
      type: ToastType.ERROR,
    });
    throw error;
  }
};

// PATCH 요청을 위한 기본 함수
export const patchData = async (endpoint: string, data: any) => {
  try {
    const response = await axiosClient.patch(`${endpoint}`, data);
    response.data &&
      showToast({
        message: '정상 처리 되었습니다.',
        type: ToastType.SUCCESS,
      });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    showToast({
      message: '요청이 실패했습니다. 잠시 후 다시 시도해 주세요.',
      type: ToastType.ERROR,
    });
    throw error;
  }
};

// DELETE 요청을 위한 기본 함수
export const deleteData = async (endpoint: string) => {
  try {
    const response = await axiosClient.delete(`${endpoint}`);
    response.data &&
      showToast({
        message: '정상 삭제 되었습니다.',
        type: ToastType.SUCCESS,
      });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    showToast({
      message: '요청이 실패했습니다. 잠시 후 다시 시도해 주세요.',
      type: ToastType.ERROR,
    });
    throw error;
  }
};

// 로그인
export const login = async (endpoint: string, data: any) => {
  try {
    const response = await axiosClient.post(`${endpoint}`, data);
    response &&
      showToast({
        message: '로그인 되었습니다.',
        type: ToastType.SUCCESS,
      });
    return response;
  } catch (error: any) {
    // const errorMessage =
    //   error.response?.data?.data ||
    //   'Failed to execute request. Please try again.';
    showToast({
      message: '요청이 실패했습니다. 다시 시도해 주세요.',
      type: ToastType.ERROR,
    });
    throw error;
  }
};

// 로그아웃
export const logout = async (endpoint: string) => {
  try {
    const response = await axiosClient.post(`${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

//엑셀 다운로드
export const fetchExcelData = async (endpoint: string) => {
  try {
    // 이진 데이터를 받기 위해 responseType을 'blob'으로 설정
    const response = await axiosClient.get(`${endpoint}`, {
      withCredentials: true, // 쿠키를 포함하여 요청
      responseType: 'blob', // Blob 형식으로 응답을 받음
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    showToast({
      message: '요청이 실패했습니다. 잠시 후 다시 시도해 주세요.',
      type: ToastType.ERROR,
    });
    throw error;
  }
};

// email pattern이 발견되었을 시 {{email}} 로 문자열 반환하기
// const replaceEmailWithPlaceholder = (message: string) => {
//   const replacedMessage = message.replace(
//     /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
//     '{{email}}'
//   );
//   return replacedMessage;
// };

// 시스템 알림 Patch
export const readAlarmData = async (endpoint: string, data: any) => {
  try {
    const response = await axiosClient.patch(`${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

// 비밀번호 초기화 Patch
export const resetPasswordData = async (endpoint: string, data: any) => {
  try {
    const response = await axiosClient.patch(`${endpoint}`, data);
    response.data &&
      showToast({
        message: '비밀번호가 초기화 되었습니다. 이메일을 확인해 주세요.',
        type: ToastType.SUCCESS,
      });
    return response.data;
  } catch (error: any) {
    console.error('Error posting data:', error);
    // const errorMessage =
    //   error.response?.data?.data ||
    //   'Failed to execute request. Please try again.';
    showToast({
      message: '요청이 실패했습니다. 다시 시도해 주세요.',
      type: ToastType.ERROR,
    });
    throw error;
  }
};

// 챗봇 채팅 전송과 응답
export const postChatData = async (endpoint: string, data: any) => {
  try {
    const response = await axiosClient.post(`${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    showToast({
      message: '요청이 실패했습니다. 잠시 후 다시 시도해 주세요.',
      type: ToastType.ERROR,
    });
    throw error;
  }
};

// 백엔드 외 외부 API
// 파일 업로드 처리 (인스턴스 서버에 직접적으로 CURL PUT (Nginx DavMethods 이용))
// axiosClient를 사용하지 않는다.
export const fileUpload = async (file: any, filePath: string) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_CDN_HOST}${filePath}`,
      file,
      {
        headers: {
          'Content-Type': file.type || 'application/octet-stream', // MIME 타입 설정
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error posting data:', error);
    showToast({
      message: '요청이 실패했습니다. 잠시 후 다시 시도해 주세요.',
      type: ToastType.ERROR,
    });
    throw error;
  }
};

// 백엔드 외 외부 API
// 도로명 주소 검색하기
// axiosClient를 사용하지 않는다.
export const searchAddress = async (keyword: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SEARCH_ADDRESS_API_URL}`,
      {
        params: {
          confmKey: import.meta.env.VITE_SEARCH_ADDRESS_API_KEY,
          addInfoYn: 'Y',
          currentPage: 1,
          countPerPage: 100,
          keyword,
          resultType: 'json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error posting data:', error);
    showToast({
      message: '요청이 실패했습니다. 잠시 후 다시 시도해 주세요.',
      type: ToastType.ERROR,
    });
    throw error;
  }
};
