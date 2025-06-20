import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Loginpage from "./components/Loginpage";
import Signup from "./components/Signup";

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
			</Routes>
		</Router>
	);
}

export default App;
