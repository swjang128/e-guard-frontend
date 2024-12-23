import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Card from '../../components/Card/Card';
import '../../css/button.css';
import IncidentWorkerEmployeeListContentsWrapper from '../ContentsWrapper/IncidentWorkerEmployeeListContentsWrapper';

const IncidentWorkerEmployee = () => {
  return (
    <div>
      <Breadcrumb pageName="근로자 사건" />

      <Card
        id="IncidentWorkerEmployeeList"
        titleUse={false}
        childrenPxUse={false}
      >
        <IncidentWorkerEmployeeListContentsWrapper />
      </Card>
    </div>
  );
};

export default IncidentWorkerEmployee;
