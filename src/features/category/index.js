import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { showNotification } from "../common/headerSlice";
import { fetchCategory, fetchCategoryById } from "./categorySlice";
import SuspenseContent from "../../containers/SuspenseContent";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import ArrowUpIcon from "@heroicons/react/24/outline/ArrowUpIcon";
import ArrowDownIcon from "@heroicons/react/24/outline/ArrowDownIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon.js";
import EllipsisVerticalIcon from "@heroicons/react/24/outline/EllipsisVerticalIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";

const getStatusBadge = (isActive) => {
  return isActive ? (
    <div className="badge badge-success text-white">Active</div>
  ) : (
    <div className="badge badge-error text-white">Deleted</div>
  );
};

const getBadgeForExpense = (isExpense) => {
  return isExpense ? (
    <div className="badge badge-success text-white flex gap-2 items-center">
      <CheckIcon className={iconClasses} />
      Expense
    </div>
  ) : (
    <div className="badge badge-error text-white  flex gap-2 items-center">
      <XMarkIcon className={iconClasses} />
      Expense
    </div>
  );
};

const getBadgeForIncome = (isIncome) => {
  return isIncome ? (
    <div className="badge badge-success text-white  flex gap-2 items-center">
      <CheckIcon className={iconClasses} />
      Income
    </div>
  ) : (
    <div className="badge badge-error text-white  flex gap-2 items-center">
      <XMarkIcon className={iconClasses} />
      Income
    </div>
  );
};

const Actions = ({ category }) => {
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

  const handleToggleStatus = () => {
    dispatch(
      openModal({
        bodyType: "CONFIRMATION_MODAL",
        extraObject: {
          message: `Are you sure you want to toggle ${category.categoryName}'s status?`,
          onConfirm: async () => {
            console.log("deleting : " + category.categoryID);
          },
        },
      })
    );
  };

  const handleEdit = async (categoryID) => {
    try {
      //   const response = await dispatch(fetchCategoryById(categoryID));
      //   const categoryData = response.payload;

      dispatch(
        openModal({
          title: "Edit Category",
          bodyType: MODAL_BODY_TYPES.ADD_EDIT_CATEGORY,
          extraObject: {
            mode: "edit",
            categoryData: null,
          },
        })
      );
      dispatch(fetchCategoryById(categoryID));
    } catch (error) {
      console.error("Failed to fetch category:", error);
    }
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
            <button
              className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 normal-case text-gray-800 dark:text-gray-100"
              onClick={() => handleEdit(category.categoryID)}
            >
              {" "}
              <PencilIcon className="w-4 h-4" />
              Edit
            </button>
          </li>
          <li>
            <button
              className="flex items-center gap-2 px-4 py-2 w-full text-left  hover:bg-gray-100 dark:hover:bg-gray-700 normal-case text-gray-800 dark:text-gray-100"
              onClick={handleToggleStatus}
            >
              <ArrowPathIcon className="w-4 h-4" />
              Toggle Status
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

// * table columns definition
const columns = [
  { accessorKey: "categoryID", header: "Id", sortingFn: "alphanumeric" },
  { accessorKey: "categoryName", header: "Name" },
  {
    accessorKey: "isExpense",
    header: "Expense",
    cell: ({ getValue }) => getBadgeForExpense(getValue()),
  },
  {
    accessorKey: "isIncome",
    header: "Income",
    cell: ({ getValue }) => getBadgeForIncome(getValue()),
  },
  { accessorKey: "description", header: "Description" },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ getValue }) => getStatusBadge(getValue()),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions category={row.original} />,
    enableSorting: false,
  },
];

const iconClasses = `h-4 w-4 font-bold`;

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewCategoryModal = () => {
    dispatch(
      openModal({
        bodyType: MODAL_BODY_TYPES.ADD_EDIT_CATEGORY,
        extraObject: { mode: "add" },
      })
    );
  };

  return (
    <div className="inline-block float-right">
      <button
        className="btn px-6 btn-sm normal-case btn-primary"
        onClick={() => openAddNewCategoryModal()}
      >
        Add New
      </button>
    </div>
  );
};

function Category() {
  const { category, loading } = useSelector((state) => state.category);
  const dispatch = useDispatch();

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCategory());
  }, []);

  const table = useReactTable({
    data: category,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
        title="Categories"
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons />}
      >
        {loading ? (
          <>
            <SuspenseContent />
          </>
        ) : (
          <>
            {category?.length === 0 ? (
              <>
                <div className="flex justify-center items-center">
                  <h1>No Categories, click on add new to get started.</h1>
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

export default Category;
