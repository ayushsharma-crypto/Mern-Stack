import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"


import Landingpage from "./components/landingpage"
import Signup from "./components/signup"
import Signin from "./components/signin"
import Jobapplicant from "./components/jobapplicant"
import Recruiter from "./components/recruiter"
import Jobapplicantprofile from "./components/jobapplicantprofile"
import Recruiterprofile from "./components/recruiterprofile"
import Jobapplication from "./components/jobapplications"
import Employees from "./components/employees"
import Myapp from "./components/myapp"
function App() {
  return (
    <Router>
        <Route path="/" exact component={Landingpage}/>
        <Route path="/signup" exact component={Signup}/>
        <Route path="/signin" exact component={Signin}/>
        <Route path="/profile/recruiter" exact component={Recruiterprofile}/>
        <Route path="/profile/jobapplicant" exact component={Jobapplicantprofile}/>        
        <Route path="/jobapplicant" exact component={Jobapplicant}/>        
        <Route path="/recruiter" exact component={Recruiter}/>       
        <Route path="/jobapplication/:jobID" exact component={Jobapplication} /> 
        <Route path="/employees" exact component={Employees} /> 
        <Route path="/Myapp" exact component={Myapp} /> 
    </Router>
  );
}

export default App;