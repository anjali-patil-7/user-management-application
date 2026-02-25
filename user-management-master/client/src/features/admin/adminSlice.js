import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import adminService from "./adminService"

const initialState = {
  users: [],
  page: 1,
  pages: 1,
  total: 0,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
}

// Get users
export const getUsers = createAsyncThunk(
  "admin/getUsers",
  async ({ search, page }, thunkAPI) => {
    try {
      return await adminService.getUsers(search, page)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Delete user
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, thunkAPI) => {
    try {
      return await adminService.deleteUser(id)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update user
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, userData }, thunkAPI) => {
    try {
      return await adminService.updateUser(id, userData)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create user
export const createUser = createAsyncThunk(
  "admin/createUser",
  async (userData, thunkAPI) => {
    try {
      return await adminService.createUser(userData)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Toggle block user
export const toggleBlockUser = createAsyncThunk(
  "admin/toggleBlockUser",
  async (id, thunkAPI) => {
    try {
      return await adminService.toggleBlockUser(id)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetAdmin: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.users = action.payload.users
        state.page = action.payload.page
        state.pages = action.payload.pages
        state.total = action.payload.total
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = "User deleted successfully"
        state.users = state.users.filter((user) => user._id !== action.meta.arg)
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createUser.fulfilled, (state) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = "User created successfully"
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = "User updated successfully"
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        )
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(toggleBlockUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(toggleBlockUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = action.payload.message
        state.users = state.users.map((user) =>
          user._id === action.meta.arg
            ? { ...user, isBlocked: action.payload.isBlocked }
            : user
        )
      })
      .addCase(toggleBlockUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { resetAdmin } = adminSlice.actions
export default adminSlice.reducer
