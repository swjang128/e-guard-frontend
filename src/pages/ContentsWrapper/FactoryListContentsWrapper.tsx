import DataTable from '../../components/Tables/DataTable';
import { useQueryClient } from '@tanstack/react-query';
import queries from '../../hooks/queries/queries';
import { FactoryEntity, FactoryExtendEntity } from '../../types/FactoryEntity';
import { useEffect, useState } from 'react';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import Modal from '../../Modal';
import EditFactory from '../Management/EditFactory';
import { patchData, postData } from '../../api';
import { CustomDropdownEventsState } from '../../components/Dropdowns/CustomDropdown';
import AreaListContentsWrapper from './AreaListContentsWrapper';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import moment from 'moment';

const FactoryListContentsWrapper: React.FC = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const queryClient = useQueryClient();
  const { useFactoryList } = queries();
  const {
    data: factoryListData,
    error: factoryListError,
    isLoading: factoryListIsLoading,
  } = useFactoryList(loggedInUser?.companyId || 0);
  const [factoryList, setFactoryList] = useState<FactoryExtendEntity[]>([]); // FactoryEntity를 확장하여 address + addressDetail을 합쳐 fullAddress로 추가

  // 추가 modal
  const [addModal, setAddModal] = useState(false);

  // 수정 modal
  const [editModal, setEditModal] = useState(false);
  const [targetFactory, setTargetFactory] = useState<FactoryEntity | null>(
    null
  );

  // 수정 modal (구역 설정)
  const [areaListModal, setAreaListModal] = useState(false);

  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (factoryListData) {
      setFactoryList(
        factoryListData
          .map((factory: FactoryEntity) => {
            return {
              ...factory,
              factoryFullAddress:
                factory.factoryAddress + ' ' + factory.factoryAddressDetail,
            } as FactoryExtendEntity;
          })
          .sort((a: FactoryEntity, b: FactoryEntity) => {
            return moment(a.createdAt).diff(moment(b.createdAt)) > 0
              ? -1
              : moment(a.createdAt).diff(moment(b.createdAt)) < 0
              ? 1
              : 0;
          }) // 생성시간 기준 sort처리
      );
    }
  }, [factoryListData]);

  const handleSave = async <T extends 'edit' | 'add'>(
    mode: T,
    updatedInfo: T extends 'edit'
      ? FactoryEntity
      : Omit<FactoryEntity, 'factoryId'>
  ) => {
    if (mode === 'edit') {
      // 타입 가드를 사용하여 updatedInfo를 FactoryEntity 타입으로 단언
      const updatedFactory = updatedInfo as FactoryEntity;

      // 공장 수정
      try {
        await patchData(`/factory/${updatedFactory.factoryId}`, updatedFactory);
        // 공장 추가 성공 시 공장 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
        queryClient.invalidateQueries({
          queryKey: ['factoryList', loggedInUser?.companyId],
        });
        setEditModal(false);
        setTargetFactory(null);
      } catch (error) {
        console.error('Error while updating factory info:', error);
      }
    } else {
      // 타입 가드를 사용하여 updatedInfo를 Omit<FactoryEntity, 'factoryId'> 타입으로 단언
      const newFactory = updatedInfo as Omit<FactoryEntity, 'factoryId'>;
      // 공장 추가
      try {
        await postData('/factory', newFactory);
        // 공장 추가 성공 시 공장 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
        queryClient.invalidateQueries({
          queryKey: ['factoryList', loggedInUser?.companyId],
        });
        setAddModal(false);
      } catch (error) {
        console.error('Error while adding factory:', error);
      }
    }
  };

  // 이벤트 핸들러 함수
  const onEdit = async (factory: FactoryEntity) => {
    setTargetFactory(factory);
    setEditModal(true);
    setAddModal(false);
  };

  const onShowAreaList = (factory: FactoryEntity) => {
    setTargetFactory(factory);
    setAreaListModal(true);
  };

  const onDelete = (factory: FactoryEntity) => {};

  // List별 dropdown 커스텀이 필요할 경우
  const [customDropdownEvents, setCustomDropdownEvents] = useState<
    CustomDropdownEventsState[]
  >([
    {
      func: onEdit,
      text: '수정',
    },
    {
      func: onShowAreaList,
      text: '구역 설정',
    },
  ]);

  // 검색어 필터링
  let filteredFactoryList = factoryList;

  if (factoryList) {
    filteredFactoryList = factoryList.filter(
      (factory) =>
        factory.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        factory.factoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        factory.factoryTotalSize
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        factory.factoryFullAddress
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }

  return (
    <>
      <DataTable<FactoryExtendEntity>
        title={'공장 목록'}
        data={filteredFactoryList}
        columns={[
          { Header: '업체명', accessor: 'companyName' },
          { Header: '공장명', accessor: 'factoryName' },
          { Header: '전체 면적 (㎡)', accessor: 'factoryTotalSize' },
          { Header: '전체 주소', accessor: 'factoryFullAddress' },
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
        {targetFactory && (
          <EditFactory
            info={targetFactory}
            onSave={(updatedInfo) =>
              handleSave('edit', updatedInfo as FactoryEntity)
            }
            onClose={() => setEditModal(false)}
            mode="edit"
          />
        )}
      </Modal>

      <Modal isOpen={addModal} onClose={() => setAddModal(false)}>
        <EditFactory
          info={
            {
              companyId: loggedInUser?.companyId,
              companyName: loggedInUser?.companyName,
              companyAddress: loggedInUser?.companyAddress,
              factoryId: 0,
              factoryName: '',
              factoryIndustryType: 'MANUFACTURING',
              factoryTotalSize: 0,
              factoryStructureSize: 0,
              factoryAddress: '',
              factoryAddressDetail: '',
            } as FactoryEntity
          }
          onSave={(updatedInfo) =>
            handleSave('add', updatedInfo as Omit<FactoryEntity, 'factoryId'>)
          }
          onClose={() => setAddModal(false)}
          mode="add"
        />
      </Modal>

      <Modal isOpen={areaListModal} onClose={() => setAreaListModal(false)}>
        {targetFactory && (
          <AreaListContentsWrapper
            companyId={targetFactory.companyId}
            factoryId={targetFactory.factoryId}
            onClose={() => setAreaListModal(false)}
          />
        )}
      </Modal>
    </>
  );
};

export default FactoryListContentsWrapper;
