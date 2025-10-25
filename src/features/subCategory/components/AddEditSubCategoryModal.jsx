import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchSubCategory } from "../subCategorySlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveCategory } from "../../category/categorySlice";

function AddEditSubCategoryModal({ extraObject, closeModal }) {
  const [loading, setLoading] = useState(false);
  const { mode } = extraObject || {}; // mode: 'add' | 'edit'
  const dispatch = useDispatch();

  const { activeCategory, activeCategoryLoading } = useSelector(
    (state) => state.category
  );
  const { subCategoryDetails, detailsLoading } = useSelector(
    (state) => state.subCategory
  );
  const [selectedCategory, setSelectedCategory] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const subCategoryData =
    mode === "edit" ? subCategoryDetails || extraObject.subCategoryData : null;

  useEffect(() => {
    dispatch(fetchActiveCategory());
  }, [dispatch]);

  useEffect(() => {
    if (mode === "edit" && subCategoryData) {
      const selected = activeCategory.find(
        (c) => c.categoryID === subCategoryData.categoryID
      );
      setSelectedCategory(selected);
      setValue("subCategoryName", subCategoryData.subCategoryName);
      setValue("categoryID", subCategoryData.categoryID);
      setValue("isExpense", subCategoryData.isExpense);
      setValue("isIncome", subCategoryData.isIncome);
      setValue("isActive", subCategoryData.isActive);
      setValue("description", subCategoryData.description);
    }
  }, [mode, subCategoryData, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (mode === "add") {
        await axios.post("/api/SubCategory", data);
        toast.success("Sub Category added successfully!");
      } else {
        await axios.patch(
          `/api/SubCategory/${subCategoryData.subCategoryID}`,
          data
        );
        toast.success("Sub Category updated successfully!");
      }
      closeModal();
      dispatch(fetchSubCategory());
    } catch (error) {
      if (error.response.status === 400) {
        const errors = error.response.data.errors;
        for (const key in errors) {
          errors[key].forEach((message) => {
            toast.error(message);
          });
        }
      }
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
        <p className="ml-3">Loading sub category details...</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="font-bold text-lg mb-4">
        {mode === "add" ? "Add New Sub Category" : "Edit Sub Category"}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text required">Name</span>
          </label>
          <input
            type="text"
            {...register("subCategoryName", { required: "Name is required" })}
            className="input input-bordered w-full"
          />
          {errors.subCategoryName && (
            <p className="text-red-500 text-sm">
              {errors.subCategoryName.message}
            </p>
          )}
        </div>

        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text required">
              {activeCategoryLoading
                ? "loading categories.."
                : "Select Category"}
            </span>
          </label>
          <select
            {...register("categoryID", { required: "Category is required" })}
            className="select select-bordered w-full"
            onChange={(e) => {
              const categoryID = Number(e.target.value);
              const selected = activeCategory.find(
                (c) => c.categoryID === categoryID
              );
              setSelectedCategory(selected);
              console.log(
                selectedCategory,
                selected.isExpense,
                selected.isIncome
              );

              if (selected) {
                setValue("isExpense", selected.isExpense);
                setValue("isIncome", selected.isIncome);
              }
            }}
          >
            <option value="">-- Select Category --</option>
            {activeCategory?.map((cat) => (
              <option key={cat.categoryID} value={cat.categoryID}>
                {cat.categoryName}
              </option>
            ))}
          </select>
          {errors.categoryID && (
            <p className="text-red-500 text-sm">{errors.categoryID.message}</p>
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
              disabled={selectedCategory && !selectedCategory.isExpense}
            />
            {selectedCategory && !selectedCategory.isExpense && (
              <p className="text-xs text-gray-500 mt-1">
                Disabled (Category not marked as Expense)
              </p>
            )}
          </div>
          <div className="form-control w-full mt-4">
            <label className="label cursor-pointer">
              <span className="label-text required">Is Income ?</span>
            </label>
            <input
              type="checkbox"
              className="toggle"
              {...register("isIncome")}
              disabled={selectedCategory && !selectedCategory.isIncome}
            />
            {selectedCategory && !selectedCategory.isIncome && (
              <p className="text-xs text-gray-500 mt-1">
                Disabled (Category not marked as Income)
              </p>
            )}
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
export default AddEditSubCategoryModal;
