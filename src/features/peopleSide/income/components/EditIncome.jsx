import { useForm } from "react-hook-form";
import TitleCard from "../../../../components/Cards/TitleCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveProject } from "../../../project/projectSlice";
import { fetchActiveIncomeCategory } from "../../../category/categorySlice";
import { fetchActiveIncomeSubCategory } from "../../../subCategory/subCategorySlice";
import { useParams } from "react-router-dom";
import { fetchIncomeById } from "../../../income/incomeSlice";
import SuspenseContent from "../../../../containers/SuspenseContent";

const EditIncome = () => {
  const { incomeId } = useParams();
  const { incomeDetails, detailsLoading } = useSelector(
    (state) => state.income
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

  const { activeIncomeCategory, activeIncomeCategoryLoading } = useSelector(
    (state) => state.category
  );
  const { activeIncomeSubCategory, activeIncomeSubCategoryLoading } =
    useSelector((state) => state.subCategory);

  const { activeProject, activeProjectLoading } = useSelector(
    (state) => state.project
  );

  useEffect(() => {
    dispatch(fetchIncomeById(incomeId));
  }, []);

  useEffect(() => {
    if (incomeDetails) {
      dispatch(fetchActiveProject());
      dispatch(fetchActiveIncomeCategory());

      // SubCategory -> CategoryID
      if (incomeDetails.categoryID) {
        dispatch(fetchActiveIncomeSubCategory(incomeDetails.categoryID));
      }
    }
  }, [dispatch, incomeDetails]);

  useEffect(() => {
    if (incomeDetails) {
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

      const formattedIncomeDate = formatDate(incomeDetails.incomeDate);
      setValue("IncomeDate", formattedIncomeDate);

      const selectedCategoryFromDB = activeIncomeCategory.find(
        (c) => c.categoryID === incomeDetails.categoryID
      );

      const selectedSubCategoryFromDB = activeIncomeSubCategory.find(
        (c) => c.subCategoryID === incomeDetails.subCategoryID
      );

      const selectedProjectFromDB = activeProject.find(
        (p) => p.projectID === incomeDetails.ProjectID
      );

      setSelectedCategory(selectedCategoryFromDB);
      setSelectedSubCategory(selectedSubCategoryFromDB);
      setSelectedProject(selectedProjectFromDB);

      setValue("CategoryID", incomeDetails.categoryID);
      setValue("SubCategoryID", incomeDetails.subCategoryID);
      setValue("ProjectID", incomeDetails.projectID);

      setValue("Amount", incomeDetails.amount);
      setValue("IncomeDetail", incomeDetails.incomeDetail);
      setValue("Description", incomeDetails.description);
    }
  }, [incomeDetails, setValue]);

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
      formData.append("IncomeDate", data.IncomeDate);
      formData.append("CategoryID", data.CategoryID);
      formData.append("SubCategoryID", data.SubCategoryID);
      formData.append("ProjectID", data.ProjectID);
      formData.append("Amount", data.Amount);
      formData.append("IncomeDetail", data.IncomeDetail);
      formData.append("Description", data.Description);

      if (data.AttachmentPath && data.AttachmentPath[0]) {
        formData.append("AttachmentPath", data.AttachmentPath[0]);
      }

      const response = await axios.patch(`/api/Income/${incomeId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message);
      window.location.href = "/people/income";
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          const errors = error.response.data.errors;
          for (const key in errors) {
            errors[key].forEach((message) => {
              toast.error(message);
            });
          }
        }
        // toast.error(`ERROR: ${error.response.data.title}`);
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
      <TitleCard title="Edit Income" topMargin="mt-2">
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
                      Income Date
                    </span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    {...register("IncomeDate", {
                      required: "Income Date is required",
                    })}
                  />
                  {errors.IncomeDate && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.IncomeDate.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="divider"></div>

              <div className="grid grid-cols-2 gap-6">
                <div className="form-control w-full mt-4">
                  {activeIncomeCategoryLoading ? (
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
                          const selectedValue = e.target.value;
                          setValue("CategoryID", selectedValue);
                          setValue("SubCategoryID", "");

                          if (selectedValue) {
                            dispatch(
                              fetchActiveIncomeSubCategory(selectedValue)
                            );
                          } else {
                            dispatch({
                              type: "subCategory/clearActiveIncomeSubCategory",
                            });
                          }
                        }}
                      >
                        <option value="">-- Select Category --</option>
                        {activeIncomeCategory?.map((cat) => (
                          <option key={cat.categoryID} value={cat.categoryID}>
                            {cat.categoryName}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>

                <div className="form-control w-full mt-4">
                  {activeIncomeSubCategoryLoading ? (
                    <>
                      <div className="flex justify-center items-center py-8">
                        <span className="loading loading-ball loading-sm"></span>
                        <p className="ml-3"> Loading Sub Categories...</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <label className="label">
                        <span className="label-text">Select Sub Category</span>
                      </label>
                      <select
                        {...register("SubCategoryID")}
                        className="select select-bordered w-full"
                      >
                        <option value="">-- Select Sub Category --</option>
                        {activeIncomeSubCategory?.map((subCat) => (
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
                      Income Detail
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="demo"
                    {...register("IncomeDetail")}
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
                  {incomeDetails?.attachmentPath && (
                    <div className="mt-3">
                      <p className="text-sm mb-1">Current Attachment:</p>
                      {incomeDetails.attachmentPath
                        .toLowerCase()
                        .endsWith(".pdf") ? (
                        <a
                          href={incomeDetails.attachmentPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-xs btn-outline btn-neutral"
                        >
                          View PDF
                        </a>
                      ) : (
                        <img
                          src={incomeDetails.attachmentPath}
                          alt="Attachment"
                          className="w-24 h-24 rounded-full border object-cover"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      )}
                    </div>
                  )}

                  <label className="label">
                    <span className="label-text">
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
                    {watch("AttachmentPath")?.[0]?.type ===
                    "application/pdf" ? (
                      <a
                        href={preview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-xs btn-outline btn-neutral"
                      >
                        View PDF
                      </a>
                    ) : (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-24 h-24 rounded-full border object-cover"
                      />
                    )}
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

export default EditIncome;
