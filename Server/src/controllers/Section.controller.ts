import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import sectionModel from "../models/section.model";
import CourseModel from "../models/course.model";
import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { model } from "mongoose";
import SubSectionModel from "../models/subsection.model";
import cloudinary from "cloudinary";
import fs from "fs"
export const Createsection = asyncHandler(async(req:Request , res: Response)=>{
    try {
		// Extract the required properties from the request body
		const { sectionName, courseId } = req.body;
			// console.log(req.body);
		// Validate the input
		if (!sectionName || !courseId) {
			throw new ApiError(401,"all Fields are Required")
		}

		// Create a new section with the given name
		const newSection = await sectionModel.create({ sectionName });

		// Add the new section to the course's content array
		const updatedCourse = await CourseModel.findByIdAndUpdate(
			courseId,
			{
				$push: {
					courseContent: newSection._id,
				},
			},
			{ new: true }
		)
			.populate({
				path: "courseContent",
				populate: {
					path: "subSection",
					model : SubSectionModel,
				},
			})
			.exec();

		// Return the updated course object in the response
		res.send(new ApiResponse(201,"Subsection created successfully",updatedCourse))
	} catch (error) {
		// Handle errors
		throw new ApiError(401, error instanceof Error ? error.message : "Trouble while creating section of  the Course ");
	}
})




export const updateSection = asyncHandler(async (req : Request, res : Response) => {
	try {
		const { sectionName, sectionId,courseId } = req.body;
		const section = await sectionModel.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

		const course = await CourseModel.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();
		res.send(new ApiResponse(201,section,course));
		
	} catch (error) {
		console.error("Error updating section:", error);
		throw new ApiError(401, error instanceof Error ? error.message : "Trouble while updating section of  the Course ");
	}
})

// DELETE a section
export const deleteSection = asyncHandler(async (req: Request, res: Response) => {
	try {
	  const { sectionId, courseId } = req.body;
  
	  // Remove section reference from course
	  await CourseModel.findByIdAndUpdate(courseId, {
		$pull: {
		  courseContent: sectionId,
		}
	  });
  
	  // Find the section to delete
	  const section = await sectionModel.findById(sectionId);
	  if (!section) {
		return res.status(404).json({
		  success: false,
		  message: "Section not found",
		});
	  }
  
	  // Find and delete videos associated with each subsection
	  const subSections = await SubSectionModel.find({ _id: { $in: section.subSection } });
	  for (const subSection of subSections) {
		if (subSection.public_id) {
		  const destroyResult = await cloudinary.v2.uploader.destroy(subSection.public_id, { resource_type: "video" });
		  if (destroyResult.result !== 'ok' && destroyResult.result !== 'not found') {
			console.error("Cloudinary deletion failed:", destroyResult);
		  }
		}
	  }
  
	  // Delete the subsections from the database
	  await SubSectionModel.deleteMany({ _id: { $in: section.subSection } });
  
	  // Delete the section from the database
	  await sectionModel.findByIdAndDelete(sectionId);
  
	  // Find the updated course and return it
	  const course = await CourseModel.findById(courseId).populate({
		path: "courseContent",
		populate: {
		  path: "subSection"
		}
	  }).exec();
  
	  res.send(new ApiResponse(201, "Section deleted", course));
	  
	} catch (error) {
	  console.error("Error deleting section:", error);
	  throw new ApiError(401, error instanceof Error ? error.message : "Trouble while deleting section of the course");
	}
  });


export const createSubSection = asyncHandler(async (req, res) => {
	try {
	  // Extract necessary information from the request body
	  const { sectionId, title, description } = req.body
	  const video = req?.file;
	  const filepath = req?.file?.path

		// console.log("video",req.file)
	
	//   // Check if all necessary fields are provided
	  if (!sectionId || !title || !description || !video) {
		return res
		  .status(404)
		  .json({ success: false, message: "All Fields are Required" })
	  }

	  if(!req.file){
		throw new ApiError(401,"video is not uploaded")
	  }

		const uploadDetails =  await cloudinary.v2.uploader.upload(filepath!,{
		folder : "sectionVideo",
		resource_type: "video",
		});

	
	//   console.log(uploadDetails)
	  // Create a new sub-section with the necessary information
	  const SubSectionDetails = await SubSectionModel.create({
		title: title,
		timeDuration: `${uploadDetails.duration}`,
		description: description,
		public_id:uploadDetails.public_id,
		videoUrl: uploadDetails.secure_url,
	  })
  
	  // Update the corresponding section with the newly created sub-section
	  const updatedSection = await sectionModel.findByIdAndUpdate(
		{ _id: sectionId },
		{ $push: { subSection: SubSectionDetails._id } },
		{ new: true }
	  ).populate("subSection")
	  fs.unlinkSync(filepath!);
	  res.send(new ApiResponse(200,"true",updatedSection))

	} catch (error) {
	  console.error("Error creating new sub-section:", error)
	  throw new ApiError(401, error instanceof Error ? error.message : "Trouble while creating sub section of  the Course ");
	}
  })
  
  export const updateSubSection = asyncHandler(async (req : Request, res : Response) => {
	try {
	  const { sectionId, subSectionId, title, description } = req.body
	  const subSection = await SubSectionModel.findById(subSectionId);
	//   console.log("subsection from update",subSection);
	// 	console.log("req.file from updateSubsection",req.file)
	  if (!subSection) {
		return res.status(404).json({
		  success: false,
		  message: "SubSection not found",
		})
	  }
  
	  if (title !== undefined) {
		subSection.title = title
	  }
  
	  if (description !== undefined) {
		subSection.description = description
	  }
	  if (req.file && req.file.path !== undefined) {
		const destroyResult = await cloudinary.v2.uploader.destroy(subSection.public_id, { resource_type: "video" });
		if (destroyResult.result === 'ok'){
		const video = req.file.path
		const uploadDetails = await cloudinary.v2.uploader.upload(video,{
			folder : "sectionVideo",
			resource_type: "video",
			});
		subSection.public_id = uploadDetails.public_id
		subSection.videoUrl = uploadDetails.secure_url
		subSection.timeDuration = `${uploadDetails.duration}`
		}	
	}
  
	  await subSection.save()
  
	  // find updated section and return it
	  const updatedSection = await sectionModel.findById(sectionId).populate(
		"subSection"
	  )
  
	//   console.log("updated section", updatedSection)
  
	  return res.json({
		success: true,
		message: "Section updated successfully",
		data: updatedSection,
	  })
	} catch (error) {
	  console.error(error)
	  return res.status(500).json({
		success: false,
		message: "An error occurred while updating the section",
	  })
	}
  })
  
export const deleteSubSection = asyncHandler(async (req: Request, res: Response) => {
	try {
	  const { subSectionId, sectionId } = req.body;
  
	  // Remove sub-section reference from section
	  await sectionModel.findByIdAndUpdate(
		{ _id: sectionId },
		{
		  $pull: {
			subSection: subSectionId,
		  },
		}
	  );
  
	  // Find sub-section to delete
	  const subSectionData = await SubSectionModel.findById(subSectionId);
	  if (!subSectionData) {
		return res.status(404).json({ success: false, message: "SubSection not found" });
	  }
  
	  // Attempt to delete the associated video from Cloudinary
	//   console.log("public_id",subSectionData.public_id)
	  const destroyResult = await cloudinary.v2.uploader.destroy(subSectionData.public_id, { resource_type: "video" });
	//   console.log("destryResult",destroyResult)
	  if (destroyResult.result === 'ok' || destroyResult.result === 'not found') {
		// Delete the sub-section from the database
		await SubSectionModel.findByIdAndDelete(subSectionId);
  
		// Find updated section and return it
		const updatedSection = await sectionModel.findById(sectionId).populate('subSection');
  
		return res.json({
		  success: true,
		  message: "SubSection deleted successfully",
		  data: updatedSection,
		});
	  } else {
		// If Cloudinary deletion fails for other reasons, log the result and throw an error
		console.error("Cloudinary deletion failed:", destroyResult);
		throw new ApiError(401, "Video deletion from Cloudinary failed");
	  }
	} catch (error) {
	  console.error("Error deleting sub-section:", error);
	  return res.status(500).json({
		success: false,
		message: "An error occurred while deleting the SubSection",
	  });
	}
  });