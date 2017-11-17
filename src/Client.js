import React, { Component } from 'react';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import TradesList from './TradesList';
import QuorumService from './services/QuorumService';

class Client extends Component {  

  constructor(props) {
    super(props);
    this.rpcURL = props.rpcURL;
    this.state = {      
      trades: []
    };
  }

  init = () => {
    this.quorumService = new QuorumService(this.rpcURL);
    console.log('Client connected:', this.quorumService.web3.isConnected());
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
          title={this.props.title || 'Client'}
        />
        <CardContent>
          <TradesList trades={this.state.trades} />        
        </CardContent>
      </Card>      
    );
  }
}

export default Client;
