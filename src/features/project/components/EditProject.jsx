import { useForm } from "react-hook-form";
import TitleCard from "../../../components/Cards/TitleCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SuspenseContent from "../../../containers/SuspenseContent";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectById } from "../projectSlice";

const EditProject = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { projectDetails, detailsLoading } = useSelector(
    (state) => state.project
  );
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchProjectById(projectId));
  }, []);

  useEffect(() => {
    if (projectDetails) {
      console.log(projectDetails);
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

      const formattedStartDate = formatDate(projectDetails.projectStartDate);
      const formattedEndDate = formatDate(projectDetails.projectEndDate);
      console.log(formattedStartDate, formattedEndDate);

      setValue("projectName", projectDetails.projectName);
      setValue("projectStartDate", formattedStartDate);
      setValue("projectEndDate", formattedEndDate);
      setValue("projectDetail", projectDetails.projectDetail);
      setValue("description", projectDetails.description);
      setValue("isActive", projectDetails.isActive);
    }
  }, [projectDetails, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.patch(`/api/Project/${projectId}`, {
        projectName: data.projectName,
        projectStartDate: data.projectStartDate,
        projectEndDate: data.projectEndDate,
        projectDetail: data.projectDetail,
        description: data.description,
        isActive: data.isActive,
      });
      toast.success(response.data.message);
      window.location.href = "/admin/project";
    } catch (error) {
      if (error.response) {
        toast.error(`ERROR: ${error.response.data.message}`);
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
      {detailsLoading ? (
        <SuspenseContent />
      ) : (
        <TitleCard title="Edit Project" topMargin="mt-2">
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
                  "Edit"
                )}
              </button>
            </div>
          </form>
        </TitleCard>
      )}
    </>
  );
};

export default EditProject;
