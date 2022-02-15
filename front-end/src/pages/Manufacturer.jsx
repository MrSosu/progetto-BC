// Manufacturer landing Page

// import reactj + web3
import { Link } from "react-router-dom";
import React, { Component } from 'react'
import Web3 from 'web3'

// import ABI 
import CovidSupplyChain from "../CovidSupplyChain.json";

// import css
import './css/timeline.css';
import './css/tables.css';
import './css/App.css';

// other imports
import * as utils from "./Utils.jsx";
import * as dashboard from "./Dashboard.jsx";



class ManufacturerPage extends Component {

  // component constructor
  constructor() 
  {
    super();
    this.state = {
      account:"",       // selected address from metamask
      loaded:false ,    // flag to show loaded page
      temp:0,           // temperature field of the form
      size:64,          // size field of the form
      history: {        // history for dashboard
        'ids':Array(),
        'status':Array(), 
        'sizes': Array(), 
        'temps':Array()}
    };

  }


  // Connection to the blockchain
  componentDidMount = async () => {
    try {
      const web3 = new Web3(window.web3.currentProvider)
      const networkId = await web3.eth.net.getId();
      const accounts = await web3.eth.getAccounts()

      this.setState({ account: accounts[0] })

      this.CovidSupplyChain = new web3.eth.Contract( 
        CovidSupplyChain.abi,
        CovidSupplyChain.networks[networkId] && CovidSupplyChain.networks[networkId].address 
      );
      
      // retrieve data for dashboard, no gas price it is read-only
      const batch = await this.CovidSupplyChain.methods.getMyLastNBatch(3, this.state.account).call();
      this.state.history['ids'] = Array.from(batch[0]);
      this.state.history['status'] = Array.from(batch[1]);
      this.state.history['sizes'] = Array.from(batch[2]);
      this.state.history['temps'] = Array.from(batch[3]);

      // Actor check, before page show up
      const res = await this.CovidSupplyChain.methods.getActor(this.state.account).call();
      if ((res[2] != 0)) { throw "You are not a Manufacturer!"; }

      this.setState({loaded:true});

    } catch (error) {
      alert(utils.errorMessage);
      console.error(error);
      document.location.href="/";
    }
  }


  // Query Form functions 
  onTempChange = (event) => {this.state.temp = event.target.value;}
  onSizeChange = (event) => {this.state.size = event.target.value;}

  onSubmitForm = async () => {
    try 
    {
      let result = await this.CovidSupplyChain.methods.addBatch(this.state.temp,this.state.size).send({ from: this.state.account });
      console.log(result); 
      alert(utils.okMessage);
    } 
    catch { alert(utils.addErrorMessage); }
  };


  // Render function
  render() {
    return (
      <div>

      <div class="titolo"> 
        <p>Manufacturer Landing Page </p> 
        <Link to="/" class="back">&#8592; Back to home</Link>
      </div>

      <div class="homepage"> 
        <div class="page-content">    

          { dashboard.dashboard(this.state.history) }

          <div class="action">
              <p id="table-title"> Add New Vaccine Batch</p>
              <center><p class="action-subtitle">(IDs are automatically generated by the system.)</p></center>

              <form onSubmit={this.formSubmit}>
                <input type="text" name="cost"  id="small-tf" placeholder="Insert Temperature"  onChange={this.onTempChange} />
                <input type="text" name="cost" id="small-tf"  placeholder="Insert Batch Size"  onChange={this.onSizeChange} />
                <button  class="button" type="button" onClick={this.onSubmitForm}>+</button>
              </form>

              <br></br>
          </div>

        </div>
      </div>
      
      </div>
    );
  }
  
}

export default ManufacturerPage;