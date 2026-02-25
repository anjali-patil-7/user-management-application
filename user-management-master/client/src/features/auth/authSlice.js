import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as authService from "./authService"

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      return await authService.login(data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message)
    }
  }
)

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      return await authService.register(data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message)
    }
  }
)

// UPDATE PROFILE
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, thunkAPI) => {
    try {
      return await authService.updateProfile(data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message)
    }
  }
)

// CHANGE PASSWORD
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data, thunkAPI) => {
    try {
      return await authService.changePassword(data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message)
    }
  }
)

//create refreshUser thunk
export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    try {
      return await authService.refresh()
    } catch (error) {
      return thunkAPI.rejectWithValue("Session expired")
    }
  }
)


const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    isAuthChecked: false,
    message: "",
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ""
    },
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        const { accessToken, ...userData } = action.payload
        state.user = userData
        state.accessToken = accessToken
        state.isAuthChecked = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { accessToken, ...userData } = action.payload
        state.user = userData
        state.accessToken = accessToken
        state.isAuthChecked = true
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })

      .addCase(refreshUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.accessToken = action.payload.accessToken
        state.isAuthChecked = true
      })
      .addCase(refreshUser.rejected, (state) => {
        state.isLoading = false
        state.accessToken = null
        state.user = null
        state.isAuthChecked = true
      })
  },
})

export const { reset, logout, setCredentials } = authSlice.actions
export default authSlice.reducer