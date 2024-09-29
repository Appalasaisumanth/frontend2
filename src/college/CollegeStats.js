import React, { useState, useEffect,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function CollegeStats() {
  
  const user = localStorage.getItem("user");
  const navigate=useNavigate();
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
     
      const response = await fetch(`https://backend-jazee.onrender.com/recuiter/college/${username}/?page=${page} `,{
        
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
  },[username, page]);
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
  const applicationhandler =async(event,comp)=>{
    event.preventDefault();
    getData("",event);
    handlePage("",event);
    try{
      const response=await fetch(`https://backend-jazee.onrender.com/recuiter/save/college/?rec=${comp.username}&college=${username}`);
      const resp=await response.json();
      console.log(resp);
      alert(resp.message);
    }
    catch(err)
    {
      console.log(err);
      alert("internal-server-error");
    }
  
  
  }
 


  return (
    <>
    {!(username) && (<p>please login to see these deatails</p>)}
    {maxPage===0 && (<><p> no companies are reachable for this college,try next year</p> <div> <button onClick={()=>{navigate("/college")}}>back </button></div></>)}
    {maxPage>0 &&(
      <>
      <div> <button onClick={()=>{navigate("/college")}}>back </button></div>
    <div id="student-company" style={{marginTop:"0px"}} >
      <h1>Available Companies: {students}</h1>
      {data  && (
        <>
        <div>these are the companies waiting for u</div>
        <table>
          <thead>
            <tr>
              <th>S No</th>
              <th>Name</th>
              <th>company Requirement</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((comp, index) => (
              <tr key={comp.id}>
                <td>{(page-1)*3+index+1}</td>
                <td> <div id="image-container"> <img src={"/uploads/images/"+comp.profile}  height="50px" width="50px" alt="logo of company"></img></div><div>{comp.username}</div></td>
                <td>{comp.company_rank_cutoff}</td>
                <td>
                  <button onClick={(event) =>{applicationhandler(event,comp)}}>Add</button>
                </td>
              </tr>
              
            ))}
          </tbody>
        </table>
        </>
        
      )
      }
      {maxPage > 0 && (
      <div id="page">
        {disablePrev && (<button onClick={(event) => {handlePage("prev",event)}} >Prev</button>)}
        <button>{page}</button>
        {disableNext && (<button onClick={(event) => {handlePage("next",event)}} >Next</button>)}
      </div> 
    )}
    </div>
    </>)}
    </>
  );
}

export default CollegeStats;
