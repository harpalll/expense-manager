import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import InputText from "../../components/Input/InputText";
import { useForm } from "react-hook-form";
import { EyeOpenSVG } from "./components/EyeOpenSVG.jsx";
import { EyeCloseSVG } from "./components/EyeCloseSVG.jsx";
import axios from "axios";
import { toast } from "react-toastify";

function Register() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);

  //   form state
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  useEffect(() => {
    if (!watch("ProfileImage")?.[0]) {
      setPreview(null);
      return;
    }
    const file = watch("ProfileImage")[0];
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [watch("ProfileImage")]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("UserName", data.name);
      formData.append("EmailAddress", data.email);
      formData.append("Password", data.password);
      formData.append("ConfirmPassword", data.confirmPassword);
      formData.append("MobileNo", data.mobileNumber);
      formData.append("ExpenseDetail", data.ExpenseDetail);
      //   formData.append("AttachmentPath", data.AttachmentPath);

      if (data.ProfileImage && data.ProfileImage[0]) {
        formData.append("ProfileImage", data.ProfileImage[0]);
      }

      const response = await axios.post("/api/User", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log(`SUCCESS: ${response.data.message}`);
      toast.success("Registration Successfull");
      window.location.href = "/login";
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

    // localStorage.setItem("token", "DumyTokenHere");
    // window.location.href = "/app/welcome";
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-5xl  shadow-xl">
        <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
          <div className="">
            <LandingIntro />
          </div>
          <div className="py-24 px-10">
            <h2 className="text-2xl font-semibold mb-2 text-center">
              Register
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <div className="grid grid-cols-1 gap-6">
                  <div className="form-control w-full mt-4">
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
                      {...register("ProfileImage")}
                    />
                  </div>
                  {preview && (
                    <div className="mt-3">
                      <p className="text-sm mb-1">Preview:</p>
                      {watch("ProfileImage")?.[0]?.type ===
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
                    {...register("name", {
                      required: "Name is required",
                    })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.name.message}
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
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>

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
                    <p className="text-error text-sm">
                      {errors.password.message}
                    </p>
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

                    {/* <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOpenSVG /> : <EyeCloseSVG />}
                    </div> */}
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

              <button type="submit" className={"btn mt-2 w-full btn-primary"}>
                {loading ? (
                  <span className="loading loading-ball loading-md"></span>
                ) : (
                  "Register"
                )}
              </button>

              <div className="text-center mt-4">
                Already have an account?{" "}
                <Link to="/login">
                  <span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Login
                  </span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
