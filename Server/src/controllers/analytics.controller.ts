import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import categoryModel from "../models/category.model";
import { ApiResponse } from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import CourseModel from "../models/course.model";
import ratingAndReviewModel from "../models/ratingAndReviews";
import SubSectionModel from "../models/subsection.model";
import courseProgressModel from "../models/courseProgress.mode";


function getRandomInt(max : any) {
    return Math.floor(Math.random() * max)
  }

export  const createCategory = asyncHandler( async(req:Request, res:Response,next : NextFunction) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			throw new ApiError(400,"All fields are required");
		}
		const CategorysDetails = await categoryModel.create({
			name: name,
			description: description,
		});
		res.send(new ApiResponse(200,"category created successfully"))
	} catch (error) {
		next(error);
	}
});

export const showAllCategories = async (req:Request, res:Response,next:NextFunction) => {
	try {
        // console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategorys = await categoryModel.find({});
		res.send(new ApiResponse(200,"category fetch successfully",allCategorys))
		if(!allCategorys){
			throw new ApiError(400,"Error whiel getting the category")
		}
	} catch (error) {
		next(error)
	}
};




export const categoryPageDetailsteCourse = asyncHandler(async (req: Request, res: Response) => {
	try {
	  // Explicitly type categoryId as string
	  const { categoryId } = req.body as { categoryId: string };
  
	  console.log("PRINTING CATEGORY ID: ", categoryId);
  
	  // Get courses for the specified category
	  const selectedCategory = await categoryModel.findById(categoryId)
		.populate({
		  path: "courses",
		  match: { status: "Published" },
		  populate: "ratingAndReviews",
		})
		.exec();
  
	  if (!selectedCategory) {
		console.log("Category not found.");
		return res
		  .status(404)
		  .json({ success: false, message: "Category not found" });
	  }
  
	  if (selectedCategory.courses.length === 0) {
		console.log("No courses found for the selected category.");
		return res.status(404).json({
		  success: false,
		  message: "No courses found for the selected category.",
		});
	  }
  
	  // Get courses for other categories
	  const categoriesExceptSelected = await categoryModel.find({
		_id: { $ne: categoryId },
	  }).exec();
  
	  const randomIndex = getRandomInt(categoriesExceptSelected.length);
	  let differentCategory = await categoryModel.findById(
		categoriesExceptSelected[randomIndex]._id
	  )
		.populate({
		  path: "courses",
		  match: { status: "Published" },
		})
		.exec();
  
	  // Get top-selling courses across all categories
	  const allCategories = await categoryModel.find()
		.populate({
		  path: "courses",
		  match: { status: "Published" },
		  populate: {
			path: "instructor",
		  },
		})
		.exec();
  
	  const allCourses = allCategories.flatMap((category) => category.courses);
	  const mostSellingCourses = allCourses
		.sort((a: any, b: any) => b.sold - a.sold)
		.slice(0, 10);
  
	  res.status(200).json({
		success: true,
		data: {
		  selectedCategory,
		  differentCategory,
		  mostSellingCourses,
		},
	  });
	} catch (error: any) {
	  return res.status(500).json({
		success: false,
		message: "Internal server error",
		error: error.message,
	  });
	}
  });
  
  export const createRating = asyncHandler(async (req:Request, res:Response)=>{
	try{

        //get user id
        const userId = req?.user?._id;
        //fetchdata from req body
        const {rating, review, courseId} = req.body;
        //check if user is enrolled or not
        const courseDetails = await CourseModel.findOne(
                                    {_id:courseId,
                                    studentsEnrolled: {$elemMatch: {$eq: userId} },
                                });

        if(!courseDetails) {
            return res.status(404).json({
                success:false,
                message:'Student is not enrolled in the course',
            });
        }
        //check if user already reviewed the course
        const alreadyReviewed = await ratingAndReviewModel.findOne({
                                                user:userId,
                                                course:courseId,
                                            });
        if(alreadyReviewed) {
                    return res.status(403).json({
                        success:false,
                        message:'Course is already reviewed by the user',
                    });
                }
        //create rating and review
        const ratingReview = await ratingAndReviewModel.create({
                                        rating, review, 
                                        course:courseId,
                                        user:userId,
                                    });
       
        //update course with this rating/review
        const updatedCourseDetails = await CourseModel.findByIdAndUpdate({_id:courseId},
                                    {
                                        $push: {
                                            ratingAndReviews: ratingReview._id,
                                        }
                                    },
                                    {new: true});
        console.log(updatedCourseDetails);
        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and Review created Successfully",
            ratingReview,
        })
    }
    catch(error : any) {
        console.log(error );
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
  })


  export const updateCourseProgress = asyncHandler(async (req:Request, res:Response)=>{

	const { courseId, subsectionId } = req.body
	const userId = req?.user?._id
  
	try {
	  // Check if the subsection is valid
	  const subsection = await SubSectionModel.findById(subsectionId)
	  if (!subsection) {
		return res.status(404).json({ error: "Invalid subsection" })
	  }
  
	  // Find the course progress document for the user and course
	  let courseProgress = await courseProgressModel.findOne({
		courseID: courseId,
		userId: userId,
	  })
  
	  if (!courseProgress) {
		// If course progress doesn't exist, create a new one
		return res.status(404).json({
		  success: false,
		  message: "Course progress Does Not Exist",
		})
	  } else {
		// If course progress exists, check if the subsection is already completed
		if (courseProgress.completedVideos.includes(subsectionId)) {
		  return res.status(400).json({ error: "Subsection already completed" })
		}
  
		// Push the subsection into the completedVideos array
		courseProgress.completedVideos.push(subsectionId)
	  }
  
	  // Save the updated course progress
	  await courseProgress.save()
  
	  return res.status(200).json({ message: "Course progress updated" })
	} catch (error) {
	  console.error(error)
	  return res.status(500).json({ error: "Internal server error" })
	}
  });