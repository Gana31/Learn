import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import userModel from "../models/user.model";
import categoryModel from "../models/category.model";
import ApiError from "../utils/ApiError";
import CourseModel, { ICourse } from "../models/course.model";
import cloudinary from "cloudinary";
import fs from "fs"
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";
import ratingAndReviewModel from "../models/ratingAndReviews";
import courseProgressModel from "../models/courseProgress.mode";
import { convertSecondsToDuration } from "../utils/TotalTimeCalculate";
import sectionModel from "../models/section.model";
import SubSectionModel from "../models/subsection.model";
const { ObjectId } = mongoose.Types;
interface ICourseDocument extends mongoose.Document, ICourse {
    _id:typeof ObjectId;
  }


export const uploadTeacherCourse = asyncHandler(async (req: Request, res: Response) => {
    try {
        // console.log(req.body)
        const userId = req?.user?._id;
        let {
            courseName,
            courseDescription,
            price,
            tag : _tag,
            whatYouWillLearn,
            category,
            status,
            instructions : _Instructions,
          } = req.body;
          const filePath = req?.file?.path;
        const tag = JSON.parse(_tag);
        const instructions = JSON.parse(_Instructions);
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
            throw new ApiError(401,"all fields Are required")
          }
          if (!status || status === undefined) {
            status = "Draft"
          }
          const instructorDetails = await userModel.findById(userId, {
            role: "Instructor",
          })
          if (!instructorDetails) {
            throw new ApiError(401,"Instructor Details are not found")
          }
      
          // Check if the tag given is valid
          const categoryDetails = await categoryModel.findById(category)
          if (!categoryDetails) {
            throw new ApiError(401,"category detail not found")
          }
          // Upload the Thumbnail to Cloudinary
          if(!filePath ) {
            throw new ApiError(401,"image for course needed")
        }
        const myCloud =  await cloudinary.v2.uploader.upload(filePath,{
            folder : "thumbnail",
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
            thumbnail: {
                public_id:myCloud.public_id,
                url : myCloud.secure_url,
            },
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
        //   console.log("HEREEEEEEEE", categoryDetails2)
          // Return the new course and a success message
          res.send( new ApiResponse(201,"Course Created Successfully",newCourse));

          fs.unlinkSync(filePath);
    } catch (error) {
        throw new ApiError(401, error instanceof Error ? error.message : "Trouble while Uploading the Course ");
    }
})


export const editCourse = asyncHandler(async (req:Request, res:Response)=>{
    try {
        
        const { courseId ,OldImg,price } = req.body
        const updates = req.body
        console.log(req.body);
        
        const course = await CourseModel.findById(courseId)
        // console.log(req.file)
        if (!course) {
          throw new ApiError(401,"No course Found");
        }
        console.log(OldImg);
        // If Thumbnail Image is found, update it
        if (req.file) {
            const destry = await cloudinary.v2.uploader.destroy(OldImg);
            console.log(destry)
            if(destry.result == 'ok'){
              const myCloud =  await cloudinary.v2.uploader.upload(req.file.path,{
                folder : "thumbnail",
                width : 150,
            });
            course.thumbnail = {
                public_id : myCloud.public_id,
                url : myCloud.secure_url,
            }
            }
            fs.unlinkSync(req.file.path);
        }

        if (price) {
          const parsedPrice = parseFloat(price);
          if (isNaN(parsedPrice)) {
            throw new ApiError(400, "Invalid price value");
          }
          updates.price = parsedPrice;
        }
        // Update only the fields that are present in the request body
        for (const key in updates) {
          if (Object.prototype.hasOwnProperty.call(updates, key)) {
            const courseKey = key as keyof ICourse;
            if (courseKey === "tag" || courseKey === "instructions") {
              course[courseKey] = JSON.parse(updates[courseKey]);
            } else {
              (course as any)[courseKey] = updates[courseKey];
            }
          }
        }
    
        await course.save();
        const updatedCourse = await CourseModel.findOne({
            _id: courseId,
          })
            .populate({
              path: "instructor",
              model: userModel, 
            
            })
            .populate("category")
            .populate({
              path: "ratingAndReviews", // Ensure this matches the field in your CourseModel schema
              model: ratingAndReviewModel,
            })
            .populate({
              path: "courseContent",
              populate: {
                path: "subSection",
              },
            })
            .exec()
          
          res.send(new ApiResponse(201,"Course Updated Successfull",updatedCourse))
    } catch (error) {
        console.log(error)
        throw new ApiError(401, error instanceof Error ? error.message : "Trouble while Editing the Course ");
    }
})

export const getAllCourses = asyncHandler(async (req:Request, res:Response)=>{
  try {
    const allCourses = await CourseModel.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec()

    return res.status(200).json({
      success: true,
      data: allCourses,
    })
  } catch (error : any) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    })
  }
});


export const getInstructorCourses = asyncHandler(async (req:Request, res:Response)=>{
  try {
    // console.log(req?.user?._id);
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req?.user?._id

    // Find all courses belonging to the instructor
    const instructorCourses = await CourseModel.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error : any) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
})


export const getFullCourseDetails = asyncHandler(async (req:Request, res:Response)=>{
  try {
    const { courseId } = req.body
    // console.log("req body",req.body)
    // console.log(courseId)
    const userId = req.user?._id
    const courseDetails = await CourseModel.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await courseProgressModel.findOne({
      courseID: courseId,
      userId: userId,
    })

    // console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }


    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content : any) => {
      content.subSection.forEach((subSection : any) => {
        // console.log("content.subSection",subSection.timeDuration)
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = await convertSecondsToDuration(totalDurationInSeconds)
    // console.log(totalDuration);
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error : any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
});


export const deleteCourse = asyncHandler(async (req:Request, res:Response)=>{
  try {
    const { courseId } = req.body

    // Find the course
    const course = await CourseModel.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }
    const thumbnail : any = course.thumbnail
    // console.log(thumbnail.public_id)
    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await userModel.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

  

    if (thumbnail) {
      await cloudinary.v2.uploader.destroy(thumbnail.public_id );
    }
 
    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      const section = await sectionModel.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          const subSection = await SubSectionModel.findById(subSectionId);
          if (subSection && subSection.public_id) {
            await cloudinary.v2.uploader.destroy(subSection.public_id, {
              resource_type: "video",
            });
          }
          await SubSectionModel.findByIdAndDelete(subSectionId);
        }
      }
      await sectionModel.findByIdAndDelete(sectionId);
    }
    const instructorId = course.instructor;
    await userModel.findByIdAndUpdate(instructorId, {
      $pull: { courses: courseId },
    });


    // Delete the course
    await CourseModel.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error : any) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
})

export const getCourseDetails = asyncHandler(async (req:Request, res:Response)=>{
  try {
    const { courseId } = req.body
    const courseDetails = await CourseModel.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",

      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content : any) => {
      content.subSection.forEach((subSection : any) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
  } catch (error : any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

export const getEnrolledCourses = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    const userDetails = await userModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(String(userId)),  // Convert userId to ObjectId here
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'courses',
          foreignField: '_id',
          as: 'courses',
          pipeline: [
            {
              $lookup: {
                from: 'sections',
                localField: 'courseContent',
                foreignField: '_id',
                as: 'courseContent',
                pipeline: [
                  {
                    $lookup: {
                      from: 'subsections',
                      localField: 'subSection',
                      foreignField: '_id',
                      as: 'subSection'
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]);
    // console.log("usedetails",userDetails)
    if (!userDetails || userDetails.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Could not find user details`,
      });
    }
    
    const user = userDetails[0];
    // console.log('Raw userDetails:', user);

    for (let i = 0; i < user.courses.length; i++) {
      let totalDurationInSeconds = 0;
      let SubsectionLength = 0;
      const courseContent = user.courses[i].courseContent || [];

      for (let j = 0; j < courseContent.length; j++) {
        const subSections = courseContent[j].subSection || [];
        totalDurationInSeconds += subSections.reduce((acc : any, curr : any) => acc + parseInt(curr.timeDuration), 0);
        SubsectionLength += subSections.length;
      }

      user.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);

      const courseProgress = await courseProgressModel.findOne({
        courseID: user.courses[i]._id,
        userId: userId,
      });

      // console.log('courseProgress:', courseProgress);

      const completedVideosCount = courseProgress?.completedVideos.length || 0;

      if (SubsectionLength === 0) {
        user.courses[i].progressPercentage = 100;
      } else {
        const multiplier = Math.pow(10, 2);
        user.courses[i].progressPercentage =
          Math.round((completedVideosCount / SubsectionLength) * 100 * multiplier) / multiplier;
      }
    }

    // console.log('Processed userDetails:', user);

    return res.status(200).json({
      success: true,
      data: user.courses,
    });
  } catch (error : any) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export const getAllRating = asyncHandler(async (req, res) => {
  try{
    const allReviews = await ratingAndReviewModel.find({})
                            .sort({rating: "desc"})
                            .populate({
                                path:"user",
                                select:"FirstName LastName email avatar",
                            })
                            .populate({
                                path:"course",
                                select: "courseName",
                            })
                            .exec();
                            // console.log(allReviews);
    return res.status(200).json({
        success:true,
        message:"All reviews fetched successfully",
        data:allReviews,
    });
}   
catch(error : any) {
console.log(error);
return res.status(500).json({
    success:false,
    message:error.message,})
  }
});

