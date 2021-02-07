import React, { useLayoutEffect, useState } from 'react';
import { Navbar, Nav , Container, Row, Col} from 'react-bootstrap';
import logo from './j.png'
import {AllJobs, AddJob} from "./recruitercards"
import {checkedLogged} from "../sources/connectapi"

function useMediaQuery() {
    const [screenSize, setScreenSize] = useState([0, 0]);
    
    useLayoutEffect(() => {
      function updateScreenSize() {
        setScreenSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener("resize", updateScreenSize);
      updateScreenSize();
      return () => window.removeEventListener("resize", updateScreenSize);
    }, []);
    
    return screenSize;
}

var Screen992 = () => {
    const [width] = useMediaQuery();
  
    return width <= 992 ? (
      0
    ) : (
      1
    );
};


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
                    <Nav.Link style={{fontSize:"20px",fontWeight:'light'}} href="/profile/recruiter" className="mr-3 "><i className="fas fa-user-circle" style={{marginRight:"10px"}}></i>Profile</Nav.Link>
                    <Nav.Link style={{fontSize:"20px",fontWeight:'light'}} href="/employees"  ><i className="fas fa-user-friends" style={{marginRight:"10px"}}></i>Employees</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                </Navbar>
            
            </div>
                
        </div>
    );
}
 
function Recruiter(){
    checkedLogged();

    return (
        <div>
            <MyNav />
            
            <div style={{maxWidth:'100%',padding:"40px 10px"}}>
                <Container style={{maxWidth:"1200px",}}>
                    <Row>
                        <Col lg={4}>
                            <Row style={Screen992()?{position:"sticky",top:"130px"}:{position:"static"}} >
                                <Col  sm="12">
                                    <AddJob />
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={8}>
                            <AllJobs />
                        </Col>
                    </Row>
                </Container>
            </div>

        </div>

    );
}

export default Recruiter;