import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
//whenever we will use this middleware , the user had to signin/login to go the next route
export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		//if there is no token , send error
		if (!token) {
			return res.status(401).send({ message: "UnAuthorised : No token" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		//if the token is not valid , send error
		if (!decoded) {
			return res.status(401).send({ message: "UnAuthorised : Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		req.user = user;
		next();
	} catch (error) {
		return res.status(500).send({ error: "Internal Server Error" });
	}
};
