import * as React from "react";

import {
  RouteComponentProps,
  Route,
} from "react-router-dom";

import {
  CustomerCreateOrUpdate,
} from "./Customer/create-or-update";

import {
  CardSourceModify
} from "./CardSource/modify"

import {
  FiatToWallet
} from "./FiatToWallet"

export function FinanceRoute(props: RouteComponentProps) {
  return (
    <>
      <Route exact path={`${props.match.path}/customer`} >
        <CustomerCreateOrUpdate />
      </Route>
      <Route exact path={`${props.match.path}/card`} >
        <CardSourceModify />
      </Route>
      <Route exact path={`${props.match.path}/exchange/`}>
        <FiatToWallet />
      </Route>
    </>
  );
}
