import Stripe from 'stripe'

import { SECRET_KEY } from "./constants";

const stripe = new Stripe(SECRET_KEY, {
  apiVersion: '2020-08-27',
})

export { stripe };
