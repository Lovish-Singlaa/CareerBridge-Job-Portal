import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }

        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            })
        }

        const hashedPass = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPass,
            role,
            profile:{
                profilePhoto: cloudResponse.secure_url
            }
        })

        return res.status(201).json({
            message: "Account created successfully",
            success: "true",
        })
    } catch (error) {

    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            })
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            })
        }
        //check role
        const isRoleMatched = user.role == role;
        if (!isRoleMatched) {
            return res.status(400).json({
                message: "Incorrect role"
            })
        }

        const tokenData = {
            userId: user._id,
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie('token', token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'none' }).json({
            message: `Welcome Back ${user.fullname}`,
            user,
            success: true,
        })
    } catch (error) {
        console.log(error)
    }
}

export const logout = async (req, res) => {
    return res.status(201).cookie('token', '', { maxAge: 0 }).json({
        message: "Logged out successfully",
        success: true,
    })
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        const file = req.file;  //cloudinary
        const fileUri = getDataUri(file)

        let cloudResponse;
        try {
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        } catch (error) {
            return res.status(500).json({
                message: "Error uploading file",
                success: false
            });
        }

            let skillsArray;
            if (skills) skillsArray = skills.split(",");

            const userId = req.id;  //middleware authentication

            let user = await User.findById(userId);
            if (!user) {
                return res.status(400).json({
                    message: "User not found",
                    success: false
                })
            }

            if (fullname) user.fullname = fullname
            if (email) user.email = email
            if (phoneNumber) user.phoneNumber = phoneNumber
            if (bio) user.profile.bio = bio
            if (skills) user.profile.skills = skillsArray

            if (cloudResponse) {
                user.profile.resume = cloudResponse.secure_url
                user.profile.resumeOriginalName = file.originalname
            }

            await user.save();

            user = {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile
            }

            return res.status(200).json({
                message: "Profile updated successfully",
                success: true
            })

        } catch (error) {
            console.log(error)
        }
    }
