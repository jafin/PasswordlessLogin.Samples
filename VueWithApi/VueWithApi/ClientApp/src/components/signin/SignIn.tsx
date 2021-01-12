import React, { useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";

export function SignIn() {
  const [usernameError, setusernameError] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [savedUsernames, setSavedUsernames] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [trustThisDevice, setTrustThisDevice] = useState<boolean>(false);
  const [signInEnabled, setSignInEnabled] = useState<boolean>(true);
  const [signInType, setSignInType] = useState<string>('');
  const [nextUrl, setNextUrl] = useState<string>('');
  const [idPrefix, setIdPrefix] = useState<string>(''); //todo this is a prop is original code.
  const submitForm = function (evt:React.FormEvent<HTMLFormElement>): void {
      evt.preventDefault();
    setMessage("Please wait...");
    if (password.length > 0) {
        signIn();
    }
    else {
        getOneTimeCode();
    }
}

const showSavedUsernames = function() {
    return savedUsernames.length && username.length === 0;
}

const getId = function(name) {
    let prefix = '';
    if (typeof idPrefix === 'string') {
        prefix = idPrefix + '-';
    }
    return prefix + name;
}

const getOneTimeCode = function () {
    api.sendOneTimeCode(username, nextUrl)
        .then(data => {
            setMessage('We sent sent a one time code to your email');
                this.$refs.password.focus();
        })
        .catch(error => {
            if (error.message) {
                setMessage(error.message);
            }
            else {
                setMessage('Something went wrong');
            }
        });
}

const signIn = function () {
    if (signInEnabled) {
        let oneTimeCode = password.replace(' ', '');
        if (signInType === 'code' || /^[0-9]{6}$/.test(oneTimeCode)) {
            api.authenticateOneTimeCode(username, oneTimeCode, trustThisDevice)
                .then(data => signInDone(data))
                .catch(error => signInFailed(error));
        }
        else {
            api.authenticatePassword(username, password, trustThisDevice, nextUrl)
                .then(data => signInDone(data))
                .catch(error => signInFailed(error));
        }
    }
}

const signInDone = function (data) {
    saveUsernames();
    this.$store.dispatch('initialize').then(() => {
        if (typeof data.nextUrl === 'string') {
            this.$router.push(data.nextUrl);
        }
    });
}
const signInFailed = function (error) {
    console.log(error);
    if (typeof error.response.status !== 'undefined' && error.response.status === 401) {
        setPassword('');
    }
        setMessage(error.message ? error.message : 'Something went wrong')
}

function saveUsernames() {
    if (trustThisDevice) {
        let usernames = savedUsernames.filter(name => name.toLowerCase() !== username.toLowerCase());
        if (username.length <= 100) {
            usernames.unshift(username);
        }
        this.$cookie.set('SavedUsernames', usernames.slice(0, 3).join(' '), { expires: '1Y' });
    }
}

function clearSavedUsernames() {
    this.$cookie.delete('SavedUsernames');
    setSavedUsernames([]);
}


  return (
    <div className="focusBox">
      <h2>Sign In</h2>
      <form className="form" onSubmit={submitForm}>
        <section className="field field-stacked form_row">
          <label className="field_label" htmlFor={getId('username')}>Email</label>
          <input
            className="field_element field_element-fullWidth signIn_username"
            value={username}
            type="text"
            placeholder="you@example.com"
            onChange={e=> setUsername(e.target.value)}
          ></input>
          {usernameError && (
            <span className="field_error">{usernameError}</span>
          )}
        </section>

        {showSavedUsernames && (
        <section>
          <div className="field field-stacked form_row">
            <label className="field_label" htmlFor={getId('password')}>Password or one time code</label>
            <input
              className="field_element field_element-fullWidth signIn_password"
              id={getId('password')}
              type="password"
              placeholder="****** / 123..."
              value={password}
              onChange={e=> setPassword(e.target.value)}
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
              onChange={e=> setTrustThisDevice(e.target.checked)}
            />
            <label className="field_label">Trust this device</label>
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
              <div className="field form_row">
                <button className="savedUsernames_username field_element field_element-fullWidth field_element-tall">
                  {username}
                </button>
              </div>
            );
          })}
        </div>
        <div className="savedUsernames_footer">
          <a href="#" className="savedUsernames_clearUsernames">
            Clear saved usernames
          </a>
        </div>
      </section>
      )}
    </div>
  );
}
