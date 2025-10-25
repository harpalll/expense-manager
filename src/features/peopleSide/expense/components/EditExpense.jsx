import { useForm } from "react-hook-form";
import TitleCard from "../../../../components/Cards/TitleCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveProject } from "../../../project/projectSlice";
import { fetchActiveExpenseCategory } from "../../../category/categorySlice";
import { fetchActiveExpenseSubCategory } from "../../../subCategory/subCategorySlice";
import { useParams } from "react-router-dom";
import { fetchExpenseById } from "../../../expense/expenseSlice";
import SuspenseContent from "../../../../containers/SuspenseContent";

const EditExpense = () => {
  const { expenseId } = useParams();
  const { expenseDetails, detailsLoading } = useSelector(
    (state) => state.expense
  );

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const dispatch = useDispatch();
  //   form state
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const { activeExpenseCategory, activeExpenseCategoryLoading } = useSelector(
    (state) => state.category
  );
  const { activeExpenseSubCategory, activeExpenseSubCategoryLoading } =
    useSelector((state) => state.subCategory);

  const { activeProject, activeProjectLoading } = useSelector(
    (state) => state.project
  );

  useEffect(() => {
    dispatch(fetchExpenseById(expenseId));
  }, []);

  useEffect(() => {
    if (expenseDetails) {
      dispatch(fetchActiveProject());
      dispatch(fetchActiveExpenseCategory());

      // SubCategory -> CategoryID
      if (expenseDetails.categoryID) {
        dispatch(fetchActiveExpenseSubCategory(expenseDetails.categoryID));
      }
    }
  }, [dispatch, expenseDetails]);

  useEffect(() => {
    if (expenseDetails) {
      //   ? This Function converts to UTC date can cause some issues
      //   const formatDate = (d) => {
      //     // format: "YYYY-MM-DD"
      //     if (!d) return "";
      //     const date = new Date(d);
      //     return date.toISOString().split("T")[0];
      //   };
      //   ? This converts locally
      const formatDate = (d) => {
        if (!d) return "";
        const date = new Date(d);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const formattedExpenseDate = formatDate(expenseDetails.expenseDate);
      setValue("ExpenseDate", formattedExpenseDate);

      const selectedCategoryFromDB = activeExpenseCategory.find(
        (c) => c.categoryID === expenseDetails.categoryID
      );

      const selectedSubCategoryFromDB = activeExpenseSubCategory.find(
        (c) => c.subCategoryID === expenseDetails.SubCategoryID
      );

      const selectedProjectFromDB = activeProject.find(
        (p) => p.projectID === expenseDetails.ProjectID
      );

      setSelectedCategory(selectedCategoryFromDB);
      setSelectedSubCategory(selectedSubCategoryFromDB);
      setSelectedProject(selectedProjectFromDB);

      setValue("CategoryID", expenseDetails.categoryID);
      setValue("SubCategoryID", expenseDetails.subCategoryID);
      setValue("ProjectID", expenseDetails.projectID);

      setValue("Amount", expenseDetails.amount);
      setValue("ExpenseDetail", expenseDetails.expenseDetail);
      setValue("Description", expenseDetails.description);
    }
  }, [expenseDetails, setValue]);

  useEffect(() => {
    if (!watch("AttachmentPath")?.[0]) {
      setPreview(null);
      return;
    }
    const file = watch("AttachmentPath")[0];
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [watch("AttachmentPath")]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("ExpenseDate", data.ExpenseDate);
      formData.append("CategoryID", data.CategoryID);
      formData.append("SubCategoryID", data.SubCategoryID);
      formData.append("ProjectID", data.ProjectID);
      formData.append("Amount", data.Amount);
      formData.append("ExpenseDetail", data.ExpenseDetail);
      formData.append("Description", data.Description);

      if (data.AttachmentPath && data.AttachmentPath[0]) {
        formData.append("AttachmentPath", data.AttachmentPath[0]);
      }

      const response = await axios.patch(
        `/api/Expense/${expenseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
      window.location.href = "/people/expense";
    } catch (error) {
      if (error.response) {
        toast.error(`ERROR: ${error.response.data.title}`);
        console.error(
          `ERROR: Status Code: ${error.response.status} || ERRORS:`,
          error.response.data
        );
      } else if (error.request) {
        // no response
        toast.error("ERROR: No response received from server");
        console.error("ERROR: No response received from server", error.request);
      } else {
        // Something else went wrong
        toast.error("ERROR: Request setup failed");
        console.error("ERROR: Request setup failed", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Edit Expense" topMargin="mt-2">
        {detailsLoading ? (
          <>
            <SuspenseContent />
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-6">
                <div className="form-control w-full mt-4">
                  <label className="label">
                    <span className={"label-text text-base-content required"}>
                      Expense Date
                    </span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    {...register("ExpenseDate", {
                      required: "Expense Date is required",
                    })}
                  />
                  {errors.ExpenseDate && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.ExpenseDate.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="divider"></div>

              <div className="grid grid-cols-2 gap-6">
                <div className="form-control w-full mt-4">
                  {activeExpenseCategoryLoading ? (
                    <>
                      <div className="flex justify-center items-center py-8">
                        <span className="loading loading-ball loading-sm"></span>
                        <p className="ml-3"> Loading Categories...</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <label className="label">
                        <span className="label-text">Select Category</span>
                      </label>
                      <select
                        {...register("CategoryID")}
                        className="select select-bordered w-full"
                        onChange={(e) => {
                          dispatch(
                            fetchActiveExpenseSubCategory(e.target.value)
                          );
                          // setValue("isExpense", selected.isExpense);
                          // setValue("isIncome", selected.isIncome);
                        }}
                      >
                        <option value="">-- Select Category --</option>
                        {activeExpenseCategory?.map((cat) => (
                          <option key={cat.categoryID} value={cat.categoryID}>
                            {cat.categoryName}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>

                <div className="form-control w-full mt-4">
                  {activeExpenseCategoryLoading ? (
                    <>
                      <div className="flex justify-center items-center py-8">
                        <span className="loading loading-ball loading-sm"></span>
                        <p className="ml-3"> Loading Categories...</p>
                      </div>
                    </>
                  ) : (
                    <>
                      {activeExpenseSubCategoryLoading ? (
                        <>
                          <div className="flex justify-center items-center py-8">
                            <span className="loading loading-ball loading-sm"></span>
                            <p className="ml-3"> Loading Sub Categories...</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <label className="label">
                            <span className="label-text">
                              Select Sub Category
                            </span>
                          </label>
                          <select
                            {...register("SubCategoryID")}
                            className="select select-bordered w-full"
                          >
                            <option value="">-- Select Sub Category --</option>
                            {activeExpenseSubCategory?.map((subCat) => (
                              <option
                                key={subCat.subCategoryID}
                                value={subCat.subCategoryID}
                              >
                                {subCat.subCategoryName}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="form-control w-full mt-4">
                  {activeProjectLoading ? (
                    <>
                      <div className="flex justify-center items-center py-8">
                        <span className="loading loading-ball loading-sm"></span>
                        <p className="ml-3"> Loading Projects...</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <label className="label">
                        <span className="label-text">Select Project</span>
                      </label>
                      <select
                        {...register("ProjectID")}
                        className="select select-bordered w-full"
                      >
                        <option value="">-- Select Project --</option>
                        {activeProject?.map((project) => (
                          <option
                            key={project.projectID}
                            value={project.projectID}
                          >
                            {project.projectName}
                          </option>
                        ))}
                      </select>
                      {/* {errors.ProjectID && (
                <p className="text-red-500 text-sm">
                  {errors.ProjectID.message}
                </p>
              )} */}
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="form-control w-full mt-4">
                  <label className="label">
                    <span className={"label-text text-base-content required"}>
                      Amount
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    {...register("Amount", {
                      required: "Amount is required",
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: "Please enter only numbers",
                      },
                    })}
                  />
                  {errors.Amount && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.Amount.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="form-control w-full mt-4">
                  <label className="label">
                    <span className={"label-text text-base-content"}>
                      Expense Detail
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="demo"
                    {...register("ExpenseDetail")}
                    rows={3}
                  />
                </div>

                <div className="form-control w-full mt-4">
                  <label className="label">
                    <span className={"label-text text-base-content"}>
                      Description
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="demo"
                    {...register("Description")}
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="form-control w-full mt-4">
                  {/* preview */}
                  {expenseDetails?.attachmentPath && (
                    <div className="mt-3">
                      <p className="text-sm mb-1">Current Image:</p>
                      <img
                        src={expenseDetails.attachmentPath}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border object-cover"
                      />
                    </div>
                  )}
                  <label className="label">
                    <span className="label-text required">
                      Attachment (Image must be a PNG or JPG or pdf and not
                      exceed 2 MB)
                    </span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    {...register("AttachmentPath")}
                  />
                </div>
                {preview && (
                  <div className="mt-3">
                    <p className="text-sm mb-1">Preview:</p>
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-24 h-24 rounded-full border object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="mt-16">
                <button className="btn btn-primary float-right" type="submit">
                  {loading ? (
                    <span className="loading loading-ball loading-md"></span>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </TitleCard>
    </>
  );
};

export default EditExpense;
