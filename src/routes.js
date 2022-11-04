import { Navigate, Route, useRoutes } from 'react-router-dom';
// layouts
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//

import Search from './pages/Search';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';

import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import fireBaseInit from './utils/firebase-init';

// ----------------------------------------------------------------------
const auth = getAuth(fireBaseInit);

export default function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  console.log("auth.currentUser", auth.currentUser);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('user signed in');
        // Search is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.Search
        console.log({user})
        // ...
        setIsLoggedIn(true);
      } else {
        console.log('user signed out');
        // Search is signed out
        // ...
        setIsLoggedIn(false);
      }
    });
  }, []);

  // useEffect(() => {
  //   if(auth.currentUser){
  //     setIsLoggedIn(true)
  //   }
  // }, [auth.currentUser])
  return useRoutes([
    {
      path: '/dashboard',
      element: <ProtectedRoute isLoggedIn={isLoggedIn} component={DashboardLayout} />,
      children: [
        { path: 'search', element: <Search />, index: true },
        // { path: 'products', element: <Products /> },
        // { path: 'blog', element: <Blog /> },
        { path: 'profile', element: <Profile /> },
        { path: 'changepassword', element: <ChangePassword  /> },
      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'register',
      element: <Register />,
    },
    { path: 'forgotpassword', element: <ForgotPassword /> },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/search" /> },
        { path: '/dashboard', element: <Navigate to="/dashboard/search" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}

function ProtectedRoute({ component: Component, isLoggedIn, ...restOfProps }) {
  console.log({ isLoggedIn });
  if (isLoggedIn) {
    return <Component {...restOfProps} />;
  }
  return <Navigate to="/login" replace />;
}
