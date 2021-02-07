import React,{useState, useEffect} from "react"
import { Navbar, Nav , Button,Row, Col, Form,Container} from 'react-bootstrap';
import {getspecificjob,  statapp} from "../sources/dashboard"
import {checkedLogged} from "../sources/connectapi"
import logo from './j.png'

function Showskill(props){
    return (<li key={Math.random()}>{props.list}</li>);
}

function Showedu(props){
    return (<li  key={Math.random()}>{props.list.institute}<br />{props.list.startyear}-{props.list.endyear}</li>);
}

function ActionButton(props){


    function handlereject(e){
        e.preventDefault();
        statapp(props.jobapplicantid,props.jobid,"reject");
        window.location.reload();
    }

    function handleshortlist(e){
        statapp(props.jobapplicantid,props.jobid,"shortlist");
        window.location.reload();
    }

    function handleaccept(e){
        e.preventDefault();
        statapp(props.jobapplicantid,props.jobid,"accept");
        window.location.reload();
    }

    if(props.state==="Applied"){
        return (<div>
            <Button style={{width:"100px", marginBottom:"2px", border:"2px solid"}} onClick={handleshortlist} variant="outline-primary"> Shortlist </Button>
            <Button style={{width:"100px", marginBottom:"2px", border:"2px solid"}} onClick={handlereject}  variant="outline-danger"> Reject </Button>
        </div>);
    }
    else if(props.state==="Shortlisted"){
        return (<div>
            <Button style={{width:"100px", marginBottom:"2px", border:"2px solid"}} onClick={handleaccept} variant="outline-success"> Accept </Button>
            <Button style={{width:"100px", marginBottom:"2px", border:"2px solid"}}  onClick={handlereject}   variant="outline-danger"> Reject </Button>
        </div>);
    }
    else{
        return (
            <Button style={{width:"100px", marginBottom:"2px", border:"2px solid"}} variant="outline-success" disabled> Accepted </Button>
        );
    }
}

function SingleApplicant(props){
    var date = new Date(props.jobperson.applicationdate).toLocaleString();
    function stemp(item){return (<ul key={Math.random()} ><Showskill key={Math.random()}  list={item} /></ul>);}
    function Etemp(item){return (<ul key={Math.random()} ><Showedu key={Math.random()}  list={item} /></ul>);}
    return (
            <tr>
                <td style={{padding:"10px 5px",width:"140px",border:"3px solid black"}} >{props.jobperson.fullname}</td>
                <td style={{padding:"10px 5px",width:"140px",border:"3px solid black"}} >{props.jobperson.skill.map(stemp)}</td> 
                <td style={{padding:"10px 5px",width:"140px",border:"3px solid black"}} >{date}</td>
                <td style={{padding:"10px 5px",width:"200px",border:"3px solid black"}} >{props.jobperson.education.map(Etemp)}</td>
                <td style={{padding:"10px 5px",width:"200px",border:"3px solid black"}} >{props.jobperson.sop}</td>
                <td style={{padding:"10px 5px",width:"130px",border:"3px solid black"}}  >rating</td>
                <td style={{padding:"10px 5px",width:"160px",border:"3px solid black"}}  >{props.jobperson.status}</td>
                <td style={{padding:"10px 5px",width:"160px",border:"3px solid black"}} ><ActionButton
                 jobapplicantid={props.jobperson.jobapplicantid} 
                 state={props.jobperson.status}
                 jobid={props.JOBID}
                 /></td>
            </tr>
    );
}

function comparedate(A,B){
    // console.log(new Date(A));
    // console.log(new Date(B).toLocaleString());

    var Adate = new Date(A).getDate();
    var Amonth = new Date(A).getMonth();
    var Ayear = new Date(A).getFullYear();

    var Atime = new Date(A).toLocaleTimeString();
    var Ahour = Number(Atime.substr(0,2));
    var Aminute = Number(Atime.substr(3,2));
    var Asecond = Number(Atime.substr(6,8));

    // console.log(Adate,Amonth,Ayear,Ahour,Aminute,Asecond);

    var Bdate = new Date(B).getDate();
    var Bmonth = new Date(B).getMonth();
    var Byear = new Date(B).getFullYear();

    var Btime = new Date(B).toLocaleTimeString();
    var Bhour = Number(Btime.substr(0,2));
    var Bminute = Number(Btime.substr(3,2));
    var Bsecond = Number(Btime.substr(6,8));

    // console.log(Bdate,Bmonth,Byear,Bhour,Bminute,Bsecond);

    var flag=true;
    if(Ayear < Byear){ flag=false; }
    else if(Ayear===Byear){
        if(Amonth < Bmonth){flag=false;}
        else if(Amonth===Bmonth){
            if(Adate < Bdate){flag=false;}
            else if(Adate===Bdate){
                if(Ahour<Bhour){flag=false;}
                else if(Ahour===Bhour){
                    if(Aminute < Bminute){flag=false;}
                    else{
                        if(Asecond<Bsecond){flag=false;}
                    }
                }
            }
        }
    }

    // console.log(flag);

    return flag;

}

function ShowAllApplication(props){
    checkedLogged();
    const JOBID=props.JOBID;
    const [formData, updateFormData]=useState();   
    function temp(item){
         {return (<SingleApplicant key={Math.random()*1000} JOBID={JOBID} jobperson={item} />);}}

    useEffect(()=>{
        var mounted=true;
        getspecificjob(JOBID).then(items => {
            if(mounted){
                updateFormData(items);
            }
        })
        return () => mounted = false;
    },[JOBID])
    
    
    const [sorting, updateSortVar]=useState({
        sortVar: null,
        order: null
    });
    function handlesorting(newSort){
        updateSortVar({...newSort});
    }

    function RemoveReject(mt){
        if(mt.status!=="Rejected"){
            return mt;
        }
    }


    if(formData){
        var finalshow = formData.message;
        finalshow=finalshow.filter(RemoveReject);
        // console.log(finalshow);
        if(sorting.sortVar==="fullname"){
            if(sorting.order==="increasing"){
              finalshow.sort((a,b)=>(a.fullname > b.fullname)?1:-1);
            }
            else{
              finalshow.sort((a,b)=>(a.fullname < b.fullname)?1:-1);
            }
        }
        else if(sorting.sortVar==="applicationdate"){
            comparedate(finalshow[0].applicationdate,finalshow[1].applicationdate);
            if(sorting.order==="increasing"){
                // finalshow.sort((a,b)=>(a.applicationdate > b.applicationdate)?1:-1);
                // finalshow.sort((a,b)=>( (new Date(a.applicationdate).toLocaleString())- (new Date(a.applicationdate).toLocaleString()) ));
                finalshow.sort((a,b)=>( comparedate(a.applicationdate,b.applicationdate)?-1:1 ));
            }
              else{
                //   console.log("hi");
                  finalshow.sort((a,b)=>( comparedate(a.applicationdate,b.applicationdate)?1:-1 ));
              }
        }
        else if(sorting.sortVar==="rating"){
            if(sorting.order==="increasing"){
              finalshow.sort((a,b)=>(a.rating > b.rating)?1:-1);
            }
            else{
              finalshow.sort((a,b)=>(a.rating < b.rating)?1:-1);
            }
        }
        
        return(<div style={{margin:"auto",padding:"20px",marginTop:"50px"}}>

            <h1 style={{marginBottom:"20px"}}>{finalshow[0]?finalshow[0].jobtitle:"No applications now."}</h1>
            <Sortpallet value={sorting} onClicked={handlesorting}  />
            <table style={{marginBottom:"30px",textAlign:"center"}}>
            <thead>
            <tr>
                <th style={{fontSize:"23px",padding:"20px 5px",width:"140px",border:"4px solid black"}} >Fullname</th>
                <th style={{fontSize:"23px",padding:"20px 5px",width:"140px",border:"4px solid black"}} >Skills</th> 
                <th style={{fontSize:"23px",padding:"20px 5px",width:"140px",border:"4px solid black"}} >Application Date</th>
                <th style={{fontSize:"23px",padding:"20px 5px",width:"200px",border:"4px solid black"}} >Education</th>
                <th style={{fontSize:"23px",padding:"20px 5px",width:"200px",border:"4px solid black"}} >SOP</th>
                <th style={{fontSize:"23px",padding:"20px 5px",width:"130px",border:"4px solid black"}}  >Rating</th>
                <th style={{fontSize:"23px",padding:"20px 5px",width:"160px",border:"4px solid black"}}  >Application Stage</th>
                <th style={{fontSize:"23px",padding:"20px 5px",width:"160px",border:"4px solid black"}} >Action</th>
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

function AllApplications({match}){
    const JOBID = match.params.jobID;
    return(<div>
        <MyNav />
        <ShowAllApplication JOBID={JOBID} />
    </div>);   
}

export default AllApplications;


function Sortpallet(props){

    const [temp, setTemp] = useState(1)
  
    function Dropform(){
      setTemp(!temp);
    }
  
  
  
    const styling = {
      position:"sticky",
      top:'130px',
      width:"300px",
      marginBottom:'20px',
      borderRadius:'10px',
      padding:"15px 20px",
      boxShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px'
    }
    
  
    const [sorting, updateSortVar]=useState(props.value);
    function handleGo(){
      if(!sorting.order || !sorting.sortVar){ alert("Select atleast 1 order and atleast 1 type");}
       else{ props.onClicked(sorting); }
    }
  
    const handleOn = (e) => {
      updateSortVar({
        ...sorting,
  
        // Trimming any whitespace
        [e.target.name]: e.target.value.trim()
      });
    };
  
    return (
      <div style={styling}>
        <Container>
          <Row style={{position:"relative"}}>
          <h4 style={{fontWeight:"800"}}>SORT</h4>
          <Button style={{position:"absolute",color:"#17a2b8",top:"-5px",right:"20px",padding:"2px 3px 0px 3px",margin:"0",backgroundColor:"inherit",border:"none"}} onClick={Dropform} >
          <i className="fas fa-2x fa-caret-square-down mb-0 mt-0"></i>
          </Button>
          </Row>
          <Form className="row" style={ temp?{display:"none"}:{display:"block" }}>
          <fieldset as={Row}>
            <Col>
            <Form.Group >
                <Form.Check
                  type="radio"
                  label="Fullname"
                  name="sortVar"
                  value="fullname"
                  onClick={handleOn}
                />
                <Form.Check
                  type="radio"
                  label="Applicationdate"
                  name="sortVar"
                  value="applicationdate"
                  onClick={handleOn}
                />
                <Form.Check
                  type="radio"
                  label="Rating"
                  name="sortVar"
                  value="rating"
                  onClick={handleOn}
                />
            </Form.Group>
            </Col>
          </fieldset>
          <fieldset>
            <Col>
            <Form.Group >
                <Form.Check
                  type="radio"
                  label="Increasing"
                  name="order"
                  value="increasing"
                  onClick={handleOn}
                /><span style={{fontWeight:"800"}}>OR</span><br />
                <Form.Check
                  type="radio"
                  label="Decreasing"
                  name="order"
                  value= "decreasing"
                  onClick={handleOn}
                />
            </Form.Group>
            </Col>
          </fieldset>
  
          <Button onClick={handleGo} variant="primary" style={{width:'70px',fontWeight:"800"}}>Go</Button>
  
          </Form>
        </Container>
      </div>
    )
  
  }
  



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