import { useState, useMemo, useEffect, useRef } from "react";
import api from "../../api/api";

export const ForgotPassword = () => {
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const submitForm = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setMessage("Please wait...");
    api
      .sendPasswordResetMessage(email, "/")
      .then((data) => {
        setMessage(data.message ? data.message : "Success");
      })
      .catch((error) => {
        setMessage(error.message ? error.message : "Something went wrong");
      });
  };


  const emailEl = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    emailEl.current.focus();
  }, []);

  const emailIsValid = useMemo<boolean>(() => {
    if (email.length === 0) {
      return false;
    }
    var testEl = document.createElement("input");
    testEl.type = "email";
    testEl.value = email;
    return testEl.checkValidity();
  }, [email]);

  return (
    <div className="focusBox">
      <h2>Forgot Password</h2>
      <div className="forgotPassword">
        <form className="form" onSubmit={submitForm}>
          <div className="field field-stacked form_row">
            <label className="field_label" htmlFor="email">
              Email
            </label>
            <input
              className="field_element field_element-fullWidth register_email"
              id="email"
              ref={emailEl}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="you@example.com"
            />
            {emailError && (
              <span v-if="emailError" className="field_error">
                {emailError}
              </span>
            )}
          </div>

          <div className="field form_row">
            <button
              disabled={!emailIsValid}
              type="submit"
              className="field_element field_element-fullWidth field_element-tall forgotPassword_button"
            >
              Get Password Reset Link
            </button>
          </div>
          {message && (
            <div className="message message-notice register_message">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
