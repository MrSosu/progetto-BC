// Main App page --> Dynamic top Navbar + React routes for multi-page layout.

// import reactj + web3
import React, { Component } from 'react';
import { Routes, Route } from "react-router-dom";
import Web3 from 'web3';
import * as utils from "./pages/Utils.jsx";

// import ABI 
import CovidSupplyChain from "./CovidSupplyChain.json";

// import other pages (components)
import CourierPage from './pages/Courier';
import FacilityPage from './pages/Facilities';
import HubPage from './pages/Hub';
import ManufacturerPage from './pages/Manufacturer';
import HomePage from './pages/Home';
import AdminPage from './pages/Admin';
import ScanPage from './pages/Scan';

// import css
import './pages/css/App.css'


class App extends Component {

  // Component constructor
  constructor() {
    super();
    this.state = {
      account:"",   // selected address from metamask
      loaded:false  // flag to show loaded page
    };
  }


  // Connection to the blockchain
  componentDidMount = async () => {
    try {
      const web3 = new Web3(window.web3.currentProvider)
      const accounts = await web3.eth.getAccounts()
      const networkId = await web3.eth.net.getId();

      this.CovidSupplyChain = new web3.eth.Contract( 
        CovidSupplyChain.abi,
        CovidSupplyChain.networks[networkId] && CovidSupplyChain.networks[networkId].address 
      );

      this.setState({ account: accounts[0] })
      this.setState({loaded:true});
      
    } catch (error) {
      alert(utils.errorMessage);
      console.error(error);
    }
  }


  // Render function
  render() {

    if (!this.state.loaded) {
      return <div>Connecting to the blockchain, please wait...</div>;
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