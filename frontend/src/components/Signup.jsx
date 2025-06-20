import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Signup.css";

const Signup = () => {
	return (
		<div className="signup-container">
			<div className="signup-box">
				<img
					src={logo}
					alt="Echocart Logo"
					className="echocart-logo"
				/>
				<h2>Create your Echocart Account</h2>
				<form>
					<input
						type="text"
						placeholder="Full Name"
						className="signup-input"
						required
					/>
					<input
						type="email"
						placeholder="Email"
						className="signup-input"
						required
					/>
					<input
						type="password"
						placeholder="Password"
						className="signup-input"
						required
					/>
					<input
						type="password"
						placeholder="Confirm Password"
						className="signup-input"
						required
					/>
					<button
						type="submit"
						className="signup-btn"
					>
						Create Account
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
