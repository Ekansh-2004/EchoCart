import { useEffect, useState } from "react";
import useProductStore from "../store/useProductStore.js";
import "./shopping-cart.css";

function ShoppingCart() {
	const { products, fetchProducts, addQuantity, removeQuantity } = useProductStore();
	const [popupOpen, setPopupOpen] = useState(false);
	const [popupItemId, setPopupItemId] = useState(null);
	const [popupQuantity, setPopupQuantity] = useState("");
	const [popupMode, setPopupMode] = useState("add");

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const handleAdd = (productId) => {
		setPopupItemId(productId);
		setPopupQuantity("");
		setPopupMode("add");
		setPopupOpen(true);
	};

	const handleRemove = (productId) => {
		setPopupItemId(productId);
		setPopupQuantity("");
		setPopupMode("remove");
		setPopupOpen(true);
	};

	const confirmAction = async () => {
		const quantity = parseInt(popupQuantity, 10);
		if (!isNaN(quantity) && quantity > 0) {
			if (popupMode === "add") {
				await addQuantity(popupItemId, quantity);
				setPopupOpen(false);
			} else if (popupMode === "remove") {
				const currentProduct = products.find((p) => p._id === popupItemId);
				if (quantity > currentProduct?.quantity) {
					alert("Cannot remove more than present in inventory.");
					return;
				}
				await removeQuantity(popupItemId, quantity);
				setPopupOpen(false);
			}
		} else {
			alert("Please enter a valid number greater than 0.");
		}
	};

	const totalItems = products.reduce((sum, item) => sum + (item.quantity || 0), 0);

	if (products.length === 0) {
		return (
			<div className="cart-fullscreen-bg">
				<div className="cart-header">
					<h2>🛒 EchoCart Inventory</h2>
				</div>
				<p>{"No products found"}</p>
			</div>
		);
	}

	const currentProduct = products.find((p) => p._id === popupItemId);

	return (
		<>
			<div className={`cart-fullscreen-bg ${popupOpen ? "blurred" : ""}`}>
				<div className="cart-header">
					<h2>🛒 EchoCart Inventory</h2>
				</div>
				<div className="cart-items-grid">
					{products.map((item) => (
						<div
							key={item._id}
							className="cart-item-card"
						>
							<img
								src={item.image}
								alt={item.name}
								className="cart-item-img"
							/>
							<div className="cart-item-info">
								<div className="cart-item-name">{item.name}</div>
								<div className="cart-item-price">
									Quantity: {item.quantity || 0} {item.unit}
								</div>
							</div>
							<div className="cart-item-actions">
								<button onClick={() => handleAdd(item._id)}>Add</button>
								<button
									className="cart-item-delete"
									onClick={() => handleRemove(item._id)}
								>
									Remove
								</button>
							</div>
						</div>
					))}
				</div>
				{totalItems === 0 && <p className="cart-empty">Your inventory is empty</p>}
			</div>

			{popupOpen && (
				<div className="popup-overlay">
					<div className="popup-form">
						<h3>{popupMode === "add" ? `Enter quantity to add for ${currentProduct?.name}` : `Enter quantity to remove for ${currentProduct?.name}`}</h3>
						<input
							type="number"
							placeholder="Quantity"
							value={popupQuantity}
							onChange={(e) => setPopupQuantity(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") confirmAction();
							}}
							autoFocus
						/>
						<div>
							<button
								className="add-btn"
								onClick={confirmAction}
							>
								Confirm
							</button>
							<button
								className="cancel-btn"
								onClick={() => setPopupOpen(false)}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default ShoppingCart;
