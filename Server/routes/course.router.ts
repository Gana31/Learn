import express from 'express';
// import {DeleteCourse, ReivewReply, addAnswerData, addQuestion, addReview, getAllCoursess, getBestReviews, test1, updateCourse, uploadCourse } from '../controllers/course.controller';
import { authorizeRoles, isAutheticated } from '../middleware/Auth.middleware';
// import { getAllCourses, getCourseByValidUser, getSingleCourse } from '../controllers/course.controller';
import { upload } from '../middleware/multer';
import { categoryPageDetailsteCourse, createCategory, createRating, showAllCategories, updateCourseProgress } from '../controllers/analytics.controller';
// import { uploadCourse } from '../controllers/course.controller';
import { deleteCourse, editCourse, getAllCourses, getAllRating, getCourseDetails, getFullCourseDetails, getInstructorCourses, uploadTeacherCourse } from '../controllers/TeacherCourse.controller';
import { capturePayment, sendPaymentSuccessEmail, verifyPayment, } from '../controllers/Payment.controller';
const courseRouter = express.Router();


courseRouter.post('/createCourse',isAutheticated,authorizeRoles("Instructor"),upload.single("thumbnailImage"),uploadTeacherCourse);
courseRouter.post('/editCourse',isAutheticated,authorizeRoles("Instructor"),upload.single("thumbnailImage"),editCourse);
// courseRouter.post('/CreateCourses',isAutheticated,upload.single('thumbnailImage'),test1);
// courseRouter.put('/updateCourse/:id',isAutheticated,authorizeRoles("admin"),updateCourse);
courseRouter.post('/CreateCategory',isAutheticated,authorizeRoles("admin"),createCategory);
courseRouter.get('/GetAllCategory',showAllCategories);
courseRouter.get('/GetAllTeacherCourses',isAutheticated,authorizeRoles("Instructor"),getAllCourses);
courseRouter.get('/getInstructorCourses',isAutheticated,authorizeRoles("Instructor"),getInstructorCourses);
courseRouter.post('/getFullCourseDetails',isAutheticated,authorizeRoles("Instructor"),getFullCourseDetails);
courseRouter.post('/deleteCourse',isAutheticated,authorizeRoles("Instructor"),deleteCourse);
courseRouter.post("/getCategoryPageDetails", categoryPageDetailsteCourse)
courseRouter.post("/getCourseDetails", getCourseDetails)


courseRouter.post('/capturePayment', isAutheticated, authorizeRoles("Student"), capturePayment)
courseRouter.post('/verifyPayment',isAutheticated, authorizeRoles("Student"), verifyPayment)
courseRouter.post('/sendPaymentSuccessEmail', isAutheticated, authorizeRoles("Student"), sendPaymentSuccessEmail);
courseRouter.post('/createRating', isAutheticated, authorizeRoles("Student"), createRating);
courseRouter.post('/updateCourseProgress', isAutheticated, authorizeRoles("Student"), updateCourseProgress);
courseRouter.get('/getReviews',getAllRating)

// courseRouter.get('/getSingleCourse/:id',getSingleCourse);
// courseRouter.get('/getAllCourse',getAllCourses);
// courseRouter.get('/getCourseByVaildUser/:id',isAutheticated,getCourseByValidUser);
// courseRouter.put('/addQuestion',isAutheticated,addQuestion);
// courseRouter.put('/addAnswer',isAutheticated,addAnswerData);
// courseRouter.put('/addReview/:id',isAutheticated,addReview);
// courseRouter.get('/getBestReviews',getBestReviews);
// courseRouter.put('/addReviewReply',isAutheticated,authorizeRoles("admin"),ReivewReply);
// courseRouter.get('/GetCoursesAdmin',isAutheticated,authorizeRoles("admin"),getAllCoursess);
// courseRouter.delete('/DeleteCourseAdmin/:_id',isAutheticated,authorizeRoles("admin"),DeleteCourse);
export default courseRouter;