// Scan page to retrieve timeline info about a vaccine batch

// import reactj + web3
import { Link } from "react-router-dom";
import React, { Component } from 'react'
import Web3 from 'web3'
import * as utils from "./Utils.jsx";

// import ABI 
import CovidSupplyChain from "../CovidSupplyChain.json";

// import css
import './css/timeline.css';


class ScanPage extends Component {

  // component constructor
  constructor() 
  {
    super();

    this.state = {
        account:"",       // selected address from metamask
        loaded:false ,    // flag to show loaded page
        res : {           // query result
          'size':0,
          'temp':0,
          'address':Array(),
          'dates':Array(),
          'names':Array(),
          'roles':Array()},  
        batch_id : -1,    // Entered batch ID
    };

  }

  
  // Connection to the blockchain
  componentDidMount = async () => {
    try {
      const web3 = new Web3(window.web3.currentProvider)
      const networkId = await web3.eth.net.getId();
      const accounts = await web3.eth.getAccounts()

      this.CovidSupplyChain = new web3.eth.Contract( 
        CovidSupplyChain.abi,
        CovidSupplyChain.networks[networkId] && CovidSupplyChain.networks[networkId].address 
      );

      this.setState({ account: accounts[0] })
      this.setState({loaded:true});

    } catch (error) {
      alert(utils.errorMessage);
      console.error(error);
      document.location.href="/";
    }
  }


  // Query Form functions
  onIdChange = (event) => { this.setState({batch_id: event.target.value}); }

  onSubmitForm = async (event) => {
    try {
      let res =  await this.CovidSupplyChain.methods.getTimeline(this.state.batch_id).call();

      this.state.res['size'] = res[0];
      this.state.res['temp'] = res[1];
      this.state.res['address'] = Array.from(res[2]);
      this.state.res['dates'] = Array.from(res[3]);
      this.state.res['names'] = Array.from(res[4]);
      this.state.res['roles'] = Array.from(res[5]);

      this.setState({batch_id:this.state.batch_id});
    }catch {
      // if batch id does not exist on chain..
      alert(utils.notFoundMessage);
    }
  
    // Scroll to the result
    document.getElementById('timeline').scrollIntoView();
    // Do not reload the page after form submission
    event.preventDefault();
    
  };


  // Render function
  render() {
    return (
      <div>

      <div class="titolo"> 
        <p>Scan Landing Page </p> 
        <Link to="/" class="back">&#8592; Back to home</Link>
      </div>

      <div class="homepage"> 
        <div class="page-content">          

          <div class="search_timeline">
            <div class="vertical-center">

              <h1>Search on the Supply Chain</h1>
              <img class="globeimg" src="http://localhost:3000/images/w4.gif"></img>

              <form onSubmit={this.onSubmitForm} >
                <input type="text" name="cost" placeholder="Insert batch id" onChange={this.onIdChange} />
                <button class="button" type="button" onClick={this.onSubmitForm} >&#128269; Scan Batch</button>
              </form>

            </div>
          </div>

          <div id="timeline" class="timeline_title">
            <h2>Vaccine Batch Timeline </h2> 
            <p> ID: {this.state.batch_id}  <br></br> 
                Size: {this.state.res[0]}  <br></br>
                Temp: {this.state.res[1]}  </p>
          </div>

          <div class="timeline">

            {/* for each entry obtained from query result on chain */}
            { this.state.res['address'].map( (item,index) => { 

                  {/* Left - Right visual style, a timeline card is generated for each status update */}
                  return (index % 2 == 0) ? 

                      <div class="container_time left">
                          <div class="content">
                              <center> <h3> {utils.BatchStatus[index]} </h3> </center>
                              <p>
                                  <b>Name:</b> {this.state.res['names'][index]} <br></br>
                                  <b>Role:</b> {utils.ActorRoles[this.state.res['roles'][index]]} <br></br>
                                  <b>Address:</b> {item} <br></br> 
                                  <b>Timestamp:</b> {new Date(this.state.res['dates'][index]*1000).toUTCString()}
                              </p>
                          </div>
                      </div>

                      : <div class="container_time right">
                          <div class="content">
                              <center> <h3> {utils.BatchStatus[index]} </h3> </center>
                              <p> 
                                  <b>Name:</b> {this.state.res['names'][index]} <br></br>
                                  <b>Role:</b> {utils.ActorRoles[this.state.res['roles'][index]]} <br></br>
                                  <b>Address:</b> {item} <br></br> 
                                  <b>Timestamp:</b> {new Date(this.state.res['dates'][index]*1000).toUTCString()}
                              </p>
                          </div>
                      </div> ;
            })}

          </div>

        </div>
      </div>

      </div>
    );
  }
  
};

export default ScanPage;