import React,{useState, useEffect} from "react"
import { Navbar, Nav , Button,Row, Col, Form,Container} from 'react-bootstrap';
import {getmyapp} from "../sources/dashboard"
import {checkedLogged} from "../sources/connectapi"
import logo from './j.png'



function SingleApplicant(props){
    var date = new Date(props.jobperson.joiningdate).toLocaleString();
    return (
            <tr>
                <td style={{padding:"10px 5px",width:"140px",border:"3px solid black"}} >{props.jobperson.title}</td>
                <td style={{padding:"10px 5px",width:"140px",border:"3px solid black"}} >{date}</td>
                <td style={{padding:"10px 5px",width:"140px",border:"3px solid black"}} >{props.jobperson.salary}</td>
                <td style={{padding:"10px 5px",width:"140px",border:"3px solid black"}} >{props.jobperson.recruitername}</td>
                <td style={{padding:"10px 5px",width:"130px",border:"3px solid black"}}  >{props.jobperson.status}</td>
                
            </tr>
    );
}

function ShowAllemployees(props){
    checkedLogged();
    
    const [formData, updateFormData]=useState();   
    function temp(item){
        //  console.log(item);
             return (<SingleApplicant key={Math.random()*1000}  jobperson={item} />);
        }

    useEffect(()=>{
        var mounted=true;
        getmyapp().then(items => {
            // console.log(items);
            if(mounted){
                updateFormData(items);
            }
        })
        return () => mounted = false;
    },[])
    

    if(formData){
        var finalshow = formData.messsage;
        // console.log(finalshow);
        
        
        return(<div style={{margin:"auto",padding:"20px",marginTop:"50px"}}>

            <h1 style={{marginBottom:"20px"}}>My Applications:</h1>
            <table style={{marginBottom:"30px",textAlign:"center"}}>
            <thead>
            <tr>
                <th style={{fontSize:"23px",padding:"20px 5px",width:"140px",border:"4px solid black"}} >Title</th>
                <th style={{fontSize:"23px",padding:"20px 5px",width:"140px",border:"4px solid black"}} >Joining Date</th>
                <th style={{fontSize:"23px",padding:"20px 5px",width:"140px",border:"4px solid black"}} >Salary per month</th>
                <th style={{fontSize:"23px",padding:"20px 5px",width:"140px",border:"4px solid black"}} >Recruiter</th>
                <th style={{fontSize:"23px",padding:"20px 5px",width:"130px",border:"4px solid black"}}  >Status</th>
            </tr>
            </thead>
            <tbody>
            {finalshow.map(temp)}
            </tbody>
            </table>
        </div>);
    }
    else{
        return (<h2>Loading...</h2>);
    }
}

function Allemployees(){
    
    return(<div>
        <MyNav />
        <ShowAllemployees />
    </div>);   
}

export default Allemployees;


  



function MyNav(){
    return(
        <div  style={{width:"100%",backgroundColor:"white",position:'sticky',top:'0px',zIndex:'10'}}>
                
            <div style={{width:"100%",borderBottom:"0.5px solid #e5e7eb",backgroundColor:"inherit",padding:"5px",display:"sticky",top:"0"}}>
                <Navbar style={{maxWidth:"1400px",margin:"auto"}} bg="inherit" expand="md" className="pl-8">
                <Navbar.Brand href="#home" style={{flexGrow:'1'}} className="mr-sm-5" >
                    <img
                    alt=""
                    src={logo}
                    width="50"
                    height="50"
                    className="d-inline-block align-top "
                    />{' '}
                    <h1 style={{margin:'0 0 0 5px',fontSize:'40px',color:'black',display:'inline'}}>JAP</h1>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{border:"2px solid gray"}} />

                <Navbar.Collapse className="justify-content-end-md mt-xs-3" >
                    <Nav className="ml-auto">
                    <Nav.Link style={{fontSize:"20px",fontWeight:'light'}} href="/profile/jobapplicant" className="mr-3 "><i className="fas fa-user-circle" style={{marginRight:"10px"}}></i>Profile</Nav.Link>
                    <Nav.Link style={{fontSize:"20px",fontWeight:'light'}} href="/jobapplicant"  ><i className="fas fa-columns" style={{marginRight:"10px"}}></i>Dashboard</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                </Navbar>
            
            </div>
                
        </div>
    );
}