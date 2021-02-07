import React,{ useState, useEffect } from 'react'
import randomColor from 'randomcolor'
import { Container,Row,Col,Button, Form } from 'react-bootstrap';
import {getalljobfusy, Applyjob} from "../sources/dashboard"
 

function Buttonforlist(props){
  const [open, setopen] = useState(false);

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

  const but = {
    border:"2px solid",
    width:"150px"
  }

  const initialFormData = Object.freeze({
    jobid: props.jobid,
    sop:"",
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
    event.preventDefault();
    if(!formData.sop){ alert("SOP cannot be empty!");}
    else {Applyjob(formData)}
}
// add other things like shortlisted/accepted
  if(props.Accepted){
    return <Button variant='outline-success' style={but} disabled>Your current Job</Button>
  }
  else if(props.Applied){
    return <Button variant="outline-warning" style={but} disabled> Applied</Button>
  }
  else if((props.P===0) || (props.MA===props.CA)){
    return <Button variant='outline-danger' style={but} disabled>FULL</Button>
  }
  else{

    return (
      <div>
      <Button variant="outline-primary" onClick={()=>{setopen(!open)}} style={but} >{open?"Not Apply":"Apply"}</Button><br />
      
      <Form.Group sm="12" className="my-3" style={open?{display:"block"}:{display:"none"}}>
        <Form.Label style={{color:"black"}}>SOP(statement of purpose)</Form.Label>
        <Form.Control required name="sop" as="textarea" rows={5} placeholder=" Max 250 Words" onKeyPress={Handlekeypress} onChange={handleChange}  />
        <Button className="my-1" onClick={handlesubmit}> Submit</Button>
      </Form.Group>

      </div>
    );
  }
  
}

function checkaccepted(list,JAID){
  for(var i=0;i<list.length;i++){
    if(list[i].jobapplicantid===JAID){
      if(list[i].status==="Accepted"){
        return true;
      }
    }
  }
  return false;
}

function checkapplied(list,JAID){
  for(var i=0;i<list.length;i++){
    if(list[i].jobapplicantid===JAID){
      if(list[i].status==="Applied" || list[i].status==="Shortlisted"){
        return true;
      }
    }
  }
  return false;
}

function R_G(props) {
  // console.log(props.job.application);

  const styling = { background: 'white',
    width:'100%',
    marginBottom:'20px',
    color:"#FFF",
    borderRadius:'20px',
    boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px'
 }

 const clcd=randomColor({hue:'blue',luminosity:'dark'});

 const head = {
   width:'100%',
   borderTopLeftRadius:'20px',
   borderTopRightRadius:'20px',
   height:'90px',
   backgroundColor:clcd,
   padding:'10px 32px',
   position:'relative'
  }

  return (
    <div style={styling}>
        <div style={head}>
          <div>
          <h4 style={{fontWeight:'500'}}>{props.job.title}</h4>  
          </div>
          <h5 className="text-White">{props.job.recruitername}</h5>
        </div>
        <div style={{width:"100%",padding:'20px 32px'}}>
            <Row>
            <Col ><p style={{fontWeight:'bolder',color:"black",marginRight:"10px"}} >Skills : <span  className="text-muted">{props.job.requiredskill.join(" , ").toUpperCase()}</span></p></Col>
            <Col ><p style={{fontWeight:'bolder',color:"black",marginRight:"10px"}} >Type :  <span  className="text-muted">{props.job.jobtype}</span></p></Col>
            </Row>
            <Row>
            <Col sm={6}><p className="text-dark"><span style={{fontWeight:'bolder'}}>E-mail :</span> {props.job.recruitermail}</p></Col>
            <Col sm={6}><p className="text-dark"><span style={{fontWeight:'bolder'}}>Duration :</span> {props.job.duration?props.job.duration+" months":"Indefinite"}</p></Col>
            </Row>
            <Row>
            <Col sm={6}><p className="text-dark"><span style={{fontWeight:'bolder'}}>Salary :</span> {props.job.salarypermonth} Rs/month</p></Col>
            <Col sm={6}><p className="text-dark"><span style={{fontWeight:'bolder'}}>Deadline :</span> {Date(props.job.postingdate).toLocaleString().substr(4,12)} {String(props.job.dtime)}</p></Col>
            </Row>
            <Row>
              <Col>
              {/* <Button variant={((props.job.maxapplication===props.job.currentapplication)||(props.job.position===0))?"outline-danger":"outline-primary"} 
              {((props.job.maxapplication===props.job.currentapplication)||(props.job.position===0))?"disabled":"notDisabled"}
              style={but}>
              {((props.job.maxapplication===props.job.currentapplication)||(props.job.position===0))?"Full":"Apply"} 
              </Button> */}
              <Buttonforlist Accepted={checkaccepted(props.job.application,props.currJA)} Applied={checkapplied(props.job.application,props.currJA)} jobid={props.job._id} title={props.job.title} recruitermail={props.job.recruitermail} MA={props.job.maxapplication} CA={props.job.currentapplication} P={props.job.position} />
              </Col>
            </Row>
        </div>
    </div>
  )
}

function AllRG(props){

  // console.log(props.JOBNAME);
  
  const [jobData, updateJobData]=useState([]);
  function temp(item){ return (<R_G key={Math.random()} job={item} currJA={currJA} />);}

    useEffect(()=>{
        var mounted=true;
        getalljobfusy(props.JOBNAME).then(items => {
            if(mounted){
                updateJobData(items);
            }
        })
        return () => mounted = false;
    },[props.JOBNAME])
    const finalshow = jobData.message;
    const currJA = jobData.currJA;

    function filtdur(mt){
      if(mt.duration<props.FILTER.duration){
        return mt;
      }
    }

    function filtmin(mt){
      if((mt.salarypermonth>=props.FILTER.minSalary)&&(mt.salarypermonth<=props.FILTER.maxSalary)){
        return mt;
      }
    }

    function filttype(mt){
      if(!props.FILTER.type || props.FILTER.type==="0"){
        // console.log("Naah");
        return mt;
      }
      else if(mt.jobtype === props.FILTER.type){
        return mt;
      }
    }
    
    if(finalshow){

        if(props.SORT.sortVar==="salary"){
          if(props.SORT.order==="increasing"){
            finalshow.sort((a,b)=>(a.salarypermonth > b.salarypermonth)?1:-1);
          }
          else{
            finalshow.sort((a,b)=>(a.salarypermonth < b.salarypermonth)?1:-1);
          }
        }
        else if(props.SORT.sortVar==="duration"){
          if(props.SORT.order==="increasing"){
            finalshow.sort((a,b)=>(a.duration > b.duration)?1:-1);
          }
          else{
            finalshow.sort((a,b)=>(a.duration < b.duration)?1:-1);
          }
        }
        else if(props.SORT.sortVar==="rating"){
          if(props.SORT.order==="increasing"){
            finalshow.sort((a,b)=>(a.rating > b.rating)?1:-1);
          }
          else{
            finalshow.sort((a,b)=>(a.rating < b.rating)?1:-1);
          }
        }
        var FINALE=finalshow.filter(filtdur).filter(filtmin).filter(filttype);

        // console.log(FINALE.length);
        if(FINALE.length > 0){
          return ( <div >{FINALE.map(temp)}</div> );
        }
        else{
          // console.log("here");
          return (<h2>Sorry! No Jobs to show.</h2>);
        }
    }
    else{
        return (<h2>Loading...</h2>);
    }
}


function Sortpallet(props){

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
                label="Salary"
                name="sortVar"
                value="salary"
                onClick={handleOn}
              />
              <Form.Check
                type="radio"
                label="Duration"
                name="sortVar"
                value="duration"
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

function Filterpallet(props){

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

  const [filtering, updateFiltering]=useState(props.value);
  function handleGo(){
      props.onClicked(filtering);
  }

  const handleOn = (e) => {
    updateFiltering({
      ...filtering,

      // Trimming any whitespace
      [e.target.name]: e.target.value.trim()
    });
  };
  return (
    <div style={styling}>
      <Container>
        <Row style={{position:"relative"}}>
        <h4 style={{fontWeight:"800"}}>FILTER</h4>
        <Button style={{position:"absolute",color:"#17a2b8",top:"-5px",right:"20px",padding:"2px 3px 0px 3px",margin:"0",backgroundColor:"inherit",border:"none"}} onClick={Dropform} >
        <i className="fas fa-2x fa-caret-square-down mb-0 mt-0"></i>
        </Button>
        </Row>
        <Form className="row" style={ temp?{display:"none"}:{display:"block" }}>
        <fieldset as={Row}>

        <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
            Job Type
          </Form.Label>
          <Col>
          <Form.Group >
              <Form.Check
                type="radio"
                label="Default"
                name="type"
                value={0}
                onClick={handleOn}
              />
              <Form.Check
                type="radio"
                label="Full-Time"
                name="type"
                value="Full-time"
                onClick={handleOn}
              />
              <Form.Check
                type="radio"
                label="Part-Time"
                name="type"
                value="Part-time"
                onClick={handleOn}
              />
              <Form.Check
                type="radio"
                label="Work From Home"
                name="type"
                value="Work from Home"
                onClick={handleOn}
              />
          </Form.Group>
          </Col>
        </fieldset>

        <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
            Salary
          </Form.Label>
        <Row>
          <Col>
            <Form.Control onChange={handleOn} type="Number" placeholder="Min" name="minSalary" defaultValue={props.value.minSalary} />
          </Col>
          <Col>
            <Form.Control onChange={handleOn} type="Number" placeholder="Max" name="maxSalary" defaultValue={props.value.maxSalary} />
          </Col>
        </Row>

        <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
            Duration
          </Form.Label>
          <Form.Control
            as="select"
            className="my-1 mr-sm-2 mb-4"
            name="duration"
            onChange={handleOn}
            custom
          >
            <option value="7"> &lt; 7 month</option>
            <option value="6"> &lt; 6 month</option>
            <option value="5"> &lt; 5 month</option>
            <option value="4"> &lt; 4 month</option>
            <option value="3"> &lt; 3 month</option>
            <option value="2"> &lt; 2 month</option>
            <option value="1"> &lt; 1 month</option>

          </Form.Control>

        <Button onClick={handleGo} variant="primary" style={{width:'70px',fontWeight:"800"}}>Go</Button>

        </Form>
      </Container>
    </div>
  )

}


export {AllRG, Filterpallet, Sortpallet};