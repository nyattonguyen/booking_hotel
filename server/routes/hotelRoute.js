import express from "express";
import { hotelController } from "../controllers/index.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const hotelRoute = express.Router();

hotelRoute.get("/", hotelController.getAllHotel);
hotelRoute.get("/count-hotel", hotelController.getCountHotel);

hotelRoute.get(
  "/all",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  hotelController.getAllHotelMain
);
hotelRoute.post(
  "/",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  hotelController.createHotel
);
hotelRoute.get("/:id", hotelController.getOneHotel);

hotelRoute.put(
  "/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  hotelController.updateHotel
);

hotelRoute.get(
  "/change-status/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  hotelController.updateHotelStatus
);
export default hotelRoute;
