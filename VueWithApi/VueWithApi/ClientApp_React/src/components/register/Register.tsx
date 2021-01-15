import { useState, useRef, useMemo, useEffect } from "react";
import api from "../../api/api";

export const Register = function () {
  const [emailError, setEmailError] = useState<string>("");
  const [email, setEmail] = useState<string>('');
  const [consent, setConsent] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [nextUrl, setNextUrl] = useState<string>("");

  const submitForm = function (evt: React.FormEvent<HTMLFormElement>): void {
    evt.preventDefault();
    setMessage("Please wait...");
    api
      .register(email, nextUrl)
      .then((data) => {
        setMessage(data.message ? data.message : "Success");
      })
      .catch((error) => {
        setMessage(error.message ? error.message : "Something went wrong");
      });
  };

  const emailEl = useRef<HTMLInputElement>(null);

  const emailIsValid = useMemo<boolean>(() => {
    if (email.length === 0) {
      return false;
    }
    var testEl = document.createElement("input");
    testEl.type = "email";
    testEl.value = email;
    const valid = testEl.checkValidity();
    return valid;
  }, [email]);

  const isSubmitDisabled = useMemo<boolean>(() => {
    return !emailIsValid || !consent;
  }, [emailIsValid, consent]);

  useEffect(() => {
    emailEl.current.focus();
  }, []);

  return (
    <div className="focusBox">
      <h2>Register</h2>
      <div className="register">
        <form className="form" onSubmit={submitForm}>
          <div className="field field-stacked form_row">
            <label className="field_label" htmlFor="email">
              Email
            </label>
            <input
              className="field_element field_element-fullWidth register_email"
              ref={emailEl}
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              v-model="email"
              type="text"
              placeholder="you@example.com"
            />
            <span v-if="emailError" className="field_error">
              {emailError}
            </span>
          </div>
          <div className="field field-checkbox form_row">
            <input
              className="field_element"
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <label
              className="field_label register_consentLabel"
              htmlFor="consent"
            >
              I consent to the{" "}
              <a href="/privacy" target="_blank">
                privacy policy
              </a>{" "}
              and{" "}
              <a href="/terms" target="_blank">
                terms of service
              </a>
              .
            </label>
          </div>
          <pre>
            validEmail: {emailIsValid ? "yes" : "no"} <br />
            consent: {consent ? "yes" : "no"}
          </pre>
          disabled: {isSubmitDisabled ? "yes" : "no"}
          <div className="field form_row">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="field_element field_element-fullWidth field_element-tall register_button"
            >
              Register
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
