import Joi from "joi";

// Validate user information
const validateUser = (data) => {
  const userSchema = Joi.object({
    username: Joi.string().pattern(new RegExp("gmail.com$")).email().required(),
    password: Joi.string().min(5).max(12).required(),
  });
  return userSchema.validate(data);
};

module.exports = { validateUser };
