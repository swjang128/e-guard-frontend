import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Card from '../../components/Card/Card';
import SettingListContentsWrapper from '../ContentsWrapper/SettingListContentsWrapper';

const Setting: React.FC = () => {
  return (
    <div>
      <Breadcrumb pageName="시스템 설정" />

      <Card id="settingList" titleUse={false} childrenPxUse={false}>
        <SettingListContentsWrapper />
      </Card>
    </div>
  );
};
export default Setting;
