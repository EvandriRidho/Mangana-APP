import Books from "../models/Books.js";
import { sendError, sendSuccess } from '../utils/response.js';
import cloudinary from '../lib/clodinary.js ';

export const getAllBooks = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        // Validate page and limit
        const books = await Books.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'username profileImage');

        const totalBooks = await Books.countDocuments();

        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        });

    } catch (error) {
        console.error("Error in get all books:", error);
        return sendError(res, 500, 'Server error');
    }
}

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

export const deletedById = async (req, res) => {
    try {
        const book = await Books.findById(req.params.id);

        // Check if the book exists
        if (!book) {
            return sendError(res, 404, 'Book not found');
        }

        // Check if the user is authorized to delete the book
        if (book.user.toString() !== req.user._id.toString()) {
            return sendError(res, 403, 'You are not authorized to delete this book');
        }

        // Delete image from Cloudinary
        if (book.image && book.image.includes('cloudinary')) {
            try {
                const publicId = book.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
                return sendError(res, 500, 'Error deleting image from Cloudinary');
            }
        }

        await book.deleteOne();

        return sendSuccess(res, 200, 'Book deleted successfully');

    } catch (error) {
        console.error("Error deleting book:", error);
        return sendError(res, 500, 'Server error');
    }
}