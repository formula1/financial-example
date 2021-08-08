import * as React from "react";

import {
  useParams
} from "react-router-dom";

import {
  UserItem
} from "../item"

export function UserParam(){
  let { id } = useParams() as { id: string };
  return <UserItem id={id} />

}
