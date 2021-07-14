import './App.css';
import IntroPage from './pages/IntroPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import PreferencePage from './pages/PreferencePage';
import MapPage from './pages/MapPage';

import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <IntroPage />
        </Route>
      </Switch>
      <Switch>
        <Route path="/login" exact>
          <LoginPage />
        </Route>
      </Switch>
      <Switch>
        <Route path="/signup" exact>
          <CreatePage />
        </Route>
      </Switch>
      <Switch>
        <Route path="/preferences" exact>
          <PreferencePage />
        </Route>
      </Switch>
      <Switch>
        <Route path="/home" exact>
          <HomePage />
        </Route>
      </Switch>
      <Switch>
        <Route path="/map" exact>
          <MapPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
