import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import NotFoundPage from "./pages/NotFoundPage"
import ProducePage from "./pages/ProducePage"
import BotPage from "./pages/BotPage"
import Navbar from "./components/Navbar"

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route path='/' component={HomePage} exact/>
          <Route path='/about' component={AboutPage}/>
          <Route path='/app' component={ProducePage}/>
          <Route path='/bot' component={BotPage}/>
          <Route component={NotFoundPage}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
