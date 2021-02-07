import React, {useState} from 'react';
import { Container, Row, Col, Button, Form} from 'react-bootstrap';
import logo from "./j.png"
import { signinData } from "../sources/connectapi"

const styleContainer = {
    backgroundColor:'#FBFBFB',
    borderRadius:'20px',
    textAlign:'center',
    padding:'50px 30px',
    maxWidth:'800px',
    margin:'auto',
    marginTop:'80px',
    boxShadow:'rgba(0, 0, 0, 0.35) 0px 5px 15px'
}

function Signin(){

    const initialFormData = Object.freeze({
        password: "",
        username:"",
    });

    const [formData, updateFormData]=useState(initialFormData);
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
        if(!formData.username )
        { alert("Mail cannot be empty!");}
        else if(!formData.username.match(mailformat)){
            alert("Invalid email!");
        }
        else if(!formData.password){ alert("Password cannot be empty!");}
        else {signinData(formData)}
    }

    return(
        <div style={{padding:'10px',textAlign:'center'}}>

            <Container style={styleContainer}>

                <img 
                alt="logo"
                onClick={() => {window.location.href='/'}} 
                src={logo}
                width="150px"
                height="150px"
                style={{marginBottom:"50px",marginTop:'-100px ',border:"5px solid #00A3BC",borderRadius:'20px',bottom:"100px",backgroundColor:'white'}}
                />
                <Row><Col ><h2 style={{fontWeight:'500',color:"#3b4754",marginBottom:'60px'}}>SIGN IN</h2></Col></Row>

                <p style={{marginTop:"50px"}}>SignIn with your Email and Password</p>
                <Form className='text-muted '>
                            
                            <Form.Group as={Col} sm="6" controlId="formEmail" style={{margin:'auto',marginTop:"5px",marginBottom:"10px"}}>
                                <Form.Control  onChange={handleChange} name="username" type="email" placeholder="Enter Email" />
                            </Form.Group>


                            <Form.Group as={Col} sm="6" controlId="formPassword" style={{margin:'auto',marginTop:"5px"}}>
                                <Form.Control onChange={handleChange} name="password" type="password" placeholder="Enter Password" />

                            <Button onClick={handlesubmit} variant="info" as={Col} sm="12" type="submit" style={{marginTop:"10px"}}>
                                Click for Login
                            </Button>
                            </Form.Group>

                </Form>

                <p style={{marginTop:"50px"}}>Don't Have An Account On JAP?  <a href="/signup" style={{color:"#00A3BC"}}> Sign Up</a> Now</p>
            </Container>
        </div>
    );
}

export default Signin;