import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import CovidSupplyChain from "./CovidSupplyChain.json";


class App extends Component {

  state = {account:"", loaded:false};

  constructor() {
    super();

    this.actor = 1;
    this.actor_name = "";

    this.onActorChange = this.onActorChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  componentDidMount = async () => {

    try {
      const web3 = new Web3(window.web3.currentProvider)
  
      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })
      const networkId = await web3.eth.net.getId();

      this.CovidSupplyChain = new web3.eth.Contract( 
        CovidSupplyChain.abi,
        CovidSupplyChain.networks[networkId] && CovidSupplyChain.networks[networkId].address 
      );

      this.res = await this.CovidSupplyChain.methods.getActor(this.state.account).call();
     
      this.setState({loaded:true});
      
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }

  }


  onSubmitForm = async () => {
    console.log(this.actor_name,this.role);
    let result = await this.CovidSupplyChain.methods.addActor(this.actor_name,this.role).send({ from: this.state.account });
    console.log(result);
  };

  onActorChange = (event) => {this.role= event.target.value;}
  onNameChange = (event) => {this.actor_name= event.target.value;}

  getRole( num) {
    if (num==0) {return "Manufacturer";}
    if (num==1) {return "Courier";}
    if (num==2) {return "National Storage Facility";}
    if (num==3) {return "Regional Storage Facility";}
    if (num==4) {return "Vaccination Hub";}
  }

  render() {

    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div class="container">
        <h1>Covid-19 Supply Chain</h1>
        <p>Selected Account: {this.state.account}</p>

        <p id="titolo" > Add actor:</p>
        Your Name: <input type="text" name="cost" value={this.name} onChange={this.onNameChange}/> <br></br><br></br>


        <form onSubmit={this.formSubmit}>
          <input type="radio" value="0" name="actor" onChange={this.onActorChange}/> Manufacturer<br></br>
          <input type="radio" value="1" name="actor" onChange={this.onActorChange}/> Courier<br></br>
          <input type="radio" value="2" name="actor" onChange={this.onActorChange}/> National Storage Facility<br></br>
          <input type="radio" value="3" name="actor" onChange={this.onActorChange}/> Regional Storage Facility<br></br>
          <input type="radio" value="4" name="actor" onChange={this.onActorChange}/> Vaccination Hub<br></br>

          <button type="button" onClick={this.onSubmitForm}>Add Actor</button>
        </form>

        <br></br>
        <p id="titolo" >Your record on chain as actor is:</p>
        <p> Your Address:<b> {this.res[0]} </b><br></br>
        Your String Name: <b>{this.res[1]} </b><br></br>
        Your Role: <b>{this.getRole(this.res[2])}</b></p>

      </div>
    );
  }

}

export default App;