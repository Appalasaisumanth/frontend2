import '../student/profile.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function CollegeNew() {
  const user=localStorage.getItem("user");
 var username=""
  if(user){
     username=localStorage.getItem("user").split("+")[1];
  }
 
  const [formData, setFormData] = useState({
    ranking:0,
    percentage:0,
    profile: null,
    username:username
    
  });
  

  const [profilePreview, setProfilePreview] = useState(null);
 
  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
      
      if (name === 'profile') {
        setProfilePreview(URL.createObjectURL(files[0]));
      } 
      if(name==='percentage')
      {
        if (formData.percentage>=100)
        {
          alert("the value must be between 100");
          formData.percentage=formData.percentage%100
        }
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  

  const navigate = useNavigate();

  const handlesubmit = async (event) => {
    event.preventDefault();
    const formDatatoSend=new FormData();
    formDatatoSend.append("profile",formData['profile']);
    formDatatoSend.append("username",formData['username']);
    formDatatoSend.append("ranking",formData['ranking']);
    formDatatoSend.append("percentage",formData['percentage']);
    console.log(formDatatoSend,formData);
    try{
      const response=await fetch("https://backend-jazee.onrender.com/college/new",{
        method:"POST",
        body:formDatatoSend
      })
      console.log(formDatatoSend,formData);
      const resp=await response.json();
      if(response.ok)
      { 
        alert("sussesful entry,redirected to college page");
        navigate('/college');
      }
      else
      { 
        alert(resp.message);
      }
    }
    catch(err)
    {
      console.log(err);
      alert("internal server error");
    }
  };

  return (
    <div>
      {!(username)&& (<div> u have to login/signin  to see remaining deatils</div>) }
      <div id="main"> plesase fill the form such that we can find suitable companies for u</div>
      <div id="back_button" style={{marginTop:"50px",marginRight:"50px"}}>
        <label htmlFor="back_button">Already-existing college: </label>
        <button onClick={() => { navigate('/college'); }}>User</button>
      </div>
      {username &&(
      <form onSubmit={handlesubmit} style={{marginTop:"200px"}}id="new_student_form">
       
        <div>
          

        <label htmlFor="grade">sorted Percentage last year : </label>
        <input type="number" step="1" min="0" max="100" id="grade" name="percentage" placeholder="percentage out of 100" onChange={handleChange} value={formData.percentage} required />
        </div>
        <div>
        <label htmlFor="ranking">Ranking of ur college: </label>
        <input type="number" id="ranking" name="ranking" placeholder="previous year rank" onChange={handleChange} value={formData.ranking} />
        </div>
        <div>
        <label htmlFor="profile">Logo of ur college: </label>
        <input type="file" id="profile" name="profile" onChange={handleChange} required/>
        {profilePreview && (
          <div className="file-preview">
            <img src={profilePreview} alt="Profile Preview"  height={300} width={400}/>
          </div>
        )}
        </div>

<div>
 
        <button type="submit">Submit</button>
        </div>
      </form>
      )}
   
        
    </div>
  );
}

export default CollegeNew;
