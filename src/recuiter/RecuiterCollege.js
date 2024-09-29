import { React, useEffect, useState,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
//import logo from '../student/logo.png';

function RecuiterCollege() {
    const navigate = useNavigate();
    const user = localStorage.getItem('user');
    const [username, setUsername] = useState("");
    const [students, setStudents] = useState(0);
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(0);
    const [data, setData] = useState([]);
    const [disablePrev, setDisablePrev] = useState(false);
    const [disableNext, setDisableNext] = useState(true);
      // Check user authentication on component mount
  useEffect(() => {
    if (user) {
      setUsername(user.split("+")[1]);
      
    } else {
      alert("First login/signup to continue, redirecting to login page");
      navigate('/login');
    }
  }, [user, navigate]);
  const getData = useCallback(async () => {
    try {
     
      const response = await fetch(`https://backend-jazee.onrender.com/recuiter/rec/college/${username}/?page=${page}`,{
        
        headers:{
          'content-Type':'application/json',
        },
        method:"GET"
      });
      if (response.ok) {
        const resp = await response.json();
        setData(resp.message);
        setMaxPage(resp.maxpages);
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

   

    const handleLogout = (event) => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("user");
            navigate('/login');
        }
    };
    const handleButton = (user) => {
      navigate(`/college/profile/${user.username}`);
    };
  
   
    if (!username) return (<div>login first</div>);
    return (
        <div>
            <div id="main">
                <div id="menu" style={{display:"flex",flexDirection:"row",alignItems:"flex-end",alignSelf:"end"
                }}>
                    <button onClick={() => { navigate('/recuiter'); }}>Back</button>
                    <button style={{marginLeft:"20px"}} onClick={handleLogout}>Logout</button>
                </div>
                {students === 0 ? ( 
                    <div>No colleges applied for you this time.</div>
                ) : (
                  <div>
                  <p>These are short profiles of your colleges: {students}</p>
                  <div id="students-map" style={{marginTop:"100px"}}>
                    {data.map((user, index) => (
                      <div id="student-map-container" style={{height:"",width:""}} key={index}>
                        <div className='map-menu' style={{height:"",width:""}}>
                          <div id="image-container"><img src={"/uploads/images/"+user.profile} height={100} alt="Profile" /></div>
                          <button type="button" style={{ fontSize: "20px" }} onClick={() => handleButton(user)}>Full</button>

                        </div>
                        <div>Name: {user.username}</div>
                        <div>previous year placement percentage: {user.percentage}</div>
                        <div>ranking: {user.ranking}</div>
                      </div>
                    ))}
                  </div>
                  <div id="company-page" >
                  {disablePrev && (maxPage!==1) && (<button type="button" onClick={(event) => handlePage("prev", event)} >Prev</button> )}
                    <span>{page}</span>
          {disableNext &&  (maxPage!==1) && (<button type="button" onClick={(event) => handlePage("next", event)} >Next</button>)}
                  </div>
                  </div>
                  
                    
                )}
            </div>
        </div>
    );
}

export default RecuiterCollege;
