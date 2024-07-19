import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import "./App.css"
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Navbar from "./Component/Common/Navbar";
import VerifyEmail from "./Pages/VerifyEmail";
import AboutUs from "./Pages/AboutUs";
import Contact from "./Pages/Contact";
import Footer from "./Component/Common/Footer";
import PrivateRoute from "./Hooks/PrivateRoute";
import { Dashboard } from "./Component/ProtectedRoutes/Dashboard";
import { useEffect, useState } from "react";
import apiClient from "./Services/ApiConnector";
import { categoryUrl } from "./Services/Api";
import MyProfile from "./Component/ProtectedRoutes/MyProfile";
import Settings from "./Component/ProtectedRoutes/Settings/Settings";
import Cart from "./Component/Core/Cart/Cart";
import { useSelector } from "react-redux";
import EnrolledCourses from "./Component/ProtectedRoutes/Settings/EnrolledCourses.tsx";
import AddCourse from "./Component/ProtectedRoutes/Course/AddCourse.tsx";
import MyCourses from "./Component/ProtectedRoutes/Settings/MyCourses.tsx";
import EditCourse from "./Component/ProtectedRoutes/Course/EditCourse/EditCourse.tsx";
import Catalog from "./Pages/Catalog.tsx";
import CourseDetails from "./Pages/CourseDetails.tsx";
import VideoDetails from "./Component/Core/course/VideoDetails.tsx";
import Viewcourse from "./Pages/Viewcourse.tsx";


function App() {
 const [result , setResult] = useState<any>([]);
 const {user} = useSelector((state : any)=>state.auth)

useEffect(()=>{
  handelsubmit();
},[])
const handelsubmit = async()=>{
  {
    try {
      const setResul = await apiClient.get(categoryUrl);
      // console.log(setResul.data.data);
      setResult(setResul.data.data);
      
  } catch (error) {
      console.log("Could Not Fetch the Category List", error);
  }
  }
}


  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter ">
      {result.length > 0 && <Navbar result={result} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/Signup" element={<SignUp/>} />
        <Route path="/verify-email" element={<VerifyEmail/>} />
        <Route path="/about" element={<AboutUs/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/catalog/:catalogName" element={<Catalog/>} />
        <Route path="/courses/:courseId" element={<CourseDetails/>} />
        //PrivateRoute
        <Route path="/" element={<PrivateRoute/>}>
          <Route path="" element={<Viewcourse />}>
        {
              user?.role === "Student" && (
                <>
           <Route 
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
                 />
                </>)}
                </Route>      
        </Route>
        <Route path="/" element={<PrivateRoute/>}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="my-profile" element={<MyProfile />} />
            <Route index element={<Navigate to="my-profile" />} />
            <Route path="settings" element={<Settings />} />
            {/* <Route index element={<Navigate to="my-profile" />} /> */}
            {
              user?.role === "Student" && (
                <>
                <Route path="cart" element={<Cart/>} />
                <Route path="enrolled-courses" element={<EnrolledCourses/>}/>
               
                {/* <Route path="enrolled-courses" element={<EnrolledCourses/>}/> */}
                </>
              )
            }
            
            {
              user?.role === "Instructor" && (
                <>
                <Route path="add-course" element={<AddCourse />} />
                <Route path="my-courses" element={<MyCourses />} />
                <Route path="edit-course/:courseId" element={<EditCourse />} />
                {/* <Route path="enrolled-courses" element={<EnrolledCourses/>}/> */}
                </>
              )
            }
            
    
          </Route>
        </Route>
      </Routes>
      <Footer/>

    </div>
  )
}

export default App
