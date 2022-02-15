// Administration Landing page

// import reactj + web3
import { Link} from "react-router-dom";
import React, { Component } from 'react'
import Web3 from 'web3'

// import ABI
import CovidSupplyChain from "../CovidSupplyChain.json";

// import css
import './css/timeline.css';
import './css/tables.css';
import './css/App.css';

// other import 
import * as utils from "./Utils.jsx";


class AdminPage extends Component {

  // component constructor
  constructor() 
  {
    super();

    this.state = {
      account:"", 
      loaded:false,
      actor:0,
      actor_name :"",
      address:"",
    };
  }


  // Connection to the blockchain
  componentDidMount = async () => {
    try {
      const web3 = new Web3(window.web3.currentProvider)
      const networkId = await web3.eth.net.getId();
      const accounts = await web3.eth.getAccounts()

      this.setState({ account: accounts[0] });

      this.CovidSupplyChain = new web3.eth.Contract( 
        CovidSupplyChain.abi,
        CovidSupplyChain.networks[networkId] && CovidSupplyChain.networks[networkId].address 
      );

      // Actor check, before page show up
      const res = await this.CovidSupplyChain.methods.getActor(this.state.account).call();
      if (res[2] != 5) { throw "You are not an admin!"; }

      this.setState({loaded:true});
      
    } catch (error) {
      alert(utils.errorMessage);
      console.error(error);
      document.location.href="/";
    }
  }


  // Query Form functions 
  onActorChange = (event) => {this.state.role= event.target.value;}
  onNameChange = (event) => {this.state.actor_name= event.target.value;}
  onAddressChange = (event) => {this.state.address= event.target.value;}

  onSubmitForm = async () => {
    try
    {
      let result = await this.CovidSupplyChain.methods.addActor(this.state.address, this.state.actor_name,this.state.role).send({ from: this.state.account });
      console.log(result); 
      alert(utils.okMessage);
    }
    catch{ alert(utils.addErrorMessage); }
  };


  // Render function
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