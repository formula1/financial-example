import * as React from "react";
import { ProvideAuth, PrivateRoute } from  "../context/user"
import { Header } from "./template/Header"
import { UserIndex } from "./User";
import { RequireUser } from "./User/RequireUser";
import { UserList } from "./Users/list";
import { UnfinishedTransactions } from "./Transactions"
import { Home } from "./Home"
import { Page404 } from "./404";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import {
  UserAuth
} from "./Users/item-types/auth";

import {
  UserParam
} from "./Users/item-types/url-param";

export function IndexView(){
  return (
    <ProvideAuth>
      <Router>
        <Header />
        <div>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/login">
              <UserIndex />
            </Route>
            <Route
              exact
              path="/self"
              children={()=>{
                // const auth = useAuth();
                return (
                  <RequireUser>
                    <UserAuth />
                  </RequireUser>
                )
              }}
            />
            <Route exact path="/transactions" >
              <RequireUser>
                <UnfinishedTransactions />
              </RequireUser>
            </Route>
            <Route exact path="/users">
              <RequireUser>
                <UserList />
              </RequireUser>
            </Route>
            <Route
              path="/users/:id"
              children={()=>{
                return (
                  <RequireUser>
                    <UserParam />
                  </RequireUser>
                )
              }}
            />
            <Route path="*">
              <Page404 />
            </Route>
          </Switch>
        </div>
      </Router>
    </ProvideAuth>
  )
}
