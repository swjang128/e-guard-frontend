import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { t } from 'i18next';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import CloseButton from '../../components/Buttons/CloseButton';
import {
  EventEntityValidationRules,
  IncidentAreaEventEntity,
} from '../../types/EventEntity';
import queries from '../../hooks/queries/queries';
import { AreaEntity } from '../../types/AreaEntity';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';

interface EditIncidentAreaProps {
  info: IncidentAreaEventEntity;
  onSave: (
    updatedInfo:
      | IncidentAreaEventEntity
      | Omit<IncidentAreaEventEntity, 'eventId'>
  ) => void; // 'eventId' 필드 제외 가능
  onClose: () => void;
  mode: 'add' | 'edit';
}

// FormValues는 AreaExtendEntity의 일부 속성들만을 사용
interface FormValues
  extends Pick<
    IncidentAreaEventEntity,
    'eventId' | 'areaId' | 'areaIncident' | 'eventResolved'
  > {}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const EditIncidentArea: React.FC<EditIncidentAreaProps> = ({
  info,
  onSave,
  onClose,
  mode,
}) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const { useAreaList } = queries();
  const {
    data: areaListData,
    error: areaListDataError,
    isLoading: areaListIsLoading,
  } = useAreaList(loggedInUser?.factoryId || 0);

  const [areaList, setAreaList] = useState<AreaEntity[]>([]);
  const [selectedArea, setSelectedArea] = useState<AreaEntity>();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      eventId: info.eventId,
      areaId: info.areaId,
      areaIncident: info.areaIncident,
      eventResolved: info.eventResolved,
    },
  });

  useEffect(() => {
    if (areaListData) {
      setAreaList(areaListData);
      setSelectedArea(
        selectedArea || mode === 'add'
          ? areaListData[0]
          : areaListData.find((area: AreaEntity) => area.areaId === info.areaId)
      );
    }
  }, [areaListData]);

  // 선택 구역 변경
  const changeArea = (area: AreaEntity) => {
    setSelectedArea(area);
    setValue('areaId', area.areaId);
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: any) => {
    onSave(data);
    onClose();
  };

  return (
    <div className="">
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark ">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {mode === 'add'
            ? '구역 사건 정보 추가'
            : `${info.areaName} 사건 정보 수정`}
        </h3>
      </div>
      <div className="grid-row grid gap-4 px-5 py-4">
        <form onSubmit={handleSubmit(onSubmit)} className="grid-row grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                구역명
              </label>
              <Controller
                name="areaId"
                control={control}
                rules={EventEntityValidationRules.areaId}
                render={({ field }) => (
                  <select
                    {...field}
                    id="areaId"
                    className={`max-h-12 w-full rounded border border-stroke bg-transparent px-5 py-3 outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
                    ${
                      errors.areaId
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                    onChange={(e) => {
                      const targetAreaId = Number(e.target.value);
                      const targetSelectedArea = areaList.find(
                        (area) => area.areaId === targetAreaId
                      );
                      targetSelectedArea && changeArea(targetSelectedArea);
                    }}
                  >
                    <option value="" disabled={true} className="text-slate-400">
                      사건이 발생한 구역을 선택합니다.
                    </option>
                    {areaList &&
                      areaList.map((area, index: number) => (
                        <option
                          key={index}
                          value={area.areaId}
                          selected={
                            selectedArea && selectedArea.areaId === area.areaId
                          }
                        >
                          {area.areaName}
                        </option>
                      ))}
                  </select>
                )}
              />
            </div>

            <div className="w-full">
              <label className="mb-2 block font-semibold text-black dark:text-white">
                사건 유형
              </label>
              <Controller
                name="areaIncident"
                control={control}
                rules={EventEntityValidationRules.areaIncident}
                render={({ field }) => (
                  <select
                    {...field}
                    id="areaIncident"
                    className={`max-h-12 w-full rounded border border-stroke bg-transparent px-5 py-3 outline-none transition disabled:cursor-default disabled:border-stroke disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary
                    ${
                      errors.areaIncident
                        ? 'border-eguard-red focus:border-eguard-red active:border-eguard-red'
                        : 'border-stroke focus:border-primary active:border-primary'
                    }`}
                  >
                    <option value="" disabled={true} className="text-slate-400">
                      사건 유형을 선택합니다.
                    </option>
                    <option value="GAS_LEAK">가스 누출</option>
                    <option value="FIRE">화재</option>
                    <option value="ELECTRICAL_HAZARD">전기 위험</option>
                    <option value="FLOOD">침수</option>
                    <option value="EVACUATION">대피</option>
                    <option value="EQUIPMENT_FAILURE">장비 고장</option>
                    <option value="STRUCTURAL_DAMAGE">구조물 손상</option>
                    <option value="AIR_QUALITY_ISSUE">공기 질 문제</option>
                    <option value="MINOR_EQUIPMENT_ISSUE">
                      경미한 장비 이상
                    </option>
                    <option value="MINOR_WORKSPACE_INTRUSION">
                      경미한 작업 공간 침해
                    </option>
                    <option value="MINOR_ENERGY_CONSUMPTION_ISSUE">
                      경미한 에너지 소비 문제
                    </option>
                    <option value="NOISE_ISSUE">소음 문제</option>
                    <option value="MINOR_ENVIRONMENTAL_ISSUE">
                      경미한 환경 문제
                    </option>
                  </select>
                )}
              />
              {errors.areaIncident && (
                <Error message={t(`${errors.areaIncident.message}`)} />
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <PrimaryButton
              text="저장"
              size="md"
              outline={false}
              additionalClasses="h-10"
            />
            <CloseButton
              text="닫기"
              size="md"
              additionalClasses="h-10"
              onClick={onClose}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIncidentArea;
