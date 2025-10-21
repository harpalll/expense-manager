import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import AdminProfile from "../../features/settings/adminProfile";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Profile" }));
  }, []);

  return <AdminProfile />;
}

export default InternalPage;
