import DashboardStats from "./components/DashboardStats";

import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import BanknotesIcon from "@heroicons/react/24/outline/BanknotesIcon";

import DashboardTopBar from "./components/DashboardTopBar";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import { useEffect, useState } from "react";
import CategoryWiseAnalytics from "./components/CategoryWiseAnalytics";
import axios from "axios";
import ProjectWiseAnalytics from "./components/ProjectWiseAnalytics";
import CategoryStats from "./components/CategoryStats";
import ProjectStats from "./components/ProjectStats";

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [totalExpense, setTotalExpense] = useState(null);
  const [totalIncome, setTotalIncome] = useState(null);

  useEffect(() => {
    setLoading(true);

    const fetchTotalExpenseIncome = async () => {
      try {
        const res = await axios.get("api/total-incomes-and-expenses");
        setTotalExpense(res.data.data.totalExpenses);
        setTotalIncome(res.data.data.totalIncomes);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTotalExpenseIncome();
  }, []);

  const statsData = [
    {
      title: "Total Expense",
      value: totalExpense,
      icon: <CreditCardIcon className="w-8 h-8" />,
      description: "Total Expense",
      hasLink: true,
      link: "/people/expense",
      linkName: "View Expense",
      showReport: true,
      showExcel: true,
    },
    {
      title: "Total Income",
      value: totalIncome,
      icon: <BanknotesIcon className="w-8 h-8" />,
      description: "Total Income",
      hasLink: true,
      link: "/people/income",
      linkName: "View Income",
      showReport: true,
      showExcel: true,
    },
  ];

  return (
    <>
      {/** ---------------------- Greet ------------------------- */}
      <DashboardTopBar />

      {/** ---------------------- Stats ------------------------- */}
      <div className="grid lg:grid-cols-2 mt-4 md:grid-cols-2 grid-cols-1 gap-6 mt">
        {loading ? (
          <>
            <div className="flex justify-center items-center py-8">
              <span className="loading loading-ball loading-md"></span>
              <p className="ml-3">Loading stats...</p>
            </div>
          </>
        ) : (
          <>
            {statsData.map((d, k) => {
              return <DashboardStats key={k} {...d} colorIndex={k} />;
            })}
          </>
        )}
      </div>
      <div className="my-4 divider" />

      {/** ---------------------- Different Entities Count ------------------------- */}
      {/* <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
        <CategoryStats />
        <ProjectStats />
      </div> */}

      {/** ---------------------- Analysis ------------------------- */}
      <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        {/* <LineChart /> */}
        <ProjectWiseAnalytics />
        <CategoryWiseAnalytics />
      </div>

      {/** ---------------------- User source channels table  ------------------------- */}

      {/* <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        <UserChannels />
        <DoughnutChart />
      </div> */}
    </>
  );
}

export default Dashboard;
