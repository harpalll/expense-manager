import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import TitleCard from "../../../components/Cards/TitleCard";
import { useEffect, useState } from "react";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function CategoryWiseAnalytics() {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  //   categoryId 4
  // categoryName  "Travel"
  // totalExpense 100.5
  // totalIncome 100

  useEffect(() => {
    setLoading(true);
    const fetchCategoryData = async () => {
      try {
        const res = await axios.get("api/category-wise-totals");
        setCategoryData(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  // const labels = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  // ];
  // categoryData.push({
  //   categoryName: "demo",
  //   totalExpense: 275,
  //   totalIncome: 200,
  // });
  const labels = categoryData.map((c) => c.categoryName);

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        // data: labels.map(() => {
        //   return Math.random() * 1000 + 500;
        // }),
        data: categoryData.map((c) => c.totalIncome),
        backgroundColor: "rgba(255, 99, 132, 1)",
      },
      {
        label: "Expense",
        // data: labels.map(() => {
        //   return Math.random() * 1000 + 500;
        // }),
        data: categoryData.map((c) => c.totalExpense),
        backgroundColor: "rgba(53, 162, 235, 1)",
      },
    ],
  };

  return (
    <TitleCard title={"Category Wise Analytics"}>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-ball loading-md"></span>
          <p className="ml-3"> Loading Category Wise Analytics...</p>
        </div>
      ) : (
        <Bar options={options} data={data} />
      )}
    </TitleCard>
  );
}

export default CategoryWiseAnalytics;
