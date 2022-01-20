import * as React from "react";

import {
  useAuth
} from "../../../../context/user";

const IS_NUMBER = /\d+/;

export function Wallet({ id, shouldReload } : { id: string, shouldReload: number}){
  const auth = useAuth();

  const [wallet, setWallet] = React.useState();

  React.useEffect(() => {
    auth.fetch("/finance/wallet/" + id).then((response)=>{
      return response.json().then((json)=>{
        if(response.ok) return setWallet(json)
        throw json
      })
    }).catch((err: any)=>{
      console.error("get wallet err:", err)
    });

  }, [shouldReload])

  if(!auth.user){
     return null;
  }

  if(!wallet){
    return null;
  }

  return (
    <div>
      <h1>Wallet</h1>
      <h3><span>balance: </span><span>{(wallet as any).balance}</span></h3>
    </div>
  );
}
