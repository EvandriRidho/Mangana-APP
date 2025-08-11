import Books from "../models/Books.js";
import { sendError, sendSuccess } from '../utils/response.js';
import cloudinary from '../lib/clodinary.js ';

export const createBook = async (req, res) => {
    try {
        const { title, caption, image, rating } = req.body;
        //  check if all fields are provided
        if (!title || !caption || !image || !rating) {
            return sendError(res, 400, 'All fields are required');
        }

        // Upload image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image)
        const imageUrl = uploadResponse.secure_url;

        // save book to database
        const books = new Books({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id
        });

        await books.save();

        return sendSuccess(res, 201, books);

    } catch (error) {
        console.error("Error creating book:", error);
        return sendError(res, 500, 'Server error');

    }
}