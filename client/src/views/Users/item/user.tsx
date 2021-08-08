import * as React from "react";

import {
  useAuth
} from "../../../context/user";

export function User({ id } : { id: string}){
  const auth = useAuth();

  const [user, setUser] = React.useState();

  React.useEffect(() => {
    console.log("retrieving users");
    auth.fetch("/admin/users/" + id).then((response)=>{
      return response.json().then((json)=>{
        if(response.ok) return setUser(json);
        throw json;
      })
    }).catch((err: any)=>{
      console.error("get user err:", err)
    });
  }, [])

  if(!user){
    return null;
  }

  return (
    <div>
      <h1>User</h1>
      <ul>
        <li><span>_id: </span><span>{(user as any)._id}</span></li>
        <li><span>name: </span><span>{(user as any).name}</span></li>
        <li><span>created: </span><span>{(user as any).created}</span></li>
      </ul>
    </div>
  );
}
