import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendError, sendSuccess } from '../utils/response.js';

const protectRoute = async (req, res, next) => {
    try {
        // get token from headers 
        const token = req.headers("Authorization").replace("Bearer ", "");
        if (!token) {
            return sendError(res, 401, "No authorization token, access denied");
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find user by id
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return sendError(res, 401, "Token is not valid, access denied");
        }

        req.user = user; // attach user to request object
        next();
    } catch (error) {
        console.error("Error in auth middleware:", error);
        return sendError(res, 401, "Token is not valid, access denied");
    }
}

export default protectRoute;