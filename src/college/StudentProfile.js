import React, { useState,useEffect } from 'react';
import { useParams,useNavigate, } from 'react-router-dom';
//import Logo from '../student/logo.png';
//import document from '../student/socument.pdf'
import '../student/profile.css';


function StudentProfile( ) {
  
 const {username}=useParams();
 const x=localStorage.getItem('user').split("+");


   console.log(username);
   const navigate=useNavigate();
   const [formData, setFormData] = useState({
    full_name: "",
    degree: "",
    gender: "",
    branch: "",
    grade: "",
    phno: "",
    college: "",
    skills: [],
    additional_skills: "",
    projects: "",
    profile: null,
    resume: null,
    name:username
  });
  const [error,setError]=useState("");
useEffect(()=>{
 const get_data= async ()=>
  {
      const response=await fetch(`https://backend-jazee.onrender.com/student/${username}`,{
        method:'GET',
        headers:{
          'content-Type':'application/json',
        }
      });
      if(response.ok)
      {
        const result=await response.json();
       
       result.message.profile='/uploads/images/'+result.message.profile;
       result.message.resume='/uploads/pdfs/'+result.message.resume;
        setFormData(result.message);
        
      }
      else
      {
        const result=await response.json();
        setError(result.message);
      }
  };
  get_data();
},[username]);
 // Render loading state or user data
 if (!formData) {
  return <div>Loading...</div>;
}

  return (
   
    <div>
      <div id="back_button">
        <button onClick={() => navigate(`/${x[0]}`)}>Back</button>
      </div>
      {error && (<p>{error}</p>)}
      {!(error) && (
      <form   id="new_student_form">
        <div>
          <label htmlFor="full_name">Full Name: </label>
          <p>{formData.full_name}</p>
        </div>
        <div>
          <label htmlFor="degree">Degree: </label>
          <p>{formData.degree}</p>
        </div>
        <div>
          <label htmlFor="branch">Branch: </label>
          <p>{formData.branch}</p>
        </div>
        <div>
          <label htmlFor="gender">Gender: </label>
          <p>{formData.gender}</p>
        </div>
        <div>
          <label htmlFor="grade">Grade: </label>
          <p>{formData.grade}</p>
        </div>
        <div>
          <label htmlFor="phno">Phone Number: </label>
          <p>{formData.phno}</p>
        </div>
        <div>
          <label htmlFor="college">College: </label>
          <p>{formData.college}</p>
        </div>
        <div>
          <label>Skills: </label>
          {formData.skills.length >0 && (<p >Skills: {formData.skills.join(', ')}</p>)}
        </div>
        <div>
          <label htmlFor="additional_skills">Additional Skills: </label>
          <p>{formData.additional_skills}</p>
        </div>
        <div>
          <label htmlFor="projects">Projects: </label>
          <p>{formData.projects}</p>
        </div>
        <div>
    <label>Profile Image: </label>
    <img src={formData.profile} alt="user-image" height={200} width={300} />
</div>
<div>
    <label htmlFor="resume">Resume: </label>
    <iframe src={formData.resume} width="800px" height="200px" title="resume"></iframe>
</div>

      </form>
      )}
    </div>
  );
}

export default StudentProfile;
