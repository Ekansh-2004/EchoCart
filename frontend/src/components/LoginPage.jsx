import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Loginpage.css";

const Loginpage = () => {
	return (
		<div className="login-container">
			<div className="login-box">
				<img
					src={logo}
					alt="Echocart Logo"
					className="echocart-logo"
				/>
				<h2>Sign in to Echocart</h2>
				<form>
					<input
						type="email"
						placeholder="Email"
						className="login-input"
						required
					/>
					<input
						type="password"
						placeholder="Password"
						className="login-input"
						required
					/>
					<button
						type="submit"
						className="login-btn"
					>
						Sign In
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
