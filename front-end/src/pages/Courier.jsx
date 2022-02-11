//You have to use the link component to link between you pages 
import { Link } from "react-router-dom";
import React, { Component } from 'react'
import Web3 from 'web3'
import CovidSupplyChain from "../CovidSupplyChain.json";


class CourierPage extends Component {

  state = {account:"", loaded:false};
  // aggiungi al dizionario state quante piu informazioni vuoi

  constructor() 
  {
    super();
    this.batch_id=0;
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

  onSubmitForm = async () => {
    //console.log(this.actor_name,this.role);

    //chiamata in scrittura .send(indirizzo mittente) 
    let result = await this.CovidSupplyChain.methods.updateStatus (this.batch_id).send({ from: this.state.account });
    console.log(result); // in result trovi l evento emesso dal contratto

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
          
        <p id="titolo" > Add batch:</p>

            Your Name: <input type="text" name="cost"  onChange={this.onIdChange}/> <br></br><br></br>

            <form onSubmit={this.formSubmit}>
              <button type="button" onClick={this.onSubmitForm}>Set to DELIVER_INTERNATIONAL</button>
            </form>


        </div>
      </div>

      </div>      
   
    );
  }
  
}

export default CourierPage;