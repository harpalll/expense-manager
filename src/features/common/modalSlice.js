import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    title: "modal",
    isOpen: false,
    bodyType: null,
    extraObject: null,
  },
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.bodyType = action.payload.bodyType;
      state.extraObject = action.payload.extraObject;
    },
    closeModal: (state) => {
      state.title = "modal";
      state.isOpen = false;
      state.bodyType = null;
      state.extraObject = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
