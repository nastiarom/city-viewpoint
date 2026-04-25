import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) throw new Error("Нет данных для авторизации");
      const response = await fetch(`http://localhost:8080/user/token`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Не удалось загрузить профиль");
      return await response.json(); 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuth: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
    state.token = null;
    state.user = null;
    state.isAuth = false;
    },
    setToken: (state, action) => {
      localStorage.setItem('token', action.payload);
      state.isAuth = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuth = false;
        state.user = null;
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
