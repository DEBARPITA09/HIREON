import Navbar from "../components/Navbar";

function Profile(){

  const user=JSON.parse(localStorage.getItem("user"));

  return(

    <div>

      <Navbar/>

      <div style={{padding:"40px"}}>

        <h2>Profile</h2>

        <p>Name: {user?.username}</p>

        <p>Email: {user?.email}</p>

        <p>LinkedIn: {user?.linkedin}</p>

      </div>

    </div>

  )
}

export default Profile;
