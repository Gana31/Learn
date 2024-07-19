import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

// import { updateProfile } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../Common/IconBtn"
import toast from "react-hot-toast"
import { authApi, useUpdateProfileMutation } from "../../../Services/Operation/authApi"
import { setuser } from "../../../Slice/AuthSlice"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

export default function EditProfile() {
  const { user } = useSelector((state: any) => state.auth)
  const [UpdateProfile] =useUpdateProfileMutation();
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitProfileForm = async (data: any) => {
    try {
    const result = await UpdateProfile(data).unwrap()
    if (result.success == true) {
        // console.log(result);
        toast.success("YOu Update is successful! done");
        dispatch(setuser(result.data));
         dispatch(authApi.util.invalidateTags(['User']))
        navigate('/dashboard/my-profile')
    }else{
        navigate('/login');
    }
    
    
    
}catch (error: any) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitProfileForm)}>
        {/* Profile Information */}
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
          <h2 className="text-lg font-semibold text-richblack-5">
            Profile Information
          </h2>
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="firstName" className="label-style">
                First Name
              </label>
              <input
                type="text"
                id="FirstName"
                placeholder="Enter first name"
                className="form-style"
                {...register("FirstName", { required: true })}
                defaultValue={user?.FirstName}
              />
              {errors.FirstName?.message && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.FirstName.message as string}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="lastName" className="label-style">
                Last Name
              </label>
              <input
                type="text"
                id="LastName"
                placeholder="Enter last name"
                className="form-style"
                {...register("LastName", { required: true })}
                defaultValue={user?.LastName}
              />
              {errors.LastName?.message && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.LastName.message as string}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="dateOfBirth" className="label-style">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                className="form-style"
                {...register("dateOfBirth", {
                  required: {
                    value: true,
                    message: "Please enter your Date of Birth.",
                  },
                  max: {
                    value: new Date().toISOString().split("T")[0],
                    message: "Date of Birth cannot be in the future.",
                  },
                })}
                defaultValue={user?.dateOfBirth}
              />
              {errors.dateOfBirth?.message && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.dateOfBirth.message as string}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="gender" className="label-style">
                Gender
              </label>
              <select
                id="gender"
                className="form-style"
                {...register("gender", { required: true })}
                defaultValue={user?.gender}
              >
                {genders.map((ele, i) => {
                  return (
                    <option key={i} value={ele}>
                      {ele}
                    </option>
                  )
                })}
              </select>
              {errors.gender?.message && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.gender.message as string}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="contactNumber" className="label-style">
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                placeholder="Enter Contact Number"
                className="form-style"
                {...register("contactNumber", {
                  required: {
                    value: true,
                    message: "Please enter your Contact Number.",
                  },
                  maxLength: { value: 12, message: "Invalid Contact Number" },
                  minLength: { value: 10, message: "Invalid Contact Number" },
                })}
                defaultValue={user?.contactNumber}
              />
              {errors.contactNumber?.message && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.contactNumber.message as string}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="about" className="label-style">
                About
              </label>
              <input
                type="text"
                id="about"
                placeholder="Enter Bio Details"
                className="form-style"
                {...register("about", { required: true })}
                defaultValue={user?.about}
              />
              {errors.about?.message && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.about.message as string}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              navigate("/dashboard/my-profile")
            }}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Save" />
        </div>
      </form>
    </>
  )
}
