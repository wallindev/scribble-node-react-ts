import { FC, JSX } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { isAuthenticated } from '../functions';

const ProtectedRoute: FC = (): JSX.Element => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}

export default ProtectedRoute
