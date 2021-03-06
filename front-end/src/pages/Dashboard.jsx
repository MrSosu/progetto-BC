// Dashboard for Courier, Facility, Hub, Manufaturer Page.
// Re-usable code.

// import css
import './css/timeline.css';
import './css/tables.css';
import './css/App.css';

// react router
import { Link } from "react-router-dom";

// other imports
import * as utils from "./Utils.jsx";


// generate the HTML dashboard when called
export function dashboard(history)  {
    return (
        <div>
            
        <br></br> <i class="material-icons" >account_circle </i> <br></br>

        <p id="table-title">History Dashboard</p>

        <table class="fl-table">
        <tbody>
          <tr>
            <th> Batch ID </th>
            <th> Batch Status </th>
            <th> Batch Temp° </th>
            <th> Batch Size </th>
            <th> Search </th>
          </tr>
          {history['ids'].map((id,index) => (
          <tr>
            <td> {utils.pad(id,8)} </td>
            <td> {utils.BatchStatus[history['status'][index]]} </td>
            <td> {history['temps'][index]} </td>
            <td> {history['sizes'][index]} </td>
            <td> <Link to="/scan" class="link"> &#128269;</Link> </td>
          </tr>
          ))}
        </tbody>
        </table>
        </div>
    );
};