import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { loginUser, reset, logout } from "../../features/auth/authSlice"
import { toast } from "react-toastify"
import { FaEye, FaEyeSlash } from "react-icons/fa"

const AdminLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, accessToken, isLoading, isError, message } = useSelector(
    (state) => state.auth
  )

  useEffect(() => {
    if (isError) {
      toast.error(message || "Login failed")
      dispatch(reset())
    }

    // ✅ If admin already logged in → redirect & replace
    if (accessToken && user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true })
      dispatch(reset())
    }

    // ❌ If normal user tries admin login
    if (accessToken && user?.role !== "admin") {
      toast.error("Not authorized as admin")
      dispatch(logout())
      dispatch(reset())
    }
  }, [accessToken, user, isError, message, navigate, dispatch])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(loginUser({ email, password }))
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold">Admin Login</h1>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          <input
            type="email"
            placeholder="admin@example.com"
            className="w-full px-4 py-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin