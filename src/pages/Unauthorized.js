import FaceFrownIcon from "@heroicons/react/24/solid/FaceFrownIcon";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="hero bg-base-200 w-full h-screen">
      <div className="hero h-4/5 bg-base-200">
        <div className="hero-content text-accent text-center">
          <div className="max-w-md">
            <FaceFrownIcon className="h-48 w-48 inline-block" />
            <h1 className="text-5xl  font-bold">401 - Unauthorized</h1>
            <p className="text-gray-500">
              You don't have permission to view this page.
            </p>
            <Link to="/login" className="text-blue-500 mt-4">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
