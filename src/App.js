import React, { lazy, useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { themeChange } from "theme-change";
import checkAuth from "./app/auth";
import initializeApp from "./app/init";
import { fetchUserInfo } from "./features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./routes/ProtectedRoutes";

// public pages
const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Register = lazy(() => import("./pages/Register"));
const Documentation = lazy(() => import("./pages/Documentation"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));

// // Admin pages
// const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
// const AdminLayout = lazy(() => import("./containers/AdminLayout"));

// * People pages
const PeopleLayout = lazy(() => import("./containers/People/PeopleLayout"));
// const EmployeeLayout = lazy(() => import("./containers/EmployeeLayout"));

// Initializing different libraries
initializeApp();

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // themes initialization
    themeChange(false);
  }, []);

  useEffect(() => {
    const token = checkAuth();
    if (token) {
      setHasToken(true);
      dispatch(fetchUserInfo());
    } else {
      setHasToken(false);
    }
  }, [dispatch]);

  return (
    <>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin Routes */}
          {/* Protected app routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                {/* layout = admin layout */}
                <Layout />
              </ProtectedRoute>
            }
          />

          {/* People routes */}
          <Route
            path="/people/*"
            element={
              <ProtectedRoute allowedRoles={["User"]}>
                <PeopleLayout />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route
            path="*"
            element={
              hasToken ? (
                user?.role === "Admin" ? (
                  <>
                    <Navigate to="/admin/app/dashboard" replace />
                  </>
                ) : user?.role === "People" ? (
                  <Navigate to="/people/dashboard" replace />
                ) : (
                  <Navigate to="/unauthorized" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
