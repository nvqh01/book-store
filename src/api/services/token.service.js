import ApiError from "../helpers/ApiError";
import dotenv from "dotenv";
import catchAsync from "../helpers/catchAsync";
import createError from "http-errors";
import JWT from "jsonwebtoken";
import redis from "../../config/redis.config";

dotenv.config();

// Delete refresh token
const deleteRefreshToken = async (refreshToken) => {
  const { _id } = await verifyRefreshToken(refreshToken);
  await redis.del(_id.toString());
  return "Logout Successfully !";
};

// Generate access token and refresh token
const generateToken = async (payload) => {
  const accessToken = await JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });

  if (!accessToken) {
    throw new ApiError(createError.NotFound("Access token is empty !"));
  }

  const refreshToken = await JWT.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "3d",
    }
  );

  if (!refreshToken) {
    throw new ApiError(createError.NotFound("Refresh token is empty !"));
  }

  await redis.set(payload._id.toString(), refreshToken, {
    EX: 3 * 24 * 60 * 60,
  });

  return [accessToken, refreshToken];
};

// Verify access token
const verifyAccessToken = catchAsync(async (req, res, next) => {
  if (!req.headers["authorization"]) {
    next(new ApiError(createError.Unauthorized("Access token is empty")));
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  const payload = await JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (!payload) {
    next(new ApiError(createError.NotFound("Payload is empty")));
  }

  req.payload = payload;
  next();
});

// Verify refresh token
const verifyRefreshToken = async (refreshToken) => {
  const payload = await JWT.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  if (!payload) {
    throw new ApiError(createError.NotFound("Payload is empty"));
  }

  const reply = await redis.get(payload._id);

  if (reply !== refreshToken) {
    throw new ApiError(
      createError.Unauthorized("Refresh token is not valid !")
    );
  }

  return payload;
};

module.exports = {
  deleteRefreshToken,
  generateToken,
  verifyAccessToken,
  verifyRefreshToken,
};
