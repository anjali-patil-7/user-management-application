import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    isLoading: false,
    error: null
  },
  reducers: {}
})

export default userSlice.reducer
