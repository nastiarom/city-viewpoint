import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCities = createAsyncThunk('cities/fetchAll', async () => {
  const response = await fetch('http://localhost:8081/city/all');
  if (!response.ok) throw new Error('Ошибка загрузки');
  return await response.json();
});

const citySlice = createSlice({
  name: 'cities',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default citySlice.reducer;
