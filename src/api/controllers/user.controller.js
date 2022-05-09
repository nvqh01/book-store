import createError from "http-errors";
import { User } from "../models/index";
import validation from "../helpers/validation";
import token from "../services/token.service";

const userController = {
  login: async (req, res, next) => {
    try {
      const { error } = validation.validateUser(req.body);

      if (error) {
        next(createError(error.details[0].message));
      }

      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (!user) {
        next(createError.NotFound("Username is not found !"));
      }

      const isValid = await user.isValidPassword(password);

      if (!isValid) {
        next(createError.Unauthorized());
      }

      const [accessToken, refreshToken] = await token.generateToken({
        _id: user._id,
        username,
      });

      res.status(200).json({
        message: "Login Successfully !",
        data: user,
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  },

  logout: (req, res, next) => {},

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        next(new Error("Refresh token is empty !"));
      }

      const { _id, username } = await token.verifyRefreshToken(refreshToken);
      const [accessToken, refrToken] = await token.generateToken({
        _id,
        username,
      });

      res.status(200).json({
        message: "Refresh Token Successfully !",
        accessToken,
        refrToken,
      });
    } catch (err) {
      next(err);
    }
  },

  register: async (req, res, next) => {
    try {
      const { error } = validation.validateUser(req.body);

      if (error) {
        next(createError(error.details[0].message));
      }

      const { username, password } = req.body;

      const isExit = await User.findOne({ username });

      if (isExit) {
        next(createError.Conflict("Username is exit !"));
      }

      const newUser = new User({ username, password });
      const savedUser = await newUser.save();

      const [accessToken, refreshToken] = await token.generateToken({
        _id: user._id,
        username,
      });

      res.status(200).json({
        message: "Success to register !",
        data: savedUser,
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
