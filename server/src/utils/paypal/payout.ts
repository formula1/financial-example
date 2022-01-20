/*

https://developer.paypal.com/docs/api/payments.payouts-batch/v1/

*/
import { fetchWithAccessToken } from "./access-token";

const PAYPAL_PAYMENT_TIME = 1000 * 60;
var queuedPaypalPayouts = [];
var paypalPayoutTimeout = void 0

function sendPayoutToPayPal(){
  const paypalPayouts = queuedPaypalPayouts;
  queuedPaypalPayouts = [];
  return fetchWithAccessToken(
    "https://api-m.sandbox.paypal.com/v1/payments/payouts",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "sender_batch_header": {
          "sender_batch_id": "Payouts_2018_100007",
          "email_subject": "You have a payout!",
          "email_message": "You have received a payout! Thanks for using our service!",
          "recipient_type": "PAYPAL_ID"
        },
        items: paypalPayouts
      })
    }
  ).then(()=>{

  })
}

export function payout (
  {
    transactionId,
    reciever,
    value
  }: {
    transactionId: string,
    reciever: string,
    value: string
  }
){
    if(paypalPayoutTimeout === void 0){
      paypalPayoutTimeout = setTimeout(()=>{
        paypalPayoutTimeout = void 0;
        sendPayoutToPayPal()
      }, PAYPAL_PAYMENT_TIME)
    }
    // https://developer.paypal.com/docs/api/payments.payouts-batch/v1/#definition-payout_item
    queuedPaypalPayouts.push({
      // custom Id
      sender_item_id: transactionId,
      // the reciever id
      reciever: reciever,
      // amount
      amount: {
        currency: "USD",
        value: value
      }
    })
  }
