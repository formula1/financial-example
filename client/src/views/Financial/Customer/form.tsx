import * as React from "react";
import { AddressForm } from "../AddressForm";
import {
  useAuth
} from "../../../context/user";

type PropsValue = {
  name: string,
  email: string,
  address: {
    line1:string,
    line2:string,
    city:string,
    state:string,
    postal_code:string,
    country:string,
  }
};

export const DEFAULT_VALUE: PropsValue = {
  name: "",
  email: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  }
}

type PropsType = {
  value: PropsValue,
  onChange: (v: PropsValue)=>any
}

export function CustomerForm(props: PropsType){
  const value = props.value;
  const copy = JSON.parse(JSON.stringify(value || {}));

  return (
    <div>
      <div>
        <h1>Name</h1>
        <input
          type="text"
          value={value.name}
          onChange={(e)=>{
            copy.name = e.target.value
            props.onChange(copy);
          }}
        />
      </div>
      <div>
        <h1>Email</h1>
        <input
          type="text"
          value={value.email}
          onChange={(e)=>{
            copy.email = e.target.value
            props.onChange(copy);
          }}
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
        />
      </div>
      <div>
        <h1>Address</h1>
        <AddressForm
          name="address"
          value={value.address}
          onChange={(eValue)=>{
            copy.address = eValue;
            props.onChange(copy);
          }}
        />
      </div>
    </div>
  )


}
