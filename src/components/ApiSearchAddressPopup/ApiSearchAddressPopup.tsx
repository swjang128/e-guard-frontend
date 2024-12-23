import axios from 'axios';
import { useEffect, useState } from 'react';
import { searchAddress } from '../../api';
import { showToast } from '../../ToastContainer';
import DataTable from '../Tables/DataTable';

type ApiSearchAddressEntity = {
  common: {
    totalCount: number;
    currentPage: number;
    countPerPage: number;
    errorCode: number;
    errorMessage: string;
  };
  juso: null | jusoEntity[];
};

type jusoEntity = {
  roadAddr: string;
  roadAddrPart1: string;
  roadAddrPart2: string;
  engAddr: string;
  jibunAddr: string;
  zipNo: string;
  admCd: string;
  rnMgtSn: string;
  bdMgtSn: string;
  detBdNmList: string;
  bdNm: string;
  bdKdcd: string;
  siNm: string;
  sggNm: string;
  emdNm: string;
  liNm: string;
  rn: string;
  udrtYn: string;
  buldMnnm: string;
  buldSlno: string;
  mtYn: string;
  lnbrMnnm: string;
  lnbrSlno: string;
  emdNo: string;
  hstryYn: string;
  relJibun: string;
  hemdNm: string;
};

interface ApiSearchAddressPopupProps {
  callback: (result: string) => void;
  onClose: () => void;
}

const ApiSearchAddressPopup: React.FC<ApiSearchAddressPopupProps> = ({
  callback,
  onClose,
}) => {
  const [searching, setSearching] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>('');
  const [seachedList, setSearchedList] = useState<null | jusoEntity[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSearch = async () => {
    setSearching(true);
    try {
      const response = await searchAddress(keyword);
      const { results }: { results: ApiSearchAddressEntity } = JSON.parse(
        response.data.slice(1, -1)
      );
      if (results.juso) {
        setTotalCount(Number(results.common.totalCount));
        setSearchedList(results.juso);
      } else {
        setTotalCount(0);
        setSearchedList(null);
        setErrorMessage(results.common.errorMessage);
      }
    } catch (error: any) {
      console.error(error);
      setTotalCount(0);
      setSearchedList(null);
      setErrorMessage(error.message);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleSearch();
      }
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="">
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark ">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          주소 검색
        </h3>
      </div>
      <div className="grid-row grid max-h-150 gap-4 overflow-y-auto px-5 py-4">
        <div className="grid-col grid gap-2">
          <div className="flex w-full gap-2">
            <input
              type="text"
              placeholder="검색하실 주소를 입력하세요. (예) 천호동, (예) 상암로39길"
              className="max-h-12 w-full rounded border border-stroke bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
            />
            <button
              type="button" // hook form submit 방지
              onClick={handleSearch}
              className="min-w-24 items-center rounded border border-primary bg-primary px-1 text-center text-white hover:bg-opacity-80 hover:text-white disabled:border-stroke disabled:bg-slate-200 dark:bg-primary dark:text-white"
              disabled={searching}
            >
              검색
            </button>
          </div>
        </div>
        <div className="grid-col grid gap-2">
          <div>
            {seachedList ? (
              <>
                <p className="text-sm">
                  * 검색된 결과에서 주소를 선택해 주세요.
                </p>
                <p className="text-sm">
                  * 맞는 주소가 없을 시, 검색어를 좀더 자세하게 입력해 보세요.
                </p>
                <div className="flex justify-end gap-2">
                  <span className="text-black">검색 결과</span>
                  <span className="text-eguard-green">
                    {seachedList.length}
                    {totalCount > 100 && '+'}건
                  </span>
                  <span>(최대 100건)</span>
                </div>
              </>
            ) : (
              <span className="text-eguard-red">{errorMessage}</span>
            )}
          </div>
        </div>
        {seachedList && (
          <div className="grid-col grid gap-2">
            <div className="w-full rounded border-2 border-eguard-green">
              <ul>
                {seachedList.length === 0 ? (
                  <li>
                    <div className="flex items-center px-4 py-4 text-black">
                      검색 결과가 없습니다. 다른 검색어로 시도하여 주세요.
                    </div>
                  </li>
                ) : (
                  seachedList.map((result, index: number) => (
                    <li key={index}>
                      <div
                        className={`flex cursor-pointer flex-row gap-2 px-4 py-2 text-sm hover:bg-eguard-body ${
                          index != seachedList.length - 1 &&
                          'border-b border-stroke'
                        }`}
                        onClick={() => {
                          callback(result.roadAddr);
                          onClose();
                        }}
                      >
                        <span className="font-semibold text-black">
                          {result.roadAddr}
                        </span>
                        <span>- {result.jibunAddr}</span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ApiSearchAddressPopup;
