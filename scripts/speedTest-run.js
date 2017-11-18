var Web3 = require('web3-quorum');

function generateEvents(numCalls) {
  var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:22000/"));
  web3.eth.defaultAccount = web3.eth.accounts[0];

  a = web3.eth.accounts[0]
  web3.eth.defaultAccount = a;

  // abi and bytecode generated from simplestorage.sol:
  // > solcjs --bin --abi simplestorage.sol
  var address="0x1349f3e1b8d71effb47b840594ff27da7e603d17";
  var abi=[ { "constant": false, "inputs": [ { "name": "input", "type": "string" } ], "name": "writeTest", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getLastTradeID", "outputs": [ { "name": "retVal", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "trades", "outputs": [ { "name": "internalTradeID", "type": "string" }, { "name": "utcTimestamp", "type": "uint256" }, { "name": "traderName", "type": "string" }, { "name": "sizeBig", "type": "int256" }, { "name": "priceBig", "type": "uint256" }, { "name": "counterparty", "type": "string" }, { "name": "client", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "tradeID", "type": "uint256" } ], "name": "kill", "outputs": [ { "name": "", "type": "string" }, { "name": "", "type": "uint256" }, { "name": "", "type": "string" }, { "name": "", "type": "int256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "internalTradeID", "type": "string" }, { "name": "utcTimestamp", "type": "uint256" }, { "name": "traderName", "type": "string" }, { "name": "sizeBig", "type": "int256" }, { "name": "priceBig", "type": "uint256" }, { "name": "counterparty", "type": "string" }, { "name": "client", "type": "string" } ], "name": "addTrade", "outputs": [ { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "string" }, { "name": "", "type": "int256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "tradeID", "type": "uint256" } ], "name": "getTradeByID", "outputs": [ { "name": "", "type": "string" }, { "name": "", "type": "uint256" }, { "name": "", "type": "string" }, { "name": "", "type": "int256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "string" }, { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "internalTradeID", "type": "string" }, { "name": "utcTimestamp", "type": "uint256" }, { "name": "traderName", "type": "string" }, { "name": "sizeBig", "type": "int256" }, { "name": "priceBig", "type": "uint256" }, { "name": "counterpartyName", "type": "string" } ], "name": "readTest", "outputs": [ { "name": "retVal", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "internalTradeID", "type": "string" }, { "name": "utcTimestamp", "type": "uint256" }, { "name": "traderName", "type": "string" }, { "name": "sizeBig", "type": "int256" }, { "name": "priceBig", "type": "uint256" }, { "name": "counterpartyName", "type": "string" } ], "name": "numTrades", "type": "function", "constant": true, "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "tradeID", "type": "uint256" } ], "name": "NewTradeEvent", "type": "event" } ];
  var tradeData=web3.eth.contract(abi).at(address);


  var testFunc = function() {
    tradeData.addTrade("trade1", 1000, "AA", 300, 500, "CPTY", "client1", 
    { from: web3.eth.coinbase, gas: 300000, privateFor:["QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="] },
    function(err, val){});
  }
  
  var iteration = 1;  
  var startTime = new Date();
  var endTime = null;

  for (var i=0;i<numCalls;i++) {
    testFunc();    
  }

  endTime = new Date();
  var timeElapsed = endTime - startTime;
  
  console.log("Time elapsed (ms):", timeElapsed);
  console.log("Events per second sent:", numCalls * 1000 / timeElapsed);

}

generateEvents(50);

