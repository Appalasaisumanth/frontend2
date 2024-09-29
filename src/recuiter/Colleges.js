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
                const response = await fetch(`https://backend-jazee.onrender.com/recuiter/${username}`, {
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
                `https://backend-jazee.onrender.com/college/rec/sort/?page=${page}`,
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
                    setStudents(resp.count);
                } else {
                    alert('Sorry, no students avialble');
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

        if (maxPage === 2 && page === 1) {
            setDisablePrev(true);

        }
        if (maxPage === 2 && page === 2) {
            setDisableNext(true);

        }
        if (maxPage === 2 && page === 1) {
            setDisablePrev(true);

        }
        if (maxPage === 3 && page === 2 && button === "next") {
            setDisableNext(false);

        }

    };
    const handleButton = (user) => {
        console.log(user);
        navigate(`/college/profile/${user.username}`);
      };



    if (!username) {
        return (
            <div>
                <div>
                    First login to see total roles{' '}
                    <button onClick={() => navigate('/recuiter')}>Back</button>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div>
                Update your profile to see the roles you can apply for{' '}
                <button onClick={() => navigate('/recuiter')}>Back</button>
            </div>
        );
    }

    return (
                <>
            <button onClick={() => navigate('/recuiter')}>Back</button>
            <div id="student-company" style={{ marginTop: "50px" }}>
                <h1>Available Colleges: {students}</h1>
                {students > 0 && 
                    
                        <div id="students-map">
                            {data.map((user, index) => (
                                <div id="student-map-container" key={index}   style={{height:"180px"}}>
                                    <div className='map-menu'>
                                        <div id="image-container"><img src={"/uploads/images/"+user.profile} height={100} alt="Profile" /></div>
                                        <button type="button" style={{ fontSize: "20px" }} onClick={() => handleButton(user)}>Full</button>


                                    </div>
                                    <div style={{fontSize:"18px"}}>Name: {user.username}</div>
                                    <div style={{fontSize:"18px"}}>Previous year placed percentage: {user.percentage}</div>
                                    <div style={{fontSize:"18px"}}>Rank: {user.ranking}</div>
                                </div>))}
                            
                                </div>                
                }
                </div>
                



                        <div id="page" style={{marginTop:"0px"}}>
                            {(disablePrev) && (<button onClick={(event) => handlePage('prev', event)}>
                                Prev
                            </button>)}
                            <button>{page}</button>
                            {(disableNext) && (<button onClick={(event) => handlePage('next', event)}>
                                Next
                            </button>)}
                        </div>
                </>

    


            );  
          
  
        
}
                export default AllCompany;
