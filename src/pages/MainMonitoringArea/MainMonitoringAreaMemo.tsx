import { useEffect, useState } from 'react';
import { patchData } from '../../api';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { useQueryClient } from '@tanstack/react-query';
import { AreaEntity } from '../../types/AreaEntity';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';

interface MainMonitoringAreaMemoProps {
  selectedArea: AreaEntity;
}

const MainMonitoringAreaMemo: React.FC<MainMonitoringAreaMemoProps> = ({
  selectedArea,
}) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const queryClient = useQueryClient();
  const [updatedMemo, setUpdatedMemo] = useState<string>('');

  useEffect(() => {
    setUpdatedMemo(selectedArea.areaMemo);
  }, [selectedArea]);

  const onChangeMemo = (e: any) => {
    setUpdatedMemo(e.target.value);
  };

  const saveMemo = async () => {
    const updatedObject = {
      memo: updatedMemo,
    };
    await patchData(`/area/${selectedArea.areaId}`, updatedObject);
    queryClient.invalidateQueries({
      queryKey: ['areaList', loggedInUser?.factoryId],
    });
  };

  return (
    <div className="hidden w-full rounded border border-stroke px-4 py-2 shadow-1 xl:block">
      <h4 className="text-lg font-semibold text-black dark:text-white">메모</h4>
      <div className="grid-row grid gap-1 py-2">
        <div className="grid-row grid gap-1 bg-gray-2 px-2 py-2">
          <div className="flex gap-2">
            <textarea
              id="areaMemo"
              placeholder="메모를 입력하세요."
              cols={10}
              rows={5}
              className="w-full p-2 text-black"
              value={updatedMemo || selectedArea.areaMemo || ''}
              onChange={(e) => onChangeMemo(e)}
            ></textarea>
            <PrimaryButton
              text="저장"
              size="sm"
              additionalClasses="text-sm h-6 w-15"
              outline={false}
              onClick={() => saveMemo()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMonitoringAreaMemo;
