"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const databaseConnection_1 = __importDefault(require("./db/databaseConnection"));
const ApiError_1 = __importDefault(require("./utils/ApiError"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const cloudinary_1 = require("cloudinary");
const course_router_1 = __importDefault(require("./routes/course.router"));
const section_router_1 = __importDefault(require("./routes/section.router"));
const ErrorHandler_1 = __importDefault(require("./middleware/ErrorHandler"));
// import orderRouter from './routes/order.routess';
// import AnalyticsRouter from './routes/analyatics.router';
// import layoutRouter from './routes/layout.router';
require("dotenv").config();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
const allowedOrigins = [
    'https://learn-alpha-murex.vercel.app',
    'https://learn-git-main-gana31s-projects.vercel.app',
    'https://learn-cw69512x3-gana31s-projects.vercel.app'
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", user_route_1.default, course_router_1.default, section_router_1.default);
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});
app.get("/", (req, res, next) => {
    res.send(process.env.NODE_ENV);
});
app.all("*", (req, res, next) => {
    next(new ApiError_1.default(400, "PAGE NOT FOUND "));
});
app.use(ErrorHandler_1.default);
(0, databaseConnection_1.default)()
    .then(() => {
    app.listen(process.env.PORT, () => {
        console.log("SERVER IS STARTED AT ", process.env.PORT);
    });
})
    .catch((error) => {
    console.log("ERROR ACCURING WHILE CONNECTING DATABASE ");
});
//# sourceMappingURL=index.js.map