import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Logo from '../student/logo.png';

function App() {
    const navigate = useNavigate();
    const user = localStorage.getItem('user');
    const [username, setUsername] = useState("");
    const [students, setStudents] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [ne,setne]=useState(false);
    const [image,setImage]=useState(null);

    useEffect(() => {
        async function get_profile(){
        if (user) {
            const currentUsername = user.split("+")[1];
            setUsername(currentUsername);
            const response=await fetch(`https://backend-jazee.onrender.com/recuiter/${username}`);
            const resp=await response.json();
            if(response.ok)
            {  if(resp.message.profile){
                setImage("/uploads/images/"+resp.message.profile);
                
            }
            else
            {
                setImage(Logo);
            }
            setne(true);
            }
            else
            {
                setImage(Logo);
                alert(resp.message);
                setne(false);
            };
            const response2=await fetch(`https://backend-jazee.onrender.com/recuiter/rec/student/${username}`);
            const resp2=await response2.json();
            if(response2.ok)
            {
                setStudents(resp2.count);
            }
            else
            {
                setStudents(0);
                alert(resp2.message);
            };
            const response3=await fetch(`https://backend-jazee.onrender.com/recuiter/rec/college/${username}`);
            const resp3=await response3.json();
            if(response3.ok)
            {
                setColleges(resp3.count);
            }
            else
            {
                setColleges(0);
                alert(resp3.message);
            };

            }
         else {
            alert("Invalid login, navigating to login page.");
            navigate("/login");
        }
    }

  
        get_profile();
   
    
    }, [user, navigate,username]);
    return (
        <div>
            <div id="main">
                Hi {username}
                <div id="menu1">
           
                    <button onClick={() => { 
                        localStorage.removeItem('user'); 
                        navigate('/logout'); 
                    }}>Logout</button>
                   {!(ne ) && ( <button onClick={() => { 
                        
                        navigate('/recuiter/new'); 
                    }} >New</button> )}
                         <button onClick={()=>{navigate('/recuiter/sort/students')}}>students</button>
                         <button onClick={()=>{navigate('/recuiter/sort/colleges')}}>colleges</button>
                    {ne && ( <button onClick={() => { 
                        
                        navigate('/recuiter/update'); 
                    }} > Update</button>)}
                     {ne && (<button onClick={() => { 
                        
                        navigate('/recuiter/profile'); 
                    }} >Profile</button>)}

                </div>
                <div id="profile-pic">
          <img src={image} alt="user-profile" />
        </div>
        {!(ne) && (<p> enter the deatails of role u can offer ,so that students and colleges can apply </p>)}
                {students > 0 && (
                    <div style={{marginTop:"200px",display:"flex",flexDirection:"row"}}>
                        <div>no. of students applied: {students}</div>
                        <button onClick={(event) => { 
                            event.preventDefault(); 
                            navigate('/recuiter/student'); 
                        }}>see Students</button>
                    </div>
                )}
                { ne && students===0 && <p> no student applied for this role </p> }
                { ne && colleges===0 && <p> no college applied for this role </p> }
               
                {colleges > 0 && (
                    <div style={{display:"flex",flexDirection:"row"}}>
                        <div>no. of colleges applied: {colleges}</div>
                        <button onClick={() => { navigate('/recuiter/college'); }}>see Colleges</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
