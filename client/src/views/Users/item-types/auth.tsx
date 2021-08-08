import * as React from "react";

import {
  useAuth
} from "../../../context/user";

import {
  UserItem
} from "../item"


export function UserAuth(){
  const auth = useAuth();
  return <UserItem id={(auth.user as any)._id} />
}
