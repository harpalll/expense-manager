import { useForm } from "react-hook-form";
import TitleCard from "../../../components/Cards/TitleCard";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddPeople = () => {
  const [loading, setLoading] = useState(false);
  //   form state
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/Project", {
        projectName: data.projectName,
        projectStartDate: data.projectStartDate,
        projectEndDate: data.projectEndDate,
        projectDetail: data.projectDetail,
        description: data.description,
      });
      toast.success(response.data.message);
      window.location.href = "/admin/project";
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
        
        if (error.response.status === 500) {
          toast.error(`ERROR: ${error.response.data.message}`);
        }

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
      <TitleCard title="Add Project" topMargin="mt-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6">
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className={"label-text text-base-content required"}>
                  Name
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="demo"
                {...register("projectName", {
                  required: "Name is required",
                })}
              />
              {errors.projectName && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.projectName.message}
                </p>
              )}
            </div>
          </div>
          <div className="divider"></div>

          <div className="grid grid-cols-2 gap-6">
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className={"label-text text-base-content"}>
                  Project Start Date
                </span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                {...register("projectStartDate")}
              />
            </div>
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className={"label-text text-base-content"}>
                  Project End Date
                </span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                {...register("projectEndDate")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className={"label-text text-base-content"}>
                  Project Details
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="demo"
                {...register("projectDetail")}
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
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

export default AddPeople;
