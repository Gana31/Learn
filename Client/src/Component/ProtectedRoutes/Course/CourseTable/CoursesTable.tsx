import React, { useEffect, useState } from "react";
import { COURSE_STATUS } from "../../../../data/homePageData";
import { formattedDate } from "../../../../data/formattedDate";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../Common/ConfirmationModal";
import { useDeleteCourseMutation, useGetInstructorCoursesQuery } from "../../../../Services/Operation/authApi";

interface Course {
  _id: string;
  courseName: string;
  thumbnail: {url : string};
  courseDescription: string;
  createdAt: string;
  status: string;
  price: number;
}

interface CoursesTableProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

const CoursesTable: React.FC<CoursesTableProps> = ({ courses, setCourses }) => {
  const navigate = useNavigate();
  const[DeleteCourse] = useDeleteCourseMutation();
  const [loading, setLoading] = React.useState(false);
  const [confirmationModal, setConfirmationModal] = React.useState<any>(null);
  const [TruncateLength,setTruncateLength] = useState(30);

  const { data: coursesList ,refetch: refetchCourses } = useGetInstructorCoursesQuery({});
  // console.log("updated data",coursesList);
  const handleCourseDelete = async (courseId: string) => {
    setLoading(true);
    // Simulate API call to delete course
    const deletecoruse = await DeleteCourse({courseId:courseId});
    // toast.success(deletecoruse)
    console.log("Deleted Course",deletecoruse);
    await refetchCourses();
    // console.log("updated data",coursesList);
    if (coursesList) {
      setCourses(coursesList)
    }
    setConfirmationModal(null)
    setLoading(false)
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setTruncateLength(10); // Set to 10 for mobile view
      } else {
        setTruncateLength(30); // Set to 30 for larger screens
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially to set the correct value based on the initial screen size

    return () => window.removeEventListener('resize', handleResize);
  }, []);




  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-xl border border-richblack-800">
          <thead>
            <tr className="rounded-t-md border-b border-b-richblack-800 px-6 py-2">
              <th className="text-left text-sm font-medium uppercase text-richblack-100 px-6 py-4">
                Courses
              </th>
              <th className="text-left text-sm font-medium uppercase text-richblack-100 px-6 py-4">
                Duration
              </th>
              <th className="text-left text-sm font-medium uppercase text-richblack-100 px-6 py-4">
                Price
              </th>
              <th className="text-left text-sm font-medium uppercase text-richblack-100 px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td
                  className="py-10 text-center text-2xl font-medium text-richblack-100"
                  colSpan={4}
                >
                  No courses found
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course._id} className="border-b border-richblack-800 px-6 py-8">
                  <td className="flex flex-1 flex-col lg:flex-row gap-x-4 px-6 py-4">
                    <img
                      src={course?.thumbnail?.url}
                      alt={course.courseName}
                      className="lg:h-[148px] lg:w-[220px] rounded-lg object-cover mb-4"
                    />
                    <div className="sm:mt-4 flex flex-col justify-between">
                      <div className="text-xs lg:text-lg lg:font-semibold text-richblack-5">
                        {course.courseName}
                      </div>
                      <div className="text-xs text-richblack-300">
                        {course.courseDescription.split(" ").length > TruncateLength
                          ? course.courseDescription
                              .split(" ")
                              .slice(0, TruncateLength)
                              .join(" ") + "..."
                          : course.courseDescription}
                      </div>
                      <div className="text-[12px] text-white">
                        Created: {formattedDate(course.createdAt)}
                      </div>
                      {course.status === COURSE_STATUS.DRAFT ? (
                        <div className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                          <HiClock size={14} />
                          Drafted
                        </div>
                      ) : (
                        <div className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                          <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                            <FaCheck size={8} />
                          </div>
                          Published
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="text-sm font-medium text-richblack-100 px-6 py-4">
                    2hr 30min
                  </td>
                  <td className="text-sm font-medium text-richblack-100 px-6 py-4">
                    ₹{course.price}
                  </td>
                  <td className="text-sm font-medium text-richblack-100 px-6 py-4 flex space-x-2">
                    <button
                      disabled={loading}
                      onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                      title="Edit"
                      className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                    >
                      <FiEdit2 size={20} />
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => {
                        setConfirmationModal({
                          text1: "Do you want to delete this course?",
                          text2: "All the data related to this course will be deleted",
                          btn1Text: !loading ? "Delete" : "Loading...  ",
                          btn2Text: "Cancel",
                          btn1Handler: !loading
                            ? () => handleCourseDelete(course._id)
                            : () => {},
                          btn2Handler: !loading
                            ? () => setConfirmationModal(null)
                            : () => {},
                        });
                      }}
                      title="Delete"
                      className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                    >
                      <RiDeleteBin6Line size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

export default CoursesTable;
