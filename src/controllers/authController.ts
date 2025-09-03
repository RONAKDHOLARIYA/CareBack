import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import User from "../models/User";



// ✅ Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Login
export const login = async (req: Request, res: Response) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not defined" });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Profile Update
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = (req as any).user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get Profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // 👈 comes from JWT middleware

    const user = await User.findById(userId).select("-password"); // hide password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
