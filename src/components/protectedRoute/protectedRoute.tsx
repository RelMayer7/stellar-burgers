import { ReactElement } from 'react';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { userSelectors } from '../../services/slices/user';

interface protectedRouterProps {
  children: ReactElement;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute = (props: protectedRouterProps) => {
  const isAuthenticated = useSelector(userSelectors.selectIsAuthenticated);
  const loginUserRequest = useSelector(userSelectors.selectLoginUserRequest);
  const location = useLocation();

  if (loginUserRequest) {
    return <Preloader />;
  }

  if (!props.onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (props.onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return props.children;
};
