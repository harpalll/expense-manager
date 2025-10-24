import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import Expense from "../../../features/peopleSide/expense";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Expense" }));
  }, []);

  return <Expense />;
}

export default InternalPage;
