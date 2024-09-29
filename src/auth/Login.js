import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // Ensure this is called correctly

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

 
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(""); // Clear the message after 5 seconds
      }, 50000);

      // Cleanup the timer if the component unmounts before the timer completes
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    
    if (type) {
    
      navigate(`/${type}`); 
    }
  }, [type, navigate]);

  const submitHandler = async (event) => {
    event.preventDefault();
    //console.log("Submitting", formData);
    if(formData.password && formData.username){
          const response = await fetch('https://backend-jazee.onrender.com/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
  });
  
   if(response.ok)
   {//console.log(response.json);
    const temporary = await response.json(); // Await the json() call
    setType(temporary.result);
    setMessage(temporary.message);
    localStorage.setItem("user", temporary.result + "+" + formData.username);
    
}
   
   else
   {
    const temporary = await response.json();
    setMessage(temporary.message);
    //console.log(temporary.error);
    alert(temporary.message);
    
   }}
   else{
    setMessage("input all feilds");
   }
  };
  const [showPassword, setShowPassword] = useState(false);
  //const [password, setPassword] = useState('');

  const passwordhandler = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div>
      <div id="main1"><button type="button" onClick={()=>{navigate('/')}}>Home</button></div>
      <form onSubmit={submitHandler}>
        <div id="total">
          <div id="v">
          <div >
  <p> login </p>
            <div id="v2" className='label' >
              <label>username</label>
              <input
                type="text"
                placeholder="Username"
                id="user"
                name="username"
                value={formData.username}
                onChange={handleChange}
                style={{marginLeft:"150px"}}
                required
                
              />
          
             </div>
             <div className='label' >
             <label>password</label>
              <div className="password_con">
                <input
                  type={showPassword ? 'text':"password"}
                  id="pass"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{marginLeft:"150px"}}
                  
                />
                <button type="button" onClick={passwordhandler} style={{fontSize:'14px'}} required>v</button>
              </div>
              </div>
              <span>{message}</span>
              <br />
              <p style={{marginLeft:"250px"}}>Don't have an account: <a href="/signup">Sign up</a></p>
              <div id="v3">
                <button type="submit">Submit</button>
                <a href="/forgot_password">Forgot password</a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
