import * as fetch from "isomorphic-fetch";

/*
 https://developer.paypal.com/docs/api/reference/get-an-access-token/
*/

import {
  CLIENT_ID,
  CLIENT_SECRET
} from "./constants"

var accessTimeout = void 0;
var accessToken = void 0;

function getToken(){
  if(accessTimeout){
    return Promise.resolve(accessToken)
  }

  return fetch(
    "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    {
      headers: {
        "Authorization": 'Basic ' + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
        "Accept": "application/json",
        "Accept-Language": "en_US",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    }
  ).then((response)=>{
    return response.json().then((json)=>{
      if(!response.ok){
        return console.log("")
      }
      accessToken = json;
      accessTimeout = setTimeout(()=>{
        accessTimeout = void 0
      }, json.expires_in - Date.now())
      return accessToken;
    })
  })
}

export function fetchWithAccessToken(url: string, props?: RequestInit){
  return Promise.all([
    getToken(),
    Promise.resolve().then(()=>{
      if(!props){
        props = {};
      }
      var headers: any = {};
      if(!props.headers){
        props.headers = headers
      } else if(props.headers instanceof Headers){
        props.headers.forEach((value, key)=>{
          headers[key] = value
        })
        props.headers = headers;
      }
      return props;
    })
  ]).then(([token, props])=>{
    if(!(props.headers as any).Authorization){
      (props.headers as any).Authorization = "Bearer " + token.access_token
    }
    return fetch(url, props)
  })
}
