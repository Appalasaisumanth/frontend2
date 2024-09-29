import '../student/profile.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RecuiterUpdate() {
  const user=localStorage.getItem("user");
 var username=""
  if(user){
     username=localStorage.getItem("user").split("+")[1];
  }
 
  const [formData, setFormData] = useState({
    username: username,
    vacancy_Female:NaN,
    vacancy_Male:NaN,
    stipend:NaN,
    Grade_cutoff_Male: NaN,
    Grade_cutoff_Female:NaN,
    company_rank_cutoff: NaN,
    skills_required: [],
    Male_applied:[],
    Female_applied:[],
    company_applied:[],
    profile: null,
    
  });
  const [error,seterror]=useState("");
  const [profilePreview, setProfilePreview] = useState(null);
  const [image,setImage]=useState({profile:null});
  console.log(username);
  useEffect(()=>{
    async function get_user()
    {
      const response =await fetch(`https://backend-jazee.onrender.com/recuiter/${username}`
      )
      const resp=await response.json();
      if(response.ok)
      {
        setFormData(resp.message);
        setProfilePreview("/uploads/images/"+resp.message.profile); 
      }
    }
    get_user();
  },[username]);
 
  console.log(formData,profilePreview);
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
    } 
    
    else {
      console.log(formData[name],typeof(formData[name]));
      if(name==="Grade_cutoff_Male" ||name==="Grade_cutoff_Female" )
      {
        if (formData[name]>10 || formData[name]<0)
        {
          seterror("grade points must be for 10");
        }
      }
      else
      {
        if(formData[name]<0)
        {
          seterror("feild values must be positive");
        }
      }
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  
  const navigate = useNavigate();
  const handleSkillsChange = (event) => {
    const { value, checked } = event.target;

    setFormData((prevFormData) => {
      const newSkills = checked
        ? [...prevFormData.skills_required, value]
        : prevFormData.skills_required.filter((skill) => skill !== value);

      return {
        ...prevFormData,
        skills_required: newSkills,
      };
    });
  };
const handlefile =(event)=>{
  const { name, type, files } = event.target;
    
  if (type === 'file') {
    setImage.profile=files[0];
    
    if (name === 'profile') {
      setProfilePreview(URL.createObjectURL(files[0]));
    } 
  } ;

}
  const handlesubmit = async (event) => {
    event.preventDefault();
    const formDatatosend=new FormData();
    for (let key of Object.keys(formData)) {
      if(key!=="profile")
      {formDatatosend.append(key, formData[key]);}
    else{
      if(image.profile)
      {
        formDatatosend.append("profile",image.profile);
      }
      else
      {
        formDatatosend.append("profile",formData["profile"]);
      }
    }
  }
  try{
  const response =await fetch("https://backend-jazee.onrender.com/recuiter/update",{
    method:"PATCH",
    body:formDatatosend
  });
  const resp=await response.json();
  if(response.ok)
  {
    alert(resp.message+"navigating to back page");
    navigate("/recuiter");
    
  }
  else
  {
    alert(resp.message);
  }}
  catch(err)
  {
    console.log(err);
    alert("internal server error");
  }
  
  }

  return (
    <div>
      {!(username)&& (<div> u have to login/signin  to see remaining deatils</div>) }
     
      <div id="back_button">
        <label htmlFor="back_button">Already-existing student: </label>
        <button onClick={() => { navigate('/recuiter'); }}>User</button>
      </div>
      {username &&(
      <form onSubmit={!(error)&&handlesubmit} id="new_student_form">
        {(error) && <p>{error}</p>}
      <div>
          
        
          <label htmlFor="vacancy_F">Female vacancies in company: </label>
          <input type="number" step="1" id="grade" name="vacancy_Female" placeholder="15" onChange={handleChange} value={formData.vacancy_Female} required />
          </div>
          <div>
          

          <label htmlFor="vacancy_M">Male vacancies in company: </label>
          <input type="number" step="1" id="grade" name="vacancy_Male" placeholder="15" onChange={handleChange} value={formData.vacancy_Male} required />
          </div>
          <div>
          

          <label htmlFor="stifund">stipend offered for this role in rupees: </label>
          <input type="number" step="1000" id="grade" name="stipend" placeholder="15000" onChange={handleChange} value={formData.stipend} required />
          </div>
          <div>
          

          <label htmlFor="grade_cut">Grade cutoff for Male students: </label>
          <input type="number" step="0.01" id="grade_cut" max={10} name="Grade_cutoff_Male" placeholder="7.00" onChange={handleChange} value={formData.Grade_cutoff_Male} required />
          </div>
          <div>
          <label htmlFor="grade_cut">Grade cutoff for Female students: </label>
          <input type="number" step="0.01"  max={10} name="Grade_cutoff_Female" placeholder="7.00" onChange={handleChange} value={formData.Grade_cutoff_Female} required />
          </div>
          <div>
          

          <label htmlFor="company_cut">Maximum rank for a college to apply : </label>
          <input type="number" step="1" id="company_cut" name="company_rank_cutoff" placeholder="15" onChange={handleChange} value={formData.company_rank_cutoff} required />
          </div>
      
          

        <div>
        <label>Skills Required for students to apply: </label>
        <div id="skills">
          <label>
            <input
              type="checkbox"
              value="web-dev"
              checked={formData.skills_required.includes('web-dev')}
              onChange={handleSkillsChange}
            />
            Web Development
          </label>
          <label>
            <input
              type="checkbox"
              value="front-end"
              checked={formData.skills_required.includes('front-end')}
              onChange={handleSkillsChange}
            />
            Front-end
          </label>
          <label>
            <input
              type="checkbox"
              value="app-dev"
              checked={formData.skills_required.includes('app-dev')}
              onChange={handleSkillsChange}
            />
            App Development
          </label>
          <label>
            <input
              type="checkbox"
              value="ml"
              checked={formData.skills_required.includes('ml')}
              onChange={handleSkillsChange}
            />
            Machine Learning
          </label>
          <label>
            <input
              type="checkbox"
              value="dsa"
              checked={formData.skills_required.includes('dsa')}
              onChange={handleSkillsChange}
            />
            Data Structures & Algorithms
          </label>
        </div>
        </div>

     
        <div>
        <label htmlFor="profile">Profile Picture/logo of company: </label>
        <input type="file" id="profile" name="profile" onChange={handlefile} />
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

export default RecuiterUpdate;
