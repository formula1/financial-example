import * as React from "react";

import {
  Link,
  useHistory,
} from "react-router-dom";

import {
  useAuth
} from "../../context/user";


export function Header(){
  let history = useHistory();
  let auth = useAuth();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/transactions">Unfinished Transactions</Link>
        </li>
        <li>
          <Link to="/self">Self</Link>
        </li>
        {
          auth.user && (
            <li>
              <a
                href="#"
                onClick={(e)=>{
                  e.preventDefault();
                  auth.storeUser(!auth.isStoring);
                }}
              >Save User? {auth.isStoring ? "No": "Yes"}</a>
            </li>
          )
        }
        {
          auth.user && (
            <li>
              <a
                href="#"
                onClick={(e)=>{
                  e.preventDefault();
                  auth.logout();
                  history.push("/");
                }}
              >Logout</a>
            </li>
          )
        }
      </ul>
    </nav>
  )
}
