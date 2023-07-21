import { NavLink } from "react-router-dom";
import "../App.css"


export default function NotFound() {
  return (
    <>
    <div className="App">
        
    <h1>NotFound</h1>
    <NavLink style={{textDecoration: 'none' }} to="/home"> Navigate To Homescreen!</NavLink>
    </div>
    </>
  )
}
