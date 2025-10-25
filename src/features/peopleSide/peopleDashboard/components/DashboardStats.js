import { Link } from "react-router-dom";

function DashboardStats({
  title,
  icon,
  value,
  description,
  colorIndex,
  hasLink,
  link,
  linkName,
}) {
  const COLORS = ["primary", "primary"];

  const getDescStyle = () => {
    if (description.includes("↗︎"))
      return "font-bold text-green-700 dark:text-green-300";
    else if (description.includes("↙"))
      return "font-bold text-rose-500 dark:text-red-400";
    else return "";
  };

  return (
    <div className="stats shadow">
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
        <div className={"stat-desc  " + getDescStyle()}>{description}</div>
        {hasLink ? (
          <>
            <div className="stat-title dark:text-slate-300 mt-4">
              <Link to={link}>
                <button className="btn btn-sm btn-primary">{linkName}</button>
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default DashboardStats;
