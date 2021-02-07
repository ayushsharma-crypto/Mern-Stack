import React, { useLayoutEffect, useState } from 'react';
import { Navbar, Nav , Container, Row, Col, Button, Form, FormControl,InputGroup} from 'react-bootstrap';
import logo from './j.png'
// import { Sortpallet, Filterpallet, AllRG} from "./jobcard"
import {AllRG, Filterpallet, Sortpallet} from "./jobcard"
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

function MyNavBar(props){


  const [jobname, updatejobname]=useState(props.value);
  function handleGo(e){
      e.preventDefault();
      props.onClicked(jobname);
  }

  const handleOn = (e) => {
    updatejobname({
      ...jobname,

      // Trimming any whitespace
      [e.target.name]: e.target.value.trim()
    });
  };

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

                    <Form title="job title search( fusy too)" onSubmit={handleGo}>
                        <InputGroup className="mt-3 mt-sm-0" size="md" style={{border:'2px solid black',borderRadius:'5px'}}>
                            <FormControl
                            type="text"
                            placeholder="Search Your Dream Job"
                            style={{border:'none'}}
                            name="jobname"
                            onChange={handleOn}
                            />
                            <InputGroup.Append>
                            <Button onClick={handleGo} variant="outline-dark" className="pl-3 pr-3" size="sm" style={{border:'none'}}><i className="fas fa-search"></i></Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>

                    <Nav className="ml-auto">
                    <Nav.Link style={{fontSize:"20px",fontWeight:'light'}} href="/profile/jobapplicant" className="mr-3 "><i className="fas fa-user-circle" style={{marginRight:"10px"}}></i>Profile</Nav.Link>
                    <Nav.Link style={{fontSize:"20px",fontWeight:'light'}} href="/Myapp"  ><i className="fas fa-database" style={{marginRight:"10px"}}></i>Applications</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                </Navbar>
            
                </div>
                
        </div>
    );
}
 
function Jobapplicant(){
    checkedLogged();

    const [sorting, updateSortVar]=useState({
        sortVar: null,
        order: null
    });
    function handlesorting(newSort){
        updateSortVar({...newSort});
    }
    const [filtering, updateFiltering]=useState({
        type: 0,
        minSalary: 0,
        maxSalary: Infinity,
        duration: 7
    });
    function handlefiltering(newSort){
        updateFiltering({...newSort});
    }
    
    const [ jobname, updatejobname]=useState({jobname:""});
    function handlejobname(newjob){
        updatejobname({...newjob});
    }
    
    // console.log(jobname);
    return (
        <div>
            <MyNavBar value={jobname} onClicked={handlejobname} />
            
            <div style={{maxWidth:'100%',padding:"40px 10px"}}>
                <Container style={{maxWidth:"1200px",}}>
                    <Row>
                        <Col lg={4}>
                            <Row style={Screen992()?{position:"sticky",top:"130px"}:{position:"static"}} >
                                <Col  sm="6" lg="12">
                                    <Sortpallet value={sorting} onClicked={handlesorting} />
                                </Col>
                                <Col sm="6" lg="12">
                                    <Filterpallet value={filtering} onClicked={handlefiltering} />
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={8}>
                            <AllRG  SORT={sorting} FILTER={filtering} JOBNAME={jobname} />
                        </Col>
                    </Row>
                </Container>
            </div>

        </div>

    );
}

export default Jobapplicant;