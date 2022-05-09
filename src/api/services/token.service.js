import dotenv from "dotenv";
import JWT from "jsonwebtoken";

dotenv.config();

const token = {
  generateToken: async (payload) => {
    try {
      const token = await JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });

      if (!token) {
        throw new Error("Fail to generate token !");
      }

      return token;
    } catch (err) {
      throw new Error(err);
    }
  },

  verifyToken: async (req, res, next) => {
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
};

module.exports = token;
