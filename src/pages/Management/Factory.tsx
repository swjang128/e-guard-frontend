import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Card from '../../components/Card/Card';
import '../../css/button.css';
import FactoryListContentsWrapper from '../ContentsWrapper/FactoryListContentsWrapper';

const Factory = () => {
  return (
    <div>
      <Breadcrumb pageName="공장 관리" />

      <Card id="factoryList" titleUse={false} childrenPxUse={false}>
        <FactoryListContentsWrapper />
      </Card>
    </div>
  );
};

export default Factory;
