import axios from "axios";
import { jwtDecode } from "jwt-decode";

const checkAuth = () => {
  /*  Getting token value stored in localstorage, if token is not present we will open login page 
    for all internal dashboard routes  */
  const TOKEN = localStorage.getItem("token");
  const PUBLIC_ROUTES = [
    "login",
    "forgot-password",
    "register",
    "documentation",
  ];

  const isPublicPage = PUBLIC_ROUTES.some((r) =>
    window.location.href.includes(r)
  );

  if (!TOKEN && !isPublicPage) {
    window.location.href = "/login";
    return;
  } else {
    // axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;
    axios.interceptors.request.use(
      function (config) {
        config.headers.Authorization = `Bearer ${TOKEN}`;
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.warn("Unauthorized — redirecting to login...");
          // clear token
          localStorage.removeItem("token");
          localStorage.removeItem("info");
          window.location.href = "/login";
        }
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
    return TOKEN;
  }
};

export default checkAuth;
