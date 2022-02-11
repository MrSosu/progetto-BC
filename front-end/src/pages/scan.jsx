//You have to use the link component to link between you pages 
import { Link } from "react-router-dom";
import React, { Component } from 'react'
import Web3 from 'web3'
import CovidSupplyChain from "../CovidSupplyChain.json";
import './timeline.css';

class ScanPage extends Component {

  state = {account:"", loaded:false};
  // aggiungi al dizionario state quante piu informazioni vuoi

  constructor() 
  {
    super();
    //this.res = {0:0,1:0};
    //this.batch_id=0;
    this.state = {
        res : {0:0,1:0},
        batch_id : 0,
    };
    //altre campi (variabili globali) vanno inserite qui sotto

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
      
      this.setState({loaded:true});
    } 
    catch (error) 
    {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  }

  zip = (a, b) => a.map((k, i) => [k, b[i]]);

  onIdChange = (event) => { this.setState({batch_id: event.target.value}); }

  onSubmitForm = async (event) => {
    //console.log(this.actor_name,this.role);

    this.setState( {res: await this.CovidSupplyChain.methods.getTimeline(this.state.batch_id).call()} );
    console.log(this.state.res); 
    event.preventDefault();
  };


  //qui si stampa l html dinamico usando anche le varibili dichiarate sopra
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

            <form onSubmit={this.formSubmit} >
                <input type="text" name="cost" placeholder="Insert batch id" value={this.batch_id} onChange={this.onIdChange} />
                <button class="button" type="button" onClick={this.onSubmitForm} >&#128269; Scan Batch</button>
            </form>

            </div>
        </div>

        <div class="timeline_title">

              <h2>Vaccine Batch Timeline </h2> 
              <p>ID: {this.state.batch_id} <br></br> Size: Unknown </p>
        </div>

        <div class="timeline">

          {this.zip( Array.from(this.state.res[0]), Array.from(this.state.res[1]) ).map( (item,index) => { 

                return (index % 2 == 0) ? 
                    <div class="container_time left">
                        <div class="content">
                            <center><h3>Status</h3></center>
                            <p ><b>Actor:</b> {item[0]} <br></br> <b>Timestamp:</b> {new Date(item[1]*1000).toUTCString()}</p>
                        </div>
                    </div>
                    : <div class="container_time right">
                        <div class="content">
                            <center><h3>Status</h3></center>
                            <p ><b>Actor:</b> {item[0]} <br></br> <b>Timestamp:</b> {new Date(item[1]*1000).toUTCString()}</p>
                        </div>
                    </div> ;
          })}

        </div>


        </div>
      </div>

      </div>
    );
  }
  
}

export default ScanPage;