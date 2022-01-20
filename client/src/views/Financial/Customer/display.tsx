import * as React from "react";

import {
  useAuth
} from "../../../context/user";

function CustomerDisplay(){
  const auth = useAuth();
  const [user, setUser] = React.useState(void 0);

  React.useEffect(()=>{
    auth.fetch("/finance/stripe/get-customer").then(async (response)=>{
      const json = await response.json();
      if(response.ok){
        console.log(json)
        setUser(json);
       }else{
        console.error(json)
      }
    })
  }, [])

  return (
    <div>
    </div>
  );
}
