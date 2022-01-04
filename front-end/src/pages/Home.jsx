//You have to use the link component to link between you pages 
import { Link } from "react-router-dom";
import './pages.css'
import '../App.css'

const HomePage = () => {
  return (
    <div >
        <div class="titolo"> <p> Home page </p> </div>
        <div class="homepage"> 

        <div class="row">
          <div class="column">
            <div class="card">
              <i class="material-icons" >local_shipping</i><br></br>
              <Link to="/courier" class="link">Courier Section</Link>
            </div>
          </div>
          <div class="column">
            <div class="card">
            <i class="material-icons" >warehouse</i><br></br>
            <Link to="/facility"  class="link">Facilities Section</Link></div>
          </div>
          <div class="column">
            <div class="card">
            <i class="material-icons" >local_hospital</i><br></br>
            <Link to="/hub"  class="link" >Vaccine Hub Section</Link></div>
          </div>
          <div class="column">
            <div class="card"> 
            <i class="material-icons" >factory</i><br></br>
            <Link to="/manufacturer"  class="link" >Manufacturer Section</Link></div>
          </div>
          <div class="column">
            <div class="card"> 
            <i class="material-icons" >manage_search</i><br></br>
            <Link to="/manufacturer"  class="link" >Scan Section</Link></div>
          </div>
          <div class="column">
            <div class="card"> 
            <i class="material-icons" >settings</i><br></br>
            <Link to="/test"  class="link" >Test page</Link></div>
          </div>
        </div> 

          
        </div>
    </div>
  );
};

export default HomePage;