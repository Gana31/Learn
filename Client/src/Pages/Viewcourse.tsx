import { useEffect, useState } from "react"
import { useDispatch} from "react-redux"
import { Outlet, useParams } from "react-router-dom"
import CourseReviewModal from "../Component/Core/course/CourseReviewModal"
import VideoDetailsSidebar from "../Component/Core/course/VideoDetailsSidebar"
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from "../Slice/ViewCourseSlice"
import { useGetFullCourseDetailsMutation } from "../Services/Operation/authApi"


export default function Viewcourse() {
  const { courseId } = useParams()
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)
    const [GetFullCourseDetails] = useGetFullCourseDetailsMutation();
  useEffect(() => {
    ;(async () => {
      const courseData = await GetFullCourseDetails({courseId : courseId})
    //   console.log("Course Data here... ", courseData.data.data)
      dispatch(setCourseSectionData(courseData.data.data.courseDetails.courseContent))
      dispatch(setEntireCourseData(courseData.data.data.courseDetails))
      dispatch(setCompletedLectures(courseData.data.data.completedVideos))
      let lectures = 0
      courseData?.data.data.courseDetails?.courseContent?.forEach((sec : any) => {
        lectures += sec.subSection.length
      })
      dispatch(setTotalNoOfLectures(lectures))
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        <VideoDetailsSidebar setReviewModal={setReviewModal} />
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6">
            <Outlet />
          </div>
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}