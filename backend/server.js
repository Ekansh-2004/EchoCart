import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import connectMongoDB from "./db/connectMongoDB.js";

import authRoutes from "./routers/auth.routes.js";
import productRoutes from "./routers/product.routes.js";
const PORT = process.env.PORT || 4001;
const app = express();

dotenv.config();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Add this function somewhere in your server.js file
// const checkInventory = async () => {
// 	try {
// 		const emptyProducts = await Product.find({ quantity: 0 }); // Use your actual model

// 		if (emptyProducts.length > 0) {
// 			let message;

// 			if (emptyProducts.length === 1) {
// 				message = `Attention! ${emptyProducts[0].name} is currently out of stock and needs restocking.`;
// 			} else {
// 				const names = emptyProducts.map((p) => p.name).join(", ");
// 				message = `Attention! Multiple products are out of stock: ${names}.`;
// 			}

// 			console.log(`🚨 ${message}`);
// 			say.speak(message, "Samantha", 0.7);
// 		}
// 	} catch (error) {
// 		console.error("Error checking inventory:", error);
// 	}
// };

// cron.schedule("*/1 * * * *", checkInventory);

// // Optional: Call immediately when server starts (for testing)
// checkInventory();

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
	console.log(`server listening at port ${PORT}`);
	connectMongoDB();
});
