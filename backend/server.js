import cookieParser from "cookie-parser";
import express from "express";

const PORT = process.env.PORT || 4000;
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(PORT, () => {
	console.log(`server listening at port ${PORT}`);
});
