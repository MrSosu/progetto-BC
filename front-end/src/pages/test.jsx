//You have to use the link component to link between you pages 
import { Link } from "react-router-dom";
import React, { Component } from 'react'
import Web3 from 'web3'
import CovidSupplyChain from "../CovidSupplyChain.json";

class TestPage extends Component {

  state = {account:"", loaded:false};

  constructor() 
  {
    super();

    this.actor = 1;
    this.actor_name = "";
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
      
      this.setState({loaded:true});
      
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }

  }

  onSubmitForm = async () => {
    console.log(this.actor_name,this.role);

    //chiamata in scrittura .send(indirizzo mittente) 
    let result = await this.CovidSupplyChain.methods.addActor(this.actor_name,this.role).send({ from: this.state.account });
    console.log(result); // in result trovi l evento emesso dal contratto
  };

  onActorChange = (event) => {this.role= event.target.value;}
  onNameChange = (event) => {this.actor_name= event.target.value;}

  getRole (num) 
  {
    if (num==0) {return "Manufacturer";}
    if (num==1) {return "Courier";}
    if (num==2) {return "National Storage Facility";}
    if (num==3) {return "Regional Storage Facility";}
    if (num==4) {return "Vaccination Hub";}
  }



  render() {
    return (
      <div>

        <div class="titolo"> 
          <p>Facility Landing Page </p> 
          <Link to="/" class="back"> Back to home</Link>
        </div>

        <div class="homepage"> 
        <div class="page-content">          

          <p id="titolo" > Add actor:</p>
            Your Name: <input type="text" name="cost" value={this.name} onChange={this.onNameChange}/> <br></br><br></br>


            <form onSubmit={this.formSubmit}>
              <input type="radio" value="0" name="actor" onChange={this.onActorChange}/> Manufacturer<br></br>
              <input type="radio" value="1" name="actor" onChange={this.onActorChange}/> Courier<br></br>
              <input type="radio" value="2" name="actor" onChange={this.onActorChange}/> National Storage Facility<br></br>
              <input type="radio" value="3" name="actor" onChange={this.onActorChange}/> Regional Storage Facility<br></br>
              <input type="radio" value="4" name="actor" onChange={this.onActorChange}/> Vaccination Hub<br></br>

              <button type="button" onClick={this.onSubmitForm}>Add Actor</button>
            </form>

            <br></br>
            <p id="titolo" >Your record on chain as actor is:</p>
            
            <p> Your Address:<b> {this.res[0]} </b><br></br>
            Your String Name: <b>{this.res[1]} </b><br></br>
            Your Role: <b>{this.getRole(this.res[2])}</b></p>
          
      
        </div>
        </div>

      </div>
   
    );
  }
}


export default TestPage;