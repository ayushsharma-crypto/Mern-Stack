import React,{ useState, useEffect } from 'react'
import randomColor from 'randomcolor'
import { Container,Row,Col,Button, Form } from 'react-bootstrap';
import { checkedLogged } from '../sources/connectapi';
import {addjob,getjob,updatejob,deletejob} from '../sources/dashboard'


function SingleJob(props) {
 
 var dddate = String(props.job.ddate).substr(0,10);
 const styling = { background: 'white',
    width:'100%',
    marginBottom:'20px',
    color:"#FFF",
    display:"block",
    borderRadius:'20px',
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px'
 }

 const clcd=randomColor({hue:'blue',luminosity:'dark'});

 const head = {
   width:'100%',
   borderTopLeftRadius:'20px',
   borderTopRightRadius:'20px',
   backgroundColor:clcd,
   padding:'10px 32px',
   position:'relative'
  }

  const but = {
    border:"2px solid",
    width:"130px",
    marginRight:"20px"
  }



  const [formData, updateFormData] = useState({
    title:props.job.title,
    maxapplication:props.job.maxapplication,
    position:props.job.position,
    ddate:props.job.ddate,
    dtime:props.job.dtime
  });
  
  const handleChange = (e) => {
    updateFormData({
      ...formData,

      // Trimming any whitespace
      [e.target.name]: e.target.value.trim()
    });
  };

  function handlesubmit(event){
      event.preventDefault();
      if(!formData.title){ alert("Title is missing"); }
      else if((formData.maxapplication<0)||(!formData.maxapplication && formData.maxapplication!==0)){ alert("Max Application is not valid"); }
      else if((formData.position<0) || (!formData.position && formData.position!==0)){ alert("Postions is not valid"); }
      else if(!formData.ddate){ alert("Deadline Date is missing"); }
      else if(!formData.dtime){ alert("Deadline time is missing"); }
      else{ updatejob(formData); }
  }

  const [disp, setDisp] = useState(true)
  function handleDelete(){
      setDisp(false);
      deletejob(props.job.title);
  }

  return (
    <div style={!disp?{display:"none"}:styling}>

        <div style={head}>
          <div>
            <h4 style={{fontWeight:'500'}}>{props.job.title}</h4>
            <Button title="delete job" onClick={handleDelete} style={{position:"absolute",padding:"2px 5px",right:"20px",top:"10px"}}variant="outline-light"><i className="fas fa-trash-alt"></i></Button>
          </div>
        </div>

        <form style={{width:"100%",padding:'20px 32px'}}>
            <Row>
            <Col ><p style={{fontWeight:'bolder',color:"black",marginRight:"10px"}} >Skills : <span  className="text-muted">{props.job.requiredskill.join(" , ").toUpperCase()}</span></p></Col>
            </Row>
            <Row>
            <Col sm={6}><p style={{fontWeight:'bolder',color:"black",marginRight:"10px"}} >Type :  <span  className="text-muted">{props.job.jobtype}</span></p></Col>
            <Col sm={6}><p style={{fontWeight:'bolder',color:"black",marginRight:"10px"}} >Salary :  <span  className="text-muted">{props.job.salarypermonth} Rs/month</span></p></Col>
            </Row>
            <Row>
            <Col sm={6}><p style={{fontWeight:'bolder',color:"black",marginRight:"10px"}} >Duration:  <span  className="text-muted">{props.job.duration?props.job.duration+" months":"Indefinite"}</span></p></Col>
            <Col sm={6} ><p style={{fontWeight:'bolder',color:"black",marginRight:"10px"}} >Posting Date :   <span  className="text-muted">{Date(props.job.postingdate).toLocaleString().substr(4,12)}</span></p></Col>
            </Row>
            <Row>
                <Col lg={5} className="my-2">
                    <label style={{fontWeight:'bolder',color:"black",marginRight:"10px"}}>Max Application : </label>
                    <input onChange={handleChange} name="maxapplication" defaultValue={props.job.maxapplication} style={{border:"1px solid gray",width:"100px"}} />
                </Col>
                <Col lg={7} className="my-2">
                    <label style={{fontWeight:'bolder',color:"black",marginRight:"10px"}}>AvailablePosition : </label>
                    <input onChange={handleChange} name="position" defaultValue={props.job.position} style={{border:"1px solid gray",width:"100px"}}  />
                </Col>
            </Row>
            <Row>
                {/* <Col lg={5} className="my-2"><p style={{fontWeight:'bolder',color:"black",marginRight:"10px"}} >Posting Date :  {String(props.job.postingdate).substr(0,10)}</p></Col> */}
                <Col lg={7} className="my-2">
                    <label style={{fontWeight:'bolder',color:"black",marginRight:"10px"}}>Deadline : </label>
                    {/* <div> */}
                        <input onChange={handleChange} style={{width:"140px",border:"1px solid gray",marginRight:"20px"}} required defaultValue={dddate} type="date" name="ddate" ></input>
                        <input onChange={handleChange} style={{border:"1px solid gray"}} required defaultValue={props.job.dtime} type="time" name="dtime" />
                    {/* </div> */}
                </Col>
            </Row>
            <Row >
                <Col>
                    <Button onClick={handlesubmit} className="my-2" type="submit" variant="outline-info" style={but}>Update</Button>
                    <Button className="my-2" variant="outline-dark" onClick={() => {window.location.href='/jobapplication/'+props.job._id}} style={but}>Applications</Button>
                </Col>
            </Row>
        </form>

    </div>
  )
}


function AllJobs(){

    const [formData, updateFormData]=useState([]);
    function temp(item){ return (<SingleJob key={Math.random()} job={item} />);}

    useEffect(()=>{
        var mounted=true;
        getjob().then(items => {
            // console.log(items);
            if(mounted){
                updateFormData(items);
            }
        })
        return () => mounted = false;
    },[])
    const finalshow = formData.message;
    // console.log(finalshow);
    
    if(finalshow){
        if(finalshow.length===0){
            return (<h2>Create a new JOB. If created then just refresh.</h2>);
        }
        else{
            return ( <div >{finalshow.map(temp)}</div> );
        }
    }
    else{
        return (<h2>Loading...</h2>);
    }
}


function AddJob(){
    
    checkedLogged();
    const [temp, setTemp] = useState(1)

    function Dropform(){
        setTemp(!temp);
    }

    const styling = {
        position:"sticky",
        top:'130px',
        width:"100%",
        marginBottom:'20px',
        borderRadius:'10px',
        padding:"15px 20px",
        boxShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px'
    }

    const addformstyle ={
        // border:"none",
        border:"2px solid gray",
        width:"94%",
        borderRadius:"5px",
        padding:"10px 3px 5px 4px",
        margin:"10px 0",
        fontWeight: "800",
        backgroundColor:"inherit"
    }
    const addformstyledt ={
        // border:"none",
        border:"2px solid gray",
        width:"46%",
        borderRadius:"5px",
        padding:"10px 1px 5px 2px",
        margin:"10px 5px 10px 0"
    }

    const [formData, updateFormData] = useState({
        title:"",
        maxapplication:"",
        position:null,
        ddate:"",
        dtime:"",
        requiredskill:"",
        jobtype:"Full-time",
        duration:0,
        salarypermonth:null
    });
      
    const handleChange = (e) => {
        updateFormData({
          ...formData,
    
          // Trimming any whitespace
          [e.target.name]: e.target.value.trim()
        });
      };
  
      function handlesubmit(event){
          event.preventDefault();
          if(!formData.title){ alert("Title is missing"); }
          else if((formData.maxapplication<0)||(!formData.maxapplication && formData.maxapplication!==0)){ alert("Max Application is not valid"); }
          else if((formData.position<0) || (!formData.position && formData.position!==0)){ alert("Postions is not valid"); }
          else if(!formData.ddate){ alert("Deadline Date is missing"); }
          else if(!formData.dtime){ alert("Deadline time is missing"); }
          else if(!formData.requiredskill){ alert("Skills are missing"); }
          else if(!formData.jobtype){ alert("Jobtype is missing"); }
          else if(!formData.duration && formData.duration!==0){ alert("Job Duration is missing"); }
          else if((formData.salarypermonth<0)||(!formData.salarypermonth)){ alert("Job Salary is not valid"); }
          else{ addjob(formData); }

      }


    return (
        <div style={styling}>
        <Container >

            <Row style={{position:"relative"}}>
                <h4 style={{fontWeight:"800"}}>ADD JOB</h4>
                <Button style={{position:"absolute",color:"#17a2b8",top:"-5px",right:"20px",padding:"2px 3px 0px 3px",margin:"0",backgroundColor:"inherit",border:"none"}} onClick={Dropform} >
                <i className="fas fa-2x fa-caret-square-down mb-0 mt-0"></i>
                </Button>
            </Row>

            <Form onSubmit={handlesubmit} className="row" style={ temp?{display:"none",overflow:"auto",maxHeight:"500px"}:{display:"block",maxHeight:"500px",overflow:"auto" }}>
                <div style={{margin:"10px 0px"}}>
                    <input required onChange={handleChange} style={addformstyle} type="text" name="title" placeholder="Job Title" />
                    <input required onChange={handleChange} style={addformstyle} type="number" name="maxapplication" placeholder="Max Application" />
                    <input required onChange={handleChange} style={addformstyle} type="number" name="position" placeholder="Available Positions" />
                    <div>
                        <label style={{margin:"20px 0 0 1px",fontWeight:"800"}}>Jobform deadline date and time</label><br  />
                        <input required onChange={handleChange} style={ {...addformstyledt}} type="date" name="ddate" />
                        <input required onChange={handleChange} style={ {...addformstyledt}} type="time" name="dtime" />
                    </div>
                    <input required onChange={handleChange} style={addformstyle} type="text" name="requiredskill" placeholder="Skill separated by ;" />
                    
                    <label style={{margin:"20px 0 0 1px",fontWeight:"800"}}>Select Job Type</label><br  />
                    <select required onChange={handleChange} style={addformstyle} name="jobtype">
                    <option value='Full-time'>Full-Time</option>
                    <option value="Part-time">Part-Time</option>
                    <option value="Work from Home">Work From Home</option>
                    </select>

                    <label style={{margin:"20px 0 0 1px",fontWeight:"800"}}>Select duration<br />(0 (indefinite) - 6 months)</label><br  />
                    <select required onChange={handleChange} style={addformstyle} name="duration">
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    </select>
                    {/* <input style={addformstyle} type="number" name="duration" placeholder="Job Duration" /> */}
                    <input required onChange={handleChange} style={addformstyle} type="number" name="salarypermonth" placeholder="Salary/Month" />

                </div>
                <button  className="btn-primary" style={{border:"2px solid #007bff",borderRadius:"5px",width:'130px',margin:"5px 0",fontWeight:"800",padding:"6px 0"}}>ADD</button>
            </Form>
        </Container>
        </div>
    )

}
export {AllJobs, AddJob};