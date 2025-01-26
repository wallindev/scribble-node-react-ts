import { FC } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute: FC = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if a token exists

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute
