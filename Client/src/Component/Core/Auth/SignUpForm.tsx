import Tab from "../../Common/Tab"
import { ACCOUNT_TYPE, tabData } from "../../../data/homePageData"
import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRegistrationMutation } from "../../../Services/Operation/authApi";
import { setUserRegisterToken } from "../../../Slice/AuthSlice";


const SignUpForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [Registration] = useRegistrationMutation();
    const [role, setrole] = useState<string>(ACCOUNT_TYPE.STUDENT);
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    const [formData, setFormData] = useState({
        FirstName : "",
        LastName:"",
        email: "",
        password: "",
        confirmPassword: "",
      })
      const {FirstName, LastName,email ,password, confirmPassword } = formData
      const handleOnChange = (e : any) => {
        setFormData((prevData) => ({
          ...prevData,
          [e.target.name]: e.target.value,
        }))
      }
      const handleOnSubmit = (e : any) => {
        e.preventDefault()
    
        if (password !== confirmPassword) {
          toast.error("Passwords Do Not Match")
          return
        }

        if (password.length < 6) {
            toast.error("Password should be at least 6 characters long");
            return;
        }
        const signupData = {
          ...formData,
          role,
        }
            signupHandle(signupData);
      }

      const signupHandle = async(signupData : any) =>{
        try {
            const {FirstName,LastName , email,password}=signupData;
            const result = await Registration({FirstName,LastName,email,password,role}).unwrap();
            if(result.success == true){
                dispatch(setUserRegisterToken({accessToken : result.data}))
                setFormData({
                    FirstName:"",
                    LastName:"",
                    email: "",
                    password: "",
                    confirmPassword: "",
                  })
                  setrole(ACCOUNT_TYPE.STUDENT)
                navigate("/verify-email");
                toast.success("Please Enter The Otp Send to email");
            }

            
        } catch (error : any) {
            toast.error(error.data?.message || "Error Acouring while the Register the User")
        }
      }
    return (
        <div>
          <Tab tabData={tabData} field={role} setField={setrole} />
        
            <form onSubmit={handleOnSubmit} className="flex w-full flex-col gap-y-4">
            <div className="flex gap-x-4">
            <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="FirstName"
              value={FirstName}
              onChange={handleOnChange}
              placeholder="Enter first name"
              style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
              }}
              className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
            />
          </label>
                    <label>
                        <p className="mb-1 text-[0.875rem] leadind-[1.375rem] text-richblack-5">
                            Last Name <sup className="text-pink-200">*</sup></p>
                        <input type="text"
                            required
                            name="LastName"
                            value={LastName}
                            onChange={handleOnChange}
                            placeholder="Enter The Full name"
                            style={{ boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18" }}
                            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                        />
                    </label>
            </div>
                <label className="w-full">
                    <p className="mb-1 text-[0.875rem] leadind-[1.375rem] text-richblack-5">
                        Email Address <sup className="text-pink-200">*</sup></p>
                    <input type="text"
                        required
                        name="email"
                        value={email}
                        onChange={handleOnChange}
                        placeholder="Enter Email Address"
                        style={{ boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18" }}
                        className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                    />
                </label>
                <div className="flex gap-x-4">
                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leadind-[1.375rem] text-richblack-5">
                            Create Password <sup className="text-pink-200">*</sup></p>
                        <input type={showPassword ? "text" : "password"}
                            required
                            name="password"
                            value={password}
                            onChange={handleOnChange}
                            placeholder="Enter Password"
                            style={{ boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18" }}
                            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
                        />
                        <span
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-[50px] z-[10] cursor-pointer"
                        >
                            {showPassword ? (
                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                            ) : (
                                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                            )}
                        </span>
                    </label>
                    <label className="relative">
                        <p className="mb-1 text-[0.875rem] leadind-[1.375rem] text-richblack-5">
                            Confirm Password <sup className="text-pink-200">*</sup></p>
                        <input type={showConfirmPassword ? "text" : "password"}
                            required
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={handleOnChange}
                            style={{ boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18" }}
                            className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-10 text-richblack-5"
                        />
                        <span
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-3 top-[50px] z-[10] cursor-pointer"
                        >
                            {showConfirmPassword ? (
                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                            ) : (
                                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                            )}
                        </span>
                    </label>
                </div>
                <button type="submit"
                className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900">
                    Create Account
                </button>
            </form>
        </div>
    )
}

export default SignUpForm