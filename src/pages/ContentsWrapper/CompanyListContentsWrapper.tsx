import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { useQueryClient } from '@tanstack/react-query';
import queries from '../../hooks/queries/queries';
import { useEffect, useState } from 'react';
import { CompanyEntity, CompanyExtendEntity } from '../../types/CompanyEntity';
import { patchData, postData } from '../../api';
import { CustomDropdownEventsState } from '../../components/Dropdowns/CustomDropdown';
import DataTable from '../../components/Tables/DataTable';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import Modal from '../../Modal';
import EditCompany from '../Management/EditCompany';
import moment from 'moment';

const CompanyListContentsWrapper: React.FC = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const queryClient = useQueryClient();
  const { useCompanyList } = queries();
  const {
    data: companyListData,
    error: companyListError,
    isLoading: companyListIsLoading,
  } = useCompanyList();
  const [companyList, setCompanyList] = useState<CompanyExtendEntity[]>([]); // CompanyEntity를 확장하여 address + addressDetail을 합쳐 fullAddress로 추가

  // 추가 modal
  const [addModal, setAddModal] = useState(false);

  // 수정 modal
  const [editModal, setEditModal] = useState(false);
  const [targetCompany, setTargetCompany] = useState<CompanyEntity | null>(
    null
  );

  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (companyListData) {
      setCompanyList(
        companyListData
          .map((company: CompanyEntity) => {
            return {
              ...company,
              companyFullAddress:
                company.companyAddress + ' ' + company.companyAddressDetail,
            } as CompanyExtendEntity;
          })
          .sort((a: CompanyEntity, b: CompanyEntity) => {
            return moment(a.createdAt).diff(moment(b.createdAt)) > 0
              ? -1
              : moment(a.createdAt).diff(moment(b.createdAt)) < 0
              ? 1
              : 0;
          }) // 생성시간 기준 sort처리
      );
    }
  }, [companyListData]);

  const handleSave = async <T extends 'edit' | 'add'>(
    mode: T,
    updatedInfo: T extends 'edit'
      ? CompanyEntity
      : Omit<CompanyEntity, 'companyId'>
  ) => {
    if (mode === 'edit') {
      // 타입 가드를 사용하여 updatedInfo를 CompanyEntity 타입으로 단언
      const updatedFactory = updatedInfo as CompanyEntity;

      // 업체 수정
      try {
        await patchData(`/company/${updatedFactory.companyId}`, updatedFactory);
        // 업체 추가 성공 시 업체 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
        queryClient.invalidateQueries({
          queryKey: ['companyList'],
        });
        setEditModal(false);
        setTargetCompany(null);
      } catch (error) {
        console.error('Error while updating company info:', error);
      }
    } else {
      // 타입 가드를 사용하여 updatedInfo를 Omit<CompanyEntity, 'companyId'> 타입으로 단언
      const newFactory = updatedInfo as Omit<CompanyEntity, 'companyId'>;
      // 업체 추가
      try {
        await postData('/company', newFactory);
        // 업체 추가 성공 시 업체 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
        queryClient.invalidateQueries({
          queryKey: ['companyList'],
        });
        setAddModal(false);
      } catch (error) {
        console.error('Error while adding company:', error);
      }
    }
  };

  // 이벤트 핸들러 함수
  const onEdit = async (company: CompanyEntity) => {
    setTargetCompany(company);
    setEditModal(true);
    setAddModal(false);
  };

  const onDelete = (company: CompanyEntity) => {};

  // List별 dropdown 커스텀이 필요할 경우
  const [customDropdownEvents, setCustomDropdownEvents] = useState<
    CustomDropdownEventsState[]
  >([
    {
      func: onEdit,
      text: '수정',
    },
  ]);

  // 검색어 필터링
  let filteredCompanyList = companyList;

  if (companyList) {
    filteredCompanyList = companyList.filter(
      (company) =>
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.businessNumber
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        company.companyPhoneNumber
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        company.companyFullAddress
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }

  return (
    <>
      <DataTable<CompanyExtendEntity>
        title={'업체 목록'}
        data={filteredCompanyList}
        columns={[
          { Header: '업체명', accessor: 'companyName' },
          { Header: '사업자 등록번호', accessor: 'businessNumber' },
          { Header: '대표 전화번호', accessor: 'companyPhoneNumber' },
          { Header: '전체 주소', accessor: 'companyFullAddress' },
        ]}
        // onEdit={onEdit}
        // onPwReset={onPwReset}
        // onDelete={onDelete}
        enableActions={true}
        useCustomDropdownEvents={true}
        customDropdownEvents={customDropdownEvents}
        additionalButtonArea={
          <PrimaryButton
            text="추가"
            size="md"
            additionalClasses="h-10"
            onClick={() => setAddModal(true)}
          />
        }
      />
      <Modal isOpen={editModal} onClose={() => setEditModal(false)}>
        {targetCompany && (
          <EditCompany
            info={targetCompany}
            onSave={(updatedInfo) =>
              handleSave('edit', updatedInfo as CompanyEntity)
            }
            onClose={() => setEditModal(false)}
            mode="edit"
          />
        )}
      </Modal>

      <Modal isOpen={addModal} onClose={() => setAddModal(false)}>
        <EditCompany
          info={
            {
              companyName: '',
              businessNumber: '',
              companyEmail: '',
              companyPhoneNumber: '',
              companyAddress: '',
              companyAddressDetail: '',
            } as CompanyEntity
          }
          onSave={(updatedInfo) =>
            handleSave('add', updatedInfo as Omit<CompanyEntity, 'companyId'>)
          }
          onClose={() => setAddModal(false)}
          mode="add"
        />
      </Modal>
    </>
  );
};

export default CompanyListContentsWrapper;
