import React, { useEffect } from "react";

const LogoutSuccess = () => {
  useEffect(() => {
    // Clear anything extra stored locally
    localStorage.removeItem("token");
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>You have been logged out</h1>
      <p>Thank you for visiting. You can safely close this page.</p>
      <a href="/">Go back to Home</a>
    </div>
  );
};

export default LogoutSuccess;
