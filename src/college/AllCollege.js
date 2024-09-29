import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function AllCompany() {
  const user = localStorage.getItem('user');
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(false);
  const [students, setStudents] = useState(0);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [data, setData] = useState([]);
  const [disablePrev, setDisablePrev] = useState(false);
  const [disableNext, setDisableNext] = useState(true);

  // Get username from user on initial render
  useEffect(() => {
    if (user) {
      setUsername(user.split('+')[1]);
    }
  }, [user]);

  // Fetch profile data
  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetch(`https://backend-jazee.onrender.com/college/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setProfile(true);
        } else {
          setProfile(false);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (username) {
      getProfile();
    }
  }, [username]);

  // Fetch company data
  const getData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://backend-jazee.onrender.com/recuiter/sort/student/?page=${page}&type=college`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        }
      );

      if (response.ok) {
        const resp = await response.json();
        if (resp.message.length > 0) {
          setData(resp.message);
          setMaxPage(resp.maxpages);
          setStudents(resp.Total);
        } else {
          alert('Sorry, no roles available');
        }
      } else {
        const resp = await response.json();
        alert(resp.message);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      alert('Internal server error');
    }
  }, [page]);

  useEffect(() => {
    if (username) {
      getData();
    }
  }, [page, username, getData]);
console.log(maxPage);
  // Handle pagination
  const handlePage = async (button, event) => {
    event.preventDefault();
   
    if(page===2)
    {
      if(button==="prev")
      {setDisablePrev(false);}

    }
    else if(page===maxPage-1)
    { if(button==="next")
      {setDisableNext(false);}
    }
    else
    {
      setDisablePrev(true);
      setDisableNext(true);
    }
    if(button==="next")
    {
      if(page!==maxPage)
      {
        setPage(page+1);
      }
    }
    else
    {
      if(page!==1)
      {
        setPage(page-1);
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


  // Handle company application
  const applicationHandler = async (event, comp) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/recuiter/save/college/?rec=${comp.username}&college=${username}`,
        { method: 'GET' } 
      );
      const resp = await response.json();
      alert(resp.message);
      getData(); // Refresh the data after application
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('Internal server error');
    }
  };

  if (!username) {
    return (
      <div>
        <div>
          First login to see total roles{' '}
          <button onClick={() => navigate('/college')}>Back</button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        Update your  college profile to see the roles you can apply for{' '}
        <button onClick={() => navigate('/college')}>Back</button>
      </div>
    );
  }

  return (
    <>
      <button onClick={() => navigate('/college')}>Back</button>
      <div id="student-company" style={{marginTop:"0px" }}>
        <h1>Available Companies: {students}</h1>
        {students > 0 && (
          <>
            <div>These are the companies available in our database</div>
            <table>
              <thead>
                <tr>
                  <th>S No</th>
                  <th>Name</th>
                  <th>Ranking required </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((comp, index) => (
                  <tr key={comp.id}>
                    <td>{(page - 1) * 3 + index + 1}</td>
                    <td>
                      <div id="image-container">
                        <img
                          src={'/uploads/images/' + comp.profile}
                          height="50px"
                          width="50px"
                          alt="logo of company"
                        />
                      </div>
                      <div>{comp.username}</div>
                    </td>
                    
                    <td>{comp.company_rank_cutoff}</td>
                    <td>
                      <button onClick={(event) => applicationHandler(event, comp)}>
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        { (
          <div id="page">
           {(disablePrev) && (  <button onClick={(event) => handlePage('prev', event)}>
              Prev
            </button>)}
            <button>{page}</button>
           {(disableNext) && ( <button onClick={(event) => handlePage('next', event)}> 
              Next
            </button>)}
          </div>
        )}
      </div>
    </>
  );
}

export default AllCompany;
