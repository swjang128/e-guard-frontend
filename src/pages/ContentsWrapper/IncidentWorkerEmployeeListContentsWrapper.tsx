import React, { useEffect, useState } from 'react';
import queries from '../../hooks/queries/queries';
import DataTable from '../../components/Tables/DataTable';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { CustomDropdownEventsState } from '../../components/Dropdowns/CustomDropdown';
import moment from 'moment';
import { useQueryClient } from '@tanstack/react-query';
import {
  EventEntity,
  EventExtendEntity,
  IncidentWorkerEmployeeEventEntity,
} from '../../types/EventEntity';
import { patchData, postData } from '../../api';
import { showToast, ToastType } from '../../ToastContainer';
import Modal from '../../Modal';
import EditIncidentWorkerEmployee from '../Event/EditIncidentWorkerEmployee';
import ConfirmCancelModal from '../../components/ConfirmCancelModal';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';

const IncidentWorkerEmployeeListContentsWrapper: React.FC = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const queryClient = useQueryClient();
  const { useWorkerEmployeeList, useIncidentWorkerEmployeeEventList } =
    queries();
  const {
    data: workerEmployeeListData,
    error: workerEmployeeListDataError,
    isLoading: workerEmployeeListIsLoading,
  } = useWorkerEmployeeList(1); // 차후 loggedInUser.factoryId
  const {
    data: incidentWorkerEmployeeEventListData,
    error,
    isLoading,
  } = useIncidentWorkerEmployeeEventList(1);

  const [incidentWorkerEmployeeEventList, setIncidentWorkerEmployeeEventList] =
    useState<EventExtendEntity[]>([]);

  // 추가 modal
  const [addModal, setAddModal] = useState(false);

  // 수정 modal
  const [editModal, setEditModal] = useState(false);
  const [
    targetIncidentWorkerEmployeeEvent,
    setTargetIncidentWorkerEmployeeEvent,
  ] = useState<IncidentWorkerEmployeeEventEntity | null>(null);

  // 해결 처리 modal
  const [editResolveModal, setEditResolveModal] = useState(false);

  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (incidentWorkerEmployeeEventListData) {
      setIncidentWorkerEmployeeEventList(
        incidentWorkerEmployeeEventListData
          .map((incidentWorkerEmployeeEvent: EventEntity) => {
            return {
              ...incidentWorkerEmployeeEvent,
              createdAt: moment(incidentWorkerEmployeeEvent.createdAt).format(
                'YYYY-MM-DD HH:mm:ss'
              ),
              eventResolvedMessage: incidentWorkerEmployeeEvent.eventResolved
                ? '해결'
                : '미해결',
            };
          })
          .sort((a: EventEntity, b: EventEntity) => {
            return moment(a.createdAt).diff(moment(b.createdAt)) > 0
              ? -1
              : moment(a.createdAt).diff(moment(b.createdAt)) < 0
              ? 1
              : 0;
          }) // 생성시간 기준 sort처리
      );
    }
  }, [incidentWorkerEmployeeEventListData]);

  const handleSave = async <T extends 'edit' | 'add'>(
    mode: T,
    updatedInfo: T extends 'edit'
      ? IncidentWorkerEmployeeEventEntity
      : Omit<IncidentWorkerEmployeeEventEntity, 'eventId'>
  ) => {
    if (mode === 'edit') {
      // 타입 가드를 사용하여 updatedInfo를 IncidentWorkerEmployeeEventEntity 타입으로 단언
      const updatedIncidentWorkerEmployeeEvent =
        updatedInfo as IncidentWorkerEmployeeEventEntity;

      // 근로자 사고 수정
      try {
        await patchData(
          `/event/${updatedIncidentWorkerEmployeeEvent.eventId}`,
          updatedIncidentWorkerEmployeeEvent
        );
        // 근로자 사고 추가 성공 시 근로자 사고 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
        queryClient.invalidateQueries({
          queryKey: [
            'incidentWorkerEmployeeEventList',
            loggedInUser?.factoryId,
          ],
        });
        setEditModal(false);
        setTargetIncidentWorkerEmployeeEvent(null);
      } catch (error) {
        console.error('Error while updating event info:', error);
      }
    } else {
      // 타입 가드를 사용하여 updatedInfo를 Omit<IncidentWorkerEmployeeEventEntity, 'eventId'> 타입으로 단언
      const newIncidentWorkerEmployeeEvent = updatedInfo as Omit<
        IncidentWorkerEmployeeEventEntity,
        'eventId'
      >;
      // 근로자 사고 추가
      try {
        await postData('/event', newIncidentWorkerEmployeeEvent);
        // 근로자 사고 추가 성공 시 근로자 사고 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
        queryClient.invalidateQueries({
          queryKey: [
            'incidentWorkerEmployeeEventList',
            loggedInUser?.factoryId,
          ],
        });
        setAddModal(false);
      } catch (error) {
        console.error('Error while adding event:', error);
      }
    }
  };

  const handleResolve = async () => {
    const resolveSubmitData = {
      eventId: targetIncidentWorkerEmployeeEvent?.eventId,
      employeeNumber: targetIncidentWorkerEmployeeEvent?.employeeNumber,
      employeeIncident: targetIncidentWorkerEmployeeEvent?.employeeIncident,
      eventResolved: true,
    } as IncidentWorkerEmployeeEventEntity;

    // 근로자 사고 수정 (해결 처리)
    try {
      await patchData(
        `/event/${targetIncidentWorkerEmployeeEvent?.eventId}`,
        resolveSubmitData
      );
      // 근로자 사고 추가 성공 시 근로자 사고 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
      queryClient.invalidateQueries({
        queryKey: ['incidentWorkerEmployeeEventList', loggedInUser?.factoryId],
      });
      setEditResolveModal(false);
      setTargetIncidentWorkerEmployeeEvent(null);
    } catch (error) {
      console.error('Error while updating event info:', error);
    }
  };

  // 이벤트 핸들러 함수
  const onEdit = async (
    incidentWorkerEmployeeEvent: IncidentWorkerEmployeeEventEntity
  ) => {
    setTargetIncidentWorkerEmployeeEvent(incidentWorkerEmployeeEvent);
    setEditModal(true);
    setAddModal(false);
  };

  const onEditResolve = async (
    incidentWorkerEmployeeEvent: IncidentWorkerEmployeeEventEntity
  ) => {
    if (incidentWorkerEmployeeEvent.eventResolved) {
      showToast({ message: '이미 해결된 사건입니다.', type: ToastType.ERROR });
    } else {
      setTargetIncidentWorkerEmployeeEvent(incidentWorkerEmployeeEvent);
      setEditResolveModal(true);
    }
  };

  // List별 dropdown 커스텀이 필요할 경우
  const [customDropdownEvents, setCustomDropdownEvents] = useState<
    CustomDropdownEventsState[]
  >([
    {
      func: onEdit,
      text: '수정',
    },
    {
      func: onEditResolve,
      text: '해결 처리',
    },
  ]);

  // 검색어 필터링
  let filteredincidentWorkerEmployeeEventList = incidentWorkerEmployeeEventList;

  if (incidentWorkerEmployeeEventList) {
    filteredincidentWorkerEmployeeEventList =
      incidentWorkerEmployeeEventList.filter(
        (incidentWorkerEmployeeEvent) =>
          incidentWorkerEmployeeEvent.employeeNumber.includes(
            searchTerm.toLowerCase()
          ) ||
          incidentWorkerEmployeeEvent.incidentPriority.includes(
            searchTerm.toLowerCase()
          ) ||
          incidentWorkerEmployeeEvent.incidentName.includes(
            searchTerm.toLowerCase()
          ) ||
          incidentWorkerEmployeeEvent.createdAt.includes(
            searchTerm.toLowerCase()
          )
      );
  }

  return (
    <>
      <DataTable<EventExtendEntity>
        title={'근로자 사건 목록'}
        data={filteredincidentWorkerEmployeeEventList}
        columns={[
          { Header: '발생일시', accessor: 'createdAt' },
          { Header: '근로자', accessor: 'employeeNumber' },
          { Header: '위험도', accessor: 'incidentPriority' },
          { Header: '사건명', accessor: 'incidentName' },
          { Header: '해결여부', accessor: 'eventResolvedMessage' },
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
        {targetIncidentWorkerEmployeeEvent && (
          <EditIncidentWorkerEmployee
            info={
              {
                eventId: targetIncidentWorkerEmployeeEvent.eventId,
                employeeId: targetIncidentWorkerEmployeeEvent.employeeId,
                employeeNumber:
                  targetIncidentWorkerEmployeeEvent.employeeNumber,
                employeeIncident:
                  targetIncidentWorkerEmployeeEvent.employeeIncident,
                eventResolved: targetIncidentWorkerEmployeeEvent.eventResolved,
              } as IncidentWorkerEmployeeEventEntity
            }
            onSave={(updatedInfo) =>
              handleSave(
                'edit',
                updatedInfo as IncidentWorkerEmployeeEventEntity
              )
            }
            onClose={() => setEditModal(false)}
            mode="edit"
          />
        )}
      </Modal>

      <Modal isOpen={addModal} onClose={() => setAddModal(false)}>
        {workerEmployeeListData && (
          <EditIncidentWorkerEmployee
            info={
              {
                eventId: 0,
                employeeId: workerEmployeeListData[0].employeeId,
                employeeNumber: workerEmployeeListData[0].employeeNumber,
                employeeIncident: 'INJURY',
                eventResolved: false,
              } as IncidentWorkerEmployeeEventEntity
            }
            onSave={(updatedInfo) =>
              handleSave(
                'add',
                updatedInfo as Omit<
                  IncidentWorkerEmployeeEventEntity,
                  'eventId'
                >
              )
            }
            onClose={() => setAddModal(false)}
            mode="add"
          />
        )}
      </Modal>
      {targetIncidentWorkerEmployeeEvent && (
        <ConfirmCancelModal
          isOpen={editResolveModal}
          onClose={() => setEditResolveModal(false)}
          onConfirm={handleResolve}
          title="사건 해결 처리"
          message={`선택된 사건을 해결 처리 하시겠습니까?`}
        />
      )}
    </>
  );
};

export default IncidentWorkerEmployeeListContentsWrapper;
