import express from "express";
import { userController } from "../controllers/index.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.post("/login-gg", userController.loginWithGoogle);

userRouter.get("/logout", userController.logout);
userRouter.get("/me", isAuthenticatedUser, userController.getUserDetails);
userRouter.put("/me/update", isAuthenticatedUser, userController.updateUser);

userRouter.put(
  "/password/update",
  isAuthenticatedUser,
  userController.updatePassword
);
userRouter.post("/change-password", userController.forgotPassword);
userRouter.put("/password/reset/:token", userController.resetPassword);
userRouter.get(
  "/admin/user",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.getAllUser
);
userRouter.get(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.getOneUser
);

userRouter.put(
  "/admin/user/updatestatus/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  userController.updateUserStatus
);
export default userRouter;
