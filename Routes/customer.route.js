import express, { request } from "express";
import mongoose from "mongoose";
import Customer from "../Model/customerModel.js";
import User from "../Model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userLoginValidationAndTokenGen, userValidation } from "../validation/validation.js";
import { deleteUserById, findUser, saveUser } from "../Service/userservice.js";
import { deleteCustomerById, getAllCustomers, saveCustomer } from "../Service/customerservice.js";
import { AppError } from "../Error/AppError.js";
import auth from "../Middleware/auth.js";

const route = express.Router();

route.post("/register", async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await saveUser(req, res, session);
    const savedCustomer = await saveCustomer(req, user, session);

    await session.commitTransaction(); // ✅ IMPORTANT
    session.endSession();

    return res.status(201).json({
      message: "User registered successfully",
      customer: savedCustomer,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    if (err instanceof AppError) {
      return res.status(400).json({ error: err.message });
    }

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        error: "Validation failed",
        details: messages,
      });
    }

    if (err.code === 11000) {
      return res.status(400).json({
        error: "user with same email or phone already exists",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required");
    }

    const user = await findUser(email);

    const token = await userLoginValidationAndTokenGen(user, password);
    const { name, phone, _id: id } = await Customer.findOne({ user: user._id });
    return res.json({ token, name, email, phone, id });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(400).json({
        error: err.message,
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
});

route.get("/", auth, async (request, response) => {
  return response.status(200).json(await getAllCustomers());
});

route.delete("/:id", auth, async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const customer = await Customer.findById(id).session(session);
    if (!customer) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Customer not found" });
    }

    if (customer.user.toString() !== req.user.id) {
      await session.abortTransaction();
      return res.status(403).json({
        error: "Unauthorized: You can only delete your own account",
      });
    }

    await Customer.findByIdAndDelete(id).session(session);

    await User.findByIdAndDelete(customer.user).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.json({
      message: "User and customer deleted successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      error: "Delete failed",
      message: err.message,
    });
  }
});

route.put("/:id", auth, async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { id } = req.params;
    const { name, email, phone, password } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const customer = await Customer.findById(id).session(session);

    if (!customer) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Customer not found" });
    }

    if (customer.user.toString() !== req.user.id) {
      await session.abortTransaction();
      return res.status(403).json({
        error: "Unauthorized: You can only update your own data",
      });
    }

    const user = await User.findById(customer.user).session(session);

    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ error: "User not found" });
    }

    if (name) customer.name = name;
    if (email) customer.email = email;
    if (phone) customer.phone = phone;

    await customer.save({ session });

    if (email) user.email = email;

    if (password) {
      if (typeof password !== "string" || password.length < 6) {
        await session.abortTransaction();
        return res.status(400).json({
          error: "Password must be at least 6 characters",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.json({
      message: "User and customer updated successfully",
      customer,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    if (err.code === 11000) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: Object.values(err.errors).map((e) => e.message),
      });
    }

    return res.status(500).json({
      error: "Update failed",
      message: err.message,
    });
  }
});

export default route;
