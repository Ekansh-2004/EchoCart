import express from "express";

import { addProduct, getProducts, updateProduct } from "../controllers/product.controllers.js";

const router = express.Router();

router.get("/getAll", getProducts);
router.post("/add", addProduct);
router.patch("/update/:id", updateProduct);

export default router;
