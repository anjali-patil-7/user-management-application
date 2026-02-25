import axios from "axios"
import store from "../app/store"
import { setCredentials, logout } from "../features/auth/authSlice"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // required for refresh cookie
})

// Attach access token from Redux
api.interceptors.request.use((config) => {
  const { accessToken } = store.getState().auth

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

// Handle expired access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const refreshEndpoint = window.location.pathname.startsWith("/admin")
          ? "/admin/refresh"
          : "/auth/refresh"

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}${refreshEndpoint}`,
          {},
          { withCredentials: true }
        )

        store.dispatch(
          setCredentials({ accessToken: res.data.accessToken })
        )

        originalRequest.headers.Authorization =
          `Bearer ${res.data.accessToken}`

        return api(originalRequest)
      } catch (err) {
        store.dispatch(logout())
      }
    }

    return Promise.reject(error)
  }
)

export default api