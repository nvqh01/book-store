import ApiError from "../helpers/ApiError";
import catchAsync from "../helpers/catchAsync";
import createError from "http-errors";
import { User } from "../models/index";
import { validateUser } from "../helpers/validate";
import {
  deleteRefreshToken,
  generateToken,
  verifyRefreshToken,
} from "../services/token.service";

// Login user
const login = catchAsync(async (req, res, next) => {
  const { error } = validateUser(req.body);

  if (error) {
    next(new ApiError(createError.BadRequest(error.details[0].message)));
  }

  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    next(new ApiError(createError.NotFound("Username is not found !")));
  }

  const isValid = await user.isValidPassword(password);

  if (!isValid) {
    next(new ApiError(createError.Unauthorized("Password is not valid !")));
  }

  const [accessToken, refreshToken] = await generateToken({
    _id: user._id,
    username,
  });

  res.status(200).json({
    message: "Login successfully !",
    data: user,
    accessToken,
    refreshToken,
  });
});

// Logout user
const logout = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    next(new ApiError(createError.NotFound("Refresh token is empty !")));
  }

  const message = await deleteRefreshToken(refreshToken);

  res.status(200).json({
    message,
  });
});

// Refresh token
const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    next(new ApiError(createError.NotFound("Refresh token is empty !")));
  }

  const { _id, username } = await verifyRefreshToken(refreshToken);
  const [accessToken, refrToken] = await generateToken({
    _id,
    username,
  });

  res.status(200).json({
    message: "Refresh token successfully !",
    accessToken,
    refrToken,
  });
});

// Register user
const register = catchAsync(async (req, res, next) => {
  const { error } = validateUser(req.body);

  if (error) {
    next(new ApiError(createError.BadRequest(error.details[0].message)));
  }

  const { username, password } = req.body;

  const isExit = await User.findOne({ username });

  if (isExit) {
    next(new ApiError(createError.Conflict("Username is exit !")));
  }

  const newUser = new User({ username, password });
  const savedUser = await newUser.save();

  const [accessToken, refreshToken] = await generateToken({
    _id: user._id,
    username,
  });

  res.status(200).json({
    message: "Register successfully !",
    data: savedUser,
    accessToken,
    refreshToken,
  });
});

module.exports = { login, logout, refreshToken, register };
