//You have to use the link component to link between you pages 
import { Link } from "react-router-dom";
import React, { Component } from 'react'
import Web3 from 'web3'
import CovidSupplyChain from "../CovidSupplyChain.json";


class HubPage extends Component {

  state = {account:"", loaded:false};
  // aggiungi al dizionario state quante piu informazioni vuoi

  constructor() 
  {
    super();

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


  //qui si stampa l html dinamico usando anche le varibili dichiarate sopra
  render() {
    return (
      <div>

        <div class="titolo"> 
          <p>Vaccine Hub Landing Page </p> 
          <Link to="/" class="back"> Back to home</Link>
        </div>

        <div class="homepage"> 
          <div class="page-content">          
            content
          </div>
        </div>

    </div>
   
    );
  }
  
}

export default HubPage;