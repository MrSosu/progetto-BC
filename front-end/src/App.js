import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import CovidSupplyChain from "./CovidSupplyChain.json";


import { Routes, Route, Link } from "react-router-dom";

import CourierPage from './pages/Courier';
import FacilityPage from './pages/Facilities';
import HubPage from './pages/Hub';
import ManufacturerPage from './pages/Manufacturer';
import HomePage from './pages/Home';
import TestPage from './pages/test';


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
        <div class="navbar">
          <h1>Covid-19 Supply Chain</h1>
          <p>Account: {this.state.account}</p>
        </div>

          <Routes>
            <Route exact path="/" element={<HomePage/>}> </Route>         
            <Route exact path="/manufacturer" element={<ManufacturerPage/>} > </Route>   
            <Route exact path="/hub" element={<HubPage/>} > </Route>   
            <Route exact path="/facility" element={<FacilityPage/>}> </Route>   
            <Route exact path="/courier" element={<CourierPage/>} > </Route>
            <Route exact path="/test" element={<TestPage/>} > </Route>    
          </Routes>

      </div>

      
    );
  }

}

export default App;