import * as React from "react"
import {
  useAuth
} from "../../../context/user";
import {
  CardSourceChoose
} from "../CardSource/choose"
import {PurchaseOrWithdraw} from "./PurchaseOrWithdraw";

export function FiatToWallet(){
  const auth = useAuth();
  const [purchaseOrWithdraw, setPOrW] = React.useState("purchase");
  const [amount, setAmount] = React.useState(1);
  const [creditCard, setCreditCard] = React.useState("");
  return (
    <form
      onSubmit={async (e)=>{
        e.preventDefault();
        try {
          if(creditCard === ""){

          }
          const response = await auth.fetch("/finance/stripe/exchange-value", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              sourceId: creditCard,
              amount: amount,
              purchaseOrWithdraw: purchaseOrWithdraw
            })
          });
          const json = await response.json()
          if(!response.ok){
            console.error(json)
            throw json;
          }
        }catch(e){
          console.error(e);
        }
      }}
    >
      <div>
        <h1>Purchase or Withdraw</h1>
        <PurchaseOrWithdraw
          name="purchaseOrWithdraw"
          value={purchaseOrWithdraw}
          onChange={(v)=>{setPOrW(v)}}
        />
      </div>
      <div>
        <h1>Amount To {purchaseOrWithdraw === "purchase" ? "Purchase" : "Withdraw"}</h1>
        <input
          type="number"
          min="1"
          step="1"
          value={amount}
          onChange={(e)=>{
            setAmount(parseInt(e.target.value))
          }}
        />
      </div>
      <div>
        <h1>Choose Credit Card</h1>
        <CardSourceChoose
          value={creditCard}
          onChange={(value)=>{setCreditCard(value)}}
        />
      </div>
      <button type="submit" >{purchaseOrWithdraw === "purchase" ? "Buy" : "Sell"} Tokens</button>
    </form>
  );
}
