import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateProfile, changePassword } from "../features/auth/authSlice"
import { useNavigate } from "react-router-dom"
import ImageUpload from "../components/ImageUpload"
import { toast } from "react-toastify"
import { FaEye, FaEyeSlash } from "react-icons/fa"

function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, isLoading } = useSelector((state) => state.auth)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [profileImage, setProfileImage] = useState(null)
  const [existingImage, setExistingImage] = useState("")
  const [isImageRemoved, setIsImageRemoved] = useState(false) // Track image removal
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate("/login")
    } else {
      setName(user.name)
      setEmail(user.email)
      setExistingImage(user.profileImage || "")
      setIsImageRemoved(false)
    }
  }, [user, navigate])

  const handleRemoveImage = () => {
    setProfileImage(null)
    setExistingImage("")
    setIsImageRemoved(true)
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()

    if (!name || !email) {
      toast.error("Name and Email are required")
      return
    }

    const nameRegex = /^[a-zA-Z\s]+$/
    if (!nameRegex.test(name)) {
      toast.error("Name must contain only alphabets")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email")
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    if (profileImage) {
      formData.append("profileImage", profileImage)
    } else if (isImageRemoved) {
      formData.append("removeImage", "true")
    }

    dispatch(updateProfile(formData))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully")
        setIsImageRemoved(false)
      })
      .catch((error) => {
        toast.error(error || "Profile update failed")
      })
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    dispatch(changePassword({ oldPassword, newPassword }))
      .unwrap()
      .then(() => {
        toast.success("Password changed successfully")
        setOldPassword("")
        setNewPassword("")
      })
      .catch((error) => {
        toast.error(error || "Password change failed")
      })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">

        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Profile Settings
        </h2>

        {isLoading && (
          <p className="text-blue-500 mb-4">Processing...</p>
        )}

        {/* Profile Section */}
        <form onSubmit={handleProfileUpdate} className="space-y-6">

          <ImageUpload
            onImageSelect={(file) => {
              setProfileImage(file)
              setIsImageRemoved(false)
            }}
            existingImage={existingImage}
            onImageRemove={handleRemoveImage}
          />

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Update Profile
          </button>
        </form>

        {/* Divider */}
        <div className="my-10 border-t"></div>

        {/* Password Section */}
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Change Password
          </h3>

          <div>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Old Password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none pr-10"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-black transition duration-300"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
