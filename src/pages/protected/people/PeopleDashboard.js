import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import PeopleDashboard from "../../../features/peopleSide/peopleDashboard";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "People Dashboard" }));
  }, []);

  return <PeopleDashboard />;
}

export default InternalPage;
