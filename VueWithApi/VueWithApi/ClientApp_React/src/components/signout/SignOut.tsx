import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useStore } from "../../store";

export function SignOut() {
  const [message, setMessage] = useState<string>('Signing out...');
  const store = useStore();

  const signOut = function () {
    api
      .signOut()
      .then(() => {
        store
          .initialize()
          .then(() => {
            setMessage("You have been signed out");
          })
          .catch(() => {
            setMessage(
              "You have been signed out but some data was not cleared. Please close your browser tab.",
            );
          });
      })
      .catch(() => {
        setMessage("Sign out failed");
      });
  };

  useEffect(() => {
    signOut();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <div>
      <h2>Sign Out Page</h2>
      <p>{ message }</p>
    </div>
  );
}
