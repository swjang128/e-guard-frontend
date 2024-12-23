import React, { useEffect, useState } from 'react';
import queries from '../../hooks/queries/queries';
import DataTable from '../../components/Tables/DataTable';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { CustomDropdownEventsState } from '../../components/Dropdowns/CustomDropdown';
import moment from 'moment';
import {
  EventEntity,
  EventExtendEntity,
  IncidentAreaEventEntity,
} from '../../types/EventEntity';
import Modal from '../../Modal';
import EditIncidentArea from '../Event/EditIncidentArea';
import { useQueryClient } from '@tanstack/react-query';
import { patchData, postData } from '../../api';
import ConfirmCancelModal from '../../components/ConfirmCancelModal';
import { showToast, ToastType } from '../../ToastContainer';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';

const IncidentAreaListContentsWrapper: React.FC = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const queryClient = useQueryClient();
  const { useAreaList, useIncidentAreaEventList } = queries();
  const {
    data: areaListData,
    error: areaListDataError,
    isLoading: areaListIsLoading,
  } = useAreaList(loggedInUser?.factoryId || 0);
  const {
    data: incidentAreaEventListData,
    error,
    isLoading,
  } = useIncidentAreaEventList(1);

  const [incidentAreaEventList, setIncidentAreaEventList] = useState<
    EventExtendEntity[]
  >([]);

  // 추가 modal
  const [addModal, setAddModal] = useState(false);

  // 수정 modal
  const [editModal, setEditModal] = useState(false);
  const [targetIncidentAreaEvent, setTargetIncidentAreaEvent] =
    useState<IncidentAreaEventEntity | null>(null);

  // 해결 처리 modal
  const [editResolveModal, setEditResolveModal] = useState(false);

  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (incidentAreaEventListData) {
      setIncidentAreaEventList(
        incidentAreaEventListData
          .map((incidentAreaEvent: EventEntity) => {
            return {
              ...incidentAreaEvent,
              createdAt: moment(incidentAreaEvent.createdAt).format(
                'YYYY-MM-DD HH:mm:ss'
              ),
              eventResolvedMessage: incidentAreaEvent.eventResolved
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
  }, [incidentAreaEventListData]);

  const handleSave = async <T extends 'edit' | 'add'>(
    mode: T,
    updatedInfo: T extends 'edit'
      ? IncidentAreaEventEntity
      : Omit<IncidentAreaEventEntity, 'eventId'>
  ) => {
    if (mode === 'edit') {
      // 타입 가드를 사용하여 updatedInfo를 IncidentAreaEventEntity 타입으로 단언
      const updatedIncidentAreaEvent = updatedInfo as IncidentAreaEventEntity;

      // 구역 사고 수정
      try {
        await patchData(
          `/event/${updatedIncidentAreaEvent.eventId}`,
          updatedIncidentAreaEvent
        );
        // 구역 사고 추가 성공 시 구역 사고 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
        queryClient.invalidateQueries({
          queryKey: ['incidentAreaEventList', loggedInUser?.factoryId],
        });
        setEditModal(false);
        setTargetIncidentAreaEvent(null);
      } catch (error) {
        console.error('Error while updating event info:', error);
      }
    } else {
      // 타입 가드를 사용하여 updatedInfo를 Omit<IncidentAreaEventEntity, 'eventId'> 타입으로 단언
      const newIncidentAreaEvent = updatedInfo as Omit<
        IncidentAreaEventEntity,
        'eventId'
      >;
      // 구역 사고 추가
      try {
        await postData('/event', newIncidentAreaEvent);
        // 구역 사고 추가 성공 시 구역 사고 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
        queryClient.invalidateQueries({
          queryKey: ['incidentAreaEventList', loggedInUser?.factoryId],
        });
        setAddModal(false);
      } catch (error) {
        console.error('Error while adding event:', error);
      }
    }
  };

  const handleResolve = async () => {
    const resolveSubmitData = {
      eventId: targetIncidentAreaEvent?.eventId,
      areaId: targetIncidentAreaEvent?.areaId,
      areaIncident: targetIncidentAreaEvent?.areaIncident,
      eventResolved: true,
    } as IncidentAreaEventEntity;

    // 구역 사고 수정 (해결 처리)
    try {
      await patchData(
        `/event/${targetIncidentAreaEvent?.eventId}`,
        resolveSubmitData
      );
      // 구역 사고 추가 성공 시 구역 사고 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
      queryClient.invalidateQueries({
        queryKey: ['incidentAreaEventList', loggedInUser?.factoryId],
      });
      setEditResolveModal(false);
      setTargetIncidentAreaEvent(null);
    } catch (error) {
      console.error('Error while updating event info:', error);
    }
  };

  // 이벤트 핸들러 함수
  const onEdit = async (incidentAreaEvent: IncidentAreaEventEntity) => {
    setTargetIncidentAreaEvent(incidentAreaEvent);
    setEditModal(true);
    setAddModal(false);
  };

  const onEditResolve = async (incidentAreaEvent: IncidentAreaEventEntity) => {
    if (incidentAreaEvent.eventResolved) {
      showToast({ message: '이미 해결된 사건입니다.', type: ToastType.ERROR });
    } else {
      setTargetIncidentAreaEvent(incidentAreaEvent);
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
  let filteredIncidentAreaEventList = incidentAreaEventList;

  if (incidentAreaEventList) {
    filteredIncidentAreaEventList = incidentAreaEventList.filter(
      (incidentAreaEvent) =>
        incidentAreaEvent.areaName.includes(searchTerm.toLowerCase()) ||
        incidentAreaEvent.incidentPriority.includes(searchTerm.toLowerCase()) ||
        incidentAreaEvent.incidentName.includes(searchTerm.toLowerCase()) ||
        incidentAreaEvent.createdAt.includes(searchTerm.toLowerCase()) ||
        incidentAreaEvent.eventResolvedMessage
          .toString()
          .includes(searchTerm.toLowerCase())
    );
  }

  return (
    <>
      <DataTable<EventExtendEntity>
        title={'구역 사건 목록'}
        data={filteredIncidentAreaEventList}
        columns={[
          { Header: '발생일시', accessor: 'createdAt' },
          { Header: '구역명', accessor: 'areaName' },
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
        {targetIncidentAreaEvent && (
          <EditIncidentArea
            info={
              {
                eventId: targetIncidentAreaEvent.eventId,
                areaId: targetIncidentAreaEvent.areaId,
                areaName: targetIncidentAreaEvent.areaName,
                areaIncident: targetIncidentAreaEvent.areaIncident,
                eventResolved: targetIncidentAreaEvent.eventResolved,
              } as IncidentAreaEventEntity
            }
            onSave={(updatedInfo) =>
              handleSave('edit', updatedInfo as IncidentAreaEventEntity)
            }
            onClose={() => setEditModal(false)}
            mode="edit"
          />
        )}
      </Modal>

      <Modal isOpen={addModal} onClose={() => setAddModal(false)}>
        {areaListData && (
          <EditIncidentArea
            info={
              {
                eventId: 0,
                areaId: areaListData[0].areaId,
                areaName: areaListData[0].areaName,
                areaIncident: 'GAS_LEAK',
                eventResolved: false,
              } as IncidentAreaEventEntity
            }
            onSave={(updatedInfo) =>
              handleSave(
                'add',
                updatedInfo as Omit<IncidentAreaEventEntity, 'eventId'>
              )
            }
            onClose={() => setAddModal(false)}
            mode="add"
          />
        )}
      </Modal>
      {targetIncidentAreaEvent && (
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

export default IncidentAreaListContentsWrapper;
