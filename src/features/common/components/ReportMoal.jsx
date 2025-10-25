import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ReportModal = ({ extraObject, closeModal }) => {
  const { type } = extraObject || {}; // 'Expense' | 'Income'
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [activeRange, setActiveRange] = useState(null); // "month" | "year" | null
  const isProgrammaticChange = useRef(false);

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    isProgrammaticChange.current = true;
    setStartDate(formatDateForInput(start));
    setEndDate(formatDateForInput(end));
    setActiveRange("month");
  };

  const handleThisYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);

    isProgrammaticChange.current = true;
    setStartDate(formatDateForInput(start));
    setEndDate(formatDateForInput(end));
    setActiveRange("year");
  };

  const handleManualChange = (setter) => (e) => {
    if (isProgrammaticChange.current) {
      isProgrammaticChange.current = false;
    }

    setter(e.target.value);
    if (!isProgrammaticChange.current) {
      setActiveRange(null);
    }
    // isProgrammaticChange.current = false;
  };

  const handleGenerateReport = async () => {
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End Date cannot be before Start Date");
      return;
    }

    setLoading(true);
    try {
      const apiUrl =
        type === "Expense"
          ? `/api/Expense/report/startDate/${startDate}/endDate/${endDate}`
          : `/api/Income/report/startDate/${startDate}/endDate/${endDate}`;

      const res = await axios.get(apiUrl, { responseType: "blob" });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${type}_Report_${startDate}_to_${endDate}.pdf`
      );
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
      <h3 className="font-bold text-lg mb-4">Generate {type} Report</h3>

      <div className="flex flex-col gap-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Start Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={startDate}
            onChange={handleManualChange(setStartDate)}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">End Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={endDate}
            onChange={handleManualChange(setEndDate)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleThisMonth}
            className={`btn btn-sm ${
              activeRange === "month" ? "btn-primary" : "btn-outline"
            }`}
          >
            This Month
          </button>
          <button
            onClick={handleThisYear}
            className={`btn btn-sm ${
              activeRange === "year" ? "btn-primary" : "btn-outline"
            }`}
          >
            This Year
          </button>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleGenerateReport}
            className="btn btn-primary btn-sm"
            disabled={loading}
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

export default ReportModal;
