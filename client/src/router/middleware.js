import React from 'react'
import {
  Route,
  Redirect,
} from 'react-router-dom'
import { useSelector } from 'react-redux'

export const AdminRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => state);

  console.log(user);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user && user.username !== '' && (user.userrole === 1 || user.userrole === 2)
        ? (
          children
          ) 
        : (
            <Redirect
              to={{
                pathname: '/manage',
                state: { from: location },
              }}
            />
          )
      }
    />
  );
}
