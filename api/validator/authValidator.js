import joi from "joi";

export const UserValidator = (user) => {
  const UserValidatorSchema = joi.object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    coverpic: joi.string().optional(),
    profilepic: joi.string().optional(),
    city: joi.string().optional(),
    website: joi.string().optional(),
  });
  return UserValidatorSchema.validate(user);
};
export const UserLoginValidator = (user) => {
  const UserLoginValidatorSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).required(),
  });
  return UserLoginValidatorSchema.validate(user);
};
