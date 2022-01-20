import * as React from "react";
import {Elements, CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {loadStripe, PaymentMethod, Token} from '@stripe/stripe-js';
import { STRIPE_PUBLISHABLE_KEY } from "../../../constants/stripe";
import {
  useAuth
} from "../../../context/user";


/*
  https://stripe.com/docs/testing
*/

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

type CheckoutFormProps = {
  onCreate: (v: Token)=>any
} | void

const CheckoutForm = (props: CheckoutFormProps) => {
  const onCreate = props && props.onCreate
  const auth = useAuth();
  const stripe = useStripe();

  const [routingNumber, setRoutingNumber] = React.useState("");
  const [accountNumber, setAccountNumber] = React.useState("");
  const [accountName, setAccountName] = React.useState("");

  const handleSubmit = async (event: any) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    try {
      const {token, error} = await stripe.createToken("bank_account", {
        country: 'US',
        currency: 'usd',
        routing_number: routingNumber,
        account_number: accountNumber,
        account_holder_name: accountName,
        account_holder_type: 'individual',
      });
      if(error){
        throw error;
      }
      console.log('[create token]', token);
      const response = await auth.fetch("/finance/stripe/bank/create", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(token)
      })
      const json = await response.json()
      if(!response.ok){
        throw json
      }
      onCreate(token);
    }catch(error){
      console.error(error)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div >
        <span>Routing Number: </span>
        <input
          type="text"
          value={routingNumber}
          onChange={(e)=>{
            setRoutingNumber(e.target.value)
          }}
        />
      </div>
      <div >
        <span>Account Number: </span>
        <input
          type="text"
          value={accountNumber}
          onChange={(e)=>{
            setAccountNumber(e.target.value)
          }}
        />
      </div>
      <div >
        <span>Account Name: </span>
        <input
          type="text"
          value={accountName}
          onChange={(e)=>{
            setAccountName(e.target.value)
          }}
        />
      </div>
      <button type="submit" disabled={!stripe}>
        Create Bank Account
      </button>
    </form>
  );
};

export const BankAccountCreate = (props: CheckoutFormProps) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm onCreate={props && props.onCreate} />
    </Elements>
  );
};
