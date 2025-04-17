import { Fragment } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const RouteGuard = ({ authenticated, user, element }) => {
  const location = useLocation()
  const path = location.pathname

  if (!authenticated && !path.startsWith('/auth')) {
    return <Navigate to="/auth" replace />
  }

  if (authenticated) {
    const role = user?.role

    if (role === 'admin') {
      if (!path.startsWith('/admin')) {
        return <Navigate to="/admin" replace />
      }
    } else if (role === 'instructor') {
      if (!path.startsWith('/instructor')) {
        return <Navigate to="/instructor" replace />
      }
    } else if (role === 'user') {
      if (
        path.startsWith('/admin') ||
        path.startsWith('/instructor') ||
        path.includes('/auth')
      ) {
        return <Navigate to="/home" replace />
      }
    }

    if (path.includes('/auth')) {
      if (role === 'admin') return <Navigate to="/admin" replace />
      if (role === 'instructor') return <Navigate to="/instructor" replace />
      return <Navigate to="/home" replace />
    }
  }

  return <Fragment>{element}</Fragment>
}

export default RouteGuard
