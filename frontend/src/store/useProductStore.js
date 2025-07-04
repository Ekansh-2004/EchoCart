import { create } from "zustand";
import axios from "../lib/axios.js";

const useProductStore = create((set) => ({
	products: [],
	fetchProducts: async () => {
		const response = await axios.get("/products/getAll");
		set({ products: response.data });
	},
	addQuantity: async (productId, quantity) => {
		try {
			const response = await axios.patch(`/products/add/${productId}`, { id: productId, quantity });

			set((prevState) => {
				const updatedProducts = prevState.products.map((product) => {
					if (product._id === productId) {
						return {
							...product,
							quantity: product.quantity + quantity,
						};
					}
					return product;
				});

				return { products: updatedProducts };
			});
		} catch (error) {
			console.error("Failed to add quantity:", error);
		}
	},

	removeQuantity: async (productId, quantity) => {
		try {
			const response = await axios.patch(`/products/remove/${productId}`, { id: productId, quantity });

			set((prevState) => {
				const updatedProducts = prevState.products.map((product) => {
					if (product._id === productId) {
						return {
							...product,
							quantity: product.quantity - quantity,
						};
					}
					return product;
				});

				return { products: updatedProducts };
			});
		} catch (error) {
			console.error("Failed to remove quantity:", error);
		}
	},
}));

export default useProductStore;
