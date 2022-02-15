// Courier Landing Page

// import react + web3
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


class CourierPage extends Component {

  // component constructor
  constructor() 
  {
    super();

    this.batch_id = 0;    // field of the form

    this.state = {
      account:"",         // selected address from metamask
      loaded:false,       // flag to show loaded page
      history: {          // history for dashboard
        'ids':Array(),
        'status':Array(), 
        'sizes': Array(), 
        'temps':Array()
      }
    };
  }


  // connection to the blockchain
  componentDidMount = async () => {
    try 
    {
      const web3 = new Web3(window.web3.currentProvider)
      const networkId = await web3.eth.net.getId();
      const accounts = await web3.eth.getAccounts()

      this.setState({ account: accounts[0] })

      this.CovidSupplyChain = new web3.eth.Contract( 
        CovidSupplyChain.abi,
        CovidSupplyChain.networks[networkId] && CovidSupplyChain.networks[networkId].address 
      );
      
      // retrieve data for dashboard, no gas price it is read-only
      const batch = await this.CovidSupplyChain.methods.getMyLastNBatch(3,this.state.account).call();
      this.state.history['ids'] = Array.from(batch[0]);
      this.state.history['status'] = Array.from(batch[1]);
      this.state.history['sizes'] = Array.from(batch[2]);
      this.state.history['temps'] = Array.from(batch[3]);

      // Actor check, before page show up
      const res = await this.CovidSupplyChain.methods.getActor(this.state.account).call();
      if (res[2] != 1) { throw "You are not an Courier!"; }

      this.setState({loaded:true});
    } 
    catch (error) 
    {
      alert(utils.errorMessage);
      console.error(error);
      document.location.href="/";
    }
  }


  // Query Form functions 
  onIdChange = (event) => {this.batch_id= event.target.value;}

  onSubmitForm = async () => { 
    try
    {
      let result = await this.CovidSupplyChain.methods.updateStatus (this.batch_id).send({ from: this.state.account });
      console.log(result); 
      alert(utils.okMessage);
    }
    catch{ alert(utils.updateErrorMessage); }
  };



  // Render function
  render() {
    return (
      <div>

      <div class="titolo"> 
        <p>Courier Landing Page </p> 
        <Link to="/" class="back"> Back to home</Link>
      </div>

      <div class="homepage"> 
        <div class="page-content">          
          
          { dashboard.dashboard(this.state.history) }

          <div class="action">
              <p id="table-title"> Update Batch Status</p>
              <center><p class="action-subtitle">(New status is automatically understood by the system.)</p></center>

              <form onSubmit={this.formSubmit}>
                <input type="text" name="cost"  id="small-tf" placeholder="Insert Batch Id.." onChange={this.onIdChange}/>
                <button  class="button" type="button" onClick={this.onSubmitForm}>Update</button>
              </form>

              <br></br>
          </div>

        </div>
      </div>

      </div>      
   
    );
  }
  
}

export default CourierPage;