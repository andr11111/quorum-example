import Web3 from 'web3-quorum';
import BigNumber from 'bignumber.js';
const contractJSON = require('../contracts/TradeData.json');

const ABI = contractJSON.abi; 
const BYTECODE = contractJSON.bytecode;
const DECIMAL_POINTS = 8;

export default class QuorumService {

  constructor(nodeUrl) {
    this.nodeUrl = nodeUrl;
    this.connectToNode();

    this.contractAbi = ABI;
  }

  connectToNode = () => {
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.nodeUrl));
    this.web3.eth.defaultAccount = this.web3.eth.accounts[0];
  }

  loadContract = (address) => {
    this.contract = this.web3.eth.contract(this.contractAbi).at(address);
  }

  deployContract = (privateFor, callback) => {
    const bytecode = BYTECODE;
    const tradeDataContract = this.web3.eth.contract(this.contractAbi);
    var tradeData = tradeDataContract.new({
      from: this.web3.eth.accounts[0], 
      data: bytecode, 
      gas: 0x47b760,
      ...privateFor && { privateFor }
    }, function(e, contract) {
      if (e) {
        callback(e);
      } else {
        callback(null, contract);
      }
    });
    return tradeData;   
  }

  watchTrades = (callback) => {
    this.contract.allEvents((err, event) => {
      if (err) {
        callback(err);
      } else {
        if (event.event === "NewTradeEvent") {
          const tradeID = event.args.tradeID;
          const trade = this.getTradeByID(tradeID);
          if (trade) {
            callback(null, trade);
          }
        }        
      }
    });
  }
  
  // function addTrade(string internalTradeID, uint utcTimestamp, string traderName, int sizeBig, uint priceBig, string counterparty) public returns (uint tradeID) {
  addTrade = (privateFor, internalTradeID, utcTimestamp, traderName, size, price, counterparty, client) => {

    return this.contract.addTrade(internalTradeID, utcTimestamp, traderName, this.decimalToBigNumber(size), this.decimalToBigNumber(price), counterparty, client,
    { from: this.web3.eth.coinbase, gas: 300000, privateFor });
  }

  // function incNumTrades() public returns (uint) {
  incNumTrades = () => {
    return this.contract.incNumTrades();
  }

  // function getTradeByID(uint tradeID) public constant returns (string, uint, string, int, uint, string) {
  getTradeByID = (tradeID) => {
    const tradeData = this.contract.getTradeByID(parseInt(tradeID));
    if (tradeData) {
      const trade = {
        internalTradeID: tradeData[0],
        utcTimestamp: tradeData[1],
        traderName: tradeData[2],
        size: this.bigNumberToDecimal(tradeData[3]),
        price: this.bigNumberToDecimal(tradeData[4]),
        counterparty: tradeData[5],
        client: tradeData[6]
      };
      return trade;
    }
    
    return null;
  }

  // function getLastTradeID() public constant returns (uint) {
  getLastTradeID = () => {    
    return this.contract.getLastTradeID();
  }

  getTrades = (lastN) => {
    const lastTradeID = this.getLastTradeID();
    let trades = [];
    for (let i = lastTradeID; i--; i > 0 && i > lastTradeID - lastN) {
      trades.push(this.getTradeByID(i));
    }
    return trades;
  }

  decimalToBigNumber = (decimalNumber) => {
    return new BigNumber(decimalNumber).shift(DECIMAL_POINTS).truncated();
  }

  bigNumberToDecimal = (bigNumber) => {
    return bigNumber.shift(-DECIMAL_POINTS).toNumber();
  }
}
