import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import type { FC, JSX } from 'react'
import { isAuthenticated } from '../utils/functions'
import { defaultRequestConfig } from '../utils/defaults'

const ProtectedRoute: FC = (): JSX.Element => {
  const [authenticated, setAuthenticated] = useState<boolean>(false)
  useEffect(() => {
    isAuthenticated(setAuthenticated, defaultRequestConfig)
  }, [])

  if (!authenticated) {
    return <Navigate to="/" />
  }
  return <Outlet />
}

export default ProtectedRoute
