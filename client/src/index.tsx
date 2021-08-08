import * as React from "react"
import * as ReactDOM from "react-dom";
import { IndexView } from "./views";


console.log("before load")

function initRun(selector: string){

  ReactDOM.render(
    <IndexView />,
    document.querySelector(selector)
  );

}

export {initRun};
