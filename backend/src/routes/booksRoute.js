import express from "express";
import { createBook } from "../controller/booksController.js";
import protectRoute from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/create', protectRoute, createBook);

export default router;