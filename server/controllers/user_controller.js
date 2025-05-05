import userModel from "../models/user_model.js";
import bcrypt from "bcryptjs";

export const registerController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Please Fill all fields"
            });
        }
        const exisitingUser = await userModel.findOne({ email });
        if (exisitingUser) {
            return res.status(401).send({
                success: false,
                message: "User already exisits"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ email, password: hashedPassword });
        await user.save();
        return res.status(201).send({
            success: true,
            message: "New User Created",
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error In Register callback",
            success: false,
            error
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        return res.status(200).send({
            userCount: users.length,
            success: true,
            message: "all users data",
            users
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Get ALl Users",
            error
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).send({
                success: false,
                message: "Please provide email or password"
            });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "email is not registerd"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: "Invalid username or password"
            });
        }
        return res.status(200).send({
            success: true,
            messgae: "Login successfully",
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Login Callcback",
            error
        });
    }
};