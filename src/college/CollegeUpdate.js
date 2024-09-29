import '../student/profile.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CollegeUpdate() {
  const user = localStorage.getItem("user");
  let username = user ? user.split("+")[1] : "";

  const [formData, setFormData] = useState({
    ranking: 9999,
    percentage: 0,
    profile: null,
    username: username,
  });

  const [profilePreview, setProfilePreview] = useState(null);
  const [image, setImage] = useState(null);
  const [req, setReq] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetch(`https://backend-jazee.onrender.com/college/${username}`, {
          headers: {
            'content-Type': 'application/json',
          },
          method: "GET"
        });
        if (response.ok) {
          const resp = await response.json();
          if (resp.message.profile) {
            const profileUrl = "/uploads/images/" + resp.message.profile;
            setImage(resp.message.profile);
            setProfilePreview(profileUrl);
            setFormData(resp.message);
            setReq(false);
          }
        } else {
          const resp = await response.json();
          alert(resp.message);
        }
      } catch (err) {
        console.log(err);
        alert("Internal server error");
      }
    };

    // Fetch the profile only once when the component is mounted
    if (username) {
      getProfile();
    }
  }, [username]);

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;

    if (type === 'file' && name === 'profile') {
      setImage(files[0]);
      setProfilePreview(URL.createObjectURL(files[0]));
    } else {
      if (name === 'percentage' && value > 100) {
        alert("Percentage value must be between 0 and 100");
        return;
      }
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDatatoSend = new FormData();

    formDatatoSend.append("username", formData.username);
    formDatatoSend.append("ranking", formData.ranking);
    formDatatoSend.append("percentage", formData.percentage);

    if (image) {
      formDatatoSend.append("profile", image);  // Append the new profile image if uploaded
    }

    try {
      const response = await fetch("https://backend-jazee.onrender.com/college/update", {
        method: "PATCH",
        body: formDatatoSend
      });

      const resp = await response.json();
      if (response.ok) {
        alert("Successful update, redirecting to college page");
        navigate('/college');
      } else {
        alert(resp.message);
      }
    } catch (err) {
      console.log(err);
      alert("Internal server error");
    }
  };

  return (
    <div>
      <div id="back_button">
        <label htmlFor="back_button">Already-existing college: </label>
        <button onClick={() => navigate('/college')}>User</button>
      </div>

      <form onSubmit={handleSubmit} id="new_student_form">
        <div>
          <label htmlFor="grade">Percentage: </label>
          <input
            type="number"
            step="1"
            min="0"
            max="100"
            id="grade"
            name="percentage"
            placeholder="Percentage out of 100"
            onChange={handleChange}
            value={formData.percentage}
            required
          />
        </div>

        <div>
          <label htmlFor="projects">Ranking: </label>
          <input
            type="number"
            id="projects"
            name="ranking"
            placeholder="Previous year rank"
            onChange={handleChange}
            value={formData.ranking}
          />
        </div>

        <div>
          <label htmlFor="profile">Profile Picture: </label>
          <input
            type="file"
            id="profile"
            name="profile"
            onChange={handleChange}
            required={req}
          />
          {profilePreview && (
            <div className="file-preview">
              <img src={profilePreview} alt="Profile Preview" height={300} width={400} />
            </div>
          )}
        </div>

        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default CollegeUpdate;
