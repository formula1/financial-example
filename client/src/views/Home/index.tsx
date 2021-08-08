import * as React from "react";
import {
  useAuth
} from "../../context/user";

export function Home(){
  const auth = useAuth();
  console.log(auth);
  return (
    <div>
      {auth.user && <h1>{auth.user.name}</h1>}
      <h1>HEllo World</h1>
    </div>
  )
}
