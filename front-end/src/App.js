import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'

import CovidSupplyChain from "./CovidSupplyChain.json";


class App extends Component {

  state = {account:"", loaded:false, value:-99, new_value:-99};

  componentDidMount = async () => {

    try {
      const web3 = new Web3("http://localhost:7545")
      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })

      const networkId = await web3.eth.net.getId();

      this.CovidSupplyChain = new web3.eth.Contract( 
        CovidSupplyChain.abi,
        CovidSupplyChain.networks[networkId] && CovidSupplyChain.networks[networkId].address 
      );

      const x = await this.CovidSupplyChain.methods.retrieve().call();
      this.setState({value:x});
      this.setState({loaded:true});
      
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }

  }


  handleSubmit = async () => {
    const { account, loaded, value, new_value } = this.state;
    let result = await this.CovidSupplyChain.methods.store(new_value).send({ from: this.state.account });
    console.log(result);
  };

  handleInputChange = (event) => {
    this.setState({ new_value: event.target.value });
  }


  render() {

    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="container">

        <h1>Covid-19 Supply Chain</h1>
        <p>Selected Account: {this.state.account}</p>
        <p>Value on chain is {this.state.value}</p>

        New Value to store: <input type="text" name="cost" value={this.state.new_value} onChange={this.handleInputChange} />
        <button type="button" onClick={this.handleSubmit}>Modify Value</button>

      </div>
    );
  }

}

export default App;