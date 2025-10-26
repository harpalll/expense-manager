import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const GenerateTodaysReportModal = ({ title, closeModal }) => {
  const [type, setType] = useState(null); // 'Expense' | 'Income'
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const startDate = new Date().toISOString().split("T")[0];
      const endDate = new Date().toISOString().split("T")[0];

      const apiUrl =
        type === "Expense"
          ? `/api/Expense/report/startDate/${startDate}/endDate/${endDate}`
          : `/api/Income/report/startDate/${startDate}/endDate/${endDate}`;

      const res = await axios.get(apiUrl, { responseType: "blob" });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}_Report_${startDate}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Report downloaded successfully!");
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3 className="font-bold text-lg mb-4">{title}</h3>

      <div className="flex flex-col gap-4">
        <div className="flex gap-2 justify-center items-center">
          <button
            onClick={() => setType("Expense")}
            className={`btn btn-sm ${
              type === "Expense" ? "btn-primary" : "btn-outline"
            }`}
          >
            Expense
          </button>
          <button
            onClick={() => setType("Income")}
            className={`btn btn-sm ${
              type === "Income" ? "btn-primary" : "btn-outline"
            }`}
          >
            Income
          </button>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleGenerateReport}
            className="btn btn-primary btn-sm"
            disabled={loading || !type}
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>
          <button
            onClick={closeModal}
            className="btn btn-ghost btn-sm"
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default GenerateTodaysReportModal;
