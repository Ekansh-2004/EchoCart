import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
	try {
		const products = await Product.find();
		res.status(200).json(products);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const addProduct = async (req, res) => {
	try {
		const product = await Product.create(req.body);
		res.status(201).json(product);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const updateProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		product.quantity = req.body.quantity;
		await product.save();
		res.status(200).json({ message: "Product quantity updated successfully", product });
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: "Error updating product quantity" });
	}
};
