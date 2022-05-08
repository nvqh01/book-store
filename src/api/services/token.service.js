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
};

module.exports = token;
