import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import connectMongoDB from "./db/connectMongoDB.js";

import authRoutes from "./routers/auth.routes.js";

const PORT = process.env.PORT || 4000;
const app = express();

dotenv.config();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
	console.log(`server listening at port ${PORT}`);
	connectMongoDB();
});
