import * as React from "react";

import {
  useAuth
} from "../../../context/user";

const IS_NUMBER = /\d+/;

export function Wallet({ id } : { id: string}){
  const auth = useAuth();

  const [shouldReload, setShouldReload] = React.useState(Date.now())
  const [wallet, setWallet] = React.useState();
  const [sendingBalance, setSendingBalance] = React.useState("");

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
      {
        (auth.user._id != id) && (
          <form onSubmit={(e)=>{
            e.preventDefault();
            if(!IS_NUMBER.test(sendingBalance)){
              return;
            }
            auth.fetch(
              "/finance/send-transaction",
              {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify({
                  to: id,
                  balance: sendingBalance
                })
              }
            ).then((response)=>{
              return response.json().then((json)=>{
                if(response.ok) return setShouldReload(Date.now())
                else console.error(json)
              })
            })
          }}>
            <h2>Send Value</h2>
            <div>
              <span>value: </span>
              <span>
                <input
                  placeholder="value"
                  type="text"
                  value={sendingBalance}
                  onChange={(e)=>{
                    e.preventDefault();
                    setSendingBalance(e.target.value)
                  }}
                />
              </span>
            </div>
            <button type="submit" >Send</button>
          </form>
        )
      }
    </div>
  );
}
