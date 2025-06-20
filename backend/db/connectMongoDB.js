import mongoose from "mongoose";

let listenersAdded = false;
const connectMongoDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		// if (!listenersAdded) {
		// 	mongoose.connection.on("connected", () => {
		console.log("MongoDB connected");
		// 	});
		// 	listenersAdded = true;
		// }
	} catch (error) {
		console.error(`error : ${error}.message`);
		process.exit(1);
	}
};

export default connectMongoDB;
