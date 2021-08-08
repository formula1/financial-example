import { StateFunction, ITransactionState } from "../types";
import { debitAccount } from "./1-debit-account"
import { creditAccount } from "./2-credit-account"
import { finishTransaction } from "./3-finish-transaction"

const TransactionSteps = [
  debitAccount,
  creditAccount,
  finishTransaction
]

async function getTransactionStep(transactionDoc: ITransactionState): Promise<number>{
  for(var i = 0; i < TransactionSteps.length; i++){
    var testValue = await TransactionSteps[i].test(transactionDoc);
    if(testValue === false){
      break;
    }
  }
  return i;
}

async function handleIncomplete (transactionDoc: ITransactionState, index: number) {
  try{


    for(index; index < TransactionSteps.length; index++){
      console.log("running step:", index);
      const curFn = TransactionSteps[index];
      await curFn.run(transactionDoc);
    }

    return transactionDoc;
  }catch(e){
    console.log("reverting:", e, index);
    index--;
    for(index; index > -1; index--){
      console.log("reverting step:", index)
      const curFn = TransactionSteps[index];
      await curFn.revert(transactionDoc);
    }
    var doc = await transactionDoc.remove();

    console.log(doc)
    return transactionDoc;
  }
};


export {
  getTransactionStep,
  handleIncomplete,
}
