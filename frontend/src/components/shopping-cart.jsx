import React, { useEffect, useState } from 'react';
import './shopping-cart.css';

function ShoppingCart() {
  const [cart, setCart] = useState({});
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupItemKey, setPopupItemKey] = useState(null);
  const [popupQuantity, setPopupQuantity] = useState('');

  useEffect(() => {
    fetch('/cart-data.json')
      .then((res) => res.json())
      .then((data) => setCart(data))
      .catch((err) => console.error('Failed to load cart data:', err));
  }, []);

  const handleAdd = (key) => {
    setPopupItemKey(key);
    setPopupQuantity('');
    setPopupOpen(true);
  };

  const confirmAdd = () => {
    const quantity = parseInt(popupQuantity, 10);
    if (!isNaN(quantity) && quantity > 0) {
      setCart((prevCart) => ({
        ...prevCart,
        [popupItemKey]: {
          ...prevCart[popupItemKey],
          quantity: prevCart[popupItemKey].quantity + quantity,
        },
      }));
      setPopupOpen(false);
    } else {
      alert('Please enter a valid number greater than 0.');
    }
  };

  const handleDelete = (key) => {
    setCart((prevCart) => ({
      ...prevCart,
      [key]: {
        ...prevCart[key],
        quantity: 0,
      },
    }));
  };

  const cartItems = Object.entries(cart);
  const totalItems = cartItems.reduce((sum, [, item]) => sum + item.quantity, 0);

  return (
    <>
      <div className={`cart-fullscreen-bg ${popupOpen ? 'blurred' : ''}`}>
        <div className="cart-header">
          <h2>🛒 EchoCart Inventory</h2>
          <span className="cart-total-count">Total: {totalItems}</span>
        </div>
        <div className="cart-items-grid">
          {cartItems.map(([key, item]) => (
            <div key={key} className="cart-item-card">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">
                  Quantity: {item.quantity} {item.unit}
                </div>
              </div>
              <div className="cart-item-actions">
                <button onClick={() => handleAdd(key)}>Add</button>
                <button className="cart-item-delete" onClick={() => handleDelete(key)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {totalItems === 0 && <p className="cart-empty">Your cart is empty</p>}
      </div>

      {popupOpen && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h3>Enter quantity for {cart[popupItemKey]?.name}</h3>
            <input
              type="number"
              placeholder="Quantity"
              value={popupQuantity}
              onChange={(e) => setPopupQuantity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmAdd();
              }}
              autoFocus
            />
            <div>
              <button className="add-btn" onClick={confirmAdd}>
                Confirm
              </button>
              <button className="cancel-btn" onClick={() => setPopupOpen(false)}>
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
