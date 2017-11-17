import React, { Component } from 'react';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import config from './config';
import TradesList from './TradesList';
import QuorumService from './services/QuorumService';

class Custodian extends Component {  

  constructor(props) {
    super(props);
    this.state = {      
      trades: []
    };

    // Load public keys to send private messges to
    this.hedgeFundPubKey = config.hedgeFund.publicKey;
    this.custodianPubKey = config.custodian.publicKey;
  }

  init = () => {
    this.quorumService = new QuorumService(config.custodian.rpcURL);
    console.log('Custodian connected:', this.quorumService.web3.isConnected());
    if(this.props.contractAddress) {
      this.loadContract(this.props.contractAddress);
    }
  }

  loadContract = (address) => {
    this.quorumService.loadContract(address);    
    this.subscribeToNewTrades();
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

  viewTrade = ({ tradeID }) => {
    const trade = this.quorumService.getTradeByID(tradeID);
    console.log(trade);
  }

  getLastTradeID = () => {
    console.log(this.quorumService.getLastTradeID().toString(10));
  }
  
  componentWillMount() {
    this.init();
  }

  render() {
    return (
      <Card>
        <CardHeader
          title="Custodian"          
        />
        <CardContent>    
          <TradesList trades={this.state.trades} />
        </CardContent>
      </Card>
    );
  }
}

export default Custodian;
