import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { loginUser, reset } from "../features/auth/authSlice"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { FaEye, FaEyeSlash } from "react-icons/fa"

const Login = () => {
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

    //If logged in, redirect & replace history
    if (accessToken) {
      if (user?.role === "admin") {
        navigate("/admin/dashboard", { replace: true })
      } else {
        navigate("/home", { replace: true })
      }
      dispatch(reset())
    }
  }, [accessToken, isError, message, navigate, dispatch])

  const validate = () => {
    const newErrors = {}
    if (!email) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format"

    if (!password) newErrors.password = "Password is required"
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submitHandler = (e) => {
    e.preventDefault()
    if (validate()) {
      dispatch(loginUser({ email, password }))
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Sign In
          </h1>
          <p className="text-gray-500 mt-2">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              className={`w-full px-4 py-2.5 border rounded-xl ${errors.email ? "border-red-500 bg-red-50" : "border-gray-200"
                }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({ ...errors, email: "" })
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-2.5 border rounded-xl ${errors.password ? "border-red-500 bg-red-50" : "border-gray-200"
                  }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password)
                    setErrors({ ...errors, password: "" })
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-bold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login