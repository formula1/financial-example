import * as React from "react";

const {
  useState
} = React;

type AddressType = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

type PropsArg = {
  name: string;
  value: AddressType;
  onChange: ((value: AddressType)=>any);
}

export function AddressForm({ name, value, onChange }: PropsArg){

  const copy = JSON.parse(JSON.stringify(value));

  return (
    <div>
      <div>
        <span>Address Line 1:</span>
        <input
          placeholder="Address Line 1"
          name={name + "[line1]"}
          type="text"
          value={value.line1}
          onChange={(e)=>{
            e.preventDefault();
            copy.line1 = e.target.value
            onChange(copy);
          }}
        />
      </div>
      <div>
        <span>Address Line 2:</span>
        <input
          placeholder="Address Line 2"
          name={name + "[line2]"}
          type="text"
          value={value.line2}
          onChange={(e)=>{
            e.preventDefault();
            copy.line2 = e.target.value
            onChange(copy);
          }}
        />
      </div>
      <div>
        <span>City:</span>
        <input
          placeholder="City"
          name={name + "[city]"}
          type="text"
          value={value.city}
          onChange={(e)=>{
            e.preventDefault();
            copy.city = e.target.value
            onChange(copy);
          }}
        />
      </div>
      <div>
        <span>State:</span>
        <input
          placeholder="State"
          name={name + "[state]"}
          type="text"
          value={value.state}
          onChange={(e)=>{
            e.preventDefault();
            copy.state = e.target.value
            onChange(copy);
          }}
        />
      </div>
      <div>
        <span>Postal Code:</span>
        <input
          placeholder="Postal Code"
          name={name + "[postal_code]"}
          type="text"
          value={value.postal_code}
          onChange={(e)=>{
            e.preventDefault();
            copy.postal_code = e.target.value
            onChange(copy);
          }}
        />
      </div>
      <div>
        <span>Country:</span>
        <input
          placeholder="Country"
          name={name + "[country]"}
          type="text"
          value={value.country}
          onChange={(e)=>{
            e.preventDefault();
            copy.country = e.target.value
            onChange(copy);
          }}
        />
      </div>
    </div>
  )
}
