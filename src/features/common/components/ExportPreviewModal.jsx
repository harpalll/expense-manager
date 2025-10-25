import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { toast } from "react-toastify";

const ExcelPreviewModal = ({ extraObject, closeModal }) => {
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { type } = extraObject || {}; // type: 'Expense' | 'Income'

  const apiUrl =
    type === "Expense" ? "/api/Expense/excel" : "/api/Income/excel";
  console.log(type, apiUrl);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);
        const res = await axios.get(apiUrl, {
          responseType: "arraybuffer",
        });

        const workbook = XLSX.read(res.data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        let headerRowIndex = jsonData.findIndex((row) =>
          row.some((cell) =>
            ["category", "amount", "date", "project"].some((keyword) =>
              String(cell || "")
                .toLowerCase()
                .includes(keyword)
            )
          )
        );

        if (headerRowIndex === -1) headerRowIndex = 0;

        const validData = jsonData.slice(headerRowIndex);

        const headers = validData[0];
        const dataRows = validData.slice(1);

        const cleanData = dataRows.map((row) =>
          headers.reduce((acc, key, i) => {
            acc[key || `Column${i + 1}`] = row[i] ?? "";
            return acc;
          }, {})
        );

        setPreviewData(cleanData.slice(0, 5)); // first 5 rows
      } catch (error) {
        console.error(error);
        toast.error("Failed to load Excel preview");
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, []);

  const handleDownload = async () => {
    try {
      const res = await axios.get(apiUrl, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${
          type === "Expense" ? "Expense_Report_" : "Income_Report_"
        }${Date.now()}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Excel downloaded successfully!");
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Download failed");
    }
  };

  return (
    <>
      <h3 className="font-bold text-lg mb-4">Excel Preview</h3>
      <div className="p-2">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-ball loading-md"></span>
            <p className="ml-3">Loading Excel Preview...</p>
          </div>
        ) : previewData.length > 0 ? (
          <>
            <div className="overflow-x-auto border border-base-300 rounded-lg">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    {Object.keys(previewData[0]).map((key) => (
                      <th key={key} className="text-sm font-semibold">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="text-sm">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleDownload}
                className="btn btn-primary btn-sm"
              >
                Download Full Excel
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-sm text-base-content/60 py-6">
            No data found in the Excel file.
          </p>
        )}
      </div>
    </>
  );
};

export default ExcelPreviewModal;
