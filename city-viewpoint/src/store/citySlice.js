import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCities = createAsyncThunk('cities/fetchAll', async () => {
  const response = await fetch('http://localhost:8081/city/all');
  if (!response.ok) throw new Error('Ошибка загрузки городов');
  return await response.json();
});
export const fetchReviewsByCity = createAsyncThunk(
  'cities/fetchReviews',
  async (cityId) => {
    const response = await fetch('http://localhost:8081/review/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filters: {
          city_id: Number(cityId)
        }
      }),
    });
    if (!response.ok) throw new Error('Ошибка загрузки отзывов');
    return await response.json();
  }
);
export const createReview = createAsyncThunk(
  'cities/createReview',
  async (reviewData) => {
    const response = await fetch('http://localhost:8081/review/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) throw new Error('Ошибка при сохранении отзыва');
    return await response.json();
  }
);

export const fetchFilteredReviews = createAsyncThunk(
  'cities/fetchFilteredReviews',
  async (filters) => {
    const response = await fetch("http://localhost:8081/review/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filters }) 
    });
    if (!response.ok) throw new Error("Ошибка поиска");
    return await response.json();
  }
);

const citySlice = createSlice({
  name: 'cities',
  initialState: {
    list: [],
    loading: false,
    error: null,
    reviews: [],
    reviewsLoading: false,
    reviewsError: null,
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
      })
      .addCase(fetchReviewsByCity.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(fetchReviewsByCity.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsByCity.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError = action.error.message;
      })
      .addCase(fetchFilteredReviews.pending, (state) => {
        state.reviewsLoading = true;
      })
      .addCase(fetchFilteredReviews.fulfilled, (state, action) => {
        state.reviews = action.payload; 
        state.reviewsLoading = false;
      })
      .addCase(fetchFilteredReviews.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.error = action.error.message;
      });
  },
});

export default citySlice.reducer;
