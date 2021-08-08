import * as React from "react";
import { IAuthState, authState } from "../utils/auth-state";

import {
  Route,
  Redirect
} from "react-router-dom";


const authContext = React.createContext(void 0);

export { authContext };

export function ProvideAuth({ children }: { children: React.ReactNode}) {
  const auth = authState();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

export function useAuth(): IAuthState{
  return React.useContext(authContext);

}

export function PrivateRoute({ children, ...rest }: { children: React.ReactNode}) {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
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
