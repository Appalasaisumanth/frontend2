import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './student/App-student';
import App1 from'./college/App-college.js';
import App2 from'./recuiter/App-recuiter.js';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Forgot from './auth/Forget_password';
import Newstudent from './student/New-student.js';
import StudentUpdate from './student/StudentUpdate.js';
import reportWebVitals from './reportWebVitals';
import Profile from './student/profile.js';
import Logout from './auth/logout.js';
import Home from './home/home';
import AddStudent from './college/AddStudent.js';
import CollegeStats from './college/CollegeStats.js';
import CollegeProfile from './college/CollegeProfile.js';
import StudentProfile from './college/StudentProfile.js'
import RecuiterStudent from './recuiter/RecuiterStudent.js';
import RecuiterCollege from './recuiter/RecuiterCollege.js';
import RecuiterNew from './recuiter/RecuiterNew.js';
import RecuiterUpdate from './recuiter/RecuiterUpdate.js';
import CollegeNew from './college/CollegeNew.js';
import CollegeUpdate from './college/CollegeUpdate.js';
import RecuiterProfile from './recuiter/RecuiterProfile.js';
import AllCompany from './student/AllCompany.js';
import AllCollege from './college/AllCollege.js';
import College from './recuiter/Colleges.js';
import Students from './recuiter/Students.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/student" element={<App />} />
      <Route path="/college" element={<App1 />} />
      <Route path="/recuiter" element={<App2 />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot_password" element={<Forgot />} />
      <Route path='/student/new' element={<Newstudent/>}/>
      <Route path='/student/update' element={<StudentUpdate/>}/>
      <Route path='/student/profile' element={<Profile/>}/>
      <Route path='/student/sort' element ={<AllCompany/>}/>
      <Route path='/logout' element={<Logout/>}/>
      <Route path="/college/new" element={<CollegeNew />} />
      <Route path="/college/update" element={<CollegeUpdate />} />
      <Route path="/college2/new" element={<AddStudent />} />
      <Route path="/college/stats" element={<CollegeStats />} />
      <Route path='/college/sort' element ={<AllCollege/>}/>
      <Route path="/student/profile/:username" element={<StudentProfile />} />
      <Route path="/college/profile/:username" element={<CollegeProfile />} />
      <Route path="/recuiter/student" element={<RecuiterStudent />} />
      <Route path="/recuiter/college" element={<RecuiterCollege />} />
      <Route path="/recuiter/new" element={<RecuiterNew />} />
      <Route path="/recuiter/update" element={<RecuiterUpdate />} />
      <Route path="/recuiter/Profile" element={<RecuiterProfile />} />
      <Route path="/recuiter/sort/students" element={<Students/>} />
      <Route path="/recuiter/sort/colleges" element={<College/>} />

      



      </Routes>
    </Router>
    
   
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
      