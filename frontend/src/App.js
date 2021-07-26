import './App.css';
import IntroPage from './pages/IntroPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import PreferencePage from './pages/PreferencePage';
import MapPage from './pages/MapPage';
import CalendarPage from './pages/CalendarPage';
import VerifyPage from './pages/VerifyPage';
import SettingsPage from './pages/SettingsPage';
import UpdatePrefPage from './pages/UpdatePrefPage';


import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <IntroPage />
        </Route>
        <Route path="/login" exact>
          <LoginPage />
        </Route>
        <Route path="/signup" exact>
          <CreatePage />
        </Route>
        <Route path="/verify" exact>
          <VerifyPage />
        </Route>
        <Route path="/preferences" exact>
          <PreferencePage />
        </Route>
        <Route path="/home" exact>
          <HomePage />
        </Route>
        <Route path="/calendar" exact>
          <CalendarPage />
        </Route>
        <Route path="/map" exact>
          <MapPage />
        </Route>
        <Route path="/settings" exact>
          <SettingsPage />
        </Route>
        <Route path="/updatePreferences" exact>
          <UpdatePrefPage />
        </Route>
      <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
