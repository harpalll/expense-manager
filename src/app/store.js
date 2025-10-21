import { configureStore } from "@reduxjs/toolkit";
import headerSlice from "../features/common/headerSlice";
import modalSlice from "../features/common/modalSlice";
import rightDrawerSlice from "../features/common/rightDrawerSlice";
import adminSlice from "../features/admins/adminSlice";
import categorySlice from "../features/category/categorySlice";
import authSlice from "../features/auth/authSlice";
import peopleSlice from "../features/people/peopleSlice";

const combinedReducer = {
  header: headerSlice,
  rightDrawer: rightDrawerSlice,
  modal: modalSlice,
  admin: adminSlice,
  category: categorySlice,
  auth: authSlice,
  people: peopleSlice,
};

export default configureStore({
  reducer: combinedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable fields in modal actions
        ignoredActions: ["modal/openModal"],
        ignoredPaths: ["modal.extraObject.onConfirm"],
      },
    }),
});
