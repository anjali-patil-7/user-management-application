import api from "../../services/api"

// Login
export const login = async (data) => {
  const res = await api.post("auth/login", data)
  return res.data
}

// Register
export const register = async (data) => {
  const res = await api.post("auth/register", data)
  return res.data
}

// Logout (backend + cookie clear)
export const logoutUser = async () => {
  await api.post("auth/logout")
}

// Update profile
export const updateProfile = async (formData) => {
  const res = await api.put("users/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data
}

// Change password
export const changePassword = async (data) => {
  const res = await api.put("users/change-password", data)
  return res.data
}

// Refresh token
export const refresh = async () => {
  const res = await api.post("auth/refresh")
  return res.data
}

// Refresh admin token
export const refreshAdmin = async () => {
  const res = await api.post("admin/refresh")
  return res.data
}
