import { useForm } from "react-hook-form";
import TitleCard from "../../../components/Cards/TitleCard";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { EyeOpenSVG } from "../../user/components/EyeOpenSVG";
import { EyeCloseSVG } from "../../user/components/EyeCloseSVG";

const AddPeople = () => {
  const userInfo = JSON.parse(localStorage.getItem("info"));

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  //   form state
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/People", {
        peopleName: data.peopleName,
        emailAddress: data.emailAddress,
        peopleCode: data.peopleCode,
        password: data.password,
        confirmPassword: data.confirmPassword,
        mobileNo: data.mobileNumber,
        description: data.description,
        userID: userInfo.id,
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
      <TitleCard title="Add People" topMargin="mt-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className={"label-text text-base-content"}>Code</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="demo"
                {...register("peopleCode")}
              />
            </div>

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
                  Email Id
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="demo@mail.com"
                {...register("emailAddress", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              {errors.emailAddress && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.emailAddress.message}
                </p>
              )}
            </div>
          </div>
          <div className="divider"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className={"label-text text-base-content required"}>
                  Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="****"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value:
                        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/,
                      message:
                        "Password must be at least 4 characters, include one uppercase letter, one number, and one special character",
                    },
                  })}
                  className="w-full pr-10 input input-bordered"
                />

                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOpenSVG /> : <EyeCloseSVG />}
                </div>
              </div>
              {errors.password && (
                <p className="text-error text-sm">{errors.password.message}</p>
              )}
            </div>

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className={"label-text text-base-content required"}>
                  Confirm Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={"text"}
                  placeholder="****"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="w-full pr-10 input input-bordered"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-error text-sm">
                  {errors.confirmPassword.message}
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
                placeholder="xxxxxxxxxx"
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
