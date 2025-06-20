import "./index.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Loginpage from "./components/Loginpage";
import Signup from "./components/Signup";
import Main from "./components/Main";

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
					path="/main"
					element={<Main />}
				/>
			</Routes>
		</Router>
	);
}

export default App;
