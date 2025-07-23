import React from 'react';

const FallbackLogin = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Login Unavailable</h2>
      <p>
        The login service is currently unreachable. Please check your network connection or try again later.
      </p>
    </div>
  );
};

export default FallbackLogin;
