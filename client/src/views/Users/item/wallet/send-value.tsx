import * as React from "react";

import {
  useAuth
} from "../../../../context/user";

const IS_NUMBER = /\d+/;

export function SendValue({ id, afterSubmit } : { id: string, afterSubmit: ()=>any }){
  const auth = useAuth();
  const [sendingBalance, setSendingBalance] = React.useState("");

  return (
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
          if(response.ok) return afterSubmit()
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
  );

}
