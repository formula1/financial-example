To Make a Charge - https://stripe.com/docs/api/charges/create
- amount
- currency
- description
- statement_descriptor - to be shown to payers account
- source
  - needs bank account - https://stripe.com/docs/api/customer_bank_accounts/create
    - needs source
      - object - "bank_account"
      - country
      - currency
      - routing number
      - account number
      - account_holder_name
      - account_holder_type
    - needs customer - https://stripe.com/docs/api/customers/create
      - address
      - email
      - description

To make a Payout - https://stripe.com/docs/api/payouts/create
- amount
- currency
- description
- statement_descriptor - to be shown on receivers account
- destination
  - needs bank account - https://stripe.com/docs/api/customer_bank_accounts/create
    - needs customer - https://stripe.com/docs/api/customers/create
      - address
      - email
      - description

To Send Value
- needs a bank account
  - Need a customer object
    - needs an address
    - needs an email
    - good to have a description
