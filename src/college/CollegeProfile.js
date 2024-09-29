import { React, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './college.css'
import logo from '../student/logo.png'

function CollegeProfile() {
  const { username } = useParams();
  console.log(username);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    student_count: 0,
    students_male: 0,
    students_female: 0,
    students_above_8: 0,
    students_above_9: 0,
    dsa_skill: 0,
    web_dev_skill: 0,
    ml_skill: 0,
  });
  const [stats2, setstats2] = useState({
    percentage: 0,
    ranking: 0
  })



  const [students, setStudents] = useState(0);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [data, setData] = useState([]);
  const [disablePrev, setDisablePrev] = useState(false);
  const [disableNext, setDisableNext] = useState(true);




  // Update students list based on username
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
          setstats2({ college_percentage: resp.message.percentage, college_required: resp.message.ranking });
        } else {
          const resp = await response.json();
          alert(resp.message);
        }
      } catch (err) {
        console.log(err);
        alert("Internal server error");
      }

    };

    const getStats = async () => {

      try {
        const response = await fetch(`https://backend-jazee.onrender.com/college/${username}/stats`, {
          headers: {
            'content-Type': 'application/json',
          },
          method: "GET"
        });
        if (response.ok) {
          const resp = await response.json();
          setStats(resp.message);
          console.log(stats);
        } else {
          const resp = await response.json();
          alert(resp.message);
        }
      } catch (err) {
        console.log(err);
        alert("Internal server error");
      }

    };



    if (username) {
      console.log(username);
      getProfile();
      getStats();
    }
  }, [username]);

  // Update paginated data when page or students change

  useEffect(() => {
    const getData = async () => {
      try {

        const response = await fetch(`https://backend-jazee.onrender.com/college/${username}/students/?page=${page}`, {
          headers: {
            'content-Type': 'application/json',
          },
          method: "GET"
        });
        if (response.ok) {
          const resp = await response.json();
          setData(resp.message);
          setMaxPage(resp.totalPages);
          setStudents(resp.count);
        } else {
          const resp = await response.json();
          alert(resp.message);
        }
      } catch (err) {
        console.log(err);
        alert("Internal server error");
      }
    };
    if (username) {
      getData();
    }
  }, [username, page])

  const handlePage = async (button, event) => {
    event.preventDefault();
  
    if (page === 2) {
      if (button === "prev") { setDisablePrev(false); }

    }
    else if (page === maxPage - 1) {
      if (button === "next") { setDisableNext(false); }
    }
    else {
      setDisablePrev(true);
      setDisableNext(true);
    }
    if (button === "next") {
      if (page !== maxPage) {
        setPage(page + 1);
      }
    }
    else {
      if (page !== 1) {
        setPage(page - 1);
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


  const handleButton = (user) => {
    console.log(user);
    navigate(`/student/profile/${user.username}`);
  };
  const user = localStorage.getItem("user");
  const prev = user.split('+')[0]

  return (
    <div id="main1">
      hi {username} management;
     
      <div id="menu1">
        <button type="button" onClick={() => { navigate(`/${prev}`) }} >
          Back
        </button>
      </div>

      <div id="College">
        <div>
          <label className='college-label' htmlFor="full_name">previous year selected student percentage: </label>
          <p>{stats2.college_percentage}</p>
        </div>
        <div>
          <label className='college-label' htmlFor="degree">Ranking of the college: </label>
          <p>{stats2.college_required}</p>
        </div>
        {(students === 0) && (<p id="sorry" style={{ position: "absolute", justifySelf: "center", top: "50%" }}>Sorry, we don't have details of your students.</p>)}
        {(students>0)&& (
          <>
        <div>
          <label className='college-label' htmlFor="full_name">Total no.of students: </label>
          <p>{stats.student_count}</p>
        </div>
        <div>
          <label className='college-label' htmlFor="degree">Total no.of Male students: </label>
          <p>{stats.students_male}</p>
        </div>
        <div>
          <label className='college-label' htmlFor="degree">Total no.of Female students: </label>
          <p>{stats.students_female}</p>
        </div>
        <div>
          <label className='college-label' htmlFor="degree">Total no.of students above 9 grade points: </label>
          <p>{stats.students_above_9}</p>
        </div>
        <div>
          <label className='college-label' htmlFor="degree">Total no.of  students above 8 grade points: </label>
          <p>{stats.students_above_8}</p>
        </div>


        <div>
          <label className='college-label' htmlFor="phno">Total no.of students having DSA skill: </label>
          <p>{stats.dsa_skill}</p>
        </div>
        <div>
          <label className='college-label' htmlFor="phno">Total no.of students having web-dev skill: </label>
          <p>{stats.web_dev_skill}</p>
        </div>
        <div>
          <label className='college-label' htmlFor="phno">Total no.of students having ai/ml skill: </label>
          <p>{stats.ml_skill}</p>
        </div> 
        </>
        )}

      </div>
      {(students>0)&& (
        <>
      <p>These are short profiles of your students: {students}</p>
      <div id="students-map">
        {data.map((user, index) => (
          <div id="student-map-container" key={index}>
            <div className='map-menu'>
              <div id="image-container"><img src={logo} height={100} alt="Profile" /></div>
              <button type="button" style={{ fontSize: "20px" }} onClick={() => handleButton(user)}>Full</button>

            </div>
            <div>Name: {user.full_name}</div>
            <div>Grade: {user.grade}</div>
            <div>Gender: {user.gender}</div>
            {user.skills.length >0 && (<div >Skills: {user.skills.join(', ')}</div>)}
          </div>
        ))}
      </div>
      <div id="college-page">
        {disablePrev && (<button type="button" onClick={(event) => handlePage("prev", event)}>Prev</button>)}
        <span>{page}</span>
        {disableNext && (<button type="button" onClick={(event) => handlePage("next", event)}>Next</button>)}
      </div>
      </>
        )}


    </div>
  )
}
export default CollegeProfile;