import * as React from "react";

import {
  useAuth
} from "../../../context/user";

import {
  BankAccountCreate
} from "./create";

import {
  BankAccountSourceList
} from "./list";

type Props = {
  value: string | void,
  onChange: (v: string)=>any | void
}

export function CardSourceModify(){
  const auth = useAuth();

  const [time, setTime] = React.useState(Date.now());

  async function deleteItem(itemId: string){
    const response = await auth.fetch("/finance/stripe/bank/delete/" + itemId);
    const json = await response.json()
    if(!response.ok){
      console.error(json);
      throw json;
    } else {
      console.log(json);
      setTime(Date.now());
    }
  }


  return (
    <div>
      <BankAccountCreate
        onCreate={()=>{
          setTime(Date.now())
        }}
      />
      <BankAccountSourceList
        shouldRefresh={time}
        displayItem={(item)=>{
          return (
            <li key={item.id}>
              <div><span>Last 4 Credit Card Numbers: </span><span>{item.card.last4}</span></div>
              <div><span>Expiration Date: </span><span>{item.card.exp_month} / {item.card.exp_year}</span></div>
              <div><a
                href="#"
                onClick={(e)=>{
                  e.preventDefault();
                  deleteItem(item.id);
                }}
              >Delete</a></div>
            </li>
          );
        }}
      />
    </div>
  )

}
