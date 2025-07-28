import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Property, PropertyFilters, CreatePropertyData, UpdatePropertyData } from '../../types/property';
import * as PropertyService from '../../services/PropertyService';

interface PropertyState {
  properties: Property[];
  myProperties: Property[];
  loading: boolean;
  error: string | null;
  filters: PropertyFilters;
  searchTerm: string;
  lastFetched: number | null;
}

const initialState: PropertyState = {
  properties: [],
  myProperties: [],
  loading: false,
  error: null,
  filters: {},
  searchTerm: '',
  lastFetched: null,
};

// Async thunks
export const fetchProperties = createAsyncThunk(
  'property/fetchProperties',
  async (filters?: PropertyFilters) => {
    const properties = await PropertyService.getProperties(filters);
    return properties;
  }
);

export const fetchMyProperties = createAsyncThunk(
  'property/fetchMyProperties',
  async (realtorId: string) => {
    const properties = await PropertyService.getPropertiesByRealtor(realtorId);
    return properties;
  }
);

export const createProperty = createAsyncThunk(
  'property/createProperty',
  async ({ propertyData, realtorId, realtorEmail }: {
    propertyData: CreatePropertyData;
    realtorId: string;
    realtorEmail: string;
  }) => {
    const propertyId = await PropertyService.createProperty(propertyData, realtorId, realtorEmail);
    const newProperty = await PropertyService.getPropertyById(propertyId);
    return newProperty;
  }
);

export const updateProperty = createAsyncThunk(
  'property/updateProperty',
  async ({ propertyId, updateData }: { propertyId: string; updateData: UpdatePropertyData }) => {
    await PropertyService.updateProperty(propertyId, updateData);
    const updatedProperty = await PropertyService.getPropertyById(propertyId);
    return updatedProperty;
  }
);

export const deleteProperty = createAsyncThunk(
  'property/deleteProperty',
  async (propertyId: string) => {
    await PropertyService.deleteProperty(propertyId);
    return propertyId;
  }
);

export const togglePropertyAvailability = createAsyncThunk(
  'property/togglePropertyAvailability',
  async ({ propertyId, isAvailable }: { propertyId: string; isAvailable: boolean }) => {
    await PropertyService.togglePropertyAvailability(propertyId, isAvailable);
    const updatedProperty = await PropertyService.getPropertyById(propertyId);
    return updatedProperty;
  }
);

export const searchProperties = createAsyncThunk(
  'property/searchProperties',
  async (searchTerm: string) => {
    const properties = await PropertyService.searchProperties(searchTerm);
    return properties;
  }
);

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<PropertyFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearSearch: (state) => {
      state.searchTerm = '';
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCache: (state) => {
      state.properties = [];
      state.myProperties = [];
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Properties
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch properties';
      });

    // Fetch My Properties
    builder
      .addCase(fetchMyProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.myProperties = action.payload;
      })
      .addCase(fetchMyProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch your properties';
      });

    // Create Property
    builder
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.myProperties.unshift(action.payload);
          state.properties.unshift(action.payload);
        }
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create property';
      });

    // Update Property
    builder
      .addCase(updateProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.myProperties.findIndex(p => p.id === action.payload?.id);
          if (index !== -1) {
            state.myProperties[index] = action.payload;
          }
          
          const publicIndex = state.properties.findIndex(p => p.id === action.payload?.id);
          if (publicIndex !== -1) {
            state.properties[publicIndex] = action.payload;
          }
        }
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update property';
      });

    // Delete Property
    builder
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.myProperties = state.myProperties.filter(p => p.id !== action.payload);
        state.properties = state.properties.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete property';
      });

    // Toggle Property Availability
    builder
      .addCase(togglePropertyAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePropertyAvailability.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.myProperties.findIndex(p => p.id === action.payload?.id);
          if (index !== -1) {
            state.myProperties[index] = action.payload;
          }
          
          const publicIndex = state.properties.findIndex(p => p.id === action.payload?.id);
          if (publicIndex !== -1) {
            state.properties[publicIndex] = action.payload;
          }
        }
      })
      .addCase(togglePropertyAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to toggle property availability';
      });

    // Search Properties
    builder
      .addCase(searchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(searchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search properties';
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setSearchTerm,
  clearSearch,
  clearError,
  clearCache,
} = propertySlice.actions;

export default propertySlice.reducer; 