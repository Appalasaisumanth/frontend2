import './profile.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Newstudent() {
  const user=localStorage.getItem("user");
 var username=""
  if(user){
     username=localStorage.getItem("user").split("+")[1];
  }
 
  const [formData, setFormData] = useState({
    username:username,
    full_name: "",
    degree: "",
    gender:"",
    branch: "",
    grade: "",
    phno: "",
    college: "",
    skills: [],
    additional_skills: "",
    projects: "",
    profile: null,
    resume: null
  });
  

  const [profilePreview, setProfilePreview] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
      
      if (name === 'profile') {
        setProfilePreview(URL.createObjectURL(files[0]));
      } else if (name === 'resume') {
        setResumePreview(URL.createObjectURL(files[0]));
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSkillsChange = (event) => {
    const { value, checked } = event.target;

    setFormData((prevFormData) => {
      const newSkills = checked
        ? [...prevFormData.skills, value]
        : prevFormData.skills.filter((skill) => skill !== value);

      return {
        ...prevFormData,
        skills: newSkills,
      };
    });
  };

  const navigate = useNavigate();

  const handlesubmit = async (event) => {
    event.preventDefault();
    try{
       // Create a FormData object
  const formDataToSend = new FormData();
  
  // Append the form fields to FormData
  Object.keys(formData).forEach((key) => {
    formDataToSend.append(key, formData[key]);
  });
  console.log(formDataToSend)
  
      
   const response=await fetch("https://backend-jazee.onrender.com/student/new",{
    method:"POST",
   
    body:formDataToSend
   });
   const data = await response.json(); 
   if(response.ok)
   {
    alert("sucessfull-creation,navigating to student");
    navigate('/student');
   }
   else
   {
    console.log(data.message);
    alert(data.message);
   }
  }
   catch(err)
   {
     alert("internal error,try another time");
   }

  };

  return (
    <div>
      {!(username)&& (<div> u have to login/signin  to see remaining deatils</div>) }
     
      <div id="back_button">
        <label htmlFor="back_button">Already-existing student: </label>
        <button onClick={() => { navigate('/student'); }}>User</button>
      </div>
      {username &&(
      <form onSubmit={handlesubmit} id="new_student_form">
       <div>
         <label htmlFor="full_name">Full Name: </label>
        <input type="text" id="full_name" name="full_name" placeholder="Full Name" onChange={handleChange} value={formData.full_name} style={{width:"300px"}} required/>
        </div>
        <div>
        <label htmlFor="degree">Degree: </label>
        <select name="degree" id="degree" value={formData.degree} onChange={handleChange} required>
          <option value="">Select Degree</option>
          <option value="Bachelors">Bachelors</option>
          <option value="Dual_Degree">Dual Degree</option>
          <option value="Masters">Masters</option>
          <option value="PostGraduation">Post Graduation</option>
        </select>
        </div>
        <div>
        <label htmlFor="branch">Branch: </label>
        <select name="branch" id="branch" value={formData.branch} onChange={handleChange} required>
          <option value="">Select Branch</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EE">EE</option>
          <option value="MECH">Mechanical</option>
          <option value="CIVIL">Civil</option>
          <option value="Meta">Metallurgy</option>
        </select>
        </div>
        <div>
        <label htmlFor="branch">Gender: </label>
        <select name="gender" id="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">MALE</option>
          <option value="female">female</option>
          <option value="others">others</option>
        </select>
        </div>
        <div>
          

        <label htmlFor="grade">Grade: </label>
        <input type="number" step="0.01" id="grade" name="grade" placeholder="Grade out of 10" onChange={handleChange} value={formData.grade} required />
        </div>
        <div>
        <label htmlFor="phno">Phone Number: </label>
        <input type="tel" id="phno" name="phno" placeholder="12-1234567890" onChange={handleChange} value={formData.phno} pattern="[0-9]{2}-[0-9]{10}" required />
      
</div>
<div>
        <label htmlFor="college">College: </label>
        <input type="text" id="college" name="college" placeholder="College" onChange={handleChange} value={formData.college} required/>
        </div>
        <div>
        <label>Skills: </label>
        <div id="skills">
          <label>
            <input
              type="checkbox"
              value="web-dev"
              checked={formData.skills.includes('web-dev')}
              onChange={handleSkillsChange}
            />
            Web Development
          </label>
          <label>
            <input
              type="checkbox"
              value="front-end"
              checked={formData.skills.includes('front-end')}
              onChange={handleSkillsChange}
            />
            Front-end
          </label>
          <label>
            <input
              type="checkbox"
              value="app-dev"
              checked={formData.skills.includes('app-dev')}
              onChange={handleSkillsChange}
            />
            App Development
          </label>
          <label>
            <input
              type="checkbox"
              value="ml"
              checked={formData.skills.includes('ml')}
              onChange={handleSkillsChange}
            />
            Machine Learning
          </label>
          <label>
            <input
              type="checkbox"
              value="dsa"
              checked={formData.skills.includes('dsa')}
              onChange={handleSkillsChange}
            />
            Data Structures & Algorithms
          </label>
        </div>
        </div>
      <div>
        <label htmlFor="additional_skills">Additional Skills: </label>
        <textarea id="additional_skills" name="additional_skills" placeholder="Additional Skills" onChange={handleChange} value={formData.additional_skills} />
        </div>
        <div>
        <label htmlFor="projects">Projects: </label>
        <textarea id="projects" name="projects" placeholder="Describe projects in one line" onChange={handleChange} value={formData.projects} />
        </div>
        <div>
        <label htmlFor="profile">Profile Picture: </label>
        <input type="file" id="profile" name="profile" onChange={handleChange} required/>
        {profilePreview && (
          <div className="file-preview">
            <img src={profilePreview} alt="Profile Preview"  height={300} width={400}/>
          </div>
        )}
        </div>
<div>
        <label htmlFor="resume">Resume: </label>
        <input type="file" id="resume" name="resume" onChange={handleChange} />
        {resumePreview && (
          <div className="file-preview">
            <a href={resumePreview} target="_blank" rel="noopener noreferrer">View Resume</a>
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

export default Newstudent;
