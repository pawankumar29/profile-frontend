import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8009';

export const fetchAdminUser = createAsyncThunk(
  'user/fetchAdminUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/getAdmin`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    adminData: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.adminData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUser.fulfilled, (state, action) => {
        state.loading = false;
        state.adminData = action.payload;
      })
      .addCase(fetchAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch admin user';
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
