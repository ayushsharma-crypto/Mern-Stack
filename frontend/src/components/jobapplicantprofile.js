import React,{ useEffect,useLayoutEffect, useState } from 'react'
import { Container,Row,Col,Button, Card, Form,Nav ,Navbar,InputGroup,FormControl, ProgressBar } from 'react-bootstrap';
import logo from './j.png'
import {checkedLogged, getProfile, updateJobApplicantProfile, signOut, JobApplicantSkill, JobApplicantEducation} from '../sources/connectapi'

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
function Singleskill(props){
    const [disp, setDisp] = useState(false);

    function handlesubmit(e){
        e.preventDefault();
        setDisp(true);
        JobApplicantSkill(props.skill,"delete");
    }

    return (
        <Form inline style={disp?{display:"none",fontWeight:"800",margin:"0px 10px 10px 0px"}:{display: "block",fontWeight:"800",margin:"0px 10px 10px 0px"}}>
            <InputGroup style={{border:'2px solid black',width:"220px",borderRadius:'5px'}}>
                <FormControl
                type="text"
                placeholder="Remove Skill"
                defaultValue={props.skill}
                style={{border:'none',paddingTop:"6px",paddingBottom:"6px",color:"black",fontWeight:"800",borderRight:"2px solid #22272B"}}
                />
                <InputGroup.Append>
                <Button title="remove" onClick={handlesubmit} variant="outline-dark" className="pl-3 pr-3" size="sm" style={{fontWeight:"800",fontSize:"20px",border:'none'}}>-</Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    );
}

function Allskill(){
    
    const [formData, updateFormData]=useState({});
    function temp(item){ return (<Singleskill key={Math.random()} skill={item} />);}

    useEffect(()=>{
        var mounted=true;
        getProfile("jobapplicant").then(items => {
            // console.log(items);
            if(mounted){
                updateFormData(items);
            }
        })
        return () => mounted = false;
    },[])
    const finalshow = formData.skill;
    // console.log(finalshow);
    
    if(finalshow){
        return ( <Row style={{padding:"20px 14px"}}>{finalshow.map(temp)}</Row> );
    }
    else{
        return (<h1>Loading...</h1>);
    }
}

function Addskill(){
    const [addSkill, updateAddSkill] = useState({skill:""});
    function handlesubmit(e){
        e.preventDefault();
        if(addSkill.skill===""){alert("Skill cannot be empty");}
        else{JobApplicantSkill(addSkill.skill,"add");}
    }

    
    const handleChange = (e) => {
      updateAddSkill({
        ...addSkill,
  
        // Trimming any whitespace
        [e.target.name]: e.target.value.trim()
      });
    };

    return(
    <Form style={{fontWeight:"800"}} onSubmit={handlesubmit}>
        <InputGroup style={{border:'2px solid black',width:"223px",borderRadius:'5px'}}>
            <FormControl
            type="text"
            placeholder="Add New Skill"
            name="skill"
            onChange={handleChange}
            style={{border:'none',paddingTop:"6px",paddingBottom:"6px",borderRight:"2px solid #22272B"}}
            />
            <InputGroup.Append>
            <Button onClick={handlesubmit} title="add skill" variant="outline-dark" className="pl-3 pr-3" size="sm" style={{fontWeight:"800",fontSize:"20px",border:'none'}}>+</Button>
            </InputGroup.Append>
        </InputGroup>
    </Form>
    );
}

function SingleEducation(props){

    const [disp, setDisp] = useState(false);
    
    const [formData, updateFormData]=useState({
        old_institute: props.education.institute,
        old_startyear: props.education.startyear,
        old_endyear: props.education.endyear,
        institute: props.education.institute,
        startyear: props.education.startyear,
        endyear: props.education.endyear
    });
    // console.log(formData);
    function handlesubmit(e){
        e.preventDefault();
        if(!formData.institute){alert("Education Institute cannot be empty");}
        else if(!formData.startyear){alert("Start Year cannot be empty");}
        // else if(formData.startyear > Date().getFullYear()){alert("hi");}
        else if(formData.endyear && formData.startyear > formData.endyear){
            alert("Wrong Start and End year");
        }
        else{
            JobApplicantEducation(formData,"edit");
        }
    }

    function handlesubmitdelete(e){
        e.preventDefault();
        setDisp(true);
        JobApplicantEducation(formData,"delete");
    }

    const handleChange = (e) => {
        updateFormData({
          ...formData,
          // Trimming any whitespace
          [e.target.name]: e.target.value.trim()
        });
      };

    return (
        <div style={disp?{display:"none",postion:"relative"}:{position: "relative",display:"block"}}>
            <Row  className="my-5">
                {/* <i style={{position:"absolute",top:"0px",right:"20px"}} className="far fa-2x fa-minus-square"></i> */}
                <Col  style={{color:"#grey", borderRight:"2px solid #e5e7eb"}}>
                <i className="fas fa-graduation-cap " style={{fontSize:"24px"}}></i>
                </Col>
                <Col sm="11">
                <input name="institute" onChange={handleChange} style={{border:"none",borderBottom:"2px solid #e5e7eb",width:"97%", paddingLeft:"10px",marginBottom:"2px"}} defaultValue={props.education.institute} />
                <br></br>
                <input onBlur={yearValidation} onKeyPress={yearValidation} name="startyear" onChange={handleChange} style={{border:"none",borderBottom:"2px solid #e5e7eb",width:"60px", paddingLeft:"10px"}} defaultValue={props.education.startyear}></input><span>-</span>
                <input onBlur={yearValidationend} onKeyPress={yearValidationend} name="endyear" onChange={handleChange} style={{border:"none",borderBottom:"2px solid #e5e7eb",width:"60px", paddingLeft:"10px",marginLeft:"10px"}} defaultValue={props.education.endyear}></input>
                {/* <Button onClick={handlesubmit} variant="outline-dark" style={{padding:"1px 5px",margin:"0 0 0 20px",border:"2px solid black"}}>Update</Button> */}
                <br /><Button onClick={handlesubmit} variant="outline-dark" style={{margin:"10px 0 0 0px",border:"2px solid black"}}>Update</Button>
                <Button onClick={handlesubmitdelete} variant="outline-dark" style={{margin:"10px 0 0 10px",border:"2px solid black"}}>Delete</Button>
                </Col>
            </Row>
        </div>
    );
}

function AllEducation(){

    const [formData, updateFormData]=useState({});
    function temp(item){ return (<SingleEducation key={Math.random()} education={item} />);}

    useEffect(()=>{
        var mounted=true;
        getProfile("jobapplicant").then(items => {
            // console.losg(items);
            if(mounted){
                updateFormData(items);
            }
        })
        return () => mounted = false;
    },[])
    const finalshow = formData.education;
    // console.log(finalshow);
    
    if(finalshow){
        return ( <div id="JPEDU" >{finalshow.map(temp)}</div> );
    }
    else{
        return (<h1>Loading...</h1>);
    }
}

function yearValidation(ev) {
    var year = ev.target.value;

    var text = /^[0-9]+$/;
    if(ev.type==="blur" || (year.length===4 && ev.keyCode!==8 && ev.keyCode!==46)) {
      if (year !== 0) {
          if ((year !== "") && (!text.test(year))) {
  
              alert("Please Enter Numeric Values Only");
              return false;
          }
  
          if (year.length !== 4) {
              alert("Year is not proper. Please check");
              return false;
          }
        //   var current_year=new Date().getFullYear();
        //   if((year < 1920) || (year > current_year))
        //       {
        //       alert("Year should be in range 1920 to current year");
        //       return false;
        //       }
          return true;
      } }
  }

function yearValidationend(ev){
    if(ev.target.value){
        return yearValidation(ev);
    }
}

function AddEducation(){
    const [addEducation, updateAddEduction] = useState({
        institute:"",
        start:null,
        end:null
    });
    function handlesubmit(e){
        e.preventDefault();
        if(!addEducation.institute){alert("Education Institute cannot be empty");}
        else if(!addEducation.start){alert("Start Year cannot be empty");}
        else if(addEducation.end && addEducation.start > addEducation.end){
            alert("Wrong Start and End year");
        }
        else{JobApplicantEducation(addEducation,"add");}
    }

    
    const handleChange = (e) => {
      updateAddEduction({
        ...addEducation,
  
        // Trimming any whitespace
        [e.target.name]: e.target.value.trim()
      });
    };

    return (
        <Form style={{fontWeight:"800",marginTop:"50px"}}>
            <InputGroup style={{border:'2px solid black',width:"270px",borderRadius:'5px'}}>
                <FormControl
                type="text"
                placeholder="New"
                onChange={handleChange}
                name="institute"
                style={{border:'none',paddingTop:"6px",paddingBottom:"6px",borderRight:"3px solid #22272B"}}
                />
                <FormControl
                type="text"
                placeholder="Start"
                onBlur={yearValidation} 
                onKeyPress={yearValidation}
                onChange={handleChange}
                name="start"
                style={{border:'none',paddingTop:"6px",paddingBottom:"6px",borderRight:"3px solid #22272B"}}
                />
                <FormControl
                type="text"
                placeholder="End(If)"
                name="end"
                onBlur={yearValidationend} 
                onKeyPress={yearValidationend}
                onChange={handleChange}
                style={{border:'none',paddingTop:"6px",paddingBottom:"6px",borderRight:"2px solid #22272B"}}
                />
                <InputGroup.Append>
                <Button onClick={handlesubmit} variant="outline-dark" className="pl-3 pr-3" size="sm" style={{fontWeight:"800",fontSize:"20px",border:'none'}}>+</Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    );
}

function Rating(props){
    return(
        <Container style={{width:"100%",margin:"0"}}>
        <Row><span style={{fontweight:"800",fontSize:"20px",margin:"0 5px 0 0"}}>5</span><ProgressBar variant="info" now={props.five} className="my-2" style={Screen992()?{width:'40%'}:{width:"90%"}} /></Row>
        <Row><span style={{fontweight:"800",fontSize:"20px",margin:"0 5px 0 0"}}>4</span><ProgressBar variant="info" now={props.four} className="my-2" style={Screen992()?{width:'40%'}:{width:"90%"}} /></Row>
        <Row><span style={{fontweight:"800",fontSize:"20px",margin:"0 5px 0 0"}}>3</span><ProgressBar variant="info" now={props.three} className="my-2" style={Screen992()?{width:'40%'}:{width:"90%"}} /></Row>
        <Row><span style={{fontweight:"800",fontSize:"20px",margin:"0 5px 0 0"}}>2</span><ProgressBar variant="info" now={props.two} className="my-2" style={Screen992()?{width:'40%'}:{width:"90%"}} /></Row>
        <Row><span style={{fontweight:"800",fontSize:"20px",margin:"0 5px 0 0"}}>1</span><ProgressBar variant="info" now={props.one} className="my-2" style={Screen992()?{width:'40%'}:{width:"90%"}} /></Row>
        </Container>
    );
}


function Profile(props){


    const [formData, updateFormData]=useState({});
    
    const handleChange = (e) => {
      updateFormData({
        ...formData,
  
        // Trimming any whitespace
        [e.target.name]: e.target.value.trim()
      });
    };

    function handlesubmit(event){
    // console.log(formData);

        var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        event.preventDefault();
        if(!formData.fullname )
        { alert("Fullname cannot be empty!");}
        if(!formData.mail )
        { alert("Mail cannot be empty!");}
        else if(!formData.mail.match(mailformat)){
            alert("Invalid email!");
        }
        else {updateJobApplicantProfile(formData)}
    }

    useEffect(()=>{
        var mounted=true;
        getProfile("jobapplicant").then(items => {
            // console.log(items);
            if(mounted){
                updateFormData(items);
            }
        })
        return () => mounted = false;
    },[])



    return (
        <Form style={{fontWeight:"800"}}>
            <Form.Row>
                <Form.Group as={Col} sm="6">
                <Form.Label >Full Name</Form.Label>
                <Form.Control onChange={handleChange} name="fullname" defaultValue={formData.fullname} type="text" placeholder="Full Name" />
                </Form.Group>
            </Form.Row>
            <Form.Row>                
                <Form.Group as={Col} sm="6">
                <Form.Label >Email</Form.Label>
                <Form.Control onChange={handleChange} name="mail" defaultValue={formData.mail} type="email" placeholder="Enter email" />
                </Form.Group>
            </Form.Row>


            <Button onClick={handlesubmit} variant="outline-dark" style={{width:'150px',fontWeight:"800",marginTop:"20px",border:"2px solid black"}} type="submit">
                Update
            </Button>

            
        </Form>

    );
}


function Jobseekerprofile(){
    checkedLogged();
    
    return (
        <div>
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
                    <Nav.Link style={{fontSize:"20px",fontWeight:'light'}} href="/jobapplicant" className="mr-3 "><i className="fas fa-database" style={{marginRight:"10px"}}></i>JobLists</Nav.Link>
                    {/* <Nav.Link style={{fontSize:"20px",fontWeight:'light'}} href="#back"  ><i className="fas fa-chevron-circle-left" style={{marginRight:"10px"}}></i>Back</Nav.Link> */}
                    <Nav.Link style={{fontSize:"20px",fontWeight:'light'}} onClick={()=>{signOut();}}  ><i className="fas fa-chevron-circle-left" style={{marginRight:"10px"}}></i>SignOut</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                </Navbar>
            
                </div>
                
            </div>
            
            <div style={{maxWidth:'100%',padding:"40px 0px"}}>
                <Container style={{maxWidth:"1200px"}}>
                    <Row>
                        <Col lg={4}>
                                <Card style={Screen992()?{position:"sticky",top:"130px", width: '320px',height:'470px',border:'none'}:{position:"static",margin:"auto" , width: '270px',height:'350px',border:'none'}}>
                                    <Card.Img variant="left" src={logo} style={{border:"2px solid black",height:"300px",padding:'0',backgroundColor:"black",borderRadius:"5px",boxShadow:'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px'}} />
                                    <Card.Body style={{paddingLeft:'0px',paddingRight:'0'}}>
                                        <Row>
                                    <Col><Button variant="outline-dark" style={{border:"2px solid black", width:'101%',boxShadow:'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px'}}>Update</Button></Col>
                                    <Col><Button variant="outline-dark" style={{border:"2px solid black",width:'101%',boxShadow:'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px'}}>Default</Button></Col>
                                    </Row>
                                    </Card.Body>
                                </Card>
                        </Col>
                        <Col  lg={8}>
                            <div style={{width:"100%",boxShadow:'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px',padding:"40px 20px",borderRadius:"10px"}}>
                                <Row><Col xs="5" sm="4" md={3}><h1>Profile</h1></Col><Col><h5 xs="5" sm="6" style={{marginTop:"17px",color:"grey",fontWeight:"800"}}>[Applicant]</h5></Col></Row>
                                <hr style={{border:"0.5px solid #e5e7eb",height:"0",marginBottom:"50px",marginTop:"20px"}}></hr>
                                <Profile />


                                
                                <Row style={{marginTop:'80px'}}><Col xs="5" sm="4" md={3}><h1>Rating</h1></Col><Col><h5 xs="5" sm="6" style={{marginTop:"17px",color:"grey",fontWeight:"800"}}>[Avg = 4.5]</h5></Col></Row>
                                <hr style={{border:"0.5px solid #e5e7eb",height:"0",marginBottom:"50px",marginTop:"20px"}}></hr>
                                <Rating five="60" four="30" three="70" two="40" one="56"/>



                                <h1 style={{marginTop:'80px'}}>Skills</h1>
                                <hr style={{border:"0.5px solid #e5e7eb",height:"0",marginBottom:"50px",marginTop:"20px"}}></hr>
                                <Allskill />
                                <Addskill />


                                <h1 style={{marginTop:'80px'}}>Education</h1>
                                <hr style={{border:"0.5px solid #e5e7eb",height:"0",marginBottom:"50px",marginTop:"20px"}}></hr>
                                <div style={{width:"100%",padding:"0",margin:"0"}}>
                                <AllEducation />
                                <AddEducation />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default Jobseekerprofile;