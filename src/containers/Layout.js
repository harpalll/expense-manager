import PageContent from "./PageContent";
import LeftSidebar from "./LeftSidebar";
import { useSelector, useDispatch } from "react-redux";
import RightSidebar from "./RightSidebar";
import { useEffect } from "react";
import { removeNotificationMessage } from "../features/common/headerSlice";
import ModalLayout from "./ModalLayout";
import { ToastContainer, toast, Bounce } from "react-toastify";

function Layout() {
  const dispatch = useDispatch();
  const { newNotificationMessage, newNotificationStatus } = useSelector(
    (state) => state.header
  );

  useEffect(() => {
    if (newNotificationMessage !== "") {
      if (newNotificationStatus === 1) toast.success(newNotificationMessage);
      if (newNotificationStatus === 0) toast.error(newNotificationMessage);
      dispatch(removeNotificationMessage());
    }
  }, [newNotificationMessage]);

  return (
    <>
      {/* Left drawer - containing page content and side bar (always open) */}
      <div className="drawer  lg:drawer-open">
        <input
          id="left-sidebar-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <PageContent />
        <LeftSidebar />
      </div>

      {/* Right drawer - containing secondary content like notifications list etc.. */}
      <RightSidebar />

      {/* Modal layout container */}
      <ModalLayout />
    </>
  );
}

export default Layout;
