import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "/api",
	withCredentials: true, // send cookies when making requests
});

export default axiosInstance;
