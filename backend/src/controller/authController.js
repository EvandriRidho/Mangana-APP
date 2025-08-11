import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';
import { sendError, sendSuccess } from '../utils/response.js';

const DEFAULT_PROFILE_IMAGE = 'https://api.dicebear.com/9.x/avataaars/svg?seed=';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // check input
        if (!username || !email || !password) {
            return sendError(res, 400, 'All fields are required');
        }

        // check if user already exists
        const isUserExist = await User.findOne({ $or: [{ username }, { email }] });
        if (isUserExist) {
            return sendError(res, 400, 'User already exists');
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const profileImage = `${DEFAULT_PROFILE_IMAGE}${username}`;

        const user = new User({
            username,
            email,
            password: hashedPassword,
            profileImage
        });

        await user.save();

        // generate JWT token
        const token = generateToken(user._id);

        return sendSuccess(res, 201, {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            },
            token
        })
    } catch (error) {
        console.error("Error during registration:", error);
        return sendError(res, 500, 'Server error');
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check Input
        if (!email || !password) {
            return sendError(res, 400, 'All fields are required');
        }

        // check if user exist
        const user = await User.findOne({ email })
        if (!user) {
            return sendError(res, 400, 'User not found');
        }

        // check password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return sendError(res, 400, 'Invalid credentials');
        }

        // generate JWT token
        const token = generateToken(user._id);

        return sendSuccess(res, 200, {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            },
            token
        })
    } catch (error) {
        console.error("Error during login:", error);
        return sendError(res, 500, 'Server error');
    }
}