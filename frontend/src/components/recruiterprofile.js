import React,{ useEffect, useLayoutEffect, useState } from 'react'
import { Container,Row,Col,Button, Card, Form,Nav ,Navbar, ProgressBar } from 'react-bootstrap';
import logo from './j.png'
import {checkedLogged, getProfile, updateRecruiterProfile, signOut} from '../sources/connectapi'

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
        var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        event.preventDefault();
        if(!formData.fullname )
        { alert("Fullname cannot be empty!");}
        if(!formData.mail )
        { alert("Mail cannot be empty!");}
        else if(!formData.mail.match(mailformat)){
            alert("Invalid email!");
        }
        else if(!formData.contact){ alert("Contact cannot be empty!");}          
        else if(formData.contact.toString().match("[^0-9]")){ alert("Invalid Contact");}
        else if(!formData.bio){alert("Bio cannot be empty!");}
        else {updateRecruiterProfile(formData)}
    }

    useEffect(()=>{
        var mounted=true;
        getProfile("recruiter").then(items => {
            // console.log(items);
            if(mounted){
                updateFormData(items);
            }
        })
        return () => mounted = false;
    },[])

    // console.log(formData);

    // Handle max word limit of bio
    // var finalString="";
    const maxWordLimit=250;

    function Handlekeypress(event){
        var word_count= event.target.value.match(/\S+/g)
        if(!word_count){return;}
        word_count=word_count.length;

        if(word_count>maxWordLimit){
            var check = event.target.value.match(/^\s/);
            var trimmed=null;
            if(check){ 
                // console.log("ouyoyo");
                trimmed = event.target.value.split(/\s+/,maxWordLimit+1);
                var len = trimmed.length;
                trimmed = trimmed.slice(1, len).join(" ");
            }
            else{
                trimmed = event.target.value.split(/\s+/,maxWordLimit).join(" ");
            }
            event.target.value= trimmed+" ";
        }
    }

    return (
        <Form style={{fontWeight:"800"}}>
            <Form.Row>
                <Form.Group as={Col} sm="12" controlId="formGridEmail">
                <Form.Label >Full Name</Form.Label>
                <Form.Control onChange={handleChange} name="fullname" defaultValue={formData.fullname} type="text" placeholder="Full Name" />
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} sm="6" controlId="formGridEmail">
                <Form.Label >Email</Form.Label>
                <Form.Control onChange={handleChange} name="mail" defaultValue={formData.mail} type="email" placeholder="Enter email" />
                </Form.Group>

                <Form.Group as={Col} sm="6" controlId="formGridContact">
                <Form.Label >Contact</Form.Label>
                <Form.Control onChange={handleChange} name="contact" defaultValue={formData.contact} type="tel" placeholder="Contact" />
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} sm="12" controlId="formGridBio">
                <Form.Label >Bio<span className="text-muted"> [Max {maxWordLimit} words]</span></Form.Label>
                <Form.Control onChange={handleChange} name="bio" defaultValue={formData.bio} as="textarea" rows={5} onKeyPress={Handlekeypress} />
                </Form.Group>
            </Form.Row>


            <Button onClick={handlesubmit} variant="outline-dark" style={{width:'150px',fontWeight:"800",marginTop:"20px",border:"2px solid black"}} type="submit">
                Update
            </Button>
        </Form>

    );
}

function Recruiterprofile(){

    // Checking Backend connection

    checkedLogged();

    return (
        <div>
            <div  style={{width:"100%",backgroundColor:"white",position:'sticky',top:'0px',zIndex:'10'}}>
                
                <div style={{width:"100%",borderBottom:"0.5px solid #e5e7eb",backgroundColor:"inherit",padding:"5px",display:"sticky",top:"0"}}>
                <Navbar style={{maxWidth:"1400px",margin:"auto"}} bg="inherit" expand="md" className="pl-8">
                <Navbar.Brand href="/" style={{flexGrow:'1'}} className="mr-sm-5" >
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
                    {/* <Nav.Link style={{fontSize:"20px",fontWeight:'light'}} href="/recruiter" className="mr-3 "><i className="fas fa-database" style={{marginRight:"10px"}}></i>JobLists</Nav.Link> */}
                    {/* <Nav.Link style={{fontSize:"20px",fontWeight:'light'}} href="#back"  ><i className="fas fa-chevron-circle-left" style={{marginRight:"10px"}}></i>Back</Nav.Link> */}
                    <Nav.Link style={{fontSize:"20px",fontWeight:'light'}} href="/recruiter"  ><i className="fas fa-columns" style={{marginRight:"10px"}}></i>Dashboard</Nav.Link>
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
                                

                                <Row><Col xs="5" sm="4" md={3}><h1>Rating</h1></Col><Col><h5 xs="5" sm="6" style={{marginTop:"17px",color:"grey",fontWeight:"800"}}>[Avg = 4.5]</h5></Col></Row>
                                <hr style={{border:"0.5px solid #e5e7eb",height:"0",marginBottom:"50px",marginTop:"20px"}}></hr>
                                <Rating five="60" four="30" three="70" two="40" one="56"/>


                                <Row style={{marginTop:"80px"}}><Col xs="5" sm="4" md={3}><h1>Profile</h1></Col><Col><h5 xs="5" sm="6" style={{marginTop:"17px",color:"grey",fontWeight:"800"}}>[Recruiter]</h5></Col></Row>
                                <hr style={{border:"0.5px solid #e5e7eb",height:"0",marginBottom:"50px",marginTop:"20px"}}></hr>
                                <Profile />

                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default Recruiterprofile;