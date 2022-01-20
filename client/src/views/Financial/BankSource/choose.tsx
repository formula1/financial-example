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

export function CardSourceChoose(
  {
    value,
    onChange
  }: Props
){
  const auth = useAuth();

  return (
    <div>
      {
        value && (
          <h1><span>Bank Acount Selected: </span><span>{value}</span></h1>
        )
      }
      <input
        key="HiddenInput"
        type="hidden"
        name="card"
        value={value || ""}
      />
      <BankAccountSourceList
        shouldRefresh={0}
        displayItem={(item)=>{
          return (
            <li key={item.id}  className={value === item.id ? "chosen" : ""}>
              <h1>{
                value !== item.id ? (
                  <a
                    href="#"
                    onClick={(e)=>{
                      e.preventDefault();
                      onChange && onChange(item.id)
                    }}
                  >Select Card</a>
                ) : (
                  <span>This Card is Selected</span>
                )
              }</h1>
              <div><span>Last 4 Credit Card Numbers: </span><span>{item.card.last4}</span></div>
              <div><span>Expiration Date: </span><span>{item.card.exp_month} / {item.card.exp_year}</span></div>
            </li>
          );
        }}
      />
    </div>
  )

}
