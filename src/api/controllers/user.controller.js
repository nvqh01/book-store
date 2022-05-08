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

      const accessToken = await token.generateToken({
        _id: user._id,
        username,
        password,
      });

      res.status(200).json({
        message: "Login Successfully !",
        data: user,
        accessToken,
      });
    } catch (err) {
      next(err);
    }
  },

  logout: (req, res, next) => {},

  refreshToken: (req, res, next) => {},

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

      res.status(200).json({
        message: "Success to register !",
        data: savedUser,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
