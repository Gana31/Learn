import { useEffect, useState } from "react";
import { VscAdd } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../Common/IconBtn";
import CoursesTable from "../Course/CourseTable/CoursesTable";
import {useGetInstructorCoursesQuery } from "../../../Services/Operation/authApi";

export default function MyCourses() {
  const { data: coursesList, error, isLoading ,refetch } = useGetInstructorCoursesQuery({});
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any>([]);

  useEffect(() => {
    // Fetch coursesList data on initial mount or remount
    refetch();
  }, [refetch]);


  useEffect(() => {
    if (coursesList) {
      setCourses(coursesList.data);
      // console.log(coursesList)
    }
  }, [coursesList , courses]);

  return (
    <div className="px-4 md:px-8 lg:px-12">
      <div className="mb-14 flex flex-col md:flex-row items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5 mb-4 md:mb-0">My Courses</h1>
        <IconBtn
          text="Add Course"
          onclick={() => navigate("/dashboard/add-course")}
        >
          <VscAdd />
        </IconBtn>
      </div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading courses</div>}
      {courses.length > 0 && <CoursesTable courses={courses} setCourses={setCourses} />}
    </div>
  );
}
