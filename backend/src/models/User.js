import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,          
      minlength: 3,
      maxlength: 8,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,         
      lowercase: true,      
      maxlength: 70,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 4,
    },
    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: [true, "Role is required"],
    },
  },
  {
    timestamps: true,
  }
);
export const User = mongoose.model("User", userSchema);