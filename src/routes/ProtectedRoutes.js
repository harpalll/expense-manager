import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SuspenseContent from "../containers/SuspenseContent";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  if (!token) {
    // no token → go to login
    // console.log("ProtectedRoute: no token → redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    // console.log("ProtectedRoute: user not yet loaded, waiting...");
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-ball loading-md"></span>
        <p className="ml-3">Fetching user data...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // console.log(token, "!isAuthenticated");

    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // console.log(
    //   `ProtectedRoute: user role '${user.role}' not in allowed roles → unauthorized`
    // );
    return <Navigate to="/unauthorized" replace />;
  }
  // console.log(
  //   `ProtectedRoute: access granted for ${user.role} → rendering child`
  // );
  return children;
}
