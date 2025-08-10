import User from '../model/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/tokenUtils.js';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // check input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // check if user already exists
        const isUserExist = await User.findOne({ $or: [{ username }, { email }] });
        if (isUserExist) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const randomProfileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;
        const user = new User({
            username,
            email,
            password: hashedPassword,
            profileImage: randomProfileImage
        });

        await user.save();

        // generate JWT token
        const token = generateToken(user._id);

        res.status(201).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            },
            token
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check Input
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // check if user exist
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // check password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // generate JWT token
        const token = generateToken(user._id);

        res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            },
            token
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Server error' });
    }
}