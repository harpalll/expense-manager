import ArrowDownTrayIcon from "@heroicons/react/24/outline/ArrowDownTrayIcon";
import ShareIcon from "@heroicons/react/24/outline/ShareIcon";
import EnvelopeIcon from "@heroicons/react/24/outline/EnvelopeIcon";
import EllipsisVerticalIcon from "@heroicons/react/24/outline/EllipsisVerticalIcon";
import { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "../../auth/authSlice";
import {
  ArrowPathIcon,
  BellIcon,
  CalendarDaysIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const periodOptions = [
  { name: "Today", value: "TODAY" },
  { name: "Yesterday", value: "YESTERDAY" },
  { name: "This Week", value: "THIS_WEEK" },
  { name: "Last Week", value: "LAST_WEEK" },
  { name: "This Month", value: "THIS_MONTH" },
  { name: "Last Month", value: "LAST_MONTH" },
];

function DashboardTopBar({ updateDashboardPeriod }) {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [dateValue, setDateValue] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, []);

  const handleDatePickerValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setDateValue(newValue);
    updateDashboardPeriod(newValue);
  };

  //   return (
  //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //       {/* <div className="">
  //         <Datepicker
  //           containerClassName="w-72"
  //           value={dateValue}
  //           theme={"light"}
  //           inputClassName="input input-bordered w-72"
  //           popoverDirection={"down"}
  //           toggleClassName="invisible"
  //           onChange={handleDatePickerValueChange}
  //           showShortcuts={true}
  //           primaryColor={"white"}
  //         />
  //       </div> */}

  //       <div>
  //         <h2 className="">
  //           Hello,{" "}
  //           {loading ? (
  //             <>
  //               <span className="loading loading-ball loading-sm"></span>
  //             </>
  //           ) : (
  //             <>{user.name}</>
  //           )}
  //         </h2>
  //       </div>

  //       <div className="text-right ">
  //         <button
  //           className="btn btn-ghost btn-sm normal-case"
  //           onClick={() => window.location.reload()}
  //         >
  //           <ArrowPathIcon className="w-4 mr-2" />
  //           Refresh Data
  //         </button>
  //         {/* <button className="btn btn-ghost btn-sm normal-case  ml-2"><ShareIcon className="w-4 mr-2"/>Share</button>

  //                 <div className="dropdown dropdown-bottom dropdown-end  ml-2">
  //                     <label tabIndex={0} className="btn btn-ghost btn-sm normal-case btn-square "><EllipsisVerticalIcon className="w-5"/></label>
  //                     <ul tabIndex={0} className="dropdown-content menu menu-compact  p-2 shadow bg-base-100 rounded-box w-52">
  //                         <li><a><EnvelopeIcon className="w-4"/>Email Digests</a></li>
  //                         <li><a><ArrowDownTrayIcon className="w-4"/>Download</a></li>
  //                     </ul>
  //                 </div> */}
  //       </div>
  //     </div>
  //   );
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
          className="btn btn-ghost btn-sm flex items-center gap-2"
          onClick={() => window.location.reload()}
        >
          <ArrowPathIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>

        {/* <button className="btn btn-ghost btn-sm">
          <BellIcon className="w-5 h-5" />
        </button> */}

        <Link to={"/admin/admin-profile"}>
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
