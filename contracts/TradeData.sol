pragma solidity ^0.4.15;

contract mortal {
    /* Define variable owner of the type address */
    address owner;

    /* This function is executed at initialization and sets the owner of the contract */
    function mortal() { owner = msg.sender; }

    /* Function to recover the funds on the contract */
    function kill() { if (msg.sender == owner) selfdestruct(owner); }
}

contract TradeData is mortal {
  struct Trade {    
      string internalTradeID;
      uint utcTimestamp;
      string traderName;
      int sizeBig;
      uint priceBig;
      string counterparty;
      string client; 
  }

  event NewTradeEvent(uint tradeID);

  string testVal;

  uint public numTrades;
  mapping (uint => Trade) public trades;

  function addTrade(string internalTradeID, uint utcTimestamp, string traderName, int sizeBig, uint priceBig, string counterparty, string client) public returns(uint) {
    // Only owner
    if (msg.sender != owner) return;
    var trade = trades[numTrades];
    uint tradeID = numTrades;
    numTrades++;  
    trade.internalTradeID = internalTradeID;
    trade.utcTimestamp = utcTimestamp;
    trade.traderName = traderName;
    trade.sizeBig = sizeBig;
    trade.priceBig = priceBig;
    trade.counterparty = counterparty;
    trade.client = client;
    NewTradeEvent(tradeID);
    return tradeID;
  }

  function getTradeByID(uint tradeID) public constant returns (string, uint, string, int, uint, string, string) {
    Trade storage trade = trades[tradeID];
    return (trade.internalTradeID, trade.utcTimestamp, trade.traderName, trade.sizeBig, trade.priceBig, trade.counterparty, trade.client);
  }

  function getLastTradeID() public constant returns (uint retVal) {
    return numTrades - 1;
  }
}