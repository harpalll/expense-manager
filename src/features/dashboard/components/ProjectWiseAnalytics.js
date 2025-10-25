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

function ProjectWiseAnalytics() {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(false);
  //   categoryId 4
  // categoryName  "Travel"
  // totalExpense 100.5
  // totalIncome 100

  useEffect(() => {
    setLoading(true);
    const fetchProjectData = async () => {
      try {
        const res = await axios.get("api/project-wise-totals");
        setProjectData(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const labels = projectData.map((c) => c.projectName);

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: projectData.map((c) => c.totalIncome),
        backgroundColor: "rgba(255, 99, 132, 1)",
      },
      {
        label: "Expense",
        data: projectData.map((c) => c.totalExpense),
        backgroundColor: "rgba(53, 162, 235, 1)",
      },
    ],
  };

  return (
    <TitleCard title={"Project Wise Analytics"}>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-ball loading-md"></span>
          <p className="ml-3"> Loading Project Wise Analytics...</p>
        </div>
      ) : (
        <Bar options={options} data={data} />
      )}
    </TitleCard>
  );
}

export default ProjectWiseAnalytics;
