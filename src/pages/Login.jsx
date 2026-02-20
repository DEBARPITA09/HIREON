import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Login(){

const navigate=useNavigate();

const [username,setUsername]=useState("");
const [password,setPassword]=useState("");

function handleLogin(){

const user=JSON.parse(localStorage.getItem("user"));

if(!user){
alert("No account found");
return;
}

if(user.username===username && user.password===password){

navigate("/linkedin-analysis");

}
else{
alert("Invalid credentials");
}

}

return(

<div className="auth-container">

<div className="auth-box">

<h2>Login</h2>

<input placeholder="Username"
onChange={(e)=>setUsername(e.target.value)}/>

<input placeholder="Password" type="password"
onChange={(e)=>setPassword(e.target.value)}/>

<button onClick={handleLogin}>Login</button>

<p onClick={()=>navigate("/forgot")} style={{cursor:"pointer",color:"blue"}}>
Forgot Password?
</p>

</div>

</div>

);
}

export default Login;
