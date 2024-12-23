import { useEffect, useState } from 'react';
import DataTable from '../../components/Tables/DataTable';
import { EmployeeEntity } from '../../types/EmployeeEntity';
import { CustomDropdownEventsState } from '../../components/Dropdowns/CustomDropdown';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { useQueryClient } from '@tanstack/react-query';
import queries from '../../hooks/queries/queries';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { useRecoilValue } from 'recoil';
import Modal from '../../Modal';
import moment from 'moment';
import EditEmployee from '../Management/EditEmployee';
import { patchData, postData } from '../../api';

const EmployeeListContentsWrapper = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const [employeeList, setEmployeeList] = useState<EmployeeEntity[]>([]); // 필요시 extend로 확장
  const queryClient = useQueryClient();
  const { useEmployeeList } = queries();
  const {
    data: employeeListData,
    error: employeeListDataError,
    isLoading: employeeListIsLoading,
  } = useEmployeeList(loggedInUser?.factoryId || 0);

  useEffect(() => {
    if (employeeListData) {
      setEmployeeList(
        employeeListData
          .map((employee: EmployeeEntity) => {
            return {
              ...employee,
            };
          })
          .sort((a: EmployeeEntity, b: EmployeeEntity) => {
            return moment(a.createdAt).diff(moment(b.createdAt)) > 0
              ? -1
              : moment(a.createdAt).diff(moment(b.createdAt)) < 0
              ? 1
              : 0;
          }) // 생성시간 기준 sort처리
      );
    }
  }, [employeeListData]);

  // 추가 modal
  const [addModal, setAddModal] = useState(false);

  // 수정 modal
  const [editModal, setEditModal] = useState(false);
  const [targetEmployee, setTargetEmployee] = useState<EmployeeEntity | null>(
    null
  );

  const handleSave = async <T extends 'edit' | 'add'>(
    mode: T,
    updatedInfo: T extends 'edit' ? EmployeeEntity : EmployeeEntity
  ) => {
    if (mode === 'edit') {
      // 타입 가드를 사용하여 updatedInfo를 EmployeeEntity 타입으로 단언
      const updatedEmployee = updatedInfo as EmployeeEntity;

      // 근로자 수정
      try {
        await patchData(
          `/employee/${updatedEmployee.employeeId}`,
          updatedEmployee
        );
        // 작업 추가 성공 시 작업 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
        queryClient.invalidateQueries({
          queryKey: ['employeeList', loggedInUser?.factoryId],
        });
        setEditModal(false);
        setTargetEmployee(null);
      } catch (error) {
        console.error('Error while updating factory info:', error);
      }
    } else {
      const newEmployee = updatedInfo as EmployeeEntity;
      console.log(newEmployee);

      // 작업 추가
      try {
        await postData('/employee', newEmployee);
        // 작업 추가 성공 시 작업 리스트 쿼리를 무효화(invalidate)하고 다시 가져옴
        queryClient.invalidateQueries({
          queryKey: ['employeeList', loggedInUser?.factoryId],
        });
        setAddModal(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // 이벤트 핸들러 함수
  const onEdit = async (employee: EmployeeEntity) => {
    setTargetEmployee(employee);
    console.log(employee);

    setEditModal(true);
    setAddModal(false);
  };

  // List별 dropdown 커스텀이 필요할 경우
  const [customDropdownEvents, setCustomDropdownEvents] = useState<
    CustomDropdownEventsState[]
  >([
    {
      func: onEdit,
      text: '수정',
    },
  ]);

  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState<string>('');
  // 검색어 필터링
  let filteredEmployeeList = employeeList;

  if (employeeList) {
    filteredEmployeeList = employeeList.filter(
      (employee) =>
        employee.factoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        employee.employeePhoneNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        employee.healthStatus.toString().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <>
      <DataTable<EmployeeEntity>
        title={'근로자 목록'}
        data={filteredEmployeeList}
        columns={[
          { Header: '공장명', accessor: 'factoryName' },
          { Header: '작업자 태그', accessor: 'employeeNumber' },
          { Header: '전화번호', accessor: 'employeePhoneNumber' },
          { Header: '건강상태', accessor: 'healthStatus' },
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
      <Modal isOpen={addModal} onClose={() => setAddModal(false)}>
        {employeeListData && (
          <EditEmployee
            info={
              {
                employeeId: 0, // 기본값
                companyId: employeeListData[0]?.companyId || 0,
                companyName: employeeListData[0]?.companyName || '',
                companyAddress: '',
                companyBusinessNumber: '',
                factoryId: employeeListData[0]?.factoryId || '',
                factoryName: '',
                employeeName: '',
                employeeNumber: '',
                employeePhoneNumber: '',
                employeeEmail: '', // 필수 속성 추가
                role: 'ADMIN', // 필수 속성 추가
                healthStatus: 'NORMAL',
                authenticationStatus: 'ACTIVE',
                accessibleMenuIds: [],
                workId: 0,
                workName: '',
                createdAt: '',
                updatedAt: '',
              } as EmployeeEntity
            }
            onSave={(updatedInfo) =>
              handleSave('add', updatedInfo as EmployeeEntity)
            }
            onClose={() => setAddModal(false)}
            mode="add"
          />
        )}
      </Modal>

      <Modal isOpen={editModal} onClose={() => setAddModal(false)}>
        {targetEmployee && (
          <EditEmployee
            info={targetEmployee}
            onSave={(updatedInfo) =>
              handleSave('edit', updatedInfo as EmployeeEntity)
            }
            onClose={() => setEditModal(false)}
            mode="edit"
          />
        )}
      </Modal>
    </>
  );
};

export default EmployeeListContentsWrapper;
