import { RiDeleteBin6Line } from "react-icons/ri";
import Rating from "@mui/material/Rating";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../../Slice/CartSlice";
import StarIcon from '@mui/icons-material/Star';
export default function RenderCartCourses() {
  const { cart } = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-1 flex-col">
      {cart.map((course: any, indx: any) => (
        <div
          key={course._id}
          className={`flex w-full flex-wrap items-start justify-between gap-6 ${
            indx !== cart.length - 1 && "border-b border-b-richblack-400 pb-6"
          } ${indx !== 0 && "mt-6"} `}
        >
          <div className="flex flex-1 flex-col gap-4 xl:flex-row">
            <img
              src={course?.thumbnail.url}
              alt={course?.courseName}
              className="h-[148px] w-[220px] rounded-lg object-cover"
            />
            <div className="flex flex-col space-y-1">
              <p className="text-lg font-medium text-richblack-5">
                {course?.courseName}
              </p>
              <p className="text-sm text-richblack-300">
                {course?.category?.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-200">{course?.ratingAndReviews?.length || 3.5}</span>
                <Rating
                  name="read-only"
                  value={course?.rating || 3.5}
                  readOnly
                  precision={0.1}
                  size="small"
                  emptyIcon={<StarIcon style={{ opacity: 0.55 ,color:"white"}} fontSize="inherit" />}
                
                />
                <span className="text-richblack-400">
                  {course?.ratingAndReviews?.length} Ratings
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={() => dispatch(removeFromCart(course._id))}
              className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200"
            >
              <RiDeleteBin6Line />
              <span>Remove</span>
            </button>
            <p className="mb-6 text-3xl font-medium text-yellow-100">
              ₹ {course?.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
