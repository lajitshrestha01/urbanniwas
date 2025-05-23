import bcryptjs from "bcryptjs";
import prisma from "../lib/prisma.js";
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
        });

        console.log(newUser);
        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create user!" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credentials!" });
        }

        const age = 1000 * 60 * 60 * 24;

        const token = jwt.sign({
            id: user.id,
            role: user.role,
        }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

        // Set token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: age,
        }).status(200).json({
            user: user,
            message: "Login Successful"
        });
        console.log(user)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to login!" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Failed to logout!" });
        }
        res.status(200).json({ message: "Logout Successful" });
    });
};
