import { useState } from 'react';
import { fileUpload } from '../../api';
import { showToast, ToastType } from '../../ToastContainer';
interface SingleInputFileTransferProps {
  id: string;
  filePath: string; // 파일 위치
  allowFileTypes: string[]; // 확장자 허용 유형
  callback: (result: string) => void;
}

// single input filetransfer : hook form input용 단일 file입출력 관리 컴포넌트
// fileName이 존재하지 않으면 => div내에 파일명 미표시, 파일 선택 표시, 삭제 버튼 미표시
// fileName이 존재하면 => div내에 파일명 표시, 파일 선택 미표시, 삭제 버튼 표시
const SingleInputFileTransfer: React.FC<SingleInputFileTransferProps> = ({
  id,
  filePath,
  allowFileTypes,
  callback,
}) => {
  const filePathArr = filePath.split('/');
  const [fileName, setFileName] = useState(filePathArr[filePathArr.length - 1]);
  const [uploading, setUploading] = useState(false);

  return (
    <>
      <span className={`${fileName !== '' && 'text-black'}`}>
        {fileName === '' ? '파일명' : fileName}
      </span>
      <div>
        {fileName !== '' && uploading === false && (
          <button
            type="button" // hook form submit 방지
            onClick={() => {
              setFileName('');
              callback('');
            }}
            className="rounded-full p-2 text-eguard-red transition-colors hover:text-opacity-80"
          >
            삭제
          </button>
        )}
        <div className="relative inline-block">
          <label
            htmlFor={`${id}_fileUpload`}
            className={`flex items-center justify-center rounded ${
              fileName === ''
                ? 'cursor-pointer bg-primary hover:bg-opacity-80'
                : 'cursor-default bg-gray'
            } px-4 py-2 text-white`}
            onClick={(e) => {
              if (fileName !== '') {
                e.preventDefault(); // 클릭 차단
              }
            }}
          >
            파일 선택
          </label>
          <input
            type="file"
            id={`${id}_fileUpload`}
            className="sr-only"
            disabled={fileName !== ''}
            onChange={(e) => {
              setUploading(true);
              setFileName('업로드 진행중 ..');

              // 1. 빈 문자열 제거
              let filteredArray = filePathArr.filter((item) => item !== '');

              // 2. 첫 번째 요소 치환
              if (filteredArray[0] === 'download') {
                filteredArray[0] = 'upload';
              }
              const uploadPath = '/' + filteredArray.join('/') + '/';

              if (e.target.files) {
                const targetFile = e.target.files[0];
                const fileName = targetFile.name;
                const fileType = fileName.split('.').pop();
                if (fileType && allowFileTypes.includes(fileType)) {
                  const targetFilePath = `${uploadPath}${fileName}`;
                  fileUpload(targetFile, targetFilePath).then((result) => {
                    if (
                      result.status &&
                      (result.status === 201 || result.status === 204)
                    ) {
                      setFileName(fileName);
                      callback(fileName);
                      e.target.value = '';
                    }
                  });
                } else {
                  showToast({
                    message:
                      '허용되지 않는 확장자입니다. 파일을 다시 확인하세요.',
                    type: ToastType.ERROR,
                  });
                  setFileName('');
                  callback('');
                  e.target.value = '';
                }
              }
              setUploading(false);
            }}
          />
        </div>
      </div>
    </>
  );
};
export default SingleInputFileTransfer;
