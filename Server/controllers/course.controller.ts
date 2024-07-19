import { NextFunction, Request, Response, request, response } from "express";
import cloudinary from "cloudinary";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { createCourse, getAllCoursesServices } from "../Services/course.services";
import CourseModel from "../models/course.model";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";
import userModel, { UserSchemaInterface } from "../models/user.model";
import { sendMail } from "../utils/SendMail";
import NotificationModel from "../models/notification.model";
import { redis } from "../utils/Redis";
import fs from "fs"
import categoryModel from "../models/category.model";
// interface AddQuestionInterface {
//     question : string;
//     courseId : string;
//     contentId : string;
// }

// interface newQuestionInterface  {
//     user : UserSchemaInterface;
//     question : string;
//     questionReplies: IComment[];
// }

// interface addAnswerDataInterface {
//     answer : string;
//     courseId : string;
//     contentId : string;
//     questionId : string;
// }

// interface addReviewInterface {
//     review : string;
//     courseId : string;
//     rating : number;
//     userId : string;
// }
// interface addReviewReplyInterface {
//     comment : string;
//     courseId : string;
//     reviewId : string;
// }

// interface IReview2 {
//     user: {
//       id: string;
//       FirstName: string;
//       email: string;
//     };
//     comment: string;
//     rating: number;
//   }


  // export const test1 = asyncHandler(async (req: Request, res: Response) => {
  //   try {
  //       const {
  //         courseName,
  //         courseDescription,
  //         price,
  //         tag,
  //         whatYouWillLearn,
  //         category,
  //         status,
  //         instructions,
  //       } = req.body;
  //       const filePath = req?.file?.path;
    
  //       // Parse JSON strings back into arrays if needed
  //       const parsedTags = JSON.parse(tag);
  //       const parsedInstructions = JSON.parse(instructions);
    
  //       // File will be available in req.file
  //       const thumbnailImage = req.file;
  //       console.log('File received:', req.file);
    
  //       // Perform operations like saving data to the database
  //       const courseData = {
  //         courseName,
  //         courseDescription,
  //         price,
  //         parsedTags,
  //         whatYouWillLearn,
  //         category,
  //         status,
  //         parsedInstructions,
  //         thumbnailImage,
  //       };
  //       if(filePath ) {
  //           const myCloud =  await cloudinary.v2.uploader.upload(filePath,{
  //               folder : "thumbnails",
  //               width : 150,
  //           });
            
  //           thumbnailImage : myCloud.secure_url,
            
  //           fs.unlinkSync(filePath);
  //       }
        
    
  //       // Simulate saving data to the database
  //       console.log(courseData);
    
  //       res.status(200).json({ message: 'Course created/updated successfully', course: courseData });
  //     } catch (error) {
  //       console.error('Error handling form data:', error);
  //       res.status(500).json({ message: 'Internal server error' });
  //     }
  //   });
export const uploadCourse = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req?.user?._id;
        let {
            courseName,
            courseDescription,
            price,
            tag,
            whatYouWillLearn,
            category,
            status,
            instructions,
          } = req.body;
          const filePath = req?.file?.path;
        const parsedTags = JSON.parse(tag);
        const parsedInstructions = JSON.parse(instructions);
        const thumbnailImage = req.file;
        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag.length ||
            !thumbnailImage ||
            !category ||
            !instructions.length
          ) {
            return res.status(400).json({
              success: false,
              message: "All Fields are Mandatory",
            })
          }
          if (!status || status === undefined) {
            status = "Draft"
          }
          const instructorDetails = await userModel.findById(userId, {
            role: "Instructor",
          })
          if (!instructorDetails) {
            return res.status(404).json({
              success: false,
              message: "Instructor Details Not Found",
            })
          }
          if (!instructorDetails) {
            return res.status(404).json({
              success: false,
              message: "Instructor Details Not Found",
            })
          }
      
          // Check if the tag given is valid
          const categoryDetails = await categoryModel.findById(category)
          if (!categoryDetails) {
            return res.status(404).json({
              success: false,
              message: "Category Details Not Found",
            })
          }
          // Upload the Thumbnail to Cloudinary
          if(!filePath ) {
            throw new ApiError(401,"image for course needed")
        }
        const myCloud =  await cloudinary.v2.uploader.upload(filePath,{
            folder : "thumbnails",
            width : 150,
        });

        
          const newCourse = await CourseModel.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag,
            category: categoryDetails._id,
            thumbnail: myCloud.secure_url,
            status: status,
            instructions,
          })
      
          // Add the new course to the User Schema of the Instructor
          await userModel.findByIdAndUpdate(
            {
              _id: instructorDetails._id,
            },
            {
              $push: {
                courses: newCourse._id,
              },
            },
            { new: true }
          )
          // Add the new course to the Categories
          const categoryDetails2 = await categoryModel.findByIdAndUpdate(
            { _id: category },
            {
              $push: {
                courses: newCourse._id,
              },
            },
            { new: true }
          )
          console.log("HEREEEEEEEE", categoryDetails2)
          // Return the new course and a success message
          res.status(200).json({
            success: true,
            data: newCourse,
            message: "Course Created Successfully",
          })
          fs.unlinkSync(filePath);
    } catch (error) {
        throw new ApiError(401, error instanceof Error ? error.message : "Trouble while Uploading the Course ");
    }
})


// export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
//     try {
//         const data = req.body;
//         const thumbnail = data.thumbnail;

//         if (thumbnail) {
//             await cloudinary.v2.uploader.destroy(thumbnail.public_id);
//             const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
//                 folder: "courses"
//             });
//             data.thumbnail = {
//                 public_id: myCloud.public_id,
//                 url: myCloud.secure_url,
//             };
//         }
//         const coursId = req.params.id;
//         const course = await CourseModel.findByIdAndUpdate(coursId,
//             { $set: data, },
//             { new: true }
//         );
//         const isCacheExist = await redis.get(coursId);
//         if(isCacheExist){
//             await redis.set("allCourses",JSON.stringify(course))
//         }
//         // console.log(course);
        

//         res.send(new ApiResponse(200, "Course Data successfully Updated", course));
//     } catch (error) {
//         throw new ApiError(401, error instanceof Error ? error.message : "Trouble while Updating the Course ");
//     }
// })



// export const addQuestion = asyncHandler(async (req : Request, res : Response) => {
//     try {
//         const {question,courseId,contentId} = req.body as AddQuestionInterface;
//         const course = await CourseModel.findById(courseId);
//         if(!mongoose.Types.ObjectId.isValid(contentId)){
//             throw new ApiError(400,"Invalid Content Id ");
//         }
//         const courseContent = course?.courseData?.find((item)=> item._id.equals(contentId))

//         if(!courseContent){
//             throw new ApiError(400,"Invalid Content Id ");
//         }


//         const newQuestion : newQuestionInterface = {
//             user : req.user!,
//             question,
//             questionReplies:[],
//         };
//         courseContent.questions.push(newQuestion as IComment);
//         const notification = await NotificationModel.create({
//             usr:req.user?._id,
//             title:"New Question Received",
//             message:`You Have a New Question in ${courseContent.title} `,
//         });
//         await course?.save();

//         res.send(new ApiResponse(200,"Comment is added successfully",course));
//     } catch (error) {
//         throw new ApiError(401, error instanceof Error ? error.message : "Trouble while Adding Question in the Course ");
//     }
// })




// export const addAnswerData = asyncHandler(async (req:Request,res:Response) => {
//     try {
//         const {answer,contentId,courseId,questionId}= req.body as addAnswerDataInterface;
//         const course = await CourseModel.findById(courseId);
        
//         if(!mongoose.Types.ObjectId.isValid(contentId)){
//             throw new ApiError(400,"Invalid Content Id ");
//         }

//         const courseContent = course?.courseData?.find((item)=> item._id.equals(contentId))

//         if(!courseContent){
//             throw new ApiError(400,"Invalid Course Content Id ");
//         }
//         const questions = courseContent?.questions?.find((item)=> item._id.equals(questionId));

//         if(!questions){
//             throw new ApiError(400,"Invalid Question Id ");
//         }
//         const newAnswer :any = {
//             user:req.user!,
//             answer,
//         }

//         questions.questionReplies?.push(newAnswer)
//         await course?.save();

//         if(req.user?._id === questions.user?._id){
//             //creating Notification model
//             await NotificationModel.create({
//                 usr:req.user?._id,
//                 title:"New Question Reply Received",
//                 message:`You Have a New Question Reply in ${courseContent.title} `,
//             });
//         }else{
//             const data = {
//                 name : questions.user.LastName + " " + questions.user.FirstName,
//                 title:courseContent.title,

//             }
//             // console.log()
//             await sendMail({
//                 type : 'emailOptions2',
//                 email:questions.user.email,
//                 subject:"Question replay",
//                 data,
//             }).catch((e)=>{
//                 throw new ApiError(400,"Error accuring while connecting the Email")
//             })
//         }

//         res.send(new ApiResponse(200,"Replay Successfully Added",course))

//     } catch (error) {
//         throw new ApiError(401, error instanceof Error ? error.message : "Trouble while Adding Answer in the Course ");
//     }
// })



// export const addReview = asyncHandler(async (req:Request,res:Response) => {
//     try {
//         const {review,rating} = req.body as addReviewInterface;
//         const courseList = req.user?.courses;
//         // console.log(courseList)
//         const courseId = req.params.id;
//         console.log("courseid ====>",courseId)
//         const courseExist = courseList?.some((course : any)=> course._id.toString()== courseId.toString());
//         // console.log(courseExist)
//         if (!courseExist) {
//             throw new ApiError(400,"Your Are not Eligible For this Course");
//         }
//         const course = await CourseModel.findById(courseId);
//         const user = req.user!;
//         const reviewData: IReview2 = {
//             user: {
//               id: user._id.toString(),
//               FirstName: user.FirstName + " " + user.LastName,
//               email: user.email
//             },
//             comment: review,
//             rating
//           };
//         course?.reviews.push (reviewData as IReview);
//         let avg = 0;
//         course?.reviews.forEach((review) =>{
//             avg += review.rating;
//         })

//         if(course){
//             course.ratings = avg / course.reviews.length;
//         }
//         await course?.save();
//         await redis.set( courseId,JSON.stringify(course),"EX",604800);

//         const notification = {
//             title : "New Reivew Received",
//             message : `${req.user?.FirstName + " " + req.user?.LastName} has given a review on your course name :- ${course?.name}`,
//         };

//         res.send(new ApiResponse(200,"new Review are add to course",course));

//     } catch (error) {
//         throw new ApiError(401, error instanceof Error ? error.message : "Trouble while Adding Review in the Course ");
//     }
// })

// export const ReivewReply = asyncHandler(async(req:Request,res:Response)=>{
// try {
//         const {comment , courseId,reviewId} = req.body as addReviewReplyInterface;
//         const course = await CourseModel.findById(courseId);
//         if(!course){
//             throw new ApiError(404," Course Not FOund");
//         }

//         const review = course?.reviews?.find((review)=> review._id.toString() === reviewId);

//         if(!review){
//             throw new ApiError(404," Course Review Not FOund");
//         }

//         const replyData : any ={
//             user : req.user!,
//             comment
//         }
//         if(!review.commentReplies){
//             review.commentReplies = [];
//         }
//         review.commentReplies.push(replyData)
//         await course?.save()

//         res.send(new ApiResponse(200,"new Review Reply are add to course",course));
// } catch (error) {
//     throw new ApiError(401, error instanceof Error ? error.message : "Trouble while Adding Review Replies in the Course ");
// }
// })


// export const getSingleCourse = asyncHandler(async (req: Request, res: Response) => {
//     try {
//         const courseId = req.params.id;
//         const isCacheExist = await redis.get(courseId);
//         if(isCacheExist){
//             const course = JSON.parse(isCacheExist);
//             res.send(new ApiResponse(200,"Your single Course data is successfully Fetch", course))
//         }else{
//             const course = await CourseModel.findById(courseId).select(" -courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
//             await redis.set( courseId,JSON.stringify(course),"EX",604800);
        
//             res.send(new ApiResponse(200, "Your single Course data is successfully Fetch", course))
//         }
       
//     } catch (error) {
//         throw new ApiError(401, error instanceof Error ? error.message : "Trouble while Getting the single Course ");
//     }
// })


// export const getAllCourses = asyncHandler(async (req: Request, res: Response) => {
//     try {
//         const isCacheExist = await redis.get("allCourses");
//         if(isCacheExist){
//             const course = JSON.parse(isCacheExist);
//             res.send(new ApiResponse(200,"Your single Course data is successfully Fetch", course))
//         }
//         else{
//             const course = await CourseModel.find().select(" -courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
//             await redis.set("allCourses",JSON.stringify(course));
//             res.send(new ApiResponse(200, "Your all Course data is successfully Fetch", course))
//         }
        

//     } catch (error) {
//         throw new ApiError(401, error instanceof Error ? error.message : "Trouble while Getting the all Course ");
//     }
// })

// export const getCourseByValidUser = asyncHandler(async (req:Request,res:Response) => {
//     try {
//         const courseList = req.user?.courses;
//         // console.log(req.user)
//         const courseId = req.params.id;
//         const courseExist = courseList?.find((course:any)=> course._id.toString() === courseId)
//         if(!courseExist){
//             throw new ApiError(400,"Your are not purchase this course")
//         }
//         const course = await CourseModel.findById(courseId);
//         const content = course?.courseData;
//         res.send(new ApiResponse(200,"Vaild User Course Succesfully fetch",content))
        
//     } catch (error) {
//         throw new ApiError(401,error instanceof Error ? error.message :"Trouble While Getting The COurse For Valid User");
//     }
// })

// export const enrollerCourses = asyncHandler(async (req:Request,res:Response) => {
//     try {
//         // console.log(req.user)
//         const purchasedCourseIds = req?.user?.courses.map((course :any) => course._id);
//         // console.log(purchasedCourseIds)
//         if (!purchasedCourseIds?.length) {
//             return res.status(200).json([]);
//         }

//         // Find courses by the IDs in purchasedCourseIds
//         const courses = await CourseModel.find({ _id: { $in: purchasedCourseIds } }).select('name description thumbnail');

//         const formattedCourses = courses.map(course => {
//             return {
//                 courseName: course.name,
//                 courseDescription: course.description,
//                 thumbnail: "https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp",
//                 totalDuration: 10,
//                 progressPercentage : 5,
//             };
//         })
//         // console.log(formattedCourses);
//         res.status(200).json(formattedCourses);
//     } catch (error) {
//         throw new ApiError(401, error instanceof Error ? error.message : "Getting Error While GetAllEnrolledCourses in User ")
//     }
// })




// export const getAllCoursess = asyncHandler(async (req:Request,res:Response) => {
//     try {
//         getAllCoursesServices(res);
//     } catch (error) {
//         throw new ApiError(401, error instanceof Error ? error.message : "Getting Error While GetAllCourses in User Controller using A getAllCoursesServices")
//     }
// })



// export const DeleteCourse = asyncHandler(async (req:Request,res:Response) => {
//     try {
//         const {_id} = req.params;
//         const user = await CourseModel.findById(_id);
//         if(!user){
//             throw new ApiError(400,"Course Is not Found FOr deleting");
//         }

//         await user.deleteOne({_id});
//         await redis.del(_id);

//         res.send(new ApiResponse(200,"COurse Deleted successfully"));
//     } catch (error) {
//         throw new ApiError(401, error instanceof Error ? error.message : "Getting Error While Deleting the Course By Admin");
//     }
// })


// interface Review {
//     review: string;
//     rating: number;
//   }
  
//   interface Course {
//     _id: string;
//     name: string;
//     reviews: Review[];
//   }
  
//   interface BestReview {
//     courseName: string;
//     bestReview: Review;
//   }
  
//   // Function to find the best review for each course
//   function findBestReviews(courses: Course[]): BestReview[] {
//     const bestReviews: BestReview[] = [];
  
//     courses.forEach((course) => {
//       // Filter out courses with no reviews
//       const filteredReviews = course.reviews.filter((review) => review.rating >= 4);
      
//       // Sort reviews by rating in descending order
//       const sortedReviews = filteredReviews.sort((a, b) => b.rating - a.rating);
//         // console.log(sortedReviews);
//       // Get the best review (first review after sorting)
//       const bestReview = sortedReviews[0];
  
//       // Push the best review along with the course name to the bestReviews array
//       bestReviews.push({
//         courseName: course.name,
//         bestReview: bestReview
//       });
//     });
  
//     return bestReviews;
//   }
//   export const getBestReviews = asyncHandler(async (req: Request, res: Response) => {
//     try {
//       let courses: Course[];
//         courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
//        let courses2 = await CourseModel.find()
//         await redis.set("allCourses", JSON.stringify(courses2));
      
//         // console.log(courses)
//       // Get the best reviews for courses
//       const bestReviews = findBestReviews(courses);
  
//       res.status(200).json({ success: true, bestReviews });
//     } catch (error) {
//       throw new ApiError(401, error instanceof Error ? error.message : "Trouble while getting all courses");
//     }
//   });

  
