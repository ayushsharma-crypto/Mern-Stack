const axios = require('axios');
axios.defaults.withCredentials = true

export function addjob(item){
    // console.log(item);
    axios.post("http://localhost:5000/addjob",
    JSON.stringify({...item}),{
        headers:{'Content-Type': 'application/json'}
    }).then(
        function(response){
            if(response.data.message==="Not Authenticated"){
                window.location.href="http://localhost:5000/signin";
            }
            else if(response.data.success){
                // alert(response.data.message);
                window.location.reload();
            }
            else{
                alert(response.data.message);
            }
        }
    ).catch(function(error){
        console.log(error);
    })
}

export function getjob(){
    axios.get('http://localhost:5000/getjob',{
    headers:{ 
        'Content-Type': 'application/json',
    }})
    .then(function (response) {
        // console.log(response);
        if(response.data.success===false){
            window.location.href="http://localhost:5000/signin";
        }
    })
    .catch(function (error) {
        console.log(error);
    });

    return fetch('http://localhost:5000/getjob',
    {credentials:'include'}).then(data => data.json())
}
export function getspecificjob(jobID){
    axios.get('http://localhost:5000/getspecificjob?jobID='+jobID,{
    headers:{ 
        'Content-Type': 'application/json',
    }})
    .then(function (response) {
        // console.log(response);
        if(response.data.success===false){
            window.location.href="http://localhost:5000/signin";
        }
    })
    .catch(function (error) {
        console.log(error);
    });

    return fetch('http://localhost:5000/getspecificjob?jobID='+jobID,
    {credentials:'include'}).then(data => data.json())
}

export function updatejob(item){
    // console.log(item);
    axios.post("http://localhost:5000/updatejob",
    JSON.stringify({...item}),{
        headers:{'Content-Type': 'application/json'}
    }).then(
        function(response){
            if(response.data.message==="Not Authenticated"){
                window.location.href="http://localhost:5000/signin";
            }
            else if(response.data.success){
                // alert(response.data.message);
                window.location.reload();
            }
            else{
                alert(response.data.message);
            }
        }
    ).catch(function(error){
        console.log(error);
    })
}

export function deletejob(item){
    // console.log(item);
    axios.post("http://localhost:5000/deletejob",
    JSON.stringify({title: item}),{
        headers:{'Content-Type': 'application/json'}
    }).then(
        function(response){
            if(response.data.message==="Not Authenticated"){
                window.location.href="http://localhost:5000/signin";
            }
            else if(!response.data.success){
                alert(response.data.message);
                window.location.reload();
            }
        }
    ).catch(function(error){
        console.log(error);
    })
}



export function getalljob(){
    axios.get('http://localhost:5000/getalljob',{
    headers:{ 
        'Content-Type': 'application/json',
    }})
    .then(function (response) {
        // console.log(response);
        if(response.data.success===false){
            window.location.href="http://localhost:5000/signin";
        }
    })
    .catch(function (error) {
        console.log(error);
    });

    return fetch('http://localhost:5000/getalljob',
    {credentials:'include'}).then(data => data.json())
}

export function getalljobfusy(fusyjob, callback){            // with fusy search
    return fetch('http://localhost:5000/getalljobfusy',{
        credentials:'include',
        method: 'POST',
        body: JSON.stringify({...fusyjob}),
        headers:{ "Content-type": "application/json; charset=UTF-8"}
    }).then(data => data.json())
}


export function Applyjob(item){
    axios.post("http://localhost:5000/addjobapplicant",
    JSON.stringify({...item}),{
        headers:{'Content-Type': 'application/json'}
    }).then(
        function(response){
            // console.log(response);
            if(response.data.message==="Not Authenticated"){
                window.location.href="http://localhost:5000/signin";
            }
            else if(response.data.success){
                // alert(response.data.message);
                window.location.reload();
            }
            else{
                alert(response.data.message);
            }
        }
    ).catch(function(error){
        console.log(error);
    })
}


export function statapp(jobapplicantid,jobid,action){
    console.log(jobapplicantid,jobid,action);
    axios.get('http://localhost:5000/statapp?jobapplicantid='+jobapplicantid+'&jobid='+jobid+'&action='+action)
    .then(function (response) {
        if(response.data.message==="Not Authenticated"){
            console.log(response.data.message);
            window.location.href="http://localhost:5000/signin";
        }
        else if(response.data.success===false){
            alert(response.data.message);
            window.location.reload();
        }
        window.location.reload();
    })
    .catch(function (error) {
        console.log(error);
    });

    // return fetch('http://localhost:5000/statapp?jobapplicantid='+jobapplicantid+'&jobid='+jobid+'&action='+action,
    // {credentials:'include'}).then(data => data.json())
}




export function getemployees(){
    axios.get('http://localhost:5000/employees',{
    headers:{ 
        'Content-Type': 'application/json',
    }})
    .then(function (response) {
        console.log(response);
        if(response.data.message==="Not Authenticated"){
            console.log(response.data.message);
            window.location.href="http://localhost:5000/signin";
        }
        else if(response.data.success===false){
            alert(response.data.message);
            // window.location.reload();
        }
        // window.location.reload();
        
    })
    .catch(function (error) {
        console.log(error);
    });

    return fetch('http://localhost:5000/employees',
    {credentials:'include'}).then(data => data.json())
}

export function getmyapp(){
    axios.get('http://localhost:5000/myapp',{
    headers:{ 
        'Content-Type': 'application/json',
    }})
    .then(function (response) {
        // console.log(response);
        if(response.data.message==="Not Authenticated"){
            console.log(response.data.message);
            window.location.href="http://localhost:5000/signin";
        }
        else if(response.data.success===false){
            alert(response.data.message);
            // window.location.reload();
        }
        // window.location.reload();
        
    })
    .catch(function (error) {
        console.log(error);
    });

    return fetch('http://localhost:5000/myapp',
    {credentials:'include'}).then(data => data.json())
}