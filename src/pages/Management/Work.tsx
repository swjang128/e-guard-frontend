import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Card from '../../components/Card/Card';
import '../../css/button.css';
import WorkListContentsWrapper from '../ContentsWrapper/WorkListContentsWrapper';

const Work = () => {
  return (
    <div>
      <Breadcrumb pageName="작업 관리" />

      <Card id="workList" titleUse={false} childrenPxUse={false}>
        <WorkListContentsWrapper />
      </Card>
    </div>
  );
};

export default Work;
