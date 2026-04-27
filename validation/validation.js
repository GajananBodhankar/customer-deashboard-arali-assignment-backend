import bcrypt from "bcryptjs";
import { AppError } from "../Error/AppError.js";
import jwt from "jsonwebtoken"
function userValidation(req) {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    throw new AppError("All fields are required");
  }

  if (typeof password !== "string") {
    throw new AppError("Password must be a string");
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters");
  }
}

async function userLoginValidationAndTokenGen(user, password) {
  if (!user) throw new AppError("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid password" );

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
}

export { userValidation, userLoginValidationAndTokenGen };
