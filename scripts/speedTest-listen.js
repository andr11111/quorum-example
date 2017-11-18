var Web3 = require('web3-quorum');

function processEvents(numCalls) {
  var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:22001/"));
  web3.eth.defaultAccount = web3.eth.accounts[0];

  // abi and bytecode generated from simplestorage.sol:
  // > solcjs --bin --abi simplestorage.sol
  var address="0x1349f3e1b8d71effb47b840594ff27da7e603d17";
  var abi=[ { "constant": false, "inputs": [ { "name": "input", "type": "string" } ], "name": "writeTest", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getLastTradeID", "outputs": [ { "name": "retVal", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "trades", "outputs": [ { "name": "internalTradeID", "type": "string" }, { "name": "utcTimestamp", "type": "uint256" }, { "name": "traderName", "type": "string" }, { "name": "sizeBig", "type": "int256" }, { "name": "priceBig", "type": "uint256" }, { "name": "counterparty", "type": "string" }, { "name": "client", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "tradeID", "type": "uint256" } ], "name": "kill", "outputs": [ { "name": "", "type": "string" }, { "name": "", "type": "uint256" }, { "name": "", "type": "string" }, { "name": "", "type": "int256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "internalTradeID", "type": "string" }, { "name": "utcTimestamp", "type": "uint256" }, { "name": "traderName", "type": "string" }, { "name": "sizeBig", "type": "int256" }, { "name": "priceBig", "type": "uint256" }, { "name": "counterparty", "type": "string" }, { "name": "client", "type": "string" } ], "name": "addTrade", "outputs": [ { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "string" }, { "name": "", "type": "int256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "tradeID", "type": "uint256" } ], "name": "getTradeByID", "outputs": [ { "name": "", "type": "string" }, { "name": "", "type": "uint256" }, { "name": "", "type": "string" }, { "name": "", "type": "int256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "string" }, { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "internalTradeID", "type": "string" }, { "name": "utcTimestamp", "type": "uint256" }, { "name": "traderName", "type": "string" }, { "name": "sizeBig", "type": "int256" }, { "name": "priceBig", "type": "uint256" }, { "name": "counterpartyName", "type": "string" } ], "name": "readTest", "outputs": [ { "name": "retVal", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "internalTradeID", "type": "string" }, { "name": "utcTimestamp", "type": "uint256" }, { "name": "traderName", "type": "string" }, { "name": "sizeBig", "type": "int256" }, { "name": "priceBig", "type": "uint256" }, { "name": "counterpartyName", "type": "string" } ], "name": "numTrades", "type": "function", "constant": true, "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "tradeID", "type": "uint256" } ], "name": "NewTradeEvent", "type": "event" } ];
  var tradeData=web3.eth.contract(abi).at(address);

  var iteration = 0;
  var startTime = null;
  var endTime = null;

  console.log('Waiting for events');
  tradeData.allEvents(function(err, evt){
    if (err) {
      console.log(err);
    } else {
      if (evt.event === "NewTradeEvent") {
        if (!startTime) {
          startTime = new Date();
        }
        var tradeID = evt.args.tradeID;
        // var trade = tradeData.getTradeByID(tradeID);
        iteration++;
        if (iteration >= numCalls) {
          endTime = new Date();
          var timeElapsed = endTime - startTime;
          console.log("Time elapsed (ms):", timeElapsed);
          console.log("Events per second received:", numCalls * 1000 / timeElapsed);
          process.exit();
        } else {
          console.log("Received trade", tradeID.toString(10));
        }
      }        
    }  
  });
}

processEvents(50);

(function wait () {
  setTimeout(wait, 1000);
})();