import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"]
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        }
    },
    {
        timestamps: true
    }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;