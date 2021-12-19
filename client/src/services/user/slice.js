import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  email: null,
  name: null,
  password: null,
  token: null,
  role: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.password = action.payload.password;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
  },
  /*extraReducers: builder => {
    builder.addCase(getAddress.fulfilled, (state, { payload }) => {});
    builder.addCase(getAddress.pending, (state, { payload }) => {});
    builder.addCase(getAddress.rejected, state => {});
  },*/
});

export const { addUser } = userSlice.actions;
