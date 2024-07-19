import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarIcon from '@mui/icons-material/Star';
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import '../../App.css';
import { Autoplay, FreeMode, Pagination } from "swiper/modules";

import { useGetAllReviewQuery } from "../../Services/Operation/authApi";

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 15;
  const { data: coursesList,refetch} = useGetAllReviewQuery({});

  useEffect(() => {
    if (coursesList && coursesList.data) {
      setReviews(coursesList.data);
      // console.log(coursesList.data)
    }
    refetch();
  }, [coursesList, refetch]);


  return (
    <div className="text-white w-full">
      <div className="my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-[100%] mySwiper"
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            }
          }}
        >
          {reviews.map((review : any, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25">
                <div className="flex items-center gap-4">
                  <img
                    src={review?.user.avatar ? review?.user?.avatar.avatar_url : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.FirstName} ${review?.user?.LastName}`}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-richblack-5">{review?.user?.FirstName} {review?.user?.LastName}</h1>
                    <h2 className="text-[12px] font-medium text-richblack-500">{review?.courseName}</h2>
                  </div>
                </div>
                <p className="font-medium text-richblack-25" style={{
                  minHeight: "50px", // Set minimum height
                  maxHeight: "100px", // Set maximum height
                  overflow: "hidden", // Hide overflow text
                }}>
                  {review?.review.split(" ").length > truncateWords ?
                    `${review?.review.split(" ").slice(0, truncateWords).join(" ")} ...` : 
                    `${review?.review}`}
                </p>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-yellow-100">{review?.rating.toFixed(1)}</h3>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {[...Array(5)].map((_, index) => (
                      index < review?.rating ? <StarIcon key={index} sx={{ color: 'yellow' }} /> : <StarBorderOutlinedIcon key={index} sx={{ color: 'yellow' }} />
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default ReviewSlider;
