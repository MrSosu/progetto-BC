
import { Link } from "react-router-dom";
import React, { Component } from 'react'
import Web3 from 'web3'

import CovidSupplyChain from "../CovidSupplyChain.json";

import './css/timeline.css';
import './css/tables.css';
import './css/App.css';

import * as utils from "./Utils.jsx";
import * as dashboard from "./Dashboard.jsx";

class CourierPage extends Component {
  // aggiungi al dizionario state quante piu informazioni vuoi

  constructor() 
  {
    super();
    this.batch_id=0;

    this.state = {
      account:"", 
      loaded:false,
      temp:0,
      size:64,
      history: {'ids':Array(),'status':Array(), 'sizes': Array(), 'temps':Array()}
    };

  }

  // qui ci si connette alla blockchain
  componentDidMount = async () => {
    try 
    {
      const web3 = new Web3(window.web3.currentProvider)
  
      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })

      const networkId = await web3.eth.net.getId();

      this.CovidSupplyChain = new web3.eth.Contract( 
        CovidSupplyChain.abi,
        CovidSupplyChain.networks[networkId] && CovidSupplyChain.networks[networkId].address 
      );
      
      const batch = await this.CovidSupplyChain.methods.getMyLastNBatch(3,this.state.account).call();
      this.state.history['ids'] = Array.from(batch[0]);
      this.state.history['status'] = Array.from(batch[1]);
      this.state.history['sizes'] = Array.from(batch[2]);
      this.state.history['temps'] = Array.from(batch[3]);

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

  onSubmitForm = async () => { 
    try{
      let result = await this.CovidSupplyChain.methods.updateStatus (this.batch_id).send({ from: this.state.account });
      console.log(result); 
    }
    catch{
      alert(utils.updateErrorMessage);
    }

  };

  onIdChange = (event) => {this.batch_id= event.target.value;}

  //qui si stampa l html dinamico usando anche le varibili dichiarate sopra
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