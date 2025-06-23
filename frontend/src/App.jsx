import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./index.css";

import Loginpage from "./components/Loginpage";
import Main from "./components/Main";
import Signup from "./components/Signup";
import ShoppingCart from "./components/shopping-cart";

function App() {
	return (
		<Router>
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
					path="/shopping-cart"
					element={<ShoppingCart />}
				/>
				<Route
					path="/main"
					element={<Main />}
				/>
			</Routes>
		</Router>
	);
}

export default App;
