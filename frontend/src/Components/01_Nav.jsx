import React from "react";
import { Link } from "react-router-dom"; //first install it in terminal -> npm install react-router-dom -> then only it'll render on the screen.

export const Nav = () => {
    return (
        <div>
            <ul className="my-nav">
                <li><Link to="/">Home</Link></li> 
                <li><Link to="/01b_Services">Services</Link></li>
                <li><Link to="/01c_About">About</Link></li> 
                {/* now this means this is added in the navlist. now to make it  so that on clicking it we reach the actual "about" page- we put it in route of the app.jsx */}
                <li><Link to="/01d_Contact">Contact</Link></li>
                <li><Link to="/01e_Help">Help</Link></li>
            </ul>
        </div>
    )
}

{/* 
    <Link to="/">Home</Link> -> means go to home page when clicked on this link . to="" expects a url link not file path. 

    whatever u have put in to="" that exact thing to be put in path="" inside the route at the app.jsx

    //at link to="/" - when the pg first renders it sees already the route to be / so immediately renders.
    if i put the exact address then only on clicking it - when the url has this 01a_home then only it will open
*/}