import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Card from '../../components/Card/Card';
import '../../css/button.css';
import EmployeeListContentsWrapper from '../ContentsWrapper/EmployeeListContentsWrapper';

const Employee = () => {
  return (
    <div>
      <Breadcrumb pageName="근로자 관리" />

      <Card id="employeeList" titleUse={false} childrenPxUse={false}>
        <EmployeeListContentsWrapper />
      </Card>
    </div>
  );
};

export default Employee;
