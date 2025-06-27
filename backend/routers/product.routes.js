import express from "express";

import { addProduct, addQuantity, getProducts, removeQuantity } from "../controllers/product.controllers.js";

const router = express.Router();

router.get("/getAll", getProducts);
router.post("/add", addProduct);
router.patch("/add/:id", addQuantity);
router.patch("/remove/:id", removeQuantity);

export default router;
