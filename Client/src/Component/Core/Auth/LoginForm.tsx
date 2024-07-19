import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate} from "react-router-dom";
import { authApi, useLoginMutation } from "../../../Services/Operation/authApi";
import toast from "react-hot-toast";
import { userLoggedIn } from "../../../Slice/AuthSlice"

const LoginForm = () => {
    const [login] = useLoginMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const { email, password } = formData

    const handleOnChange = (e: any) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    }

    const handleOnSubmit = async(e: any) => {
        e.preventDefault()
        try {
        const result = await login(formData).unwrap()
        if (result.success == true) {
            // console.log(result);
            toast.success("Login successful!");
             localStorage.setItem("accessToken",JSON.stringify(result.accessToken));
             localStorage.setItem("user",JSON.stringify(result.user));
             await dispatch(userLoggedIn({accessToken : result.accessToken , user : result.user}));
             dispatch(authApi.util.invalidateTags(['User']))
            navigate('/dashboard/my-profile')
        }else{
            navigate('/login');
        }
        
        
        
    } catch (error : any) {
          toast.error(error.data?.message || "An Error Accuring while Login Account");
          navigate("/login");
        }
    }

    const [showPassword, setshowPassword] = useState<Boolean>(false)

    return (
        <form 
        onSubmit={handleOnSubmit}
        className="mt-6 flex w-full flex-col gap-y-4">
            <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5"
                >Email Address <sup className="text-pink-200">*</sup></p>
                <input type="text" required
                    name="email"
                    placeholder="Enter EmailAddress"
                    value={email}
                    onChange={handleOnChange}
                    style={{ boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18)" }}
                    className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
                />
            </label>
            <label className="relative">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5"
                >Password <sup className="text-pink-200">*</sup></p>
                <input type={showPassword ? "text" : "password"} required
                    name="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={handleOnChange}
                    style={{ boxShadow: "inset 0px -1px 0px rgba(255,255,255,0.18)" }}
                    className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
                />
                <span
                    onClick={() => setshowPassword((prev) => !prev)}
                    className="absolute right-3 top-[50px] z-[10] cursor-pointer"
                >
                    {showPassword ? (
                        <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                    ) : (
                        <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                    )}
                </span>
                <Link to="/forgot-password">
                    <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
                        Forgot Password
                    </p>
                </Link>
            </label>
            <button type="submit"
                className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900">
                Sign In
            </button>

        </form>
    )
}

export default LoginForm;