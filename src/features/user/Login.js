import { useState } from "react";
import { Link } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import ErrorText from "../../components/Typography/ErrorText";
// import InputText from "../../components/Input/InputText";
import { useForm } from "react-hook-form";
import { EyeOpenSVG } from "./components/EyeOpenSVG.jsx";
import { EyeCloseSVG } from "./components/EyeCloseSVG.jsx";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //   form state
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("/login", {
        emailAddress: data.email,
        password: data.password,
        Role: data.role === "admin" ? 0 : 1,
      });
      const token = response.data.data;
      // console.log(`SUCCESS: ${response.data.message}`);
      toast.success("Login Successfull");
      localStorage.setItem("token", token);
      if (data.role === "admin") {
        window.location.href = "/admin/app/dashboard";
      } else {
        window.location.href = "/people/people-dashboard";
      }
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

        // toast.error(`ERROR: ${error.response.data.message}`);
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

  //   const submitForm = (e) => {
  //     e.preventDefault();
  //     setErrorMessage("");

  //     if (loginObj.emailId.trim() === "")
  //       return setErrorMessage("Email Id is required! (use any value)");
  //     if (loginObj.password.trim() === "")
  //       return setErrorMessage("Password is required! (use any value)");
  //     else {
  //       setLoading(true);
  //       // TODO: Call API to check user credentials and save token in localstorage
  //       localStorage.setItem("token", "DumyTokenHere");
  //       setLoading(false);
  //       window.location.href = "/app/welcome";
  //     }
  //   };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-5xl  shadow-xl">
        <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
          <div className="">
            <LandingIntro />
          </div>
          <div className="py-24 px-10">
            <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                {/* ROLE RADIO */}
                <div className="form-control w-full mt-4">
                  <label className="label">
                    <span className="label-text text-base-content required">
                      Role
                    </span>
                  </label>

                  <div className="flex gap-2">
                    {["employee", "admin"].map((role) => (
                      <label
                        key={role}
                        className={`flex-1 text-center border rounded-lg py-2 cursor-pointer transition-all duration-200
                            ${
                              watch("role") === role
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-base-200 text-base-content border-base-300 hover:border-blue-400"
                            }`}
                      >
                        <input
                          type="radio"
                          value={role}
                          className="hidden"
                          {...register("role", {
                            required: "Please select a role.",
                          })}
                        />
                        <span className="capitalize">{role}</span>
                      </label>
                    ))}
                  </div>

                  {errors.role && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.role.message}
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
                      className="w-full pr-10 input  input-bordered"
                      autoComplete="true"
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
              </div>

              <div className="text-right text-primary">
                <Link to="/forgot-password">
                  <span className="text-sm  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Forgot Password?
                  </span>
                </Link>
              </div>

              <button type="submit" className={"btn mt-2 w-full btn-primary"}>
                {loading ? (
                  <span className="loading loading-ball loading-md"></span>
                ) : (
                  "Login"
                )}
              </button>

              <div className="text-center mt-4">
                Don't have an account yet?{" "}
                <Link to="/register">
                  <span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Register
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

export default Login;
