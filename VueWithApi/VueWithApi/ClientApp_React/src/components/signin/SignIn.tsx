/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect, useMemo } from "react";
import api from "../../api/api";
import { Link, useHistory, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useStore } from "../../store";
import { resolve } from "path";

type RouteParams = {
  longCode?: string;
};

export function SignIn() {
  let { longCode } = useParams<RouteParams>();

  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [savedUsernames, setSavedUsernames] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [trustThisDevice, setTrustThisDevice] = useState<boolean>(false);
  const [signInEnabled, setSignInEnabled] = useState<boolean>(true);
  const [signInType, setSignInType] = useState<string>("");
  let history = useHistory();
  const store = useStore();
  const [cookies, setCookie, removeCookie] = useCookies(["name"]);

  //TODO: these should be props as per vue code.
  const [nextUrl, setNextUrl] = useState<string>("");
  const [idPrefix, setIdPrefix] = useState<string>("");
  const [loginHint, setLoginHint] = useState<string>("");

  // refs
  const passwordEl = useRef<HTMLInputElement>(null);
  const usernameEl = useRef<HTMLInputElement>(null);

  // computed
  const usernameError = useMemo(() => {
    if (username.length === 0) {
      return "";
    }
    if (username.includes(" ")) {
      return "No spaces allowed";
    }
    return "";
  }, [username]);

  useEffect(() => {
    //TODO: Should be an effect or just run as a func, we don't need to wait for render.

    if (longCode) {
      api
        .authenticateLongCode(longCode)
        .then((data) => {
          console.log("authrespon:", data);
          signInDone(data);
        })
        .catch((error) => {
          signInFailed(error)
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [longCode]);

  useEffect(() => {
    loadSavedUsernames();
    if (loginHint) {
      setUsername(loginHint);
      passwordEl.current.focus();
    } else {
      usernameEl.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitForm = function (evt: React.FormEvent<HTMLFormElement>): void {
    evt.preventDefault();
    setMessage("Please wait...");
    if (password.length > 0) {
      signIn();
    } else {
      getOneTimeCode();
    }
  };

  const loadSavedUsernames = function () {
    setSavedUsernames([]);
    const usernames = cookies["SavedUsernames"];
    if (typeof usernames == "string") {
      let count = 0;
      usernames.split(" ").forEach((name) => {
        count++;
        if (count <= 3 && name.length > 1 && name.length <= 100) {
          setSavedUsernames([...savedUsernames, name]);
        }
      });
    }
  };

  const showSavedUsernames = function () {
    return savedUsernames.length && username.length === 0;
  };

  const getId = function (name) {
    let prefix = "";
    if (typeof idPrefix === "string") {
      prefix = idPrefix + "-";
    }
    return prefix + name;
  };

  const selectUsername = function (name) {
    setUsername(name);
    passwordEl.current.focus();
  };

  const getOneTimeCode = function () {
    api
      .sendOneTimeCode(username, nextUrl)
      .then((data) => {
        setMessage("We sent sent a one time code to your email");
        passwordEl.current.focus();
      })
      .catch((error) => {
        if (error.message) {
          setMessage(error.message);
        } else {
          setMessage("Something went wrong");
        }
      });
  };

  const signIn = function () {
    if (signInEnabled) {
      let oneTimeCode = password.replace(" ", "");
      if (signInType === "code" || /^[0-9]{6}$/.test(oneTimeCode)) {
        api
          .authenticateOneTimeCode(username, oneTimeCode, trustThisDevice)
          .then((data) => signInDone(data))
          .catch((error) => signInFailed(error));
      } else {
        api
          .authenticatePassword(username, password, trustThisDevice, nextUrl)
          .then((data) => signInDone(data))
          .catch((error) => signInFailed(error));
      }
    }
  };

  const signInDone = function (data) {
    saveUsernames();
    store.initialize();
    if (typeof data.nextUrl === "string") {
      history.push(data.nextUrl);
    }
  };

  function addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  const signInFailed = function (error) {
    console.log(error);
    if (
      typeof error.response.status !== "undefined" &&
      error.response.status === 401
    ) {
      setPassword("");
    }
    setMessage(error.message ? error.message : "Something went wrong");
  };

  function saveUsernames() {
    if (trustThisDevice) {
      let usernames = savedUsernames.filter(
        (name) => name.toLowerCase() !== username.toLowerCase(),
      );
      if (username.length <= 100) {
        usernames.unshift(username);
      }
      const expire = addDays(new Date(), 365);
      setCookie("SavedUsernames", usernames.slice(0, 3).join(" "), {
        expires: expire,
      });
    }
  }

  function clearSavedUsernames() {
    removeCookie("SavedUsernames");
    setSavedUsernames([]);
  }

  return (
    <div className="focusBox">
      <h2>Sign In</h2>
      <form className="form" onSubmit={submitForm}>
        <section className="field field-stacked form_row">
          <label className="field_label" htmlFor={getId("username")}>
            Email
          </label>
          <input
            className="field_element field_element-fullWidth signIn_username"
            ref={usernameEl}
            value={username}
            type="text"
            placeholder="you@example.com"
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          {usernameError && (
            <span className="field_error">{usernameError}</span>
          )}
        </section>

        {showSavedUsernames && (
          <section>
            <div className="field field-stacked form_row">
              <label className="field_label" htmlFor={getId("password")}>
                Password or one time code
              </label>
              <input
                className="field_element field_element-fullWidth signIn_password"
                id={getId("password")}
                ref={passwordEl}
                type="password"
                placeholder="****** / 123..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <span className="field_error">{passwordError}</span>
              )}
            </div>

            <div className="field field-checkbox form_row">
              <input
                className="field_element"
                type="checkbox"
                checked={trustThisDevice}
                onChange={(e) => setTrustThisDevice(e.target.checked)}
              />
              <label className="field_label"> Trust this device</label>
            </div>

            <div className="fields fields-flexSpaceBetween form_row">
              <div className="field">
                <button
                  className="field_element field_element-tall signIn_signInButton"
                  type="submit"
                >
                  Sign in
                </button>
              </div>
              <div className="field">
                <button className="field_element field_element-tall signIn_oneTimeCodeButton">
                  Get one time code
                </button>
              </div>
            </div>
            {message && (
              <div className="message message-notice signIn_message">
                {message}
              </div>
            )}
          </section>
        )}
        <div className="minorNav signIn_footer">
          <Link className="signIn_forgotPasswordLink" to="/forgotpassword">
            Forgot password?
          </Link>
        </div>
      </form>
      {showSavedUsernames && (
        <section className="savedUsernames">
          <header className="savedUsernames_header">
            <span className="savedUsernames_title">Saved Usernames</span>
          </header>
          <div className="form">
            {savedUsernames.map((username, index) => {
              return (
                <div className="field form_row" key={username}>
                  <button
                    className="savedUsernames_username field_element field_element-fullWidth field_element-tall"
                    onClick={() => selectUsername(username)}
                  >
                    {username}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="savedUsernames_footer">
            <button
              className="savedUsernames_clearUsernames link"
              onClick={() => clearSavedUsernames()}
            >
              Clear saved usernames
            </button>
          </div>
        </section>
      )}

      <div className="debug">
        <span>Longcode: {longCode}</span>
      </div>
    </div>
  );
}
