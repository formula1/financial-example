import * as React from "react";
import {
  useAuth
} from "../../../context/user";

/*

Get first page
- if has_more, display nextPage button

Get Next Page
- add page to setPrevPage to lastItemId

Get Prev Page
- If chose next page, store it
*/

type PropsArg = {
  shouldRefresh: number;
  displayItem: (item: any)=> any
}

const DEFAULT_ARGS: PropsArg = {
  shouldRefresh: Date.now(),
  displayItem: (item)=>{
    console.log("displayItem:", item);
    return (
      <li key={item.id} >
        <div><span>Last 4 Credit Card Numbers: </span><span>{item.card.last4}</span></div>
        <div><span>Expiration Date: </span><span>{item.card.exp_month} / {item.card.exp_year}</span></div>
      </li>
    )
  }
};

export function BankAccountSourceList(args: void | PropsArg){
  const {displayItem, shouldRefresh} = args ? args : DEFAULT_ARGS;

  const auth = useAuth();
  const [loaded, setLoaded] = React.useState(false);
  const [items, setItems] = React.useState([])
  const [prevPage, setPrevPage] = React.useState([]);
  const [nextPage, setNextPage] = React.useState(false);

  async function getSourcePage(curPage: void | string){
    setLoaded(false);
    const response = await auth.fetch("/finance/stripe/bank/list/" + (curPage || ""));
    const json = await response.json()
    if(!response.ok){
      console.error(json)
      throw json;
    }
    if(json.has_more){
      setNextPage(true);
    } else {
      setNextPage(false);
    }
    console.log("source page:", json);
    setItems(json.data);
    setLoaded(true);
  }

  function goToNextPage(){
    if(!nextPage){
      throw "Already at last page";
    }
    const lastItemId = items[items.length - 1].id;
    getSourcePage(lastItemId);
    setPrevPage(prevPage.concat([lastItemId]))
  }

  function goToPrevPage(){
    if(prevPage.length === 0){
      throw "Already at Starting Page"
    }
    getSourcePage(prevPage[prevPage.length - 2])
    setPrevPage(prevPage.slice(0, - 2))
  }

  React.useEffect(()=>{
    getSourcePage()
    setPrevPage([]);
  }, [shouldRefresh])

  return (
    <div>
    {!loaded ? null : (
      [
        <div key="PageSelector">
          {prevPage.length ? (
            <button
              onClick={(e)=>{
                e.preventDefault();

              }}
            >Previous Page</button>
          ) : null}
          {nextPage ? (
            <button
              onClick={()=>{}}
            >Next Page</button>
          ) : null}
        </div>,
        <ul key="SourceList">
          {
            items.map((item)=>{
              return displayItem(item);
            })
          }
        </ul>
      ]
    )}
    </div>
  )
}
