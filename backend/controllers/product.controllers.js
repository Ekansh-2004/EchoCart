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

export const addQuantity = async (req, res) => {
	try {
		const { id } = req.params;
		const { quantity } = req.body;
		if (!id || !quantity || quantity <= 0) {
			return res.status(400).json({ error: "Product ID and valid quantity are required" });
		}

		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		// Add quantity to existing product
		product.quantity = (product.quantity || 0) + parseInt(quantity);
		await product.save();

		res.status(200).json(product);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};

export const removeQuantity = async (req, res) => {
	try {
		const { id } = req.params;
		const { quantity } = req.body;

		if (!quantity || quantity <= 0) {
			return res.status(400).json({ error: "Valid quantity is required" });
		}

		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		// Check if there's enough quantity to remove
		if (quantity > product.quantity) {
			return res.status(400).json({ error: "Cannot remove more than available quantity" });
		}

		// Remove quantity from existing product
		product.quantity = product.quantity - parseInt(quantity);
		await product.save();

		res.status(200).json(product);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// export const updateProduct = async (req, res) => {
// 	try {
// 		const product = await Product.findById(req.params.id);

// 		if (!product) {
// 			return res.status(404).json({ error: "Product not found" });
// 		}

// 		product.quantity = req.body.quantity;
// 		await product.save();
// 		res.status(200).json({ message: "Product quantity updated successfully", product });
// 	} catch (error) {
// 		console.log(error);
// 		res.status(400).json({ error: "Error updating product quantity" });
// 	}
// };
