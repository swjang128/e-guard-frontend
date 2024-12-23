import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Card from '../../components/Card/Card';
import '../../css/button.css';
import IncidentAreaListContentsWrapper from '../ContentsWrapper/IncidentAreaListContentsWrapper';

const IncidentArea = () => {
  return (
    <div>
      <Breadcrumb pageName="구역 사건" />

      <Card id="incidentAreaList" titleUse={false} childrenPxUse={false}>
        <IncidentAreaListContentsWrapper />
      </Card>
    </div>
  );
};

export default IncidentArea;
