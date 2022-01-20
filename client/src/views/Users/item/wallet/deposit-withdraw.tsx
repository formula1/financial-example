import * as React from "react";

import {
  useAuth
} from "../../../../context/user";

const IS_NUMBER = /\d+/;
enum depositOrWithdrawValues {
  DEPOSIT = "Deposit",
  WITHDRAW = "Withdraw"
}

export function DepositOrWithdraw({ afterSubmit } : { afterSubmit: ()=>any }){
  const auth = useAuth();
  const [depositOrWithdraw, setDepositOrWithdraw] = React.useState(depositOrWithdrawValues.DEPOSIT);
  const [sendingBalance, setSendingBalance] = React.useState("");

  return (
    <form onSubmit={(e)=>{
      e.preventDefault();
      if(!IS_NUMBER.test(sendingBalance)){
        return;
      }
      auth.fetch(
        (
          depositOrWithdrawValues.DEPOSIT === depositOrWithdraw ? (
            "/finance/deposit-funds"
          ) : (
            "/finance/withdraw-funds"
          )
        ),
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
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
        <span>withdraw or deposit: </span>
        <span>
          <button
            onClick={(e)=>{
              e.preventDefault();
              setDepositOrWithdraw(
                depositOrWithdraw === depositOrWithdrawValues.DEPOSIT ? (
                  depositOrWithdrawValues.WITHDRAW
                ) : (
                  depositOrWithdrawValues.DEPOSIT
                )
              )
            }}
          >{depositOrWithdraw}</button>
        </span>
      </div>
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
