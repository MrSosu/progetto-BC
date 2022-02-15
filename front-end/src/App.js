import React, { Component } from 'react'
import Web3 from 'web3'
import './pages/css/App.css'
import CovidSupplyChain from "./CovidSupplyChain.json";


import { Routes, Route, Link } from "react-router-dom";

import CourierPage from './pages/Courier';
import FacilityPage from './pages/Facilities';
import HubPage from './pages/Hub';
import ManufacturerPage from './pages/Manufacturer';
import HomePage from './pages/Home';
import AdminPage from './pages/Admin';
import ScanPage from './pages/Scan';

class App extends Component {

  state = {account:"", loaded:false};

  constructor() {
    super();
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


  render() {

    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (


      <div className="container">
        <div className="navbar">
          <h1>Covid-19 Supply Chain</h1>
          <p>Account: {this.state.account}</p>
        </div>

          <Routes>
            <Route exact path="/" element={<HomePage/>}> </Route>         
            <Route exact path="/manufacturer" element={<ManufacturerPage/>} > </Route>   
            <Route exact path="/hub" element={<HubPage/>} > </Route>   
            <Route exact path="/facility" element={<FacilityPage/>}> </Route>   
            <Route exact path="/courier" element={<CourierPage/>} > </Route>
            <Route exact path="/scan" element={<ScanPage/>} > </Route>
            <Route exact path="/admin" element={<AdminPage/>} > </Route>    
          </Routes>

      </div>

      
    );
  }

}

export default App;