const axios = require('axios');
axios.defaults.withCredentials = true


export function LandingpageApi(){
    return fetch('http://localhost:5000/')
    .then(data => data.json())
}

export function signupData(item) {

  // console.log(item);
    
    axios.post('http://localhost:5000/signup',JSON.stringify({item}),{
        headers:{ 
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*'
         }
    })
      .then(function (response) {
        // console.log("response got=>"+response);
          if(response.data==="OK"){
            // alert("Successfully Registered");
            window.location.href="http://localhost:5000/signin";
          }
          else{
            alert(response.data);
            window.location.href="http://localhost:5000/signup";
          }
        
      })
      .catch(function (error) {
        console.log(error);
      });
}

export function signinData(item){
  // console.log(item);
  axios.post('http://localhost:5000/signin',JSON.stringify({...item}),{
    headers:{ 
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*'
     }
})
  .then(function (response) {
    // console.log(response);
      if(response.data.message==="OK"){
        // alert("Successfully SignedIn");
        window.location.href="http://localhost:3000/"+response.data.nextroute;
      }
      else{
        alert(response.data.message);
        window.location.href="http://localhost:5000/signin";
      }
    
  })
  .catch(function (error) {
    console.log(error);
  });
}


export function checkedLogged(){
  axios.get('http://localhost:5000/checklog',{
    headers:{ 
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*'
     }
  })
  .then(function (response) {
    // console.log(response);
      if(response.data.message!=="Authenticated"){
        window.location.href="http://localhost:5000/signin";
      }
  })
  .catch(function (error) {
    console.log(error);
  });
}


export function signOut(){
  axios.get('http://localhost:5000/signout',{
    headers:{ 
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*'
     }
  })
  .then(function (response) {
    // if(response.data.success){alert(response.data.message);}
    window.location.href="/"
  })
}


export function getProfile(type){
  axios.get('http://localhost:5000/profile/'+type,{
    headers:{ 
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*'
     }
  })
  .then(function (response) {
    // console.log(response);
      if(response.data.message==="Not Authenticated"){
        window.location.href="http://localhost:5000/signin";
      }
  })
  .catch(function (error) {
    console.log(error);
  });

  return fetch('http://localhost:5000/profile/'+type,{credentials:'include'})
  .then(data => data.json())
  // .catch(function (error) {
  //   console.log(error);
  // });
}



export function updateRecruiterProfile(item){
  // console.log(item);
  axios.post("http://localhost:5000/profile/recruiter?profile=true",JSON.stringify({...item}),{
    headers:{ 
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*'
     }
})
  .then(function (response) {
    // console.log(response);
      if(response.data.message==="Not Authenticated"){
        // alert(response.data.message);
        window.location.href="http://localhost:5000/signin";
      }
      else if(response.data.success === true){
        // alert(response.data.message);
        // window.location.href="http://localhost:3000/profile/recruiter";
        window.location.reload();
      }
      else if(response.data.success=== false){
        alert(response.data.message);
        // window.location.href="http://localhost:3000/profile/recruiter";
      }
    
  })
  .catch(function (error) {
    console.log(error);
  });
}


export function updateJobApplicantProfile(item){
  // console.log(item);
  axios.post("http://localhost:5000/profile/jobapplicant?profile=true",JSON.stringify({...item}),{
    headers:{ 
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*'
     }
})
  .then(function (response) {
    // console.log(response);
      if(response.data.message==="Not Authenticated"){
        // alert(response.data.message);
        window.location.href="http://localhost:5000/signin";
      }
      else if(response.data.success === true){
        // alert(response.data.message);
        window.location.reload();
        // window.location.href="http://localhost:3000/profile/recruiter";
      }
      else if(response.data.success=== false){
        alert(response.data.message);
        // window.location.href="http://localhost:3000/profile/recruiter";
      }
    
  })
  .catch(function (error) {
    console.log(error);
  });
}

export function JobApplicantSkill(item,type){
  //  console.log(item);
   axios.post("http://localhost:5000/profile/jobapplicant?skill="+type,JSON.stringify({skill: item}),{
    headers:{ 
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*'
     }
})
  .then(function (response) {
    // console.log(response);
      if(response.data.message==="Not Authenticated"){
        // alert(response.data.message);
        window.location.href="http://localhost:5000/signin";
      }
      else if(response.data.success === true){
        // alert(response.data.message);
        if(type==="add"){
          // window.location.href="http://localhost:3000/profile/jobapplicant";
          window.location.reload();
        }
      }
      else if(response.data.success=== false){
        alert(response.data.message);
        // window.location.href="http://localhost:3000/profile/jobapplicant";
      }
    
  })
  .catch(function (error) {
    console.log(error);
  });
}
export function JobApplicantEducation(item,type){  // type can add, edit or delete
  //  console.log(item);
   axios.post("http://localhost:5000/profile/jobapplicant/education?"+type+"=true",JSON.stringify({...item}),{
    headers:{ 
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*'
     }
})
  .then(function (response) {
    // console.log(response);
      if(response.data.message==="Not Authenticated"){
        // alert(response.data.message);
        window.location.href="http://localhost:5000/signin";
      }
      else if(response.data.success === true){
        // alert(response.data.message);
        if(type==="add" || type==="edit"){
          // window.location.href="http://localhost:3000/profile/jobapplicant";
          window.location.reload();
        }
      }
      else if(response.data.success=== false){
        alert(response.data.message);
        // window.location.href="http://localhost:3000/profile/jobapplicant";
      }
    
  })
  .catch(function (error) {
    console.log(error);
  });
}