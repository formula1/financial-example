import * as React from "react";

import {
  useAuth
} from "../../../context/user";

import {
  CardSourceCreate
} from "./create";

import {
  CardSourceList
} from "./list";

type Props = {
  value: string | void,
  onChange: (v: string)=>any | void
}

export function CardSourceModify(){
  const auth = useAuth();

  const [time, setTime] = React.useState(Date.now());

  async function deleteItem(itemId: string){
    const response = await auth.fetch("/finance/stripe/card/delete/" + itemId);
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
      <CardSourceCreate
        onCreate={()=>{
          setTime(Date.now())
        }}
      />
      <CardSourceList
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
