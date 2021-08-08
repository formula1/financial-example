import * as React from "react";

import {
  Route,
  Redirect
} from "react-router-dom";

import {
  useAuth
} from "../../context/user";

function RequireUser({children}: { children: React.ReactNode}){
  const auth = useAuth();

  if(!auth.user){
    return (
      <Redirect
        to={{ pathname: "/login", }}
      />
    )
  }

  return <>{children}</>;
}

export {
  RequireUser
};
