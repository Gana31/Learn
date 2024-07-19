import {useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import useOnClickOutside from "../../../Hooks/useOnClickOutside"
import toast from "react-hot-toast"
import { useLogoutMutation } from "../../../Services/Operation/authApi"
import { LogOutState } from "../../../Slice/AuthSlice"
import { clearUser } from "../../../Slice/ProfileSlice"


const ProfileDropDown = () => {
  const { user } = useSelector((state : any) => state.auth)
  const [Logout] =useLogoutMutation({});
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate();

  useOnClickOutside(ref, () => setOpen(false))

  const logouthandle = async()=>{
    setOpen(false)
    try {
      const result = await Logout({}).unwrap();
      console.log(result)
      if (result.success === true) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user")
        dispatch(LogOutState());
        dispatch(clearUser());
        navigate('/');
        toast.success(result?.data?.message || "Logout Successfull")
      }
    } catch ( error: any) {
      console.log(error)
      // toast.error(error || "Error While User Logout")
    }
  }

  if (!user) return null
  return (
    <div>
        <button className="relative" onClick={() => setOpen(true)}>
      <div className="flex items-center gap-x-1">
        <img
          src={user?.avatar?.avatar_url}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[30px] rounded-full object-cover"
        />
        <AiOutlineCaretDown className="text-sm text-richblack-100" />
      </div>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800"
          ref={ref}
        >
          <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
              <VscDashboard className="text-lg" />
              Dashboard
            </div>
          </Link>
          <div
            onClick={
              logouthandle
            }
            className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>
        </div>
      )}
    </button>
    </div>
  )
}

export default ProfileDropDown