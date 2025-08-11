import express from "express";
import { createBook, getAllBooks, deletedById } from "../controller/booksController.js";
import protectRoute from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/', protectRoute, getAllBooks);
router.post('/add', protectRoute, createBook);
router.delete('/:id', protectRoute, deletedById);

export default router;