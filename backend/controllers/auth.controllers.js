import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";

//SIGN UP FUNCTION
// 1. Check the validity of username , password and email
// 2. Hash the password
// 3. Create the User in db and save it
// 4. Create token and save it to cookie

export const signup = async (req, res) => {
	try {
		const { fullName, email, password } = req.body;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

		const existingUser = await User.findOne({ fullName });
		if (existingUser) {
			return res.status(400).json({ error: "Username is already taken" });
		}

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ error: "Email is already taken" });
		}

		if (password.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters long" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			fullName,
			email,
			password: hashedPassword,
		});

		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();
			const { password: _, ...userWithoutPassword } = newUser.toObject();
			res.status(201).json(userWithoutPassword);

			res.status(201).json(newUser);
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// LOGIN IN FUNCTION
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			res.status(400).json({ error: "Email already exists" });
		}
		//check whether the password submitted is equal to the password in the db
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
		if (!isPasswordCorrect) {
			res.status(400).json({ error: "Invalid Password" });
		}

		generateTokenAndSetCookie(user._id, res);

		const { password: _, ...userWithoutPassword } = user.toObject();
		res.status(201).json(userWithoutPassword);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// LOG OUT FUNCTION
export const logout = async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logout Out successfully" });
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

// GET ME
export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");

		res.status(200).json(user);
	} catch (error) {
		console.error("Auth error:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
