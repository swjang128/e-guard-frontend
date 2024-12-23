import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { useQueryClient } from '@tanstack/react-query';
import queries from '../../hooks/queries/queries';
import { useEffect, useState } from 'react';
import { patchData, postData } from '../../api';
import { CustomDropdownEventsState } from '../../components/Dropdowns/CustomDropdown';
import DataTable from '../../components/Tables/DataTable';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import moment from 'moment';
import Modal from '../../Modal';
import EditSetting from '../Management/EditSetting';
import {
  SettingAddEntity,
  SettingAddSchema,
  SettingEditEntity,
  SettingListEntity,
} from '../../types/SettingEntity';

const SettingListContentsWrapper: React.FC = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const queryClient = useQueryClient();

  const { useSettingList } = queries();
  const {
    data: settingListData,
    error: settingListDataError,
    isLoading: settingListIsLoading,
  } = useSettingList();

  const [settingList, setSettingList] = useState<SettingListEntity[]>([]);

  // 추가 modal
  const [addModal, setAddModal] = useState(false);

  // 수정 modal
  const [editModal, setEditModal] = useState(false);
  const [target, setTarget] = useState<null | SettingEditEntity>(null);

  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (settingListData) {
      setSettingList(
        settingListData
          .map((setting: SettingListEntity) => {
            return {
              ...setting,
              twoFactorAuthenticationEnabledText:
                setting.twoFactorAuthenticationEnabled ? '사용' : '미 사용',
            };
          })
          .sort((a: SettingListEntity, b: SettingListEntity) => {
            return moment(a.createdAt).diff(moment(b.createdAt)) > 0
              ? -1
              : moment(a.createdAt).diff(moment(b.createdAt)) < 0
              ? 1
              : 0;
          }) // 생성시간 기준 sort처리
      );
    }
  }, [settingListData]);

  // hanleSave 개선
  const handleSave = async (
    mode: 'add' | 'edit',
    updatedInfo: SettingEditEntity | SettingAddEntity
  ) => {
    if (mode === 'edit') {
      const updatedSetting = updatedInfo as SettingEditEntity;
      try {
        await patchData(`/setting/${updatedSetting.settingId}`, updatedSetting);
        setEditModal(false);
        setTarget(null);
      } catch (error) {
        console.error('Error while updating setting info:', error);
      }
    } else if (mode === 'add') {
      const newSetting = updatedInfo as SettingAddEntity;
      try {
        await postData('/setting', newSetting);
        setAddModal(false);
      } catch (error) {
        console.error('Error while adding setting:', error);
      }
    }
    queryClient.invalidateQueries({
      queryKey: ['settingList'],
    });
  };

  // 이벤트 핸들러 함수
  const onEdit = async (target: SettingEditEntity) => {
    setTarget(target);
    setEditModal(true);
    setAddModal(false);
  };

  const onDelete = (target: SettingEditEntity) => {};

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
  let filteredSettingList = settingList;

  if (settingList) {
    filteredSettingList = settingList.filter(
      (setting) =>
        setting.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        setting.maxFactoriesPerCompany
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        setting.maxAreasPerFactory
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        setting.maxEmployeesPerFactory
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        setting.twoFactorAuthenticationEnabledText
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }

  return (
    <>
      <DataTable<SettingListEntity>
        title={'설정 목록'}
        data={filteredSettingList}
        columns={[
          { Header: '업체명', accessor: 'companyName' },
          { Header: '최대 공장수', accessor: 'maxFactoriesPerCompany' },
          { Header: '최대 구역수', accessor: 'maxAreasPerFactory' },
          { Header: '최대 근로자수', accessor: 'maxEmployeesPerFactory' },
          {
            Header: '2차인증 사용여부',
            accessor: 'twoFactorAuthenticationEnabledText',
          },
        ]}
        // onEdit={onEdit}
        // onPwReset={onPwReset}
        // onDelete={onDelete}
        enableActions={true}
        useCustomDropdownEvents={true}
        customDropdownEvents={customDropdownEvents}
        // additionalButtonArea={
        //   <PrimaryButton
        //     text="추가"
        //     size="md"
        //     additionalClasses="h-10"
        //     onClick={() => setAddModal(true)}
        //   />
        // }
      />
      <Modal isOpen={editModal} onClose={() => setEditModal(false)}>
        {target && (
          <EditSetting
            info={target}
            onSave={(updatedInfo) =>
              handleSave('edit', updatedInfo as SettingEditEntity)
            }
            onClose={() => setEditModal(false)}
            mode="edit"
          />
        )}
      </Modal>
      <Modal isOpen={addModal} onClose={() => setAddModal(false)}>
        <EditSetting
          info={SettingAddSchema.parse({})} // zod를 사용한 기본값으로 초기화 객체
          onSave={(updatedInfo) =>
            handleSave('add', updatedInfo as SettingAddEntity)
          }
          onClose={() => setAddModal(false)}
          mode="add"
        />
      </Modal>
    </>
  );
};
export default SettingListContentsWrapper;
