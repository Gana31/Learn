import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/Auth.middleware";
import { createOrder, getAllOrders } from "../controllers/order.controller";
import { getNotification, updateNotification } from "../controllers/notification.controller";

const orderRouter = express.Router();


orderRouter.post("/CreateOrder",isAutheticated,createOrder);
orderRouter.get("/GetNotification",isAutheticated,authorizeRoles("admin"),getNotification);
orderRouter.put("/UpdateNotification/:id",isAutheticated,authorizeRoles("admin"),updateNotification);
orderRouter.get("/GetAllOrderAdmin",isAutheticated,authorizeRoles("admin"),getAllOrders);

export default orderRouter;