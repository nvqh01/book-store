import dotenv from "dotenv";
import JWT from "jsonwebtoken";
import redis from "../../config/redis.config";

dotenv.config();

const token = {
  generateToken: async (payload) => {
    try {
      const accessToken = await JWT.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "20s",
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

      await redis.set(payload._id.toString(), refreshToken, {
        EX: 3 * 24 * 60 * 60,
      });

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
        throw new Error("Payload is empty !");
      }

      const reply = await redis.get(payload._id);

      if (reply !== refreshToken) {
        throw new Error("Refresh token is not valid !");
      }

      return payload;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  logout: async (refreshToken) => {
    try {
      const { _id } = await token.verifyRefreshToken(refreshToken);
      await redis.del(_id.toString());
      return "Logout !";
    } catch (err) {
      throw new Error(err.message);
    }
  },
};

module.exports = token;
