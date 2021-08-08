import * as React from "react";
import {
  Link,
} from "react-router-dom";
import {
  useAuth
} from "../../context/user";

export function UserList(){
  const auth = useAuth();

  const user = auth.user;

  console.log(auth, user);

  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    console.log("retrieving users");
    auth.fetch("/admin/users").then((response)=>{
      return response.json().then((json)=>{
        if(!response.ok) throw json;
        setUsers(json);
      })
    }).catch((err)=>{
      console.error("get users err:", err)
    })
  }, [])
  return (
    <ul>{
      users.map((userItem)=>{
        return (
          <li key={userItem._id}>
            <Link to={"/users/" + userItem._id}>{userItem.name}</Link>
          </li>
        )
      })
    }</ul>
  );
}
