import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useUserStore } from "../store/useUserStore.js";
import "./Loginpage.css";

const Loginpage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { login, loading } = useUserStore();

	const handleSubmit = (e) => {
		e.preventDefault();
		login(email, password);
	};

	return (
		<div className="login-container">
			<div className="login-box">
				<img
					src={logo}
					alt="Echocart Logo"
					className="echocart-logo"
				/>
				<h2>Sign in to Echocart</h2>
				<form onSubmit={handleSubmit}>
					<input
						id="email"
						type="email"
						placeholder="Email"
						className="login-input"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						className="login-input"
						id="password"
						type="password"
						required
						placeholder="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button
						type="submit"
						className="login-btn"
						disabled={loading}
					>
						{loading ? <>Loading...</> : <>Login</>}
					</button>
				</form>
				<p className="signup-link">
					New to Echocart? <Link to="/signup">Create an account</Link>
				</p>
			</div>
		</div>
	);
};

export default Loginpage;
