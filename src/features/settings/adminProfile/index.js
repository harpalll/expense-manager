import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from "../../common/headerSlice";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import ToogleInput from "../../../components/Input/ToogleInput";
import { fetchUserInfo } from "../../auth/authSlice";
import SuspenseContent from "../../../containers/SuspenseContent";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { fetchAdminById } from "../../admins/adminSlice";

function AdminProfile() {
  const dispatch = useDispatch();
  const [formLoading, setFormLoading] = useState(false);
  const { user, loading, error } = useSelector((state) => state.auth);
  const { adminDetails, detailsLoading } = useSelector((state) => state.admin);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAdminById(user.id));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (adminDetails) {
      setValue("userName", adminDetails.userName);
      setValue("mobileNo", adminDetails.mobileNo);
    }
  }, [adminDetails, setValue]);

  useEffect(() => {
    if (!watch("profileImage")?.[0]) {
      setPreview(null);
      return;
    }
    const file = watch("profileImage")[0];
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [watch("profileImage")]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loading loading-ball loading-md"></span>
        <p className="ml-3">Loading User details...</p>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setFormLoading(true);
    try {
      const formData = new FormData();
      formData.append("userName", data.userName);
      formData.append("mobileNo", data.mobileNo);

      if (data.profileImage && data.profileImage[0]) {
        formData.append("profileImage", data.profileImage[0]);
      }

      const response = await axios.patch("/api/User/Profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile Updated Successfully.");
      dispatch(fetchUserInfo());
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
      setFormLoading(false);
    }
  };

  return (
    <>
      <TitleCard title="Profile" topMargin={"mt-2"}>
        {loading ? (
          <>
            <SuspenseContent />
          </>
        ) : (
          <>
            {detailsLoading ? (
              <>
                <div className="w-full text-gray-300 dark:text-gray-200 bg-base-100 flex justify-center items-center">
                  <span className="loading loading-ball loading-xs"></span>
                  <span className="loading loading-ball loading-sm"></span>
                  <span className="loading loading-ball loading-md"></span>
                  <span className="loading loading-ball loading-xl"></span>
                  <span className="loading loading-ball loading-lg"></span>
                </div>
              </>
            ) : (
              <>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4">
                    <div className="form-control w-full mt-4">
                      {/* preview */}
                      {adminDetails?.profileImage && (
                        <div className="mt-3">
                          <p className="text-sm mb-1">Current Image:</p>
                          <img
                            src={adminDetails.profileImage}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border object-cover"
                          />
                        </div>
                      )}
                      <label className="label">
                        <span className="label-text required">
                          Profile Image
                        </span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="file-input file-input-bordered w-full"
                        {...register("profileImage", {
                          required: adminDetails?.profileImage
                            ? false
                            : "Profile image is required",
                        })}
                      />
                      {errors.profileImage && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.profileImage.message}
                        </p>
                      )}
                    </div>

                    {preview && (
                      <div className="mt-3">
                        <p className="text-sm mb-1">Preview:</p>
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-24 h-24 rounded-full border object-cover"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                      <div className="form-control w-full mt-4">
                        <label className="label">
                          <span
                            className={"label-text text-base-content required"}
                          >
                            Name
                          </span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          {...register("userName", {
                            required: "Name is required",
                          })}
                        />
                        {errors.userName && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.userName.message}
                          </p>
                        )}
                      </div>

                      <div className="form-control w-full mt-4">
                        <label className="label">
                          <span
                            className={"label-text text-base-content required"}
                          >
                            Mobile Number
                          </span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          {...register("mobileNo", {
                            required: "Mobile Number is required",
                            pattern: {
                              value: /^[\d]{10}$/,
                              message: "Please enter a valid mobile number",
                            },
                          })}
                        />
                        {errors.mobileNo && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.mobileNo.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-16">
                      <button
                        className="btn btn-primary float-right"
                        type="submit"
                      >
                        {formLoading ? (
                          <span className="loading loading-ball loading-md"></span>
                        ) : (
                          "Update"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </>
        )}
      </TitleCard>
    </>
  );
}

export default AdminProfile;
