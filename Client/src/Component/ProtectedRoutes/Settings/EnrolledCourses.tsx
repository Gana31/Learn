import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";
import { useEnrolledCourseMutation } from "../../../Services/Operation/authApi";

export default function EnrolledCourses() {
  const navigate = useNavigate();
  const [EnrolledCourse] = useEnrolledCourseMutation();

  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const getEnrolledCourses = async () => {
    try {
      const res = await EnrolledCourse({}).unwrap();
      setEnrolledCourses(res.data);
    } catch (error) {
      console.log("Could not fetch enrolled courses:", error);
      // Handle error fetching courses if needed
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="text-3xl text-richblack-50 mb-6">Enrolled Courses</div>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div> {/* Replace with your spinner */}
        </div>
      ) : !enrolledCourses.length ? (
        <p className="h-[10vh] flex items-center justify-center text-richblack-5">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Course list header */}
          <div className="flex rounded-t-lg bg-richblack-500">
            <p className="w-[45%] sm:w-2/5 px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3 hidden sm:block">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>
          {/* Render each enrolled course */}
          {enrolledCourses.map((course : any, index, array) => (
            <div
              className={`flex flex-col sm:flex-row items-center border border-richblack-700 ${
                index === array.length - 1 ? "rounded-b-lg" : "rounded-none"
              } mb-4 sm:mb-0`}
              key={course._id} // Assuming _id is unique for each course
            >
              <div
                className="flex w-full sm:w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick={() =>
                  navigate(
                    `/view-course/${course._id}/section/${
                      course.courseContent?.[0]?._id
                    }/sub-section/${
                      course.courseContent?.[0]?.subSection?.[0]?._id
                    }`
                  )
                }
              >
                <img
                  src={course.thumbnail?.url} // Assuming thumbnail is an object with a url property
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex flex-col gap-2">
                  <p className="font-semibold text-sm sm:text-base">{course.courseName}</p>
                  <p className="text-xs text-richblack-300 sm:text-sm">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>
              <div className="w-full sm:w-1/4 px-2 py-3 sm:px-0">
                <p className="hidden sm:block">{course?.totalDuration}</p>
              </div>
              <div className="flex w-full sm:w-1/5 flex-col gap-2 px-2 py-3">
                <p className="text-sm sm:text-base">Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
