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
        {
          !auth.user && (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )
        }
        {
          auth.user && ([
            <li key="/customer">
              <Link to="/finance/customer" >Customer</Link>
            </li>,
            <li key="/card">
              <Link to="/finance/card" >Card</Link>
            </li>,
            <li key="/exchange">
              <Link to="/finance/exchange" >Exchange</Link>
            </li>,
            <li key="/users">
              <Link to="/users">Users</Link>
            </li>,
            <li key="/transactions">
              <Link to="/transactions">Unfinished Transactions</Link>
            </li>,
            <li key="/self">
              <Link to="/self">Self</Link>
            </li>,
            (
              <li key="save-user">
                <a
                  href="#"
                  onClick={(e)=>{
                    e.preventDefault();
                    auth.storeUser(!auth.isStoring);
                  }}
                >Save User? {auth.isStoring ? "No": "Yes"}</a>
              </li>
            ), (
              <li key="/logout">
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
          ])
        }
      </ul>
    </nav>
  )
}
