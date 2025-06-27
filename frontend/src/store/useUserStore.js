import { create } from "zustand";
import axios from "../lib/axios.js";

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
		}

		try {
			const res = await axios.post("/auth/signup", { fullName: name, email, password });
			console.log(res.data);
			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
		}
	},

	login: async (email, password) => {
		set({ loading: true });

		try {
			const res = await axios.post("/auth/login", { email, password });
			set({ user: res.data, loading: false });
			console.log(user);
		} catch (error) {
			set({ loading: false });
		}
	},

	logout: async () => {
		try {
			await axios.post("/auth/logout");
			set({ user: null });
		} catch (error) {}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const res = await axios.get("/auth/me");

			set({ user: res.data, checkingAuth: false });
		} catch (error) {
			set({ checkingAuth: false, user: null });
		}
	},
}));
