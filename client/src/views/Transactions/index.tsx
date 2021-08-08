import * as React from "react";

import {
  useAuth
} from "../../context/user";


export function UnfinishedTransactions(){
  const auth = useAuth();

  const [transactions, setTransactions] = React.useState([])

  React.useEffect(() => {

    auth.fetch("/finance/unfinished-transactions/").then((response)=>{
      return response.json().then((json)=>{
        if(response.ok) return setTransactions(json)
        throw json
      })
    }).catch((err: any)=>{
      console.error("get transactions err:", err)
    });
  }, [])

  return (
    <div>
      <h2>Transactions</h2>
      <ul>{
        transactions.map((t)=>{
          return (
            <li>
              <div>id: {t._id}</div>
              <div>from: {t.from}</div>
              <div>balance: {t.balance}</div>
              <div>finished: {t.finished.toString()}</div>
            </li>
          )
        })
      }</ul>
    </div>
  )
}
