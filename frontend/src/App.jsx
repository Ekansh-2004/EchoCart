import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Loginpage from "./components/Loginpage";
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
			</Routes>
		</Router>
	);
}

export default App;
