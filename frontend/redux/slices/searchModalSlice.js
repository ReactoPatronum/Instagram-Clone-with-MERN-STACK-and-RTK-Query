import { createSlice } from "@reduxjs/toolkit";

const searchModalSlice = createSlice({
  name: "postModal",
  initialState: {
    modal: false,
  },
  reducers: {
    setModal: (state, action) => {
      state.modal = action.payload;
    },
  },
});

export const { setModal } = searchModalSlice.actions;

export default searchModalSlice.reducer;
