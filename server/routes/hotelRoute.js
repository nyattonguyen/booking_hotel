import express from "express";
import { hotelController } from "../controllers/index.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const roomRoute = express.Router();

roomRoute.get("/", hotelController.getAllHotel);
roomRoute.get(
  "/all",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  hotelController.getAllHotelMain
);
roomRoute.post(
  "/",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  hotelController.createHotel
);
roomRoute.get("/:id", hotelController.getOneHotel);

roomRoute.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  hotelController.updateHotel
);

roomRoute.get(
  "/change-status/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  hotelController.updateHotelStatus
);
export default roomRoute;
