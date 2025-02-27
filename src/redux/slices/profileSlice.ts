import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import request from '@/utils/axios';


export interface User {
  Role: any;
  User: any;
  firstName: string;
  lastName: string;
  // email: string;
  birthDate: string;
  address: string;
  phone: string;
  whereYouLive: string;
  billingAddress: string;
  preferredLanguage: string;
  profileImage?: string | File;
  [key: string]: any;  
}

interface UserProfileState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserProfileState = {
  user: null,
  loading: false,
  error: null,
};

export const getUserProfile:any = createAsyncThunk('userProfile/getProfile', async (_, { rejectWithValue }) => {
  try {
    const response: any = await request.get('/users/profile');
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateUserProfile:any = createAsyncThunk(
  'userProfile/updateProfile',
  async (profileData: Partial<User> | FormData, { rejectWithValue }) => {
    try {
      console.log('Original profile data:', profileData);

      let formData: FormData;
      if (profileData instanceof FormData) {
        formData = profileData;
      } else {
        formData = new FormData();
        Object.entries(profileData).forEach(([key, value]) => {
          if (value !== undefined && key !== 'email' && key !== 'password') {
            if (value instanceof File) {
              formData.append(key, value, value.name);
            } else {
              formData.append(key, value);
            }
          }
        });
      }

      console.log('FormData contents:');
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      const response: any = await request.put('/users/profiles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Server response:', response);

      // Assuming response.data contains the entire user object as shown in the screenshot
      const userData = response.user;

      
      const existingData = JSON.parse(localStorage.getItem('profile') || '{}');

      
      const updatedData = {
        ...existingData,
        User: {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          googleId: userData.googleId,
          profileImage: userData.profileImage,
          verified: userData.verified,
          phone: userData.phone,
          birthDate: userData.birthDate,
          preferredLanguage: userData.preferredLanguage,
          preferredCurrency: userData.preferredCurrency,
          whereYouLive: userData.whereYouLive,
          billingAddress: userData.billingAddress,
          roleId: userData.roleId,
          isActive: userData.isActive,
          reasonForDeactivation: userData.reasonForDeactivation,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          passwordExpiresAt: userData.passwordExpiresAt,
          isPasswordExpired: userData.isPasswordExpired,
          Role: existingData.User?.Role || {}, // Preserve existing Role data
        }
      };

      // Store the updated data back to localStorage
      localStorage.setItem('profile', JSON.stringify(updatedData));
    
      return response;


    } catch (error: any) {
      console.error('Update API call error:', error);
      console.error('Error response:', error.response);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userProfileSlice.reducer;