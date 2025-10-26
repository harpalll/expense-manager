import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "../../../auth/authSlice";
import {
  ArrowPathIcon,
  DocumentTextIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { MODAL_BODY_TYPES } from "../../../../utils/globalConstantUtil";
import { openModal } from "../../../common/modalSlice";

function DashboardTopBar() {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, []);

  const handleGenerateTodaysReport = async () => {
    dispatch(
      openModal({
        title: "Generate Today's Summary",
        bodyType: MODAL_BODY_TYPES.GENERATE_TODAYS_REPORT,
      })
    );
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-base-100 border border-base-200 rounded-2xl shadow-sm p-4 sm:p-6">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <div className="avatar placeholder">
          <div className="bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center font-semibold">
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-base-content">
            {loading ? (
              <span className="loading loading-dots loading-sm"></span>
            ) : (
              <>Hello, {user?.name || "User"} 👋</>
            )}
          </h2>
          <p className="text-sm text-base-content/70">
            Here's what's happening today
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 mt-4 sm:mt-0">
        <button
          className="btn btn-outline btn-ghost btn-sm"
          onClick={handleGenerateTodaysReport}
        >
          <DocumentTextIcon className="w-4 h-4" />
          Generate Today's Summary
        </button>

        <button
          className="btn btn-outline btn-sm flex items-center gap-2"
          onClick={() => window.location.reload()}
        >
          <ArrowPathIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>

        <Link to={"/people/people-profile"}>
          <button className="btn btn-outline btn-sm hidden sm:flex items-center gap-2">
            <UserCircleIcon className="w-4 h-4" />
            Profile
          </button>
        </Link>
      </div>
    </div>
  );
}

export default DashboardTopBar;
