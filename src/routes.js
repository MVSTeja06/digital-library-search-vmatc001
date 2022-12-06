import { Navigate, Route, useRoutes } from 'react-router-dom';
// layouts
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
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
import SearchResultPage from './components/SearchResultPage';

const db = getFirestore(fireBaseInit);

// ----------------------------------------------------------------------
const auth = getAuth(fireBaseInit);

export default function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  console.log('auth.currentUser', auth.currentUser);
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      const userEmail = localStorage.getItem('userEmail');
      const usersTable = collection(db, 'users');
      // Search is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.Search
      console.log({ user });
      const snapshot = await query(usersTable, where('email', '==', userEmail));
      const result = await getDocs(snapshot);
      if (user) {

        await setDoc(result.docs[0].ref, { ...result.docs[0].data(), loginJWT: user.uid });
        // ...
        setIsLoggedIn(true);
      } else {
        console.log('user signed out');
        await setDoc(result.docs[0].ref, { ...result.docs[0].data(), loginJWT: '' });
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
        { path: 'changepassword', element: <ChangePassword /> },
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
    {
      path: 'summary',
      element: <SearchResultPage />
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
