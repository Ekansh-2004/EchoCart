import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.mode === "development" ? "http://localhost:4001/api" : "/api",
	withCredentials: true, // send cookies when making requests
});

export default axiosInstance;
