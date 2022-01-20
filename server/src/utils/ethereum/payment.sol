pragma solidity ^0.8.7;

/*

The server hold the user's Internal tokens
- Internal Tokens will be signified by IT


A user can donate to the contract inorder to get an amount of IT
- This will emit an event
- The server will provide an amount of IT equal to ETH => USD


A user can request value from their


*/

contract Exchange {

  address public owner;

  struct SendTransaction {
    string userId;
    address sender;
    uint value;
    uint date;
  };

  mapping(string => uint) public numberOfTransactions;
  mapping(bytes32 => SendTransaction) public sendTransactions;

  event NewSendValue (
    string transactionId
  );

  constructor() {
    owner = msg.sender;
  }

  function createTransactionId(string userId, uint amount) public view returns (memory bytes32) {
    uint num = numberOfTransactions[userId];
    return keccak256(abi.encode(userId, amount, num));
  }

  function sendValue(string userId, string transactionId) payable {
    bytes32 transId = createTransactionId(userId, msg.value);
    sendTransactions[transId] = SendTransaction(userId)
    numberOfTransactions[userId]++;
    emit NewSendValue(transId);
  }

  function requestValue(string userId, uint value) {

  }


}
