/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';

function StudentUpdate() {
  const username = localStorage.getItem("user")?.split("+")[1];
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
    username: username,
  });

 
  const navigate = useNavigate();
  const [profilePreview, setProfilePreview] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const [temp,settemp]=useState({
    profile:null,
    resume:null
  })


  useEffect(() => {
    const getUser = async () => {
      if (username) {
        try {
          const response = await fetch(`https://backend-jazee.onrender.com/student/${username}`, {
            method: "GET",
          });
          const data = await response.json();
          if (response.ok) {
            settemp({profile:data.message.profile,resume:data.message.resume});
            
            setFormData(data.message);
            setProfilePreview(temp.profile);
            setResumePreview(temp.resume);
            
           
          } else {
            alert(data.message);
          }
        } catch (err) {
          alert("Internal error, loading data failed");
        }
      } else {
        alert("Login first");
        navigate('/login');
      }
    };
    getUser();
  }, [navigate, username]); // Add username as a dependency

 // Set the preview of the dummy image

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

const handleChange2 = (event) => {
  const { name, type, files } = event.target;
  
  if (type === 'file' && files.length > 0) {
      settemp(prev => ({
          ...prev,
          [name]: files[0],
      }));

      // Create a preview for the file
      if (name === 'profile') {
          setProfilePreview(URL.createObjectURL(files[0]));
      } else if (name === 'resume') {
          setResumePreview(URL.createObjectURL(files[0]));
      }
  }
};

  const handleSkillsChange = (event) => {
    const { value, checked } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      skills: checked
        ? [...prevFormData.skills, value]
        : prevFormData.skills.filter(skill => skill !== value)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSubmit = new FormData();
  
    // Append all form data
    for (const key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }
    
    // Append profile and resume if they are files
    if (temp.profile) {
      formDataToSubmit.append('profile', temp.profile);
    } else {
      formDataToSubmit.append('profile', formData.profile);
    }
    
    if (temp.resume) {
      formDataToSubmit.append('resume', temp.resume);
    } else {
      formDataToSubmit.append('resume', formData.resume);
    }
    // Log FormData contents for debugging
    for (const [key, value] of formDataToSubmit.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
  }
  console.log(formData.profile,formData.resume,temp.resume,temp.profile);
   
    try {
      const response = await fetch("https://backend-jazee.onrender.com/student/update", {
        method: "PATCH",
        body:formDataToSubmit // Send FormData
      });
      
      const res = await response.json(); 
      if (response.ok) {
        alert(JSON.stringify(res.message));
        navigate("/student");
      } else {
        console.log(res.message);
        alert( JSON.stringify(res.message));
      }
    } catch (err) {
      alert("Internal error, try another time");
    }
      
      
  };

  return (
    <>
      <div>
        {!username && (
          <div id="back_button">
            <label htmlFor="back_button">Login: </label>
            <button onClick={() => { navigate('/login'); }}>Login</button>
          </div>
        )}

        <div id="back_button">
          <label htmlFor="back_button">New Student: </label>
          <button onClick={() => { navigate('/student'); }}>Back</button>
        </div>
        <form onSubmit={handleSubmit} id="new_student_form">
          <div>
            <label htmlFor="full_name">Full Name: </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              placeholder="Full Name"
              onChange={handleChange}
              value={formData.full_name}
              required
            />
          </div>
          <div>
            <label htmlFor="degree">Degree: </label>
            <select
              name="degree"
              id="degree"
              value={formData.degree}
              onChange={handleChange}
              required
            >
              <option value="">Select Degree</option>
              <option value="Bachelors">Bachelors</option>
              <option value="Dual_Degree">Dual Degree</option>
              <option value="Masters">Masters</option>
              <option value="PostGraduation">Post Graduation</option>
            </select>
          </div>
          <div>
            <label htmlFor="branch">Branch: </label>
            <select
              name="branch"
              id="branch"
              value={formData.branch}
              onChange={handleChange}
              required
            >
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
            <label htmlFor="gender">Gender: </label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div>
            <label htmlFor="grade">Grade: </label>
            <input
              type="number"
              step="0.01"
              id="grade"
              name="grade"
              placeholder="Grade out of 10"
              onChange={handleChange}
              value={formData.grade}
              required
            />
          </div>
          <div>
            <label htmlFor="phno">Phone Number: </label>
            <input
              type="tel"
              id="phno"
              name="phno"
              placeholder="12-1234567890"
              onChange={handleChange}
              value={formData.phno}
              pattern="[0-9]{2}-[0-9]{10}"
              required
            />
          </div>
          <div>
            <label htmlFor="college">College: </label>
            <input
              type="text"
              id="college"
              name="college"
              placeholder="College"
              onChange={handleChange}
              value={formData.college}
              required
            />
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
            <textarea
              id="additional_skills"
              name="additional_skills"
              placeholder="Additional Skills"
              onChange={handleChange}
              value={formData.additional_skills}
            />
          </div>
          <div>
            <label htmlFor="projects">Projects: </label>
            <textarea
              id="projects"
              name="projects"
              placeholder="Describe projects in one line"
              onChange={handleChange}
              value={formData.projects}
            />
          </div>
          <div>
        <label htmlFor="profile">Profile Picture: </label>
        <input type="file" id="profile" name="profile" onChange={handleChange2}  />
        {profilePreview && (
          <div className="file-preview">
            <img src={profilePreview} alt="Profile Preview"  height={300} width={400}/>
          </div>
        )}
        </div>
<div>
        <label htmlFor="resume">Resume: </label>
        <input type="file" id="resume" name="resume"  onChange={handleChange2}  />
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
      </div>
    </>
  );
}

export default StudentUpdate;
