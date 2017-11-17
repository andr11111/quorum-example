import React, { Component } from 'react';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import config from './config';
import TradeForm from './TradeForm';
import TradesList from './TradesList';
import QuorumService from './services/QuorumService';

class HedgeFund extends Component {  

  constructor(props) {
    super(props);
    this.tradeID = 0;
    this.state = {      
      trades: [],
      tradeFormOpen: false
    };

    // Load public keys to send private messges to
    this.hedgeFundPubKey = config.hedgeFund.publicKey;
    this.custodianPubKey = config.custodian.publicKey;
    this.client1PubKey = config.client1.publicKey;
    this.client2PubKey = config.client2.publicKey;
  }

  init = () => {
    this.quorumService = new QuorumService(config.hedgeFund.rpcURL);
    console.log('Hedge Fund connected:', this.quorumService.web3.isConnected());
    if(this.props.contractAddress) {
      this.loadContract(this.props.contractAddress);
    }
  }

  loadContract = (address) => {
    this.quorumService.loadContract(address);    
    this.tradeID = this.quorumService.getLastTradeID().toNumber();
    this.subscribeToNewTrades();
  }

  deployContract = () => {
    const privateFor = [this.custodianPubKey, this.client1PubKey, this.client2PubKey];
    this.quorumService.deployContract(privateFor, (e, contract) => {
      if (e) {
        console.log("err creating contract", e);
      } else {
        if (!contract.address) {
          console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
        } else {
          console.log("Contract mined! Address: " + contract.address);
          console.log(contract);
          this.props.setContractAddress(contract.address);
          this.loadContract(contract.address);
        }
      }      
    });
  }

  subscribeToNewTrades = () => {
    this.quorumService.watchTrades((err, trade) => {
      if (err) {
        console.log(err);
      } else {
        if (trade) {
          this.setState({trades: [trade].concat(this.state.trades)});
        }        
      }
    });
  }

  addTrade = (values) => {
    this.closeTradeDialog();
    this.tradeID++;
    const { client, traderName, size, price, counterparty } = values;
    const utcTimestamp = new Date().getTime();
    let privateFor = [this.custodianPubKey];
    if (client === "client1") {
      privateFor.push(this.client1PubKey);
    } else if (client === "client2") {
      privateFor.push(this.client2PubKey);
    }    
    const result = this.quorumService.addTrade(privateFor, `trade${this.tradeID}`, utcTimestamp, traderName, size, price, counterparty, client);
    console.log(result);
  }

  viewTrade = ({ tradeID }) => {
    const trade = this.quorumService.getTradeByID(tradeID);
    console.log(trade);
  }

  getLastTradeID = () => {
    console.log(this.quorumService.getLastTradeID().toString(10));
  }

  openTradeDialog = () => {
    this.setState({ tradeFormOpen: true });
  }

  closeTradeDialog = () => {
    this.setState({ tradeFormOpen: false });
  }

  componentWillMount() {
    this.init();
  }

  render() {    
    const isContractDeployed = !!this.props.contractAddress;
    let content = null;
    if (!isContractDeployed) {
      content = <Button raised color="primary" onClick={this.deployContract}>Deploy Contract</Button>;
    } else {
      content = (
        <div>          
          <TradeForm onSubmit={this.addTrade} handleCancel={this.closeTradeDialog} open={this.state.tradeFormOpen}/>
          <TradesList trades={this.state.trades} />        
        </div>
      );
    }

    const title = <div>Hedge Fund&nbsp;&nbsp;<Button raised color="primary" onClick={this.openTradeDialog}>Report Trade</Button></div>;;

    return (
      <Card>
        <CardHeader
          title={title}
        />
        <CardContent>          
          {content}
        </CardContent>        
      </Card>
    );
  }
}

export default HedgeFund;
