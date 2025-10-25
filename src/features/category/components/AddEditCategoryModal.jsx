import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchCategory } from "../categorySlice";
import { useDispatch, useSelector } from "react-redux";

function AddEditCategoryModal({ extraObject, closeModal }) {
const [loading, setLoading] = useState(false);
const { mode } = extraObject || {}; // mode: 'add' | 'edit'
const dispatch = useDispatch();
const { categoryDetails, detailsLoading } = useSelector(
  (state) => state.category
);
const {
  register,
  handleSubmit,
  setValue,
  formState: { errors },
} = useForm();

const categoryData =
  mode === "edit" ? categoryDetails || extraObject.categoryData : null;

  useEffect(() => {
    if (mode === "edit" && categoryData) {
      setValue("categoryName", categoryData.categoryName);
      setValue("isExpense", categoryData.isExpense);
      setValue("isIncome", categoryData.isIncome);
      setValue("isActive", categoryData.isActive);
      setValue("description", categoryData.description);
    }
  }, [mode, categoryData, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (mode === "add") {
        await axios.post("/api/Category", data);
        toast.success("Category added successfully!");
      } else {
        await axios.patch(`/api/Category/${categoryData.categoryID}`, data);
        toast.success("Category updated successfully!");
      }
      closeModal();
      dispatch(fetchCategory());
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (detailsLoading && mode === "edit") {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loading loading-ball loading-md"></span>
        <p className="ml-3">Loading category details...</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="font-bold text-lg mb-4">
        {mode === "add" ? "Add New Category" : "Edit Category"}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text required">Name</span>
          </label>
          <input
            type="text"
            {...register("categoryName", { required: "Name is required" })}
            className="input input-bordered w-full"
          />
          {errors.categoryName && (
            <p className="text-red-500 text-sm">
              {errors.categoryName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="form-control w-full mt-4">
            <label className="label cursor-pointer">
              <span className="label-text required">Is Expense ?</span>
            </label>
            <input
              type="checkbox"
              className="toggle"
              {...register("isExpense")}
            />
          </div>
          <div className="form-control w-full mt-4">
            <label className="label cursor-pointer">
              <span className="label-text required">Is Income ?</span>
            </label>
            <input
              type="checkbox"
              className="toggle"
              {...register("isIncome")}
            />
          </div>
        </div>

        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <input
            type="text"
            {...register("description")}
            className="input input-bordered w-full"
          />
        </div>

        {mode === "edit" && (
          <div className="form-control w-full mt-4">
            <label className="label cursor-pointer">
              <span className="label-text required">Is Active ?</span>
            </label>
            <input
              type="checkbox"
              className="toggle"
              {...register("isActive")}
            />
          </div>
        )}

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            className="btn btn-outline"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {loading ? (
              <>
                <span className="loading loading-ball loading-md"></span>
              </>
            ) : (
              <>{mode === "add" ? "Add" : "Save Changes"}</>
            )}
          </button>
        </div>
      </form>
    </>
  );
}
export default AddEditCategoryModal;
