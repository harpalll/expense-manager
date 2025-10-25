import { useForm } from "react-hook-form";
import TitleCard from "../../../../components/Cards/TitleCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveProject } from "../../../project/projectSlice";
import { fetchActiveIncomeCategory } from "../../../category/categorySlice";
import { fetchActiveIncomeSubCategory } from "../../../subCategory/subCategorySlice";

const AddExpense = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

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
    if (!watch("AttachmentPath")?.[0]) {
      setPreview(null);
      return;
    }
    const file = watch("AttachmentPath")[0];
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [watch("AttachmentPath")]);

  useEffect(() => {
    dispatch(fetchActiveProject());
  }, []);

  useEffect(() => {
    dispatch(fetchActiveIncomeCategory());
  }, []);

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
      //   formData.append("AttachmentPath", data.AttachmentPath);
      formData.append("Description", data.description);

      if (data.AttachmentPath && data.AttachmentPath[0]) {
        formData.append("AttachmentPath", data.AttachmentPath[0]);
      }

      const response = await axios.post("/api/Income", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message);
      window.location.href = "/people/income";
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
      <TitleCard title="Add Income" topMargin="mt-2">
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
                  <span className="loading loading-ball loading-sm"></span>
                  loading categories..
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
                      dispatch(fetchActiveIncomeSubCategory(e.target.value));
                      // setValue("isExpense", selected.isExpense);
                      // setValue("isIncome", selected.isIncome);
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
                  <span className="loading loading-ball loading-sm"></span>
                  loading sub-categories..
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
              <label className="label">
                <span className="label-text">
                  {activeProjectLoading
                    ? "loading projects.."
                    : "Select Project"}
                </span>
              </label>
              <select
                {...register("ProjectID")}
                className="select select-bordered w-full"
              >
                <option value="">-- Select Project --</option>
                {activeProject?.map((project) => (
                  <option key={project.projectID} value={project.projectID}>
                    {project.projectName}
                  </option>
                ))}
              </select>
              {/* {errors.ProjectID && (
                <p className="text-red-500 text-sm">
                  {errors.ProjectID.message}
                </p>
              )} */}
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
                {...register("description")}
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text required">
                  Attachment (Image must be a PNG or JPG or pdf and not exceed 2
                  MB)
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
                "Add"
              )}
            </button>
          </div>
        </form>
      </TitleCard>
    </>
  );
};

export default AddExpense;
