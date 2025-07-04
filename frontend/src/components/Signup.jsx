import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useUserStore } from "../store/useUserStore.js";

import { useState } from "react";
import "./Signup.css";

const Signup = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { signup, loading } = useUserStore();

	const handleSubmit = (e) => {
		e.preventDefault();
		signup(formData);
	};

	return (
		<div className="signup-container">
			<div className="signup-box">
				<img
					src={logo}
					alt="Echocart Logo"
					className="echocart-logo"
				/>
				<h2>Create your Echocart Account</h2>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Full Name"
						className="signup-input"
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						value={formData.name}
						required
					/>
					<input
						type="email"
						placeholder="Email"
						className="signup-input"
						onChange={(e) => setFormData({ ...formData, email: e.target.value })}
						value={formData.email}
						required
					/>
					<input
						type="password"
						placeholder="Password"
						className="signup-input"
						onChange={(e) => setFormData({ ...formData, password: e.target.value })}
						value={formData.password}
						required
					/>
					<input
						type="password"
						placeholder="Confirm Password"
						className="signup-input"
						onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
						value={formData.confirmPassword}
						required
					/>
					<button
						type="submit"
						className="signup-btn"
						disabled={loading}
					>
						{loading ? <> Loading...</> : <>Sign up</>}
					</button>
				</form>
				<p className="login-link">
					Already have an account? <Link to="/">Sign in</Link>
				</p>
			</div>
		</div>
	);
};

export default Signup;
