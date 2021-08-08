import { TransactionModel } from "../../models/Transaction"

export async function getTransactions(userId: string){
  try {
    const [ from, to ] = await Promise.all([
      TransactionModel.find({
        from: userId
      }),
      TransactionModel.find({
        to: userId
      })
    ])
    // console.log("Transactions:", from, to);
    return {
      from, to
    }
  }catch(e){
    throw {
      status: 500,
      message: e.message,
      stack: e.stack
    }
  }
}
