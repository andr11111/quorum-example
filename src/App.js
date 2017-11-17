import React, { Component } from 'react';
import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { Provider } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import HedgeFund from './HedgeFund';
import Custodian from './Custodian';
import Client from './Client';
import config from './config';
import './App.css';


const rootReducer = combineReducers({
  form: formReducer
});

const store = createStore(rootReducer);


const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
  },
});

class App extends Component {

  constructor(props) {
    super(props);    
    this.state = { contractAddress: localStorage.contractAddress };
  }

  setContractAddress = (address) => {
    localStorage.contractAddress = address;
    this.setState({ contractAddress: localStorage.contractAddress });
  }

  render() {    
    return (      
        <Provider store={store}>
          <div className={this.props.classes.root}>
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <HedgeFund 
                  setContractAddress={this.setContractAddress} 
                  contractAddress={this.state.contractAddress} 
                  rpcURL={config.hedgeFund.rpcURL} />
              </Grid>
              <Grid item xs={6}>
                <Custodian 
                  contractAddress={this.state.contractAddress} 
                  rpcURL={config.custodian.rpcURL} />
              </Grid>
              <Grid item xs={6}>
                <Client
                  title='Client 1'
                  contractAddress={this.state.contractAddress} 
                  rpcURL={config.client1.rpcURL} />
              </Grid>
              <Grid item xs={6}>
                <Client 
                  title='Client 2'
                  contractAddress={this.state.contractAddress} 
                  rpcURL={config.client2.rpcURL} />
              </Grid>
            </Grid>
          </div>       
        </Provider>      
    );
  }
}

export default withStyles(styles)(App);
