import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

export const UserProtectedRoute = ({ children }) => {
  const { accessToken, isAuthChecked } = useSelector(
    (state) => state.auth
  )

  // ⏳ Wait until auth check finishes
  if (!isAuthChecked) return null

  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  return children
}

export const AdminProtectedRoute = ({ children }) => {
  const { user, accessToken, isAuthChecked } = useSelector(
    (state) => state.auth
  )

  // ⏳ Wait until auth check finishes
  if (!isAuthChecked) return null

  if (!accessToken) {
    return <Navigate to="/admin/login" replace />
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />
  }

  return children
}