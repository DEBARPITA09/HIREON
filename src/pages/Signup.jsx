import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Signup(){

const navigate = useNavigate();

const [data,setData]=useState({
username:"",
password:"",
confirm:"",
email:"",
linkedin:""
});

function handleSignup(){

if(data.password!==data.confirm){
alert("Passwords do not match");
return;
}

localStorage.setItem("user",JSON.stringify(data));

alert("Signup successful");

navigate("/login");
}

return(

<div className="auth-container">

<div className="auth-box">

<h2>Signup</h2>

<input placeholder="Username"
onChange={(e)=>setData({...data,username:e.target.value})}/>

<input placeholder="Password" type="password"
onChange={(e)=>setData({...data,password:e.target.value})}/>

<input placeholder="Confirm Password" type="password"
onChange={(e)=>setData({...data,confirm:e.target.value})}/>

<input placeholder="Email"
onChange={(e)=>setData({...data,email:e.target.value})}/>

<input placeholder="LinkedIn URL"
onChange={(e)=>setData({...data,linkedin:e.target.value})}/>

<button onClick={handleSignup}>Signup</button>

</div>

</div>

);
}

export default Signup;
