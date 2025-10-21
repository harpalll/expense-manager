import { useForm } from "react-hook-form";
import TitleCard from "../../../components/Cards/TitleCard";
import { EyeOpenSVG } from "../../user/components/EyeOpenSVG";
import { EyeCloseSVG } from "../../user/components/EyeCloseSVG";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SuspenseContent from "../../../containers/SuspenseContent";

const EditPeople = () => {
  const { peopleId } = useParams();
  const [pageloading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchPeople = async () => {
      setPageLoading(true);
      try {
        const response = await axios.get(`/api/People/${peopleId}`);
        reset({
          peopleName: response.data.data.peopleName,
          mobileNumber: response.data.data.mobileNo,
          description: response.data.data.description,
        });
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
          console.error(
            "ERROR: No response received from server",
            error.request
          );
        } else {
          // Something else went wrong
          toast.error("ERROR: Request setup failed");
          console.error("ERROR: Request setup failed", error.message);
        }
      } finally {
        setPageLoading(false);
      }
    };
    fetchPeople();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data);
    
    try {
      const response = await axios.patch(`/api/People/${peopleId}`, {
        peopleName: data.peopleName,
        mobileNo: data.mobileNumber,
        description: data.description,
      });
      toast.success(response.data.message);
      window.location.href = "/app/people";
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
      {pageloading ? (
        <SuspenseContent />
      ) : (
        <TitleCard title="Edit People" topMargin="mt-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-control w-full mt-4">
                <label className="label">
                  <span className={"label-text text-base-content required"}>
                    Name
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...register("peopleName", {
                    required: "Name is required",
                  })}
                />
                {errors.peopleName && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.peopleName.message}
                  </p>
                )}
              </div>

              <div className="form-control w-full mt-4">
                <label className="label">
                  <span className={"label-text text-base-content required"}>
                    Mobile Number
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...register("mobileNumber", {
                    required: "Mobile Number is required",
                    pattern: {
                      value: /^[\d]{10}$/,
                      message: "Please enter a valid mobile number",
                    },
                  })}
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1">
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

export default EditPeople;
