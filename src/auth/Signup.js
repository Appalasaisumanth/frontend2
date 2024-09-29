import './signin.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function checkPass(password) {
  const Capital = "QWERTYUIOPLKJHGFDSAZXCVBNM";
  const Small = "qwertyuioplkjhgfdsazxcvbnm";
  const numbers = "0123456789";
  const special = "@#$&";

  const hasCapital = Capital.split('').some(char => password.includes(char));
  const hasSmall = Small.split('').some(char => password.includes(char));
  const hasNumber = numbers.split('').some(char => password.includes(char));
  const hasSpecial = special.split('').some(char => password.includes(char));

  return password.length >= 8 && hasCapital && hasSmall && hasNumber && hasSpecial;
}

function Signup() {
  const [formData, setFormData] = useState({ user: "",
     pass: "",
      email: " ",
       repass: "", 
       cat: ""
       });
  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(false);
  const navigate = useNavigate();
  const [reqerror,setreqerror]=useState("");

  // Validate form data on change
  useEffect(() => {
    const { user, pass, repass, email, cat } = formData;
    const newErrors = {};

    // Check if all fields are filled
    if (!(cat && email && pass && repass && user)) {
      newErrors.fields = "Please input all fields.";
    }
    // Check if email is valid
    else if (!(email.includes("@") && email.includes("."))) {
      newErrors.email = "Invalid email.";
    }
    // Check if passwords match
    else if (pass !== repass) {
      newErrors.password = "Passwords do not match.";
    }
    // Check if password is strong
    else if (!checkPass(pass)) {
      newErrors.passwordStrength = "Password must have more strength and contain all required character types.";
    }
    else {
      setFormValid(true); // Form is valid if no errors
    }

    setErrors(newErrors);
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset field-specific error when user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",  // Clear specific field error
    }));
    
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const passwordHandler = () => {
    setShowPassword(!showPassword);
  };

  const rePasswordHandler = () => {
    setShowRePassword(!showRePassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formValid) {
      const response = await fetch('https://backend-jazee.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.user,
          password: formData.pass,
          email: formData.email,
          type: formData.cat
        }),
      });

      if (response.ok) {
        const temporary = await response.json(); // Await the json() call
        navigate(`/${temporary.result}/new`);
        setErrors(temporary.message);
        localStorage.setItem("user", temporary.result + "+" + formData.user);
      } else {
        const temporary = await response.json();
        setreqerror(temporary.message);
        alert(temporary.message);
       
      }
    } else {
     // console.log("Form is invalid");
     setErrors("Invalid deatails");
     
    }
  };

  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (Object.keys(errors).length) {
      const timer = setTimeout(() => {
        setErrors({}); // Clear errors after 5 seconds
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <div>
      <div id="main1"><button onClick={() => { navigate('/') }}>Home</button></div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div id="total">
          <div id="v2">
            <span className='label2'>Are you</span>
            <select  className='label2'name="cat" id="cat" value={formData.cat} onChange={handleChange}>
              <option value="">Select Type</option>
              <option value="student">Student</option>
              <option value="college">College</option>
              <option value="recuiter">Recruiter</option>
            </select>
            <span className='label2'>Email</span>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ marginLeft: "10px" }}
              required
            />
            {errors.email && <p>{errors.email}</p>}

            <span className='label2'>Username</span>
            <input
              type="text"
              placeholder="Username"
              name="user"
              value={formData.user}
              onChange={handleChange}
              style={{ marginLeft: "10px" }}
              required
            />
            {errors.user && <p>{errors.user}</p>}

            <span className='label2'>Password</span>
            <div className="password_con">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="pass"
                value={formData.pass}
                onChange={handleChange}
                autoComplete="new-password"
                required // Avoid browser's auto-suggestions
              />
              <button style={{ fontSize: '16px' }} type="button" onClick={passwordHandler}>v</button>
            </div>

            <span className='label2'>Re-enter Password</span>
            <div className="password_con">
              <input
                type={showRePassword ? "text" : "password"}
                placeholder="Re-enter Password"
                name="repass"
                value={formData.repass}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button style={{ fontSize: '16px' }} type="button" onClick={rePasswordHandler}>v</button>
            </div>

            {errors.password && <p>{errors.password}</p>}
            {errors.passwordStrength && <p>{errors.passwordStrength}</p>}
            {errors.passwordUnique && <p>{errors.passwordUnique}</p>}
            {errors.fields && <p>{errors.fields}</p>}
            {reqerror && <p>{reqerror}</p>}
            <p>Already have an account? <a href="/login">Login</a></p>

            <div id="v3">
              <button type="submit">Submit</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Signup;
