import { useRecoilValue } from 'recoil';
import { loggedInUserState } from './store/loggedInUserAtom';
import { Navigate } from 'react-router-dom';

function AppProtectedRoute({ children }: { children: JSX.Element }) {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const isAuthenticated = !!loggedInUser;

  // 로그인 또는 가입 페이지는 인증된 사용자에게 접근 금지
  const noAuthRoutes = ['/auth/login', '/auth/signup'];
  return isAuthenticated && !noAuthRoutes.includes(location.pathname) ? (
    children
  ) : (
    <Navigate to="/auth/login" replace />
  );
}

export default AppProtectedRoute;
