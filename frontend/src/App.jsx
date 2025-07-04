import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import "./index.css";

import { useEffect } from "react";
import Loginpage from "./components/LoginPage";
import Main from "./components/Main";
import Navigation from "./components/Navigation";
import Signup from "./components/Signup";
import ShoppingCart from "./components/shopping-cart";
import { useUserStore } from "./store/useUserStore";

function AppRoutes() {
	const { user, checkAuth, checkingAuth } = useUserStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	const location = useLocation();
	const showNav = ["/", "/main", "/cart"].some((path) => location.pathname.startsWith(path));

	return (
		<>
			{showNav && <Navigation />}
			<Routes>
				<Route
					path="/"
					element={!user ? <Loginpage /> : <Main />}
				/>
				<Route
					path="/signup"
					element={!user ? <Signup /> : <Main />}
				/>
				<Route
					path="/cart"
					element={user ? <ShoppingCart /> : <Loginpage />}
				/>
				<Route
					path="/main"
					element={user ? <Main /> : <Loginpage />}
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
