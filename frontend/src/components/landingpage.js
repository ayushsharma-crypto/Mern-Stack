import React,  { useLayoutEffect, useState } from 'react';
import { Navbar, Nav , Container, Row, Col, Button, Badge} from 'react-bootstrap';
// import {LandingpageApi} from '../sources/connectapi'
import logo from './j.png'
import sideimg from './JPA1.png'

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
      1
    ) : (
      0
    );
};

var Screen500 = () => {
    const [width] = useMediaQuery();
  
    return width <= 500 ? (
      1
    ) : (
      0
    );
};

function Landingpage(){

    // const [backendData, setBackendData] = useState([]);
    // useEffect(()=>{
    //     var mounted=true;
    //     LandingpageApi()
    //     .then(items => {
    //         console.log(items);
    //         if(mounted){
    //             setBackendData(items)
    //         }
    //     })
    //     return () => mounted = false;
    // },[])

    return (
        <div style={{backgroundColor:"#F8F9FA"}}>

        <div  style={{width:"100%",backgroundColor:"white",position:'sticky',top:'0px',zIndex:'10'}}>
                
                <div style={{width:"100%",borderBottom:"0.5px solid #e5e7eb",backgroundColor:"inherit",padding:"5px",display:"sticky",top:"0"}}>
                <Navbar style={{maxWidth:"1400px",margin:"auto"}} bg="inherit" expand="md" className="pl-8">
                <Navbar.Brand href="/"  style={{flexGrow:'1'}} className="mr-sm-5" >
                    <img
                    alt=""
                    src={logo}
                    width="50"
                    height="50"
                    // border="primary"
                    className="d-inline-block align-top "
                    />{' '}
                    <h1 style={{margin:'0 0 0 5px',fontSize:'40px',color:'black',display:'inline'}}>JAP</h1>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{border:"2px solid gray"}} />

                <Navbar.Collapse className="justify-content-end-md mt-xs-3" >
                    <Nav className="ml-auto">
                    <Nav.Link style={{fontSize:"20px",fontWeight:'light'}} href="/signup" className="mr-3 ml-1"><i className="fas fa-user-plus" style={{marginRight:"10px"}}></i>SignUp</Nav.Link>
                    <Nav.Link style={{fontSize:"20px",fontWeight:'light'}} href="/signin"  ><i className="fas fa-sign-in-alt" style={{marginRight:"10px"}}></i>SignIn</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                </Navbar>
            
                </div>
                
            </div>
            

        <div  style={{width:"100%",backgroundColor:"#F8F9FA"}}>
            
            <Container style={{maxWidth:"1200px",marginTop:"100px",paddingBottom:"100px"}}>
                <Row span={3}>

                    <Col sm={12} xs={12} lg={{ order:2 }} style={ Screen992() ? {textAlign:'center',marginBottom:"80px"} : {textAlign:'left'} }>
                        <img alt="brand-JAP" src={sideimg} style={ Screen500() ? { width:"300px",height:'260px',border:"10px solid #e5e7eb", paddingLeft:"5px", paddingTop:"10px", paddingBottom:"10px",borderRadius:"10%" } : { width:'350px',height:'260px',border:"10px solid #e5e7eb", paddingLeft:"5px", paddingTop:"10px", paddingBottom:"10px",borderRadius:"10%" }}></img>
                    </Col>
                    <Col sm={12} xs={12} lg={7} style={ Screen992() ? {textAlign:'center'} : {textAlign:'left'} }>
                        <h1 style={{marginBottom:"40px",color:"#3b4754"}}>Start your Career with JAP</h1>
                        <p style={{color:"#838383",marginBottom:"80px"}}>Entice job seekers to read on with a short and catchy introduction<br style={ Screen500() ? { display:'none' } : {display:'block' }}></br> to your company.</p>
                        <Button onClick={() => {window.location.href='/signin'}} style={ Screen500()? { marginRight:'auto',marginBottom:'23px',width:"220px",height:"50px" }:{ marginRight:'23px',width:"220px",height:"50px" } } size="lg" variant="info">SignIn</Button>
                        <br style={ Screen500() ? { display:'block' } : {display:'none' }}></br>
                        <Button style={{width:"220px",height:"50px"}} onClick={() => {window.location.href='/signup'}} size="lg"  variant="outline-info">SignUp</Button>
                    </Col>

                </Row>
            </Container>
        </div>

        <Container style={{maxWidth:"1200px",marginTop:"100px",marginBottom:"100px"}}>
            <Row >
                <Col sm={12} xs={12} lg={7}  style={ Screen992() ? {textAlign:'center'} : {textAlign:'left'}}>
                    <h4 style={{color:"#3b4754"}}>Who Are We?</h4>
                    <p style={{color:"#838383",marginBottom:"20px",marginTop:"20px"}}>Here's where you can explain what your company does <br style={ Screen500() ? { display:'none' } : {display:'block' }}></br> and who you serve. 
                        You might even include a short <br style={ Screen500() ? { display:'none' } : {display:'block' }}></br>sentence about your mission and values.
                    </p>
                    <p style={{color:"#838383",marginBottom:"20px",marginTop:"20px"}}>But don't forget to mention that your company is only<br style={ Screen500() ? { display:'none' } : {display:'block' }}></br> as good as its 
                        dedicated and creative staff.
                    </p>
                </Col>

                <Col sm={12} xs={12} lg={5}  style={ Screen992() ? {textAlign:'center',marginTop:'80px'} : {textAlign:'left'}}>
                    <h4 style={{color:"#3b4754"}}>Who Are We?</h4>
                    <p style={{color:"#838383",marginBottom:"20px",marginTop:"20px"}}>Here's where you can explain what your company does <br style={ Screen500() ? { display:'none' } : {display:'block' }}></br> and who you serve. 
                        You might even include a short <br style={ Screen500() ? { display:'none' } : {display:'block' }}></br>sentence about your mission and values.
                    </p>
                    <p style={{color:"#838383",marginBottom:"20px",marginTop:"20px"}}>But don't forget to mention that your company is only<br style={ Screen500() ? { display:'none' } : {display:'block' }}></br> as good as its 
                        dedicated and creative staff.
                    </p>
                </Col>
            </Row>
        </Container>

        <div style={{width:'100%',backgroundColor:'#F8F9FC'}}>
        <Container style={{maxWidth:"1200px",marginTop:"100px",textAlign:'center'}}>
            <h2>
            <Badge variant="secondary" style={{width:'290px',fontFamily:'Open Sans',marginTop:'20px',marginBottom:'20px'}}>© 2021  JAP</Badge>
            </h2>
        </Container>
        </div>
        </div>

    );
}

export default Landingpage;