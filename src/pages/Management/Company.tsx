import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Card from '../../components/Card/Card';
import '../../css/button.css';
import CompanyListContentsWrapper from '../ContentsWrapper/CompanyListContentsWrapper';

const Company = () => {
  return (
    <div>
      <Breadcrumb pageName="업체 관리" />

      <Card id="companyList" titleUse={false} childrenPxUse={false}>
        <CompanyListContentsWrapper />
      </Card>
    </div>
  );
};

export default Company;
