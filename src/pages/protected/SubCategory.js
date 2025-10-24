import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import SubCategory from "../../features/subCategory";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Sub Category" }));
  }, []);

  return <SubCategory />;
}

export default InternalPage;
