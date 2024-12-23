import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import LogIn from './pages/Authentication/LogIn';
import './i18n';
import i18n from './i18n';
import PublicRoute from './AppPublicRoute';
import ProtectedRoute from './AppProtectedRoute';
import DefaultLayout from './layout/DefaultLayout';
import Home from './pages/Home';
import Factory from './pages/Management/Factory';
import Work from './pages/Management/Work';
import IncidentArea from './pages/Event/IncidentArea';
import IncidentWorkerEmployee from './pages/Event/IncidentWorkerEmployee';
import NotFound404 from './pages/NotFound/NotFound404';
import Company from './pages/Management/Company';
import Employee from './pages/Management/Employee';
import Setting from './pages/Management/Setting';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const selectedLanguage = 'ko-KR';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    i18n.changeLanguage(selectedLanguage);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className={selectedLanguage === 'ko-KR' ? 'font-notoSansKR' : ''}>
      <Routes>
        {/* 인증되지 않은 사용자 접근 PublicRoute */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route
          path="/auth/login"
          element={
            <PublicRoute>
              <>
                <PageTitle title="LogIn | E-GUARD" />
                <LogIn />
              </>
            </PublicRoute>
          }
        />
        {/* 인증 사용자 접근 ProtectedRoute */}
        <Route
          index
          path="/main"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="Main | E-GUARD" />
                <Home />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        {/* ----------------------------------관리---------------------------------- */}
        <Route
          path="/management/company"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="Management company | E-GUARD" />
                <Company />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/factory"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="Management factory | E-GUARD" />
                <Factory />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/work"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="Management work | E-GUARD" />
                <Work />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/employee"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="Management employee | E-GUARD" />
                <Employee />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/setting"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="Management setting | E-GUARD" />
                <Setting />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/area"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="Event area | E-GUARD" />
                <IncidentArea />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/employee"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="Event employee | E-GUARD" />
                <IncidentWorkerEmployee />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        {/* ----------------------------------프로필---------------------------------- */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="Profile | E-GUARD" />
                {/* <Profile /> */}
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        {/* ----------------------------------그 외의 처리---------------------------------- */}
        <Route
          path="/404"
          element={
            <>
              <PageTitle title="NotFound | E-GUARD" />
              <NotFound404 />
            </>
          }
        />
        <Route path="/*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  );
}

export default App;

