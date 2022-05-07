import createError from "http-errors";
import { User } from "../models/index";
import validation from "../helpers/validation";

const userController = {
  login: (req, res, next) => {
    res.send(req.body);
  },

  logout: (req, res, next) => {},

  refreshToken: (req, res, next) => {},

  register: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const { error } = validation.validateUser({ username, password });

      if (error) {
        next(createError(error.details[0].message));
      }

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
      next(createError(err));
    }
  },
};

module.exports = userController;
