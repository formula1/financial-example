import * as React from "react";

import {
  User
} from "./user"

import {
  Wallet
} from "./wallet"

import {
  Transactions
} from "./transactions";

export function UserItem({ id }: { id: string }){

  return (
    <div>
      <User id={id} />
      <Wallet id={id} />
      <Transactions id={id} />
    </div>
  );
}
