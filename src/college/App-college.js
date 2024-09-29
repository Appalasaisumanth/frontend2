import React, { useEffect, useState,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './college.css';
import logo from '../student/logo.png'

function App() {
  const user = localStorage.getItem("user");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [students, setStudents] = useState(0);
  const [image, setImage] = useState("../student/logo.png");
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [data, setData] = useState([]);
  const [disablePrev, setDisablePrev] = useState(false);
  const [disableNext, setDisableNext] = useState(true);
  const [ne,setNew]=useState(false);

  // Check user authentication on component mount
  useEffect(() => {
    if (user) {
      setUsername(user.split("+")[1]);
      
    } else {
      alert("First login/signup to continue, redirecting to login page");
      navigate('/login');
    }
  }, [user, navigate]);

  // Update students list based on username
  useEffect(() => {
   /* const HelloCollege=async ()=>{
      try {
        const response = await fetch(`http://localhost:5000/college/`, {
          headers:{
            'content-Type':'application/json',
          },
          method:"GET"});
        if (response.ok) {
          const resp = await response.json();
          alert(resp.message);
        } else {
          const resp = await response.json();
          alert(JSON.stringify(resp.message));
        }
      } catch (err) {
        console.log(err);
        alert("Internal server error");
      }
    };
    */

  
    const getProfile = async () => {
      
      try {
        const response = await fetch(`https://backend-jazee.onrender.com/college/${username}`, {
          headers:{
            'content-Type':'application/json',
          },
          method:"GET"});
        if (response.ok) {
          const resp = await response.json();
          if (resp.message.profile) {
            setImage("/uploads/images/" + resp.message.profile);
          };
          setNew(true);
          
        } else {
          const resp = await response.json();
          console.log(resp.message);
          alert(resp.message);
        }
      } catch (err) {
        console.log(err);
        alert("Internal server error");
      }
     
    };
 

  if(username){
    console.log(username);
    getProfile();
   // HelloCollege();
  }

  
 
   
  }, [username]);
  const getData = useCallback(async () => {
    try {
     
      const response = await fetch(`https://backend-jazee.onrender.com/college/${username}/students/?page=${page}`,{
        headers:{
          'content-Type':'application/json',
        },
        method:"GET"
      });
      if (response.ok) {
        const resp = await response.json();
        setData(resp.message);
        setMaxPage(resp.totalPages);
        setStudents(resp.count);
      } else {
        const resp = await response.json();
        alert(resp.message);
      }
    } catch (err) {
      console.log(err);
      alert("Internal server error");
    }
  },[username,page]);
useEffect(()=>{
 
  if(username){
  getData();
  }
},[username, page, getData]);
  const handlePage = async (button, event) => {
    event.preventDefault();
    if(maxPage===2 && page===2)
      {
        setDisablePrev(true);
      }
    if(page===2)
    {
      if(button==="prev")
      {setDisablePrev(false);}

    }
    else if(page===maxPage-1)
    { if(button==="next")
      {setDisableNext(false);}
    }
    else
    {
      setDisablePrev(true);
      setDisableNext(true);
    }
    if(button==="next")
    {
      if(page!==maxPage)
      {
        setPage(page+1);
      }
    }
    else
    {
      if(page!==1)
      {
        setPage(page-1);
      }
    }
    if(maxPage===2 && page===1)
      {
        setDisablePrev(true);
       
      }
      if(maxPage===2 && page===2)
        {
          setDisableNext(true);
         
        }
        if(maxPage===2 && page===1)
          {
            setDisablePrev(true);
           
          }
          if(maxPage===3 && page===2 && button==="next")
            {
              setDisableNext(false);
             
            }
    
  };

  const handleButton = (user) => {
    navigate(`/student/profile/${user.username}`);
  };

  const handleProfile = () => {
    navigate(`/college/profile/${user.split("+")[1]}`);
  };

    const handleDelete = async (user) => {
      try {
        const response = await fetch(`https://backend-jazee.onrender.com/college/${user.username}`, {
          method: "DELETE",
        });
        const resp = await response.json();
        alert(resp.message);
  
        // Call the data function after successful deletion
        getData(); 
      } catch (err) {
        console.log(err);
        alert("Internal server error");
      }
      getData();
    };
  
    // Ensure this effect is dependent on the `data` function if you want it to be invoked on data change
  
  


  // Render the component only if username is set
  if (!username) return null;

  return (
    <div>
      <div id="main">
        <div id="menu1">
        <button 
    type="button" 
    onClick={() => { 
        if (window.confirm("Are you sure you want to logout?")) {
            navigate("/login");
        }
    }}
>
    Logout
</button>
          {(ne && <> <button type="button" onClick={() => navigate('/college/stats')}>Recruiter</button>
          <button type="button" onClick={(event) => {
            event.preventDefault();
            navigate('/college2/new');
          }}>
          Abandon
          </button>
          <button type="button" onClick={() => handleProfile()}>Profile</button> </>)}
          <button type="button"  style={{width:"500px",height:"50px"}}onClick={() => navigate("/college/sort")}>All roles</button>
          {!(ne) && <button type="button" onClick={() => navigate('/college/new')}>New</button>}
           <button type="button" onClick={() => navigate('/college/update')}>Update</button>
          <div id="profile-pic">
            <img src={image} alt="user-profile" />
          </div>
        </div>
        <p>Hi {username}, management</p>
      </div>
    
      {(students===0) && (<p id="sorry" style={{position:"absolute",justifySelf:"center",top:"50%"}}>Sorry, we don't have details of your students.</p>)}
      {(students>0) && (
      <div id="container-profiles-student">
        <p>These are short profiles of your students: {students}</p>
        <div id="students-map">
          
          {data && data.map((user, index) => (
            <div id="student-map-container" key={index}>
              <div className='map-menu'>
                <div id="image-container"><img src={logo} height={100} alt="Profile" /></div>
                <button type="button" style={{ fontSize: "20px" }} onClick={() => handleButton(user)}>Full</button>
                <button type="button" id="redButton" style={{ fontSize: "20px", backgroundColor: "red" }} onClick={()=>handleDelete(user)}>Delete</button>
              </div>
              <div>Name: {user.full_name}</div>
              <div>Grade: {user.grade}</div>
              <div>Gender: {user.gender}</div>
              <div>Skills: {user.skills.join(', ')}</div>
            </div>
          ))}
        </div>
        <div id="page">
          {disablePrev && (<button type="button"  onClick={(event) => handlePage("prev", event)} >Prev</button> )}
          <span style={{margin:"20px"}} >{page}</span>
          {disableNext && (<button type="button"  onClick={(event) => handlePage("next", event)} >Next</button>)}
        </div>
      </div>
      )}
    </div>
  );
}

export default App;
