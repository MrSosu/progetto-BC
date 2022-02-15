// Home page

// import reactj + web3
import React, { Component } from 'react'
import { Link } from "react-router-dom";
import Web3 from 'web3'

// import ABI
import CovidSupplyChain from "../CovidSupplyChain.json";

// import css
import './css/pages.css'
import './css/App.css'

// other imports
import * as utils from "./Utils.jsx";



class HomePage extends Component {

  // component constructor
  constructor() 
  {
    super();

    this.batch_id = 0;  // batch id of the form

    this.state = {
      account:"",       // selected address from metamask
      loaded:false,     // flag to show loaded page
      actor:[-1,-1,-1]  // actor fields (address,name,role) to enable links
    };
  }

  // connection to the blockchain
  componentDidMount = async () => {
    try 
    {
      const web3 = new Web3(window.web3.currentProvider)
      const networkId = await web3.eth.net.getId();
      const accounts = await web3.eth.getAccounts()

      this.CovidSupplyChain = new web3.eth.Contract( 
        CovidSupplyChain.abi,
        CovidSupplyChain.networks[networkId] && CovidSupplyChain.networks[networkId].address 
      );

      this.setState({ account: accounts[0] })
      this.state.actor = await this.CovidSupplyChain.methods.getActor(this.state.account).call();
      
      this.setState({loaded:true});
    } 
    catch (error) 
    {
      alert(utils.errorMessage);
      console.error(error);
      document.location.href="/";
    }
  }

  

  // Render function
  render() {
    return (
    <div >
        <div class="titolo"> <p> Home page </p> </div>

        <div class="homepage"> 

          <div class="row">

            <div class="column">
              <div class="card">
                <i class="material-icons" >local_shipping</i> <br></br>
                { (this.state.actor[2]==1) ? <Link to="/courier" class="link">Courier Section</Link> : <Link to="" class="link_none">Courier Section</Link> }
              </div>
            </div>

            <div class="column">
              <div class="card">
                <i class="material-icons" >warehouse</i> <br></br>
                { (this.state.actor[2]==2 || this.state.actor[2]==3 ) ? <Link to="/facility" class="link">Facilities Section</Link> : <Link to="" class="link_none">Facilities Section</Link> }
              </div>
            </div>

            <div class="column">
              <div class="card">
                <i class="material-icons" >local_hospital</i><br></br>
                { (this.state.actor[2]==4 ) ? <Link to="/hub" class="link">Vaccine Hub Section</Link> : <Link to="" class="link_none">Vaccine Hub Section</Link> }
              </div>
            </div>

            <div class="column">
              <div class="card"> 
                <i class="material-icons" >factory</i><br></br>
                { (this.state.actor[2]==0 ) ? <Link to="/manufacturer" class="link">Manufacturer Section</Link> : <Link to="" class="link_none">Manufacturer Section</Link> }
              </div>
            </div>

            <div class="column">
              <div class="card"> 
                <i class="material-icons" >manage_search</i><br></br>
                <Link to="/scan"  class="link" >Scan Section</Link>
              </div>
            </div>

            <div class="column">
              <div class="card"> 
                <i class="material-icons" >settings</i><br></br>
                { (this.state.actor[2]==5 ) ? <Link to="/admin" class="link">Administration</Link> : <Link to="" class="link_none">Administration</Link> }
              </div>
            </div>

          </div> 
        </div>

    </div>
  );}

}

export default HomePage;