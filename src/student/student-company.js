import React, { useState, useEffect,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function CompanyList() {
  
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

  // Update students list based on username
  
  
  const getData = useCallback(async () => {
    try {
     
      const response = await fetch(`https://backend-jazee.onrender.com/recuiter/student/${username}/?page=${page} `,{
        
        headers:{
          'content-Type':'application/json',
        },
        method:"GET"
      });
      if (response.ok) {
        const resp = await response.json();
        setData(resp.message);
        setMaxPage(resp.maxpages);
        setStudents(resp.Total);
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
const applicationhandler =async(event,comp)=>{
  event.preventDefault();
  getData();
 
  try{
    const response=await fetch(`https://backend-jazee.onrender.com/recuiter/save/student/?rec=${comp.username}&student=${username}`);
    const resp=await response.json();
    
    alert(resp.message);
  }
  catch(err)
  {
    console.log(err);
    alert("internal-server-error");
  }


}
 


  return (
    <div id="student-company" style={{marginTop:"100px"}}>
      <h1>Available Companies/Roles: {students}</h1>
      {students > 0 && (
        <>
        <div>These roles are sorted based on stipend and vacancies in roles</div>
        <table>
          <thead>
            <tr>
              <th>S No</th>
              <th>Name</th>
              <th>Stipend</th>
              <th>Skills Required</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((comp, index) => (
              <tr key={index}>
                <td>{(page-1)*3+index+1}</td>
                <td> <div id="image-container"> <img src={"/uploads/images/"+comp.profile}  height="50px" width="50px" alt="logo of company"></img></div><div>{comp.username}</div></td>
                <td>{comp.stipend}</td>
                <td>{comp.skills_required ? comp.skills_required.join(', ') : '----'}</td>
                <td>
                  <button onClick={(event) =>{applicationhandler(event,comp)}}>Add</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      )}
      {maxPage > 0 && (
      <div id="page"  style={{marginTop:"0px"}}>
        {disablePrev && (<button onClick={(event) => {handlePage("prev",event)}} >Prev</button>)}
        <button>{page}</button>
        {disableNext && (<button onClick={(event) => {handlePage("next",event)}} >Next</button>)}
      </div> )}
    </div>
  );
}

export default CompanyList;
