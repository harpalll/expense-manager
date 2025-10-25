import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import SuspenseContent from "../../../containers/SuspenseContent.js";
import EllipsisVerticalIcon from "@heroicons/react/24/outline/EllipsisVerticalIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import ArrowUpIcon from "@heroicons/react/24/outline/ArrowUpIcon";
import ArrowDownIcon from "@heroicons/react/24/outline/ArrowDownIcon";
import { openModal } from "../../common/modalSlice.js";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  fetchIncome,
  fetchIncomeById,
  deleteIncome,
} from "../../income/incomeSlice.js";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { MODAL_BODY_TYPES } from "../../../utils/globalConstantUtil.js";

//   ? converts date format
const formatDate = (incomeDate) => {
  if (!incomeDate) return "";
  const date = new Date(incomeDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// const formattedIncomeDate = formatDate(incomeDetails.incomeDate);
// setValue("IncomeDate", formattedIncomeDate);

// * table columns definition
const columns = [
  {
    accessorKey: "incomeID",
    header: "Id",
    sortingFn: "alphanumeric",
    cell: ({ getValue }) => getValue() || "—",
  },
  {
    accessorKey: "incomeDate",
    header: "Date",
    cell: ({ getValue }) => formatDate(getValue()) || "-",
  },
  {
    accessorKey: "categoryName",
    header: "Category",
    cell: ({ getValue }) => getValue() || "—",
  },
  {
    accessorKey: "subCategoryName",
    header: "Sub Category",
    cell: ({ getValue }) => getValue() || "—",
  },
  {
    accessorKey: "projectName",
    header: "Project",
    cell: ({ getValue }) => getValue() || "—",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => getValue() || "—",
  },
  {
    accessorKey: "incomeDetail",
    header: "Detail",
    cell: ({ getValue }) => getValue() || "—",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => getValue() || "—",
  },
  {
    accessorKey: "attachmentPath",
    header: "Attachment",
    cell: ({ getValue }) => renderImage(getValue()) || "-",
    enableSorting: false,
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ getValue }) => getStatusBadge(getValue()) || "-",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions income={row.original} /> || "-",
    enableSorting: false,
  },
];

const getStatusBadge = (isActive) => {
  return isActive ? (
    <div className="badge badge-success text-white">Active</div>
  ) : (
    <div className="badge badge-error text-white">Deleted</div>
  );
};

const renderImage = (attachmentPath) => {
  return (
    <img
      src={attachmentPath}
      alt="Attachment"
      className="w-16 h-16 rounded-full border object-cover"
    />
  );
};

const Actions = ({ income }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = () => {
    dispatch(
      openModal({
        bodyType: "CONFIRMATION_MODAL",
        extraObject: {
          message: `Are you sure you want to delete ${income.incomeDetail}?`,
          onConfirm: async () => {
            dispatch(deleteIncome(income.incomeID))
              .unwrap()
              .then(() => dispatch(fetchIncome()))
              .catch((err) => console.error(err));
          },
        },
      })
    );
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        className="btn btn-ghost btn-sm btn-square normal-case"
        onClick={() => setOpen((prev) => !prev)}
      >
        <EllipsisVerticalIcon className="w-5 h-5" />
      </button>

      {open && (
        <ul className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded z-50 menu p-2">
          <li>
            <Link
              to={`/people/income/edit/${income.incomeID}`}
              className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 normal-case text-gray-800 dark:text-gray-100"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </li>
          <li>
            <button
              className="flex items-center gap-2 px-4 py-2 w-full text-left  hover:bg-red-100 dark:hover:bg-red-700 normal-case text-red-800 dark:text-red-100"
              onClick={handleDelete}
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

function Income() {
  const { income, loading, error } = useSelector((state) => state.income);
  const dispatch = useDispatch();
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    dispatch(fetchIncome());
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const table = useReactTable({
    data: income,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleExportExcel = async () => {
    dispatch(
      openModal({
        title: "Excel Preview",
        bodyType: MODAL_BODY_TYPES.EXCEL_PREVIEW,
        extraObject: {
          type: "Income",
        },
      })
    );
  };

  const TopSideButtons = () => {
    return (
      <div className="flex gap-4 float-right">
        <button
          className="flex items-center btn px-6 btn-sm normal-case btn-success text-white"
          onClick={handleExportExcel}
        >
          <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
          Export Excel
        </button>

        <Link to={"/people/income/add"}>
          <button className="btn px-6 btn-sm normal-case btn-primary">
            Add New
          </button>
        </Link>
      </div>
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <TitleCard
        title="Income"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        {loading ? (
          <SuspenseContent />
        ) : (
          <>
            {income?.length === 0 ? (
              <>
                <div className="flex justify-center items-center">
                  <h1>No income.</h1>
                </div>
              </>
            ) : (
              <>
                <div className="overflow-x-auto w-full">
                  {/* search */}
                  <div className="w-full flex items-center gap-2 pb-4">
                    <div className="flex items-center input input-bordered w-full px-2">
                      <svg
                        className="h-5 w-5 text-gray-400 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>

                      <input
                        ref={searchRef}
                        type="search"
                        className="flex-1 bg-transparent outline-none placeholder-gray-400"
                        placeholder="Search"
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-1 text-sm opacity-60">
                      <kbd className="kbd kbd-sm">⌘</kbd>
                      <kbd className="kbd kbd-sm">K</kbd>
                    </div>
                  </div>

                  <table className="table w-full">
                    <thead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="px-2 py-1 font-bold cursor-pointer select-none"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <div className="flex items-center gap-1">
                                <span>
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                </span>
                                {{
                                  asc: <ArrowUpIcon className="w-4 h-4" />,
                                  desc: <ArrowDownIcon className="w-4 h-4" />,
                                }[header.column.getIsSorted()] ?? null}
                              </div>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {table.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-base-300 cursor-pointer "
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-2 py-1">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </TitleCard>
    </>
  );
}

export default Income;
