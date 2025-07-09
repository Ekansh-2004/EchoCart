import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import connectMongoDB from "./db/connectMongoDB.js";
import AIStockMonitor from "./services/aiStockMonitor.js";

import authRoutes from "./routers/auth.routes.js";
import productRoutes from "./routers/product.routes.js";

dotenv.config();

const PORT = process.env.PORT || 4001;
const app = express();
const server = createServer(app);

// Configure CORS for both Express and Socket.io
const corsOptions = {
	origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
	credentials: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
};

app.use(cors(corsOptions));

const io = new Server(server, {
	cors: corsOptions
});

// Initialize AI Stock Monitor
const aiMonitor = new AIStockMonitor(io);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Socket.io connection handling
io.on('connection', (socket) => {
	console.log('👤 User connected:', socket.id);
	
	// Send current AI status to newly connected client
	socket.emit('aiStatus', aiMonitor.getStatus());
	
	// Handle AI control from frontend
	socket.on('startAI', (data) => {
		const { duration } = data;
		console.log(`🤖 Starting AI with ${duration} minute intervals`);
		aiMonitor.start(duration);
		io.emit('aiStatus', aiMonitor.getStatus());
	});
	
	socket.on('stopAI', () => {
		console.log('🤖 Stopping AI');
		aiMonitor.stop();
		io.emit('aiStatus', aiMonitor.getStatus());
	});
	
	socket.on('disconnect', () => {
		console.log('👤 User disconnected:', socket.id);
	});
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// AI Monitor control endpoints
app.post("/api/ai/start", (req, res) => {
	const { duration } = req.body;
	aiMonitor.start(duration || 15);
	res.json({ success: true, status: aiMonitor.getStatus() });
});

app.post("/api/ai/stop", (req, res) => {
	aiMonitor.stop();
	res.json({ success: true, status: aiMonitor.getStatus() });
});

app.get("/api/ai/status", (req, res) => {
	res.json(aiMonitor.getStatus());
});

// Health check endpoint
app.get("/api/health", (req, res) => {
	res.json({ 
		status: "OK", 
		timestamp: new Date().toISOString(),
		ai: aiMonitor.getStatus()
	});
});

server.listen(PORT, () => {
	console.log(`🚀 Server listening at port ${PORT}`);
	console.log(`🌐 CORS enabled for: ${corsOptions.origin.join(', ')}`);
	connectMongoDB();
});