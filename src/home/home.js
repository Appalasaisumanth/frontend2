import React from "react";
import { useNavigate } from 'react-router-dom';
import './home.css'
function Home(){
   const navigate = useNavigate();
    return(
        <div>
        <div>
        <div id="main">
            <p>llinked-link</p>
            
        </div>
        <div id="Home2">
        <div id="Home-home">
            heartly welcome to the linked-link
        <br>
        </br>
        <div>A bond creater between students,recuiters,and colleges </div>
        
        <br>
        </br>
        </div>
        < img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRsC6j3j32OtdSxWwnnyrhxHDTMNxL5YkMKQ&s" alt="developer-image" height={300}/>
        </div>
        </div>
        <div id="menu">
               
                <button onClick={()=>navigate('/login')}>
                    login
                </button>
                <button onClick={()=>navigate('/signup')}>
                    signup
                </button>
            </div>
            </div>

    );
};

export default Home