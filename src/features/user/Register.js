import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import InputText from "../../components/Input/InputText";
import { useForm } from "react-hook-form";
import { EyeOpenSVG } from "./components/EyeOpenSVG.jsx";
import { EyeCloseSVG } from "./components/EyeCloseSVG.jsx";

/*
    General Component: 
     <InputText
                  defaultValue={registerObj.emailId}
                  updateType="emailId"
                  containerStyle="mt-4"
                  labelTitle="Email Id"
                  updateFormValue={updateFormValue}
                />
*/

function Register() {
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
    // demo delay
    await new Promise((r) =>
      setTimeout(() => {
        r();
      }, 2000)
    );
    const registerData = {
      UserName: data.name,
      EmailAddress: data.email,
      Password: data.password,
      confirmPassword: data.confirmPassword,
      MobileNo: data.mobileNumber,
    };
    console.log(registerData);
    setLoading(false);

    // setLoading(true);
    // TODO: Call API to check user credentials and save token in localstorage

    // localStorage.setItem("token", "DumyTokenHere");
    // setLoading(false);
    // window.location.href = "/app/welcome";
  };

  //   const submitForm = (e) => {
  //     e.preventDefault();
  //     setErrorMessage("");

  //     if (registerObj.name.trim() === "")
  //       return setErrorMessage("Name is required! (use any value)");
  //     if (registerObj.emailId.trim() === "")
  //       return setErrorMessage("Email Id is required! (use any value)");
  //     if (registerObj.password.trim() === "")
  //       return setErrorMessage("Password is required! (use any value)");
  //     else {
  //       setLoading(true);
  //       // Call API to check user credentials and save token in localstorage
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
            <h2 className="text-2xl font-semibold mb-2 text-center">
              Register
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <div className="form-control w-full mt-4">
                  <label className="label">
                    <span className={"label-text text-base-content"}>Name</span>
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
                    <span className={"label-text text-base-content"}>
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
                    <span className={"label-text text-base-content"}>
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
                    <span className={"label-text text-base-content"}>
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
                    <span className={"label-text text-base-content"}>
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
