import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import "./index.css";

import Loginpage from "./components/Loginpage";
import Main from "./components/Main";
import Signup from "./components/Signup";
import ShoppingCart from "./components/shopping-cart";
import Navigation from "./components/Navigation";

function AppRoutes() {
	const location = useLocation();
	const showNav = ["/main", "/cart"].includes(location.pathname);
	return (
		<>
			{showNav && <Navigation />}
			<Routes>
				<Route
					path="/"
					element={<Loginpage />}
				/>
				<Route
					path="/signup"
					element={<Signup />}
				/>
				<Route
					path="/cart"
					element={<ShoppingCart />}
				/>
				<Route
					path="/main"
					element={<Main />}
				/>
			</Routes>
		</>
	);
}

function App() {
	return (
		<Router>
			<AppRoutes />
		</Router>
	);
}

export default App;
