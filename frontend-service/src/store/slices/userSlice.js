import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileHttp } from '../../lib/api';

export const fetchAdminUser = createAsyncThunk(
  'user/fetchAdminUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileHttp.get('/api/getAdmin');
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
    isInitialized: false,
    authCheckAttempted: false,
  },
  reducers: {
    clearUser: (state) => {
      state.adminData = null;
      state.isInitialized = false;
      state.authCheckAttempted = false;
    },
    setInitialized: (state, action) => {
      state.isInitialized = action.payload;
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
        state.isInitialized = true;
        state.authCheckAttempted = true;
      })
      .addCase(fetchAdminUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch admin user';
        state.isInitialized = false;
        state.authCheckAttempted = true;
      });
  },
});

export const { clearUser, setInitialized } = userSlice.actions;
export default userSlice.reducer;
