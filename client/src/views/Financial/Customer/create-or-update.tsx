import * as React from "react";
import { AddressForm } from "../AddressForm";
import {
  useAuth
} from "../../../context/user";

import {
  DEFAULT_VALUE,
  CustomerForm
} from "./form"


export function CustomerCreateOrUpdate(){
  const auth = useAuth();
  const [user, setUser] = React.useState(DEFAULT_VALUE);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(()=>{
    auth.fetch("/finance/stripe/get-customer").then(async (response)=>{
      const json = await response.json();
      if(response.ok){
        console.log("get-cutsomer result", json)
        console.log("get-cutsomer stripe", json.customerStripe)
        setUser(json.customerStripe);
       }else{
        console.error(json)
      }
      setLoaded(true);
    })
  }, [])

  if(!loaded){
    return null;
  }

  return (
    <form
      onSubmit={async (e)=>{
        e.preventDefault()
        try {
          const response = await auth.fetch("/finance/stripe/create-or-update-customer", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(user)
          });
          const json = await response.json()
          if(!response.ok){
            throw json;
          }
          console.log(json);
        }catch(e){
          console.error(e);
        }

      }}
    >
      <CustomerForm
        value={user}
        onChange={(value)=>{setUser(value)}}
      />
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  )


}
