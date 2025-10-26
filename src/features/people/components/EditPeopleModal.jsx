import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchPeople } from "../peopleSlice";
import { useDispatch, useSelector } from "react-redux";

function EditPeopleModal({ closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { peopleDetails, detailsLoading } = useSelector(
    (state) => state.people
  );
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (peopleDetails) {
      setValue("peopleName", peopleDetails.peopleName);
      setValue("mobileNo", peopleDetails.mobileNo);
      setValue("description", peopleDetails.description);
      setValue("isActive", peopleDetails.isActive);
    }
  }, [peopleDetails, setValue]);

  if (detailsLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loading loading-ball loading-md"></span>
        <p className="ml-3">Loading People details...</p>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.patch(`/api/People/${peopleDetails.peopleID}`, data);
      toast.success("People updated successfully!");
      closeModal();
      dispatch(fetchPeople());
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

  return (
    <>
      <h3 className="font-bold text-lg mb-4">Edit People</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-6">
          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text required">Name</span>
            </label>
            <input
              type="text"
              {...register("peopleName", { required: "Name is required" })}
              className="input input-bordered w-full"
            />
            {errors.peopleName && (
              <p className="text-red-500 text-sm">
                {errors.peopleName.message}
              </p>
            )}
          </div>

          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text required">Mobile Number</span>
            </label>
            <input
              type="text"
              {...register("mobileNo", {
                required: "Mobile Number is required",
                pattern: {
                  value: /^[\d]{10}$/,
                  message: "Please enter a valid mobile number",
                },
              })}
              className="input input-bordered w-full"
            />
            {errors.mobileNo && (
              <p className="text-red-500 text-sm">{errors.mobileNo.message}</p>
            )}
          </div>
        </div>

        <div className="form-control w-full mt-4">
          <label className="label">
            <span className="label-text text-base-content">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            {...register("description")}
            rows={3}
          />
        </div>

        <div className="form-control w-full mt-4">
          <label className="label cursor-pointer">
            <span className="label-text required">Is Active ?</span>
          </label>
          <input type="checkbox" className="toggle" {...register("isActive")} />
        </div>

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
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </>
  );
}
export default EditPeopleModal;
