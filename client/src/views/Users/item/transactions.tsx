import * as React from "react";

import {
  useAuth
} from "../../../context/user";

const IS_NUMBER = /\d+/;

export function Transactions({ id } : { id: string}){
  const auth = useAuth();

  const [transactions, setTransactions] = React.useState({
    to: [],
    from: []
  })

  React.useEffect(() => {

    auth.fetch("/finance/transactions/" + id).then((response)=>{
      return response.json().then((json)=>{
        if(response.ok) return setTransactions(json)
        throw json
      })
    }).catch((err: any)=>{
      console.error("get transactions err:", err)
    });
  }, [])

  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "center"
    }}>
      <div>
        <h2>From Transactions</h2>
        <ul>{
          transactions.from.map((t)=>{
            return (
              <li>
                <div>id: {t._id}</div>
                <div>to: {t.to}</div>
                <div>balance: {t.balance}</div>
                <div>finished: {t.finished.toString()}</div>
              </li>
            )
          })
        }</ul>
      </div>
      <div>
        <h2>To Transactions</h2>
        <ul>{
          transactions.to.map((t)=>{
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
    </div>
  );
}
