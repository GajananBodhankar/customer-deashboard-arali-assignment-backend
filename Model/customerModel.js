import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      match: [/^[A-Za-z\s]+$/, "Name can only contain letters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    phone: {
      type: String,
      unique: true,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Phone must be 10 digits"],
    },
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true
    }
  },
  { timestamps: true }
);

const Customer= mongoose.model("Customer", customerSchema);
export default Customer;
