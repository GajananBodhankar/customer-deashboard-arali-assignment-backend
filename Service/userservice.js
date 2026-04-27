import User from "../Model/userModel.js";
import { userValidation } from "../validation/validation.js";
import bcrypt from "bcryptjs";

async function saveUser(request, response, session) {
  const { email, password } = request.body;
  userValidation(request, response);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
  });

  return await user.save({session});
}

async function findUser(email) {
  return await User.findOne({ email });
}

async function deleteUserById(id) {
  return await User.findByIdAndDelete(id);
}

export { saveUser, findUser, deleteUserById };
