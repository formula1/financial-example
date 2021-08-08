import { useState, useEffect } from "react"
import {
  fetchServer
} from "./server-fetch"

type JSONUserValue = {
  token: string,
  expirationDate: number,
  user: { _id: string, name: string, created: Number }
}

export interface IAuthState {
  user: void | { _id: string, name: string, created: Number },
  storeUser: (shouldSave: boolean)=>void
  isStoring: boolean,
  logout: ()=>void,
  login: (props: { email: string, password: string })=>Promise<void>,
  register: (
    props: {
      username: string, email: string, password: string
    }
  )=>Promise<void>,
  fetch: (url: string, props?: RequestInit) => Promise<Response>
}

export function authState(): IAuthState{

  var userStorageString = localStorage.getItem("saved-user");
  var userStorageJson: void | JSONUserValue;
  if(userStorageString){
    userStorageJson = JSON.parse(userStorageString);
    if(Date.now() > (userStorageJson as JSONUserValue).expirationDate){
      userStorageJson = void 0;
      console.error("can't refresh token, must login again")
    }
  }

  useEffect(() => {
    if(userStorageJson && userStorageJson.expirationDate){
      handleTimeout(userStorageJson.expirationDate);
    }
  }, []);

  const [saveToken, setSaveToken] = useState(userStorageString ? true : false);
  const [jsonUser, setJSONUser] = useState(userStorageJson ? userStorageJson : void 0);
  const [refreshTimeout, setRefreshTimeout] = useState(void 0)

  useEffect(()=>{
    if(!saveToken){
      return localStorage.removeItem("saved-user")
    }
    if(!jsonUser){
      return localStorage.removeItem("saved-user")
    }
    localStorage.setItem("saved-user", JSON.stringify(jsonUser))
  }, [jsonUser, saveToken])

  function storeUser(shouldSave: boolean){
    setSaveToken(shouldSave)
  }

  function handleResponse(response: Response){
    return response.json().then((json)=>{
      if(!response.ok){
        console.error(json);
        throw json
      }
      console.log(json);
      setJSONUser({
        user: json.user,
        expirationDate: json.expirationDate,
        token: json.token
      });;

      console.log("save token:", saveToken, json)
      handleTimeout(json.expirationDate);
    })
  }

  function handleTimeout(expirationDate: number){
    console.trace()
    var offset = expirationDate - Date.now() - 1000 * 60 * 5;
    console.log("Refreshing token in " + offset + " milliseconds")
    console.log("Refreshing token in " + offset / (1000 * 60 * 60 ) + " hours")
    Promise.resolve().then(()=>{
      clearTimeout(refreshTimeout);
      setRefreshTimeout(
        setTimeout(()=>{
          refreshToken();
        }, offset)
      )
    })
  }

  function refreshToken(){
    return fetch("/auth/refresh").then((response)=>{
      return response.json().then((json)=>{
        if(!response.ok){
          console.error(json);
          throw json
        }
        console.log(json);
        return this.handleResponseJSON(json)
      })
    })
  }

  function logout(){
    clearTimeout(this.refreshTimeout)
    setJSONUser(void 0);
  }

  function register(
    {
      username, email, password
    } : {
      username: string, email: string, password: string
    }
  ){
    return fetchServer(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({
          username, email, password
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then(handleResponse)
  }

  function login(
    {
      email, password
    } : {
      email: string, password: string
    }
  ){
    return fetchServer(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          email, password
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }

    ).then(handleResponse)
  }

  function fetch(url: string, props?: RequestInit): Promise<Response> {
    return Promise.resolve().then(()=>{
      if(!props){
        props = {};
      }
      if(typeof props.headers !== "object"){
        props.headers = {};
      } else if(props.headers instanceof Headers){
        var oldHeaders = props.headers as Headers;
        var newHeaders = {} as any;
        for (var pair of (oldHeaders as any).entries()) {
          console.log(pair[0]+ ': '+ pair[1]);
          newHeaders[pair[0]] = pair[1];
        }
        props.headers = newHeaders;
      }

      if(!(props.headers as any)["Authorization"]){
        var bearer = 'Bearer ' + jsonUser.token;
        (props.headers as any)["Authorization"] = bearer;
      }

      console.log(props);

      return fetchServer(url, props)
    })
  }

  return {
    user: jsonUser?.user,
    storeUser,
    isStoring: saveToken,
    logout,
    login,
    register,
    fetch
  }
}
