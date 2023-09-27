import { UserModel } from "../models/index.js";
import catchAsyncError from "../middleware/catchAsyncErrors.js";
import sendToken from "../utills/jwtToken.js";
import ErrorHandler from "../utills/errorHandle.js";
import { sendEmail } from "../utills/sendEmailChangeOrForgotPassword.js";
import crypto from "crypto";
import { googleAuth } from "google-auth-library";

export const register = catchAsyncError(async (req, res, _next) => {
  const { username, phone, password, email } = req.body;

  const userId = UserModel.findOne({ email: email });
  if (!userId) {
    return _next(new ErrorHandler("Email exist", 402));
  }
  const user = await UserModel.create({
    username,
    email,
    password,
  });

  return sendToken(user, 200, res);
});
export const login = catchAsyncError(async (req, res, _next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return _next(new ErrorHandler("Please enter email/password...", 400));
  }
  const user = await UserModel.findOne({ email }).select("+password");
  console.log(user);
  if (!user) {
    return _next(new ErrorHandler("Wrong email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return _next(new ErrorHandler("Wrong email or password...", 401));
  }

  if (user.status !== false) {
    return _next(new ErrorHandler("Account is disabled...", 402));
  }

  sendToken(user, 200, res);
});

export const loginWithGoogle = catchAsyncError(async (req, res, _next) => {
  const code = req.body.code;

  // Lấy thông tin người dùng từ Google
  const googleUser = await googleAuth.signInWithRedirect(code);

  const user = await UserModel.findOne({ email: googleUser.email });

  if (!user) {
    const user = new UserModel({
      id: googleUser.id,
      displayName: googleUser.displayName,
      email: googleUser.email,
    });

    await user.save();
  }

  res.status(200).json({
    id: user.id,
    displayName: user.displayName,
    email: user.email,
  });
});
export const logout = catchAsyncError(async (req, res, _next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully!!",
  });
});

export const getAllUser = catchAsyncError(async (_req, res, _next) => {
  const users = await UserModel.find({});

  res.status(200).json({
    users,
    success: true,
    message: "get all users successfully",
  });
});
export const getOneUser = catchAsyncError(async (req, res, _next) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    return _next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    user,
    message: "get user successfully",
    success: true,
  });
});
export const getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found or not logged in", 404));
  }

  res.status(200).json({
    success: true,
    user,
    message: "get user details successfully completed",
  });
});
export const updateUser = catchAsyncError(async (req, res, next) => {
  const newUser = {
    username: req.body.username,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
  };
  const user = await UserModel.findByIdAndUpdate(req.user.id, newUser, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  console.log(user);
  const tokenReset = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `http://localhost:4000/api/v1/user/password/reset/${tokenReset}`;
  const message = `
  The coffee KN
  <br>
  Your password reset token is <a href="${resetPasswordUrl}">Click</a> you have a link`;
  try {
    await sendEmail({
      email: user.email,
      suject: "The coffee KN",
      message: `<b>Changepassword Link:${message} </b>`,
      html: `<b>Changepassword Link: ${message}</b>`,
    });

    return res.status(200).json({
      success: true,
      message,
      email: user.email,
      suject: "The coffee KN",
      html: `<b>Changepassword Link: </b>${message}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("server internal :  " + error.message, 500));
  }
});
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = await crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await UserModel.findOne({
    resetPasswordExpire: { $gt: Date.now() },
    resetPasswordToken,
  });

  if (!user) {
    return next(new ErrorHandler("User not found or not logged in", 404));
  }

  if (req.body.newPasssword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Comfirm password not matched", 400));
  }

  user.password = req.body.newPasssword;

  await user.save();

  sendToken(user, 200, res);
});

export const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.findById(req.user.id).select("+password");
  const isPasswordMatched = await user?.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password not match", 400));
  }

  if (user) {
    user.password = req.body.newPassword;

    await user.save();
  }

  sendToken(user, 200, res);
});
export const updateUserStatus = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("Not found", 404));
  }

  user.status = !user.status; // change status

  await user.save();

  res.status(200).json({
    user,
    success: true,
  });
});
