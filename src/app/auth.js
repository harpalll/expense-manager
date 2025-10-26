import axios from "axios";
import store from "../app/store";
import { logout, logoutUser, setAuthToken } from "../features/auth/authSlice";

export default function checkAuth() {
  const token = localStorage.getItem("token");

  if (token) {
    store.dispatch(setAuthToken(token));
  }

  // Global 401 handler
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn("Unauthorized — logging out...");
        store.dispatch(logout());
        store.dispatch(logoutUser());
      }
      return Promise.reject(error);
    }
  );

  return !!token;
}
