import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import api from "../../api/api";

export const SetPassword = () => {
  const [message, setMessage] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  let history = useHistory();

  const minimumPasswordLength = 1; //todo get from config.

  const setPassword = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
    } else if (newPassword.length < minimumPasswordLength) {
      setMessage(
        "Password must be at least " +
          minimumPasswordLength +
          " characters long",
      );
    } else {
      api
        .setPassword(newPassword)
        .then((data) => {
          history.push(data.nextUrl ? data.nextUrl : "/");
        })
        .catch((err) => {
          setMessage(err.message);
        });
    }
  };

  return (
    <div className="focusBox">
      <h2>Set New Password</h2>
      <div className="setPassword">
        <div className="form_row field field-stacked">
          <label className="field_label">New Password</label>
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            className="field_element field_element-fullWidth"
          />
          {/* <PasswordStrengthMeter :minStrengthInBits="minimumPasswordStrength" :password="newPassword"></PasswordStrengthMeter> */}
        </div>
        <div className="form_row field field-stacked">
          <label className="field_label">Repeat New Password</label>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            className="field_element field_element-fullWidth"
          />
        </div>
        <div className="form_row field">
          <button
            className="field_element field_element-fullWidth field_element-tall setPassword_button"
            disabled={!newPassword}
            onClick={setPassword}
          >
            Set Password
          </button>
        </div>
        <div className="form_row field">
          <Link to="/myaccount">Cancel</Link>
        </div>
        {message && <div className="notification">{message}</div>}
      </div>
    </div>
  );
};
