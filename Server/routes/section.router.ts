import  express from "express";
import { Createsection, createSubSection, deleteSection, deleteSubSection, updateSection, updateSubSection } from "../controllers/Section.controller";
import { authorizeRoles, isAutheticated } from "../middleware/Auth.middleware";
import { upload } from "../middleware/multer";

const sectionRouter = express.Router();

sectionRouter.post('/Createsection',isAutheticated,authorizeRoles("Instructor"),Createsection);
sectionRouter.post('/Updatesection',isAutheticated,authorizeRoles("Instructor"),updateSection);
sectionRouter.post('/Deletesection',isAutheticated,authorizeRoles("Instructor"),deleteSection);
sectionRouter.post('/UpdateSubSection',isAutheticated,authorizeRoles("Instructor"),upload.single("video"),updateSubSection);
sectionRouter.post('/CreateSubSection',isAutheticated,authorizeRoles("Instructor"),upload.single("video"),createSubSection);
sectionRouter.post('/DeleteSubSection',isAutheticated,authorizeRoles("Instructor"),deleteSubSection);

export default sectionRouter;