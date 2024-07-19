import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import IconBtn from "../../Common/IconBtn"
import { buyCourse } from "../../../Services/Payment"
import { useCapturePaymentMutation, useSendPaymentSuccessEmailMutation, useVerifyPaymentMutation, } from "../../../Services/Operation/authApi"
// import { buyCourse } from "../../../../services/operations/studentFeaturesAPI"

export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state : any) => state.cart)
  const { user } = useSelector((state : any) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [CapturePayment] =useCapturePaymentMutation();
  const [SendPaymentSuccessEmail] = useSendPaymentSuccessEmailMutation();
  const [VerifyPayment] = useVerifyPaymentMutation();
  const handleBuyCourse = () => {
    const courses = cart.map((course : any) => course._id)
    // console.log("total courses",courses);
    buyCourse(courses, user, navigate, dispatch,CapturePayment,
      VerifyPayment,SendPaymentSuccessEmail,
      )
  }

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />
    </div>
  )
}