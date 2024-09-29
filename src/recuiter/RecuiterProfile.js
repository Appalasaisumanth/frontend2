import React, { useState,useEffect } from 'react';
import { useParams,useNavigate, } from 'react-router-dom';
//import Logo from '../student/logo.png';
//import document from '../student/socument.pdf'
import '../student/profile.css';


function RecuiterProfile( ) {
  
 const {username1}=useParams();
 var x=localStorage.getItem("user");
 if(x)
 {
  var username=x.split("+")[1];
  x=x.split("+");
  if(x[0]!=='recuiter')
  {
    username=username1;
  }
 }


   console.log(username);
   const navigate=useNavigate();
   const [formData, setFormData] = useState({
    vacancy_Female:0,
    vacancy_Male:0,
    stipend:0,
    Grade_cutoff_Male:0,
    Grade_cutoff_Female:0,
    company_rank_cutoff:0,
    skills_required: [],
    profile: null,
    username:username
  });

useEffect(()=>{
 const get_data= async ()=>
  {
      const response=await fetch(`https://backend-jazee.onrender.com/recuiter/${username}`,{
        method:'GET',
        headers:{
          'content-Type':'application/json',
        }
      });
      if(response.ok)
      {
        const result=await response.json();
       
       result.message.profile='/uploads/images/'+result.message.profile;
        setFormData(result.message);
        console.log(result.message);
      }
      else
      {
        const result=await response.json();
        alert(result.message);
      }
  };
  get_data();
},[username]);
 // Render loading state or user data
 if (!formData) {
  return <div>Loading...</div>;
}

  return (
   <>
   {!(username) && (<p>login first  <button onClick={() => navigate(`/${x[0]}`)}>Back</button></p>)}
   {username && (
    <div>
      <div id="back_button">
        
        <button onClick={() => navigate(`/${x[0]}`)}>Back</button>
      </div>
      {!(formData.profile) && (<p>fill the profile</p>)}
      {formData.profile && (
      <form   id="new_student_form">
       
        <div>
          <label htmlFor="grade">vacancy avilable for Female: </label>
          <p>{formData.vacancy_Female}</p>
        </div>
        <div>
          <label htmlFor="phno">vacancy avilable for men: </label>
          <p>{formData.vacancy_Male}</p>
        </div>
        <div>
          <label >stipend offered for this  swe role: </label>
          <p>{formData.stipend}</p>
        </div>
        <div>
          <label>Skills Required: </label>
          <p>{formData.skills_required?formData.skills_required.join(" ,"):"Not Required"}</p>
        </div>
        <div>
          <label>Grade points cutoff for Boys: </label>
          <p>{formData.Grade_cutoff_Male}</p>
        </div>
        <div>
          <label >Grade points cutoff for girls: </label>
          <p>{formData.Grade_cutoff_Female}</p>
        </div>
        <div>
          <label htmlFor="projects">maximum rank of company to apply: </label>
          <p>{formData.company_rank_cutoff}</p>
        </div>
        <div>
    <label>Profile Image: </label>
    <img src={formData.profile} alt="user-image" height={200} width={300} />
    
</div>

   

      </form>)}
      
    
    </div>
    )}
    
    </>
  );
}

export default RecuiterProfile;
