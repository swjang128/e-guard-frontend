import React, { useEffect, useState } from 'react';
import CloseButton from '../../components/Buttons/CloseButton';
import queries from '../../hooks/queries/queries';
import Modal from '../../Modal';
import EditArea from '../Management/EditArea';
import { useQueryClient } from '@tanstack/react-query';
import { patchData, postData } from '../../api';
import ThumbnailItem from '../../components/Thumbnails/ThumbnailItem';
import area_add from '../../images/area/icons8-add-new-50.png';
import { AreaEntity, AreaExtendEntity } from '../../types/AreaEntity';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import moment from 'moment';

// AreaList는 Area 조회에 factoryId가 필요하기 때문에 Prop으로 설정함.
// Area 도면도 등록시 companyId가 추가로 필요해져 Prop에 추가.
interface AreaListContentsWrapperProps {
  companyId: number;
  factoryId: number;
  onClose: () => void;
}

const AreaListContentsWrapper: React.FC<AreaListContentsWrapperProps> = ({
  companyId,
  factoryId,
  onClose,
}) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const queryClient = useQueryClient();
  const { useAreaList } = queries();
  const { data: areaListData, error, isLoading } = useAreaList(factoryId);

  const [areaList, setAreaList] = useState<AreaExtendEntity[]>([]);

  // 추가 modal
  const [addModal, setAddModal] = useState(false);

  // 수정 modal
  const [editModal, setEditModal] = useState(false);
  const [targetArea, setTargetArea] = useState<AreaExtendEntity | null>(null);

  useEffect(() => {
    if (areaListData) {
      setAreaList(
        areaListData.sort((a: AreaEntity, b: AreaEntity) => {
          return moment(a.createdAt).diff(moment(b.createdAt)) > 0
            ? -1
            : moment(a.createdAt).diff(moment(b.createdAt)) < 0
            ? 1
            : 0;
        }) // 생성시간 기준 sort처리
      );
    }
  }, [areaListData]);

  const handleSave = async <T extends 'edit' | 'add'>(
    mode: T,
    updatedInfo: T extends 'edit'
      ? AreaExtendEntity
      : Omit<AreaExtendEntity, 'areaId'>
  ) => {
    if (mode === 'edit') {
      // 타입 가드를 사용하여 updatedInfo를 AreaExtendEntity 타입으로 단언
      const updatedArea = updatedInfo as AreaExtendEntity;

      // 구역 수정
      try {
        await patchData(`/area/${updatedArea.areaId}`, updatedArea);
        // 구역 추가 성공 시 구역 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
        queryClient.invalidateQueries({
          queryKey: ['areaList', loggedInUser?.factoryId],
        });
        setEditModal(false);
        setTargetArea(null);
      } catch (error) {
        console.error('Error while updating area info:', error);
      }
    } else {
      // 타입 가드를 사용하여 updatedInfo를 Omit<AreaExtendEntity, 'areaId'> 타입으로 단언
      const newArea = updatedInfo as Omit<AreaExtendEntity, 'areaId'>;
      // 구역 추가
      try {
        await postData('/area', newArea);
        // 구역 추가 성공 시 구역 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
        queryClient.invalidateQueries({
          queryKey: ['areaList', loggedInUser?.factoryId],
        });
        setAddModal(false);
      } catch (error) {
        console.error('Error while adding area:', error);
      }
    }
  };

  // 이벤트 핸들러 함수
  const onEdit = async (area: AreaExtendEntity) => {
    setTargetArea({
      ...area,
      companyId: companyId,
    });
    setEditModal(true);
    setAddModal(false);
  };

  return (
    <div className="">
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark ">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          구역 설정
        </h3>
      </div>
      <div className="grid-row grid gap-4">
        <div className="w-full">
          <div className="grid h-180 grid-cols-2 gap-2 overflow-auto px-2 py-2 2xl:grid-cols-3">
            <div
              className="grid-row grid cursor-pointer items-center justify-center rounded border border-slate-300 bg-gray shadow-2 hover:opacity-80  md:h-100"
              onClick={() => setAddModal(true)}
            >
              <div className="group relative">
                <img src={area_add} />
                <div className="absolute left-1/2 top-full z-20 mt-3 -translate-x-1/2 whitespace-nowrap rounded border border-primary bg-white px-4.5 py-1.5 text-sm font-medium text-white opacity-0 drop-shadow-2 group-hover:opacity-100 dark:bg-meta-4">
                  <p className="text-primary">추가</p>
                </div>
              </div>
            </div>
            {/* AreaList는 각 Area마다 도면도를 가지는 것에 착안. 썸네일 리스트 형식으로 표시한다. ThumbnailItem 컴포넌트 사용 */}
            {areaList.map((area, index: number) => (
              <ThumbnailItem
                key={index}
                onClick={() => onEdit(area)}
                bgFileUri={`http://193.122.125.229${area.areaPlan2DFilePath}`}
                title={area.areaName}
                subTitle={area.areaLocation}
                useEtcCase={true}
                isEtcCondition={area.areaIncident === 'NORMAL'}
                trueNode={<p className="text-eguard-green">{area.eventName}</p>}
                falseNode={<p className="text-eguard-red">{area.eventName}</p>}
              ></ThumbnailItem>
            ))}
          </div>
        </div>
      </div>
      <div className="grid-row grid gap-4 px-5 py-4">
        <div className="flex flex-wrap justify-end gap-2">
          <CloseButton
            text="닫기"
            size="md"
            additionalClasses="h-10"
            onClick={onClose}
          />
        </div>
      </div>
      <Modal isOpen={editModal} onClose={() => setEditModal(false)}>
        {targetArea && (
          <EditArea
            info={targetArea}
            onSave={(updatedInfo) =>
              handleSave('edit', updatedInfo as AreaExtendEntity)
            }
            onClose={() => setEditModal(false)}
            mode="edit"
          />
        )}
      </Modal>
      <Modal isOpen={addModal} onClose={() => setAddModal(false)}>
        <EditArea
          info={
            {
              companyId: companyId,
              factoryId: factoryId,
              areaId: 0,
              areaName: '',
              areaLocation: '',
              areaUsableSize: 0,
              areaLatitude: 0.000001,
              areaLongitude: 0.000001,
              areaPlan2DFilePath: '',
              areaPlan3DFilePath: '',
            } as AreaExtendEntity
          }
          onSave={(updatedInfo) =>
            handleSave('add', updatedInfo as Omit<AreaExtendEntity, 'areaId'>)
          }
          onClose={() => setAddModal(false)}
          mode="add"
        />
      </Modal>
      <div className="hidden pb-2 pl-2 text-xs">
        <a target="_blank" href="https://icons8.com/icon/37787/add-new">
          Add New Icon
        </a>{' '}
        작가:{' '}
        <a target="_blank" href="https://icons8.com">
          Icons8
        </a>
      </div>
    </div>
  );
};

export default AreaListContentsWrapper;
