import { useState } from "react";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";;
import { useNavigate } from "react-router-dom";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useVerifyEmailMutation } from "../Services/Operation/authApi";
import { clearAuthState } from "../Slice/AuthSlice";


function VerifyEmail() {
  const [activation_code, setactivation_code] = useState("");
  const accessToken = useSelector((state : any) => state.auth.accessToken);
const [VerifyEmail,{isLoading}] = useVerifyEmailMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

type activationType = {
  activation_code :string,
  accessToken :string,
}

  const handleVerifyAndSignup = (e : any) => {
    e.preventDefault();
    const data = {activation_code, accessToken}
    EmailVerfiyhandle(data);
  };
  const  EmailVerfiyhandle = async( data : activationType)=>{
    // console.log(accessToken)
    try {
      const result = await VerifyEmail(data);
      if(result) {
        await dispatch(clearAuthState())
        navigate("/login");
        toast.success(result?.data?.message || "Account Successfully Activated")
      }
    } catch (error : any) {
      toast.error(error?.data?.message || "Error While Verify The Otp")
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
      {isLoading ? (
        <div>
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
            Verify Email
          </h1>
          <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
            A verification code has been sent to you. Enter the code below
          </p>
          <form onSubmit={handleVerifyAndSignup}>
            <OTPInput
              value={activation_code}
              onChange={setactivation_code}
              numInputs={4}
              renderInput={(props : any) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
            <button
              type="submit"
              className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900"
            >
              Verify Email
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/signup">
              <p className="text-richblack-5 flex items-center gap-x-2">
                <BiArrowBack /> Back To Signup
              </p>
            </Link>
            <button
              className="flex items-center text-blue-100 gap-x-2"
            >
              <RxCountdownTimer />
              Resend it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;