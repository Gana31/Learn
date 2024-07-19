import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"


import { setCourse, setEditCourse } from "../../../../Slice/CourseSlice"
import RenderSteps from "../RenderSteps"
import { useGetFullCourseDetailsMutation } from "../../../../Services/Operation/authApi"

export default function EditCourse() {
  const dispatch = useDispatch()
  const { courseId } = useParams()
  const[GetFullCourseDetails] = useGetFullCourseDetailsMutation();
  const { course } = useSelector((state : any) => state.course)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    ;(async () => {
      setLoading(true)
    //   console.log("frontend",courseId)
      const result = await GetFullCourseDetails({courseId:courseId});
    //   console.log('coursedetail in edit',result.data.data)
      if (result?.data.data.courseDetails) {
        dispatch(setEditCourse(true))
        dispatch(setCourse(result?.data.data.courseDetails))
      }
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="grid flex-1 place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Course
      </h1>
      <div className="mx-auto max-w-[600px]">
        {course ? (
          <RenderSteps />
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            Course not found
          </p>
        )}
      </div>
    </div>
  )
}