import * as React from "react";

import { Wallet as WalletDisplay } from "./display";
import { SendValue } from "./send-value";
import { DepositOrWithdraw } from "./deposit-withdraw"
import {
  useAuth
} from "../../../../context/user";

export function Wallet({ id } : { id: string }){
  const auth = useAuth();
  const [shouldReload, setShouldReload] = React.useState(Date.now())

  if(!auth.user){
    return null;
  }

  return (
    <div>
      <WalletDisplay id={id} shouldReload={shouldReload} />
      {
        id == auth.user._id ? (
          <DepositOrWithdraw afterSubmit={()=>{setShouldReload(Date.now())}} />
        ) : (
          <SendValue id={id} afterSubmit={()=>{setShouldReload(Date.now())}} />
        )
      }

    </div>
  )
}
