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

export const fetchCityDetails = createAsyncThunk(
  'cities/fetchCityDetails',
  async (cityId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8081/city?city_id=${cityId}`);
      if (!response.ok) throw new Error('Ошибка при получении данных города');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
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

export const fetchLikedReviews = createAsyncThunk(
  'cities/fetchLikedReviews',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token || localStorage.getItem('token');
      const response = await fetch('http://localhost:8081/review/liked', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ошибка сервера:", errorData);
        throw new Error('Ошибка при загрузке');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMyReviews = createAsyncThunk(
  'cities/fetchMyReviews',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token || localStorage.getItem('token');

      const response = await fetch('http://localhost:8081/review/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDrafts = createAsyncThunk(
  'cities/fetchDrafts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token || localStorage.getItem('token');
      const response = await fetch('http://localhost:8081/review/drafts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Ошибка при загрузке черновиков');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchReviewsByRegion = createAsyncThunk(
  'cities/fetchReviewsByRegion',
  async (region, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8081/review/region?region=${encodeURIComponent(region)}`);

      if (!response.ok) throw new Error('Ошибка при загрузке отзывов региона');

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
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
      })
      .addCase(fetchLikedReviews.fulfilled, (state, action) => {
        state.likedReviews = action.payload;
        state.loading = false;
      })
      .addCase(fetchLikedReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLikedReviews.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchMyReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.userReviews = action.payload;
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDrafts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrafts.fulfilled, (state, action) => {
        state.drafts = action.payload;
        state.loading = false;
      })
      .addCase(fetchDrafts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchReviewsByRegion.pending, (state) => {
        state.reviewsLoading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByRegion.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.reviews = action.payload || [];
      })
      .addCase(fetchReviewsByRegion.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCityDetails.fulfilled, (state, action) => {
        state.currentCityDetails = action.payload;
      });
  },
});

export default citySlice.reducer;
