import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

const signupSchema = z.object({
    email: z.string().email("Invalid email format").max(70),
    username: z.string().min(3, "Username too short").max(8, "Username too long"),
    password: z.string().min(4, "Password must be at least 4 characters"),
    role: z.enum(["student", "recruiter"], {
        errorMap: () => ({ message: 'Role must be either "student" or "recruiter"' }),
    }),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_KEY,
        { expiresIn: "7d" }
    );
};

const setTokenCookie = (res, token) => {
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
    });
};

export const signup = async (req, res) => {
    const parsedInput = signupSchema.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: parsedInput.error.flatten().fieldErrors,
        });
    }

    const { email, username, password, role } = parsedInput.data;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this email" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            username,
            password: hashedPassword,
            role,
        });

        const token = generateToken(newUser);
        setTokenCookie(res, token);


        return res.status(201).json({
            message: "Account created successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
            token,
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Error creating account", error: error.message });
    }
};



export const login = async (req, res) => {

    const parsedInput = loginSchema.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: parsedInput.error.flatten().fieldErrors,
        });
    }

    const { email, password } = parsedInput.data;

    try {

        const existingUser = await User.findOne({ email });
        if (!existingUser) {

            return res.status(401).json({ message: "Invalid email or password" });
        }


        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }


        const token = generateToken(existingUser);
        setTokenCookie(res, token);


        return res.status(200).json({
            message: "Login successful",
            user: {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                role: existingUser.role,
            },
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Error during login", error: error.message });
    }
};



export const logout = async (req, res) => {
    try {

        res.clearCookie("token", { path: "/" });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Error during logout", error: error.message });
    }
};



export const getMe = async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error("GetMe error:", error);
        return res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};