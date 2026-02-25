import React, { useState, useEffect } from 'react'
import { registerUser, reset } from '../features/auth/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash } from "react-icons/fa"

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const { name, email, password } = formData

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isError) {
      toast.error(message || "Registration failed")
      dispatch(reset())
    }
    if (isSuccess || user) {
      navigate("/home", { replace: true })
      dispatch(reset())
    }
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const validateField = (name, value) => {
    let error = ""
    if (name === "name") {
      const nameRegex = /^[a-zA-Z\s]+$/
      if (!value.trim()) error = "Name is required"
      else if (!nameRegex.test(value)) error = "Name must contain only alphabets"
      else if (value.trim().length < 2) error = "Name must be at least 2 characters"
    }
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value) error = "Email is required"
      else if (!emailRegex.test(value)) error = "Invalid email format"
    }
    if (name === "password") {
      if (!value) error = "Password is required"
      else if (value.length < 6) error = "Password must be at least 6 characters"
    }
    return error
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))

    // Real-time validation
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const submitHandler = (e) => {
    e.preventDefault()

    const newErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error("Please fix the validation errors")
      return
    }

    dispatch(registerUser({ name, email, password }))
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h1>
          <p className="text-gray-500 mt-2">Join us today! It only takes a minute.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className={`w-full px-4 py-2.5 border rounded-xl outline-none transition duration-200 ${errors.name ? 'border-red-500 bg-red-50 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50'}`}
              value={name}
              onChange={onChange}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              className={`w-full px-4 py-2.5 border rounded-xl outline-none transition duration-200 ${errors.email ? 'border-red-500 bg-red-50 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50'}`}
              value={email}
              onChange={onChange}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 border rounded-xl outline-none transition duration-200 ${errors.password ? 'border-red-500 bg-red-50 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50'}`}
                value={password}
                onChange={onChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black active:scale-[0.98] transition-all shadow-md disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4">
            Log In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
