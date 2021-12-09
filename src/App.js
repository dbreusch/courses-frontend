// the GPS Tracks app
//
// uses AuthContext to globally manage user authentication status;
// recognized routes depend on login status;
// Navigation and routes wrapped by React Router

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';

import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

// import Users from './user/pages/Users';
const Users = React.lazy(() => import('./user/pages/Users'));

// // import NewCourse from './places/pages/NewCourse';
// const NewCourse = React.lazy(() => import('./places/pages/NewCourse'));

// // import UserCourses from './places/pages/UserCourses';
// const UserCourses = React.lazy(() => import('./places/pages/UserCourses'));

// // import UpdateCourse from './places/pages/UpdateCourse';
// const UpdateCourse = React.lazy(() => import('./places/pages/UpdateCourse'));

// import Auth from './user/pages/Auth';
const Auth = React.lazy(() => import('./user/pages/Auth'));

const App = () => {
  // get global information from Context
  const { token, login, logout, userId } = useAuth();

  // define Routes based on login-status (via token)
  let routes;
  if (token) {  // logged in, show everything
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        {/* <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route> */}
        <Redirect to="/" />
      </Switch>
    );
  } else {  // not logged in, show unrestricted and Authenticate
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        {/* <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route> */}
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    // wrap with the Context for global sharing of data
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      {/* wrap MainNavigation and Routes in the Router */}
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
