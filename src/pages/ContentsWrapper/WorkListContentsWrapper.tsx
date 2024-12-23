import DataTable from '../../components/Tables/DataTable';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { useEffect, useState } from 'react';
import queries from '../../hooks/queries/queries';
import { WorkEntity, WorkExtendEntity } from '../../types/WorkEntity';
import Modal from '../../Modal';
import EditWork from '../Management/EditWork';
import { patchData, postData } from '../../api';
import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { CustomDropdownEventsState } from '../../components/Dropdowns/CustomDropdown';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';

const WorkListContentsWrapper: React.FC = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const queryClient = useQueryClient();
  const { useAreaList, useWorkList } = queries();
  const {
    data: areaListData,
    error: areaListDataError,
    isLoading: areaListIsLoading,
  } = useAreaList(loggedInUser?.factoryId || 0);
  const {
    data: workListData,
    error: workListError,
    isLoading: workListIsLoading,
  } = useWorkList(loggedInUser?.factoryId);

  const [workList, setWorkList] = useState<WorkExtendEntity[]>([]); // workEntity를 확장하여 근로자수를 추가

  // 추가 modal
  const [addModal, setAddModal] = useState(false);

  // 수정 modal
  const [editModal, setEditModal] = useState(false);
  const [targetWork, setTargetWork] = useState<WorkEntity | null>(null);

  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (workListData) {
      setWorkList(
        workListData
          .map((work: WorkEntity) => {
            return {
              ...work,
              employeesCount: work.employees.length,
            };
          })
          .sort((a: WorkEntity, b: WorkEntity) => {
            return moment(a.createdAt).diff(moment(b.createdAt)) > 0
              ? -1
              : moment(a.createdAt).diff(moment(b.createdAt)) < 0
              ? 1
              : 0;
          }) // 생성시간 기준 sort처리
      );
    }
  }, [workListData]);

  const handleSave = async <T extends 'edit' | 'add'>(
    mode: T,
    updatedInfo: T extends 'edit' ? WorkEntity : Omit<WorkEntity, 'workId'>
  ) => {
    if (mode === 'edit') {
      // 타입 가드를 사용하여 updatedInfo를 WorkEntity 타입으로 단언
      const updatedWork = updatedInfo as WorkEntity;

      // 작업 수정
      try {
        await patchData(`/work/${updatedWork.workId}`, updatedWork);
        // 작업 추가 성공 시 작업 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
        queryClient.invalidateQueries({
          queryKey: ['workList', loggedInUser?.factoryId],
        });
        queryClient.invalidateQueries({
          queryKey: ['workerEmployeeList', loggedInUser?.factoryId],
        });
        setEditModal(false);
        setTargetWork(null);
      } catch (error) {
        console.error('Error while updating factory info:', error);
      }
    } else {
      // 타입 가드를 사용하여 updatedInfo를 Omit<WorkEntity, 'workId'> 타입으로 단언
      const newWork = updatedInfo as Omit<WorkEntity, 'workId'>;
      // 작업 추가
      try {
        await postData('/work', newWork);
        // 작업 추가 성공 시 작업 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
        queryClient.invalidateQueries({
          queryKey: ['workList', loggedInUser?.factoryId],
        });
        queryClient.invalidateQueries({
          queryKey: ['workerEmployeeList', loggedInUser?.factoryId],
        });
        setAddModal(false);
      } catch (error) {
        console.error('Error while adding member:', error);
      }
    }
  };

  // 이벤트 핸들러 함수
  const onEdit = async (work: WorkEntity) => {
    setTargetWork(work);
    setEditModal(true);
    setAddModal(false);
  };

  const onDelete = (work: WorkEntity) => {};

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
  let filteredWorkList = workList;

  if (workList) {
    filteredWorkList = workList.filter(
      (work) =>
        work.areaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.workName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.workStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.employeesCount.toString().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <>
      <DataTable<WorkExtendEntity>
        title={'작업 목록'}
        data={filteredWorkList}
        columns={[
          { Header: '구역명', accessor: 'areaName' },
          { Header: '작업명', accessor: 'workName' },
          { Header: '상태', accessor: 'workStatus' },
          { Header: '할당된 근로자수', accessor: 'employeesCount' },
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
        {targetWork && (
          <EditWork
            info={targetWork}
            onSave={(updatedInfo) =>
              handleSave('edit', updatedInfo as WorkEntity)
            }
            onClose={() => setEditModal(false)}
            mode="edit"
          />
        )}
      </Modal>
      <Modal isOpen={addModal} onClose={() => setAddModal(false)}>
        {areaListData && (
          <EditWork
            info={
              {
                areaId: areaListData[0].areaId || 0,
                areaIncident: areaListData[0].areaIncident || '',
                areaName: areaListData[0].areaName || '',
                workId: 0,
                workName: '',
                workStatus: 'PENDING',
                employees: [],
                createdAt: '',
                updatedAt: '',
              } as WorkEntity
            }
            onSave={(updatedInfo) =>
              handleSave('add', updatedInfo as Omit<WorkEntity, 'workId'>)
            }
            onClose={() => setAddModal(false)}
            mode="add"
          />
        )}
      </Modal>
    </>
  );
};

export default WorkListContentsWrapper;
