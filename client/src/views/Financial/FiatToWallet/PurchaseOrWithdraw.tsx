import * as React from "react";

type PropsArg = {
  name: string;
  value: string;
  onChange: ((itemId: string)=>any),
}

export function PurchaseOrWithdraw({name, value, onChange}: PropsArg){

  return (
    <div>
      <div>
        <span>Purchase: </span><span></span>
        <input
          type="radio"
          name={name}
          value="purchase"
          checked={value === 'purchase'}
          onChange={(e)=>{
            onChange(e.target.value)
          }} />
      </div>
      <div>
        <span>Withdraw: </span>
        <input
          type="radio"
          name={name}
          value="withdraw"
          checked={value === 'withdraw'}
          onChange={(e)=>{
            onChange(e.target.value)
          }} />
      </div>
    </div>
  )

}
