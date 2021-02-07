import React, { useState} from 'react';
import { Container, Row, Col, Button, Form} from 'react-bootstrap';
import { signupData } from "../sources/connectapi"
import logo from "./j.png"

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


function Signup(){

    const [typeForm, setTypeForm] = useState(1);

    function changeForm(){
        setTypeForm(!typeForm);
    }

    
    function Jobseekerform(){

        const initialFormData = Object.freeze({
            fullname: "",
            password: "",
            mail:"",
            type:"jobapplicant"
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
            if(!formData.fullname)
            { alert("Fullname cannot be empty!");}
            else if(!formData.mail )
            { alert("Mail cannont be empty!");}
            else if(!formData.mail.match(mailformat)){
                alert("Invalid email!");
            }
            else if(!formData.password){ alert("Password cannot be empty!");}
            else {signupData(formData)}
        }

        return (
            <Form onSubmit={handlesubmit}>
                  
                <Form.Row style={{marginTop:"40px"}}>



                <Form.Group  as={Col} sm="12"  controlId="formUserType" style={{margin:'auto',marginTop:"20px",marginBottom:"20px"}}>
                        <Form.Label column >Are You  Recruiter OR Job Seeker?</Form.Label>
                        <Form.Control
                            required
                            as="select"
                            className="my-1 mr-sm-2"
                            onChange={changeForm}
                            name="type"
                        >
                            <option value="2">Job Seeker</option>
                            <option value="1">Recruiter</option>
                        </Form.Control>
                    </Form.Group>
                

                    <Form.Group as={Col} sm="6" controlId="formFullName">
                    <Form.Control required name="fullname" type="text" placeholder="Full Name" onChange={handleChange} />
                    </Form.Group>


                    <Form.Group as={Col} sm="6" controlId="formEmail">
                    <Form.Control required name="mail" type="email" placeholder="Enter Email" onChange={handleChange} />
                    </Form.Group>

                    <Form.Group  as={Col} sm="12" controlId="formPassword" >
                    <Form.Control required name="password"  type="password" placeholder="Password" onChange={handleChange}  />
                    <Form.Label column style={{ textAlign:'left', paddingLeft:"0"}} >[ suggested 6 or more character ]</Form.Label>
                    </Form.Group>


                    <Button onClick={handlesubmit} variant="info" as={Col} sm="3" type="submit" style={{margin:"auto"}}>
                        Submit
                    </Button>
                </Form.Row>
            </Form>
        );
    }

    function Recruiterform(){

        const initialFormData = Object.freeze({
            fullname: "",
            password: "",
            mail:"",
            contact:"",
            bio:"",
            type:"recruiter"
        });

        const [formData, updateFormData]=useState(initialFormData);
        const handleChange = (e) => {
          updateFormData({
            ...formData,
      
            // Trimming any whitespace
            [e.target.name]: e.target.value.trim()
          });
        };



        // function handlesubmit(event){
        //     event.preventDefault();
        //     signupData(formData,"recruiter")
        // }
        function handlesubmit(event){
            var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            event.preventDefault();
            if(!formData.fullname)
            { alert("Fullname cannot be empty!");}
            else if(!formData.contact){ alert("Contact cannot be empty!");}
            else if(formData.contact.match("[^0-9]"))  { alert("Invalid Contact");}
            else if(!formData.mail )
            { alert("Mail cannot be empty!");}
            else if(!formData.mail.match(mailformat)){
                alert("Invalid email!");
            }
            else if(!formData.password){ alert("Password cannot be empty!");}
            else if(!formData.bio){ alert("Bio cannot be empty!");}
            else {signupData(formData)}
        }


        // var finalString="";
        const maxWordLimit=250;
        // function Handlekeypress(event) {
        //     var nWords = event.target.value.match( /[A-Za-z.-]\s/g);
        //     if(nWords){
        //         if (nWords.length>=maxWordLimit){
        //             event.target.value=finalString.substring(0,finalString.length);
        //         }
        //         else if(nWords.length===maxWordLimit){
        //             event.preventDefault();
        //         }
        //         finalString=event.target.value;
        //     }
        // }

        function Handlekeypress(event){
            var word_count= event.target.value.match(/\S+/g)
            if(!word_count){return;}
            word_count=word_count.length;
    
            if(word_count>maxWordLimit){
                var check = event.target.value.match(/^\s/);
                var trimmed=null;
                if(check){ 
                    console.log("ouyoyo");
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
            <Form onSubmit={handlesubmit}>
                <Form.Row style={{marginTop:"40px"}}>



                <Form.Group  as={Col} sm="12"  controlId="formUserType" style={{margin:'auto',marginTop:"20px",marginBottom:"20px"}}>
                        <Form.Label column >Are You  Recruiter OR Job Seeker?</Form.Label>
                        <Form.Control
                            required
                            as="select"
                            className="my-1 mr-sm-2"
                            onChange={changeForm}
                            name="typeform"
                        >
                            <option value="1">Recruiter</option>
                            <option value="2">Job Seeker</option>
                        </Form.Control>
                    </Form.Group>
                

                    <Form.Group as={Col} sm="6" controlId="formFullName">
                    <Form.Control required name="fullname" type="text" placeholder="Full Name" onChange={handleChange} />
                    </Form.Group>


                    <Form.Group as={Col} sm="6" controlId="formContact">
                    <Form.Control required name="contact" type="contact" placeholder="Contact" onChange={handleChange} />
                    </Form.Group>

                    <Form.Group as={Col} sm="6" controlId="formEmail">
                    <Form.Control required name="mail" type="email" placeholder="Enter email" onChange={handleChange} />
                    </Form.Group>

                    <Form.Group  as={Col} controlId="formPassword" >
                    <Form.Control required name="password"  type="password" placeholder="Password" onChange={handleChange}  />
                    <Form.Label column style={{ textAlign:'left', paddingLeft:"0"}} >[ suggested 6 or more character ]</Form.Label>
                    </Form.Group>


                    <Form.Group as={Col} sm="12" controlId="formGridBio">
                        <Form.Control required name="bio" as="textarea" rows={5} placeholder="Bio Max 250 Words" onKeyPress={Handlekeypress} onChange={handleChange} />
                    </Form.Group>



                    <Button onClick={handlesubmit} variant="info" as={Col} sm="3" type="submit" style={{margin:"auto"}}>
                            Click for Signup
                    </Button>
                </Form.Row>
                                
            </Form>
        );
    }

    function Whichform(){
        if(typeForm){
            return <Recruiterform />;
        }
        else{
            return <Jobseekerform />
        }
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
                <Row><Col ><h2 style={{fontWeight:'500',color:"#3b4754",marginBottom:'60px'}}>SIGN UP</h2></Col></Row>

                <Whichform />
                <p style={{marginTop:"20px"}}>Already on JAP? <a href="/signin" style={{color:"#00A3BC"}}>Sign In</a></p>
            </Container>
        </div>
    );
}

export default Signup;