import User from '../model/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
}
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // 1.check input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // 2.check if user already exists
        const isExistingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (isExistingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 3.Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4.Create new user
        const randomProfileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;
        const user = new User({
            username,
            email,
            password: hashedPassword,
            profileImage: randomProfileImage
        });

        await user.save();

        // 5.Generate JWT token
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

    } catch (error) {

    }
}