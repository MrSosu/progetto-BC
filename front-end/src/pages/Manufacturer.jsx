//You have to use the link component to link between you pages 
import { Link } from "react-router-dom";
import React, { Component } from 'react'
import Web3 from 'web3'
import CovidSupplyChain from "../CovidSupplyChain.json";
import './timeline.css';

class ManufacturerPage extends Component {

  state = {account:"", loaded:false};
  // aggiungi al dizionario state quante piu informazioni vuoi

  constructor() 
  {
    super();
    this.res = {0:0,1:0};
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
      
      this.res = await this.CovidSupplyChain.methods.getTimeline(0).call();

      //console.log(this.res);

      this.setState({loaded:true});
    } 
    catch (error) 
    {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  }


  onSubmitForm = async () => {
    //console.log(this.actor_name,this.role);

    //chiamata in scrittura .send(indirizzo mittente) 
    let result = await this.CovidSupplyChain.methods.addBatch().send({ from: this.state.account });
    console.log(result); // in result trovi l evento emesso dal contratto

  };



  //qui si stampa l html dinamico usando anche le varibili dichiarate sopra
  render() {
    return (
      <div>

      <div class="titolo"> 
        <p>Manufacturer Landing Page </p> 
        <Link to="/" class="back">&#8592; Back to home</Link>
      </div>

      <div class="homepage"> 
        <div class="page-content">          
     
          manufacturer


            <p id="titolo" > Add batch:</p>
            <form onSubmit={this.formSubmit}>
              <button type="button" onClick={this.onSubmitForm}>Add Batch</button>
            </form>

            <br></br>
            <p id="titolo" >Last batch on chain is:</p>

            <ul>
              {Array.from(this.res[0]).map( item => { return <li>{item}</li>;})}
            </ul>

            <ul>
              {Array.from(this.res[1]).map( item => { return <li>{ new Date(item*1000).toUTCString() }</li>;})}
            </ul>

        </div>
      </div>
      
      </div>
    );
  }
  
}

export default ManufacturerPage;