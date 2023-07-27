// generate token using secret from process.env.JWT_SECRET
import jwt from "jsonwebtoken";

// generate token and return it
export const generateToken = (user) => {
  //1. Don't use password and other sensitive fields
  //2. Use the information that are useful in other parts
  if (!user) return null;

  var u = {
    id: user.id,
    fullName: user.fullName,
    password: user.password,
    rolePosition: user.rolePosition,
  };

  return jwt.sign(u, process.env.JWT_SECRET || "", {
    expiresIn: 60 * 60 * 24, // expires in 24 hours
  });
};

// return basic user details
export const getCleanUser = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    fullName: user.fullName,
    password: user.password,
    rolePosition: user.rolePosition,
  };
};
