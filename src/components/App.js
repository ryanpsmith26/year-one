import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './App.css';
import Movies from './Movies';

function App() {
	return (
		<Router>
			<div className="App">
				<header className="App-header">
					<p>Welcome to Ryan's Movie Lookup!</p>
					{/* <Link to="/docs">Start Searching!</Link> */}
				</header>
				{/* <Route path="/docs" component={Movies} /> */}
				<Movies />
			</div>
		</Router>
	);
}

export default App;
