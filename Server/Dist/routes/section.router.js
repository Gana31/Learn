"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Section_controller_1 = require("../controllers/Section.controller");
const Auth_middleware_1 = require("../middleware/Auth.middleware");
const multer_1 = require("../middleware/multer");
const sectionRouter = express_1.default.Router();
sectionRouter.post('/Createsection', Auth_middleware_1.isAutheticated, (0, Auth_middleware_1.authorizeRoles)("Instructor"), Section_controller_1.Createsection);
sectionRouter.post('/Updatesection', Auth_middleware_1.isAutheticated, (0, Auth_middleware_1.authorizeRoles)("Instructor"), Section_controller_1.updateSection);
sectionRouter.post('/Deletesection', Auth_middleware_1.isAutheticated, (0, Auth_middleware_1.authorizeRoles)("Instructor"), Section_controller_1.deleteSection);
sectionRouter.post('/UpdateSubSection', Auth_middleware_1.isAutheticated, (0, Auth_middleware_1.authorizeRoles)("Instructor"), multer_1.upload.single("video"), Section_controller_1.updateSubSection);
sectionRouter.post('/CreateSubSection', Auth_middleware_1.isAutheticated, (0, Auth_middleware_1.authorizeRoles)("Instructor"), multer_1.upload.single("video"), Section_controller_1.createSubSection);
sectionRouter.post('/DeleteSubSection', Auth_middleware_1.isAutheticated, (0, Auth_middleware_1.authorizeRoles)("Instructor"), Section_controller_1.deleteSubSection);
exports.default = sectionRouter;
//# sourceMappingURL=section.router.js.map