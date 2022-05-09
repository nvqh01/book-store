import dotenv from "dotenv";
import JWT from "jsonwebtoken";

dotenv.config();

const token = {
  generateToken: async (payload) => {
    try {
      const accessToken = await JWT.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "10m",
        }
      );

      if (!accessToken) {
        throw new Error("Fail to generate access token !");
      }

      const refreshToken = await JWT.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "3d",
        }
      );

      if (!refreshToken) {
        throw new Error("Fail to generate refresh token !");
      }

      return [accessToken, refreshToken];
    } catch (err) {
      throw new Error(err);
    }
  },

  verifyAccessToken: async (req, res, next) => {
    try {
      if (!req.headers["authorization"]) {
        next(new Error("Token is not valid !"));
      }

      const authHeader = req.headers["authorization"];
      const token = authHeader.split(" ")[1];
      const payload = await JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);

      if (!payload) {
        next("Payload is empty !");
      }

      req.payload = payload;
      next();
    } catch (err) {
      next(err);
    }
  },

  verifyRefreshToken: async (refreshToken) => {
    try {
      const payload = await JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      if (!payload) {
        next("Payload is empty !");
      }

      return payload;
    } catch (err) {
      next(err);
    }
  },
};

module.exports = token;
