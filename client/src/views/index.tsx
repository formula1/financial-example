import * as React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


import { Home } from "./Home"
import { Page404 } from "./404";

import { ProvideAuth, PrivateRoute } from  "../context/user"
import { Header } from "./template/Header"
import { UserIndex } from "./User";
import { RequireUser } from "./User/RequireUser";
import { UserList } from "./Users/list";
import { UnfinishedTransactions } from "./Transactions"

import {
  UserAuth
} from "./Users/item-types/auth";

import {
  UserParam
} from "./Users/item-types/url-param";

import {
  FinanceRoute
} from "./Financial/Route"

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
            <RequireUser>
              <Route exact path="/self" >
                  <UserAuth />
              </Route>
              <Route path="/finance" component={FinanceRoute} />
              <Route exact path="/transactions" >
                  <UnfinishedTransactions />
              </Route>
              <Route exact path="/users">
                  <UserList />
              </Route>
              <Route path="/users/:id" >
                  <UserParam />
              </Route>
            </RequireUser>
            <Route path="*">
              <Page404 />
            </Route>
          </Switch>
        </div>
      </Router>
    </ProvideAuth>
  )
}
