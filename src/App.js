import './App.css';
//import 'bootstrap/dist/css/bootstrap.min.css'
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import NotFoundPage from "./pages/NotFoundPage"
import ProducePage from "./pages/ProducePage"

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path='/' component={HomePage} exact/>
          <Route path='/about' component={AboutPage}/>
          <Route path='/produce' component={ProducePage}/>
          <Route component={NotFoundPage}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
