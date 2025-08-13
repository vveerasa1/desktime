// import React, { useEffect } from 'react';
// import * as awsconfig from '../aws-exports';

// const CognitoLoginRedirect = () => {
//   useEffect(() => {
//     console.log('awsconfig:', awsconfig);
//     console.log('awsconfig.Auth:', awsconfig.default.Auth);

//     const { domain, redirectSignIn, responseType, scope } = awsconfig.default.Auth.oauth;
//     const clientId = awsconfig.default.Auth.userPoolWebClientId;

//     const url = new URL(`https://${domain}/oauth2/authorize`);
//     url.searchParams.append('client_id', clientId);
//     url.searchParams.append('response_type', responseType);
//     url.searchParams.append('scope', scope.join(' '));
//     url.searchParams.append('redirect_uri', redirectSignIn);

//     window.location.href = url.toString();
//   }, []);

//   return <div>Redirecting to Cognito login...</div>;
// };

// export default CognitoLoginRedirect;
import React, { useEffect, useState } from 'react';
import * as Amplify from 'aws-amplify';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import * as awsconfig from '../aws-exports'; // Assuming this is your aws-exports.js file

const CognitoLoginRedirect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State to manage loading status
  // useEffect(() => {
  //   // Ensure Amplify Auth is configured.
  //   // Ideally, this is done once in your main index.js or App.js.
  //   // This check is a safeguard.
  //   // if (!Amplify.Auth._config.userPoolId) { // Access Auth via Amplify default export
  //   //   Amplify.configure(awsconfig.default); // Configure the entire Amplify object
  //   // }

  // //   const checkAuthAndRedirect = async () => {
  // //     try {
  // //       // Attempt to get the current authenticated user using Amplify.Auth
  // //       await Amplify.Auth.currentAuthenticatedUser();
  // //       console.log('User is already authenticated. Navigating to dashboard.');
  // //       // If authenticated, navigate to the dashboard or your main protected route
  // //       navigate('/dashboard'); // Adjust this path to your actual dashboard route
  // //     } catch (error) {
  // //       // User is not authenticated, proceed with redirect to Cognito login
  // //       console.log('User is not authenticated. Redirecting to Cognito login...', error);

  // //       const { domain, redirectSignIn, responseType, scope } = awsconfig.default.Auth.oauth;
  // //       const clientId = awsconfig.default.Auth.userPoolWebClientId;

  // //       // Construct the URL for the Cognito Hosted UI's authorization endpoint
  // //       // const url = new URL(`https://${domain}/oauth2/authorize`);
  // //       // url.searchParams.append('client_id', clientId);
  // //       // url.searchParams.append('response_type', responseType);
  // //       // url.searchParams.append('scope', scope.join(' '));
  // //       // url.searchParams.append('redirect_uri', redirectSignIn);

  // //       // // Perform the redirect
  // //       // window.location.assign(url.toString());
  // //     } finally {
  // //       setLoading(false); // Set loading to false once check is complete
  // //     }
  // //   };

  // //   checkAuthAndRedirect();
  // // }, [navigate]); // Add navigate to dependency array

  // Show a loading message while checking authentication status
  if (loading) {
    return <div>Checking authentication status and redirecting...</div>;
  }

  // If not loading and not redirected (shouldn't happen if logic is correct),
  // or if navigate took over, this component might briefly render.
  return null;
};

export default CognitoLoginRedirect;
