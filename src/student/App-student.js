import { React,useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import defaultImage from './logo.png'; // Import your default image
import CompanyList from './student-company';

function App() {
  const navigate = useNavigate();
  const [username,setusername]=useState("");
  const [profile,setProfile]=useState(defaultImage);
  const [data,setdata]=useState(false);
  const person = localStorage.getItem("user");
  const [ne,setne]=useState(false);
  // eslint-disable-next-line no-unused-vars
  var person2="";
  useEffect(() => {
    if (person) {
      const parts = person.split("+");
      const person2 = parts[1];
      setusername(person2); // Only set username when person data is available
    }
  }, [person]);
  useEffect(() => {
    const get_data = async () => {
      try {
        const response = await fetch(`https://backend-jazee.onrender.com/student/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        if (response.ok) {
          
            if(result.message.profile){
          // Assuming 'profile' is part of the result message and needs to be updated.
          result.message.profile = '/uploads/images/' + result.message.profile;
          setProfile(result.message.profile);
          setdata(true);
          setne(true);
        }
          else
          {
            setProfile(defaultImage);
          }
          
        } else {
          alert("internal error");
          console.log(result.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    get_data();
  }, [username]);
  

const logouthandler=()=>
{
  if (window.confirm("Are you sure you want to logout?"))
     {
    localStorage.removeItem("user");
    navigate("/login");
    
}
};


  return (
    <>
    {!(username) && (<div id="menu1">   <button onClick={() => { navigate('/login'); }}>login</button></div>)}
    {username &&(
      <div id="main">
        hi {username} {<p>enter ur deatails to see other deatails</p> && !(data) }
        <div id="menu1">
          <button onClick={logouthandler }>logout</button>
          {!(ne) && (<button onClick={() => { navigate('/student/new'); }}>new</button>)}
          {(ne)  && (<button onClick={() => { navigate('/student/update'); }}>update</button>)}
          {(ne) && ( <button onClick={() => { navigate('/student/profile'); }}>full profile</button>)}
            <button onClick={() => { navigate('/student/sort'); }}>All Roles</button>
        </div>
        <div id="profile-pic">
          <img src={profile} alt="user-profile" style={{}} />
        </div>
       
        {(ne) && (
        <CompanyList />)}
         {!(ne) && (<p> enter ur deatails to see suitable companies for u </p>)}
      </div>
      )}
     
    </>
  );
}

export default App;
