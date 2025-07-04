import mongoose from "mongoose";
//define the Schema For Users

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
