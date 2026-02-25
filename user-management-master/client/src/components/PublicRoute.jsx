import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"

const PublicRoute = ({ children }) => {
  const { user, accessToken, isAuthChecked } = useSelector((state) => state.auth)

  // ⏳ Wait until auth check finishes
  if (!isAuthChecked) return null

  if (accessToken) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />
    }
    return <Navigate to="/home" replace />
  }

  return children
}

export default PublicRoute
