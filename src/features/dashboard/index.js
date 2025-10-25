import DashboardStats from "./components/DashboardStats";

import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import BanknotesIcon from "@heroicons/react/24/outline/BanknotesIcon";

import LineChart from "./components/LineChart";
import DashboardTopBar from "./components/DashboardTopBar";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";
import DoughnutChart from "./components/DoughnutChart";
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
  const [totalActivePeople, setTotalActivePeople] = useState(null);

  const fetchTotalExpenseIncome = async () => {
    try {
      const res = await axios.get("api/total-incomes-and-expenses");
      setTotalExpense(res.data.data.totalExpenses);
      setTotalIncome(res.data.data.totalIncomes);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTotalActiveUsers = async () => {
    try {
      const res = await axios.get("api/People/Count");
      setTotalActivePeople(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchStats = async () => {
      try {
        await fetchTotalExpenseIncome();
        await fetchTotalActiveUsers();
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsData = [
    {
      title: "Active People",
      value: totalActivePeople,
      icon: <UsersIcon className="w-8 h-8" />,
      description: "Active People",
      hasLink: true,
      link: "/admin/people",
      linkName: "View People",
      showReport: false,
      showExcel: false,
    },
    {
      title: "Total Expense",
      value: totalExpense,
      icon: <CreditCardIcon className="w-8 h-8" />,
      description: "Total Expense",
      hasLink: true,
      link: "/admin/expense",
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
      link: "/admin/income",
      linkName: "View Income",
      showReport: true,
      showExcel: true,
    },
  ];

  const updateDashboardPeriod = (newRange) => {
    // Dashboard range changed, write code to refresh your values
    dispatch(
      showNotification({
        message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`,
        status: 1,
      })
    );
  };

  return (
    <>
      {/** ---------------------- Greet ------------------------- */}
      <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod} />

      {/** ---------------------- Stats ------------------------- */}
      <div className="grid lg:grid-cols-3 mt-4 md:grid-cols-3 grid-cols-1 gap-6">
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
      <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
        <CategoryStats />
        <ProjectStats />
      </div>

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
