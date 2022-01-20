import * as React from "react";
import {Elements, CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {loadStripe, PaymentMethod} from '@stripe/stripe-js';
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
  onCreate: (v: PaymentMethod)=>any
} | void

const CheckoutForm = (props: CheckoutFormProps) => {
  const onCreate = props && props.onCreate
  const auth = useAuth();
  const stripe = useStripe();
  const elements = useElements();


  const handleSubmit = async (event: any) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.log('[error]', error);
      throw error
    }
    console.log('[PaymentMethod]', paymentMethod);
    const response = await auth.fetch("/finance/stripe/card/create", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(paymentMethod)
    })

    const json = await response.json()

    if(!response.ok){
      throw json
    }

    console.log(json);

    onCreate(paymentMethod);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Create Card
      </button>
    </form>
  );
};

export const CardSourceCreate = (props: CheckoutFormProps) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm onCreate={props && props.onCreate} />
    </Elements>
  );
};
