import React from 'react';
import {
    
  Redirect,
  Route,

} from "react-router-dom";
import {getUserAuthenticationStatus} from "./SessionStorage"


export function PrivateRoute({ children, ...rest }) {
    const isUserAuthenticated = getUserAuthenticationStatus();
    return (
      <Route
        {...rest}
        render={({ location }) =>
          (isUserAuthenticated==="true") ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
}

export function LoginRoute({ children, ...rest }) {
  const isUserAuthenticated = getUserAuthenticationStatus();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        (isUserAuthenticated!=="true") ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/admin",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

