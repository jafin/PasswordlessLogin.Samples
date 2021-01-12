import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import api from "./api/api";
import { Home } from "./components/home/Home";
import { SignIn } from "./components/signin/SignIn";

function App() {

  // api.getAppInfo().then((appInfo) => {
  //   console.log("appInfo", appInfo);
  //   console.log("user", appInfo.user);
  // });

  return (
    <div className="App" id="app">
      <h1>SimpleIAM Passwordless Example</h1>

      <Router>
        <div className="menu">
          <Link to="/">Home</Link>
          
          {/* need to secure perm: canViewProfile*/}
          <Link to="/myaccount">My Account</Link>
          
          {/* only if not signed in  */}
          <Link to="/signin">Sign In</Link>
          <Link to="/register">Register</Link>
          
          {/* only if signed in  */}
          <Link to="/signout">Sign out</Link>
        </div>

        <Switch>
          <Route path="/signin">
            <SignIn></SignIn>
          </Route>
          <Route path="/signout">
            <p>SignOut</p>
          </Route>
          <Route path="/register">
            <p>Register</p>
          </Route>
          <Route path="/forgotpassword">
            <p>Forgot Password</p>
          </Route>
          <Route path="/myaccount">
            <p>My Account</p>
          </Route>
          <Route path="/setpassword">
            <p>Set Password</p>
          </Route>
          <Route exact path="/">
            <Home></Home>
          </Route>

        </Switch>
      </Router>
    </div>
  );
}

export default App;
