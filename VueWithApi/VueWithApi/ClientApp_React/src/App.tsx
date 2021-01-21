import React from "react";
import { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { useStore } from "./store";
import { Routes } from "./Routes";

function App():JSX.Element {
  const store = useStore();
  const user = useStore((state) => state.user);
  const isSignedIn = useStore((state) => state.signedIn());

  useEffect(() => {
    store.initialize();
  }, []);

  return (
    <div className="App" id="app">
      <h1>SimpleIAM Passwordless Example</h1>
      <Router>
        <div className="menu">
          <Link to="/">Home</Link>

          {/* need to secure perm: canViewProfile*/}
          {isSignedIn && <Link to="/myaccount">My Account</Link>}

          {!isSignedIn && (
            <>
              <Link to="/signin">Sign In</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {isSignedIn && <Link to="/signout">Sign out</Link>}
        </div>
        <Routes />
      </Router>
      <div className="debug">
      Signed in: {isSignedIn ? "yes" : "no"} <br />
      <pre>User: {JSON.stringify(user)} </pre>
      </div>

    </div>
  );
}

export default App;
