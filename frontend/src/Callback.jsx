import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {useUserExistQuery} from '../src/redux/services/user'
import { useState } from 'react';
export default function Callback() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [cognitoId, setCognitoId] = useState(null)
  const { data: userdata } = useUserExistQuery(cognitoId, { skip: !cognitoId })
  useEffect(() => {
    console.log("Auth:", auth);
    // if (!auth.isLoading && !auth.isAuthenticated) {
    //   auth.signinRedirect(); // Redirect to Cognito Hosted UI
    // }
    if (!auth.isLoading && auth.isAuthenticated) {
      setCognitoId(auth.user?.profile?.sub)
      localStorage.setItem('token', auth.user.id_token)
      // localStorage.setItem('userId', auth.user.id_token)
      navigate('/dashboard'); // or your landing page
    }
  }, [auth.isLoading, auth.isAuthenticated]);
   useEffect(() => {

    if (userdata) {
      localStorage.setItem("userId", userdata?.user?._id);
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
