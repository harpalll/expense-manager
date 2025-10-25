import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "../../../features/common/modalSlice";
import { MODAL_BODY_TYPES } from "../../../utils/globalConstantUtil";
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

function DashboardStats({
  title,
  icon,
  value,
  description,
  colorIndex,
  hasLink,
  link,
  linkName,
  showReport,
  showExcel,
}) {
  const COLORS = ["primary", "primary"];
  const dispatch = useDispatch();

  const handleExportExcel = () => {
    dispatch(
      openModal({
        title: `${title} Excel Export`,
        bodyType: MODAL_BODY_TYPES.EXCEL_PREVIEW,
        extraObject: {
          type: title.includes("Expense") ? "Expense" : "Income",
        },
      })
    );
  };

  const handleReportGeneration = () => {
    dispatch(
      openModal({
        title: `${title} Report`,
        bodyType: MODAL_BODY_TYPES.GENERATE_REPORT,
        extraObject: {
          type: title.includes("Expense") ? "Expense" : "Income",
        },
      })
    );
  };

  return (
    <div className="stats shadow relative">
      <div className="stat">
        <div
          className={`stat-figure dark:text-slate-300 text-${
            COLORS[colorIndex % 2]
          }`}
        >
          {icon}
        </div>
        <div className="stat-title dark:text-slate-300">{title}</div>
        <div
          className={`stat-value dark:text-slate-300 text-${
            COLORS[colorIndex % 2]
          }`}
        >
          {value}
        </div>
        <div className="stat-desc">{description}</div>

        <div className="stat-actions flex items-center gap-2">
          {/* <button className="btn btn-xs">Withdrawal</button>
          <button className="btn btn-xs">Deposit</button> */}
          {hasLink && (
            <Link to={link}>
              <button className="btn btn-xs btn-outline btn-neutral">
                {linkName}
              </button>
            </Link>
          )}
          {showExcel && (
            <div className="tooltip tooltip-top" data-tip="Export Excel">
              <button
                onClick={handleExportExcel}
                className="btn btn-xs btn-success btn-circle"
              >
                <ArrowDownTrayIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          {showReport && (
            <div className="tooltip tooltip-top" data-tip="Generate Report">
              <button
                onClick={handleReportGeneration}
                className="btn btn-xs btn-primary btn-circle"
              >
                <DocumentTextIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;
