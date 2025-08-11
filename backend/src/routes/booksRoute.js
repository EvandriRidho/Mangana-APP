import express from "express";
import { createBook, getAllBooks } from "../controller/booksController.js";
import protectRoute from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/', protectRoute, getAllBooks);
router.post('/add', protectRoute, createBook);

export default router;