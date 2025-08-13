// src/redux/slices/authFlowSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authFlowSlice = createSlice({
  name: 'authFlow',
  initialState: {
    email: '',
  },
  reducers: {
    setEmail: (state, action) => {
        console.log(state,"STATE",action,"ACTION")
      state.email = action.payload;
    },
    clearEmail: (state) => {
      state.email = '';
    },
  },
});

export const { setEmail, clearEmail } = authFlowSlice.actions;
export default authFlowSlice.reducer;
