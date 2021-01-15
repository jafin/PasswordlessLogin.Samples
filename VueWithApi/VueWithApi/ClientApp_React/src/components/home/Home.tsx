import React, { useState, useEffect } from "react";
import api from "../../api/api";
export function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      api
        .tryToGetProtectedInfoButDontRedirectIfUnauthenticated()
        .then((data) => {
          setMessage(data.message);
        })
        .catch((err) => {
          if (
            typeof err.response.status !== "undefined" &&
            err.response.status === 401
          ) {
            setMessage("Please sign in to see the message.");
          } else {
            setMessage(err.message ? err.message : "An error occurred");
          }
        });
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <div>Protected Message: {message}</div>
    </div>
  );
}
