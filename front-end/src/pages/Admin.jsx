//You have to use the link component to link between you pages 
import { Link} from "react-router-dom";
import React, { Component } from 'react'
import Web3 from 'web3'
import CovidSupplyChain from "../CovidSupplyChain.json";
import * as utils from "./Utils.jsx";

import './css/timeline.css';
import './css/tables.css';
import './css/App.css';


class AdminPage extends Component {

  state = {account:"", loaded:false};

  constructor() 
  {
    super();

    this.actor = 1;
    this.actor_name = "";
    this.address ="";
    this.res = {0:0,1:0,2:0};
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

      //chiamata in lettura .call()
      this.res = await this.CovidSupplyChain.methods.getActor(this.state.account).call();
      console.log(this.res);
      if (this.res[2] != 5) { throw "You are not an admin!"; }

      this.setState({loaded:true});
      
    } catch (error) {
      alert(`An error has occured while connecting to the blockchain. Check console for details.`);
      console.error(error);
      document.location.href="/";
    }

  }

  onSubmitForm = async () => {
    console.log(this.actor_name,this.role,this.address);

    //chiamata in scrittura .send(indirizzo mittente) 
    let result = await this.CovidSupplyChain.methods.addActor(this.address, this.actor_name,this.role).send({ from: this.state.account });
    console.log(result); // in result trovi l evento emesso dal contratto
  };

  onActorChange = (event) => {this.role= event.target.value;}
  onNameChange = (event) => {this.actor_name= event.target.value;}
  onAddressChange = (event) => {this.address= event.target.value;}




  render() {
    return (
      <div>

        <div className="titolo"> 
          <p>Admin Landing Page </p> 
          <Link to="/" className="back"> Back to home</Link>
        </div>

        <div className="homepage"> 
        <div className="page-content">          

          <div class="action">
                <p id="table-title"> Add a new actor</p>
                <center><p class="action-subtitle">(If an actor already exist you will update its record on chain.)</p></center>

                <form onSubmit={this.formSubmit}>

                <input type="text" name="cost" placeholder="Insert Actor Address" onChange={this.onAddressChange}/>
                <input type="text" name="cost" placeholder="Insert Actor String Name"  onChange={this.onNameChange}/>

                  <select onChange={this.onActorChange}>
                    <option value="0">Manufacturer</option>
                    <option value="1">Courier</option>
                    <option value="2">National Storage Facility</option>
                    <option value="3">Regional Storage Facility</option>
                    <option value="4">Vaccination Hub</option>
                    <option value="5">Administrator</option>
                  </select>


                <button type="button"class="bigbutton"  onClick={this.onSubmitForm}>Add Actor</button>

                </form>
                <br></br>
          </div>

          
      
        </div>
        </div>

      </div>
   
    );
  }
}


export default AdminPage;