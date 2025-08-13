import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useUserExistQuery } from '../src/redux/services/user'
import { useState } from 'react';
import { useSessionMutation } from './redux/services/electron';
export default function Callback() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [cognitoId, setCognitoId] = useState(null)
  const { data: userdata } = useUserExistQuery(cognitoId, { skip: !cognitoId })
  const [electronAPI] = useSessionMutation();

  useEffect(() => {
    console.log("Auth:", auth);
    // if (!auth.isLoading && !auth.isAuthenticated) {
    //   auth.signinRedirect(); // Redirect to Cognito Hosted UI
    // }
    if (!auth.isLoading && auth.isAuthenticated) {
      // auth.signoutPopup(); // Redirect to Cognito Hosted UI

      console.log(auth.user.id_token)
      const decoded = jwtDecode(auth.user.id_token)
      console.log(decoded, "decoded")
      const groups = auth.user?.profile?.["cognito:groups"] || [];
      console.log(groups)
      if (groups.includes("trackmeAccess")) {

        console.log(groups, groups.includes("trackmeAccess"), "groups.includes")

        localStorage.setItem('token', auth.user.id_token);
        localStorage.setItem('refresh_token', auth.user.refresh_token);
        setCognitoId(auth.user?.profile?.sub)
      } else {
        navigate('/subscribe-trackme');
      }
    }
  }, [auth.isLoading, auth.isAuthenticated]);
  useEffect(() => {
    if (userdata) {
      console.log(userdata?.user)
      try {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refresh_token');
        electronAPI({ token: token, userId: userdata?.user?._id, refreshToken });
      } catch (err) {
        console.error(
          "Failed to send token to Electron server:",
          err.message
        );
      }
      localStorage.setItem("userId", userdata?.user?._id);
      // Save object properly
      localStorage.setItem("autUser", JSON.stringify(userdata?.user));
      navigate('/dashboard');
    }
  }, [userdata])
  // useEffect(() => {
  //     console.log('auth', auth);
  //       // auth.signoutPopup();

  //     if (!auth.isLoading && !auth.isAuthenticated) {
  //       console.log('auth', auth);
  //       auth.signinRedirect();
  //     }
  //     if (auth.isAuthenticated) {
  //       // auth.signoutPopup();

  //       // setId(auth.user?.profile?.sub);
  //       console.log(auth.user?.profile?.sub);
  //       localStorage.setItem('token', auth.user.access_token);
  //       // localStorage.setItem("authUser", auth.user?.profile);
  //       // console.log(jwtDecode(auth.user.id_token))
  //       // const groups = auth.user?.profile?.["cognito:groups"] || [];
  //       // if (groups.includes("hrmsAccess")) {
  //         navigate('/dashboard');
  //       // } else {
  //       //   navigate('/subscribe-trackme');
  //       // }
  //     }
  //   }, [auth.isLoading, auth.isAuthenticated]);
  return <div>Processing login...</div>;
}
