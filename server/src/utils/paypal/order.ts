/*

https://developer.paypal.com/docs/api/orders/v2/

*/

import { BRAND_NAME } from "./constants";
import { fetchWithAccessToken } from "./access-token";


export function order(
  {
    transactionId,
    payer_id,
    value
  } : {
    transactionId: string,
    payer_id: string,
    value: string
  }
){
  return fetchWithAccessToken(
    "https://api-m.sandbox.paypal.com/v2/checkout/orders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        custom_id: transactionId,
        // https://developer.paypal.com/docs/api/orders/v2/#definition-payer
        payer: {
          payer_id: payer_id
        },

        // https://developer.paypal.com/docs/api/orders/v2/#definition-purchase_unit_request
        // https://developer.paypal.com/docs/api/orders/v2/#definition-amount_with_breakdown
        purchase_units: [
          {
            description: "Purchase Tokens",
            amount: {
              currency_code: "USD",
              value: value
            }
          }
        ],
        // https://developer.paypal.com/docs/api/orders/v2/#definition-order_application_context
        application_context: {
          brand_name: BRAND_NAME,
          shipping_preference: "NO_SHIPPING"
        }
      })
    }
  )
}
