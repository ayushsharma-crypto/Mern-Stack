//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require('express-session');
const cors = require('cors');
const passportLocalMongoose = require("passport-local-mongoose");
const Fuse = require('fuse.js')

// Connecting to the database
mongoose.connect('mongodb://localhost:27017/jobDB',{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

// Error handelling for database mongoose connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("CONNECTED TO DATABASE...");
});

const app = express();
// routes
// var profile = require("./routes/profile.js");
// const dashboard = require("./routes/dashboard");
// setup API points
// app.use("/profile",profile);
// app.use("/dashboard",dashboard);


// Cross-Origin approval and app-use
var corsOptions = {
  origin: " http://localhost:3000",
  optionsSuccessStatus: 200 ,// some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
}
app.use(cors(corsOptions))
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(session({
  secret: "This is secret babe...",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour

}));
app.use(passport.initialize());
app.use(passport.session());

// Load job applicant and recruiter model
const Jobapplicant = require("./schema/jobapplicant");
const Recruiter = require("./schema/recruiter");
const Job = require("./schema/job");
// General User login Schema
const userSchema = new mongoose.Schema ({
  // username: String,
  type: String // either recruiter or jobapplicant
});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
// use static serialize and deserialize of model for passport session support
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});








// Authentication routes




app.get("/",function(req,res){
  res.redirect(' http://localhost:3000')
});

app.get("/signup",function(req,res){
  res.redirect("http://localhost:3000"+"/signup")
});

app.get("/signin",function(req,res){
  res.redirect("http://localhost:3000"+"/signin")
});

app.post("/signup",function(req, res){
  User.findOne({username:req.body.item.mail},function(err, user){
    if(err){
      console.log(err);
    }
    else{
      if(user){
        res.send("Already registered mail. Try another one.");
      }
      else{
        // console.log("Registering...");
        User.register({username: req.body.item.mail,type:req.body.item.type},
          req.body.item.password,
          function(err, user){
            if(err){
              console.log(err);
              res.send("Some Error occured while registering. Try again");
            }
            else{
              if(req.body.item.type==="recruiter"){
                var newRecruiter = new Recruiter({
                  fullname:req.body.item.fullname,
                  mail:req.body.item.mail,
                  contact:req.body.item.contact,
                  bio:req.body.item.bio
                })     
                // console.log(newRecruiter);
                newRecruiter.save();
                res.send("OK");
              }
              else if(req.body.item.type==="jobapplicant"){
                var newJobapplicant = new Jobapplicant({
                  fullname:req.body.item.fullname,
                  mail:req.body.item.mail
                })                
                newJobapplicant.save(); 
                // console.log(newJobapplicant);
                res.send("OK");               
              }
              else{
                res.send("Unknown Data");
              }
            }
          });
      }
    }
  });
});


app.post('/signin', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
      return next(err); 
    }
    if (!user) { 
      return res.json({success: false,message:"Either mail or Password is wrong or not registered user"}); 
    }
    req.logIn(user, function(err) {
      if (err) { 
        return next(err); 
      }
      return res.json({success: true,message:"OK",nextroute:user.type});
    });
  })(req, res, next);
});


app.get("/signout", function(req, res){
  if(req.isAuthenticated()){
    req.logout();
    res.json({success: true,message: "Successfull Signout"});
  }
  else{
    res.json({success: false, message: "Not Authenticated"});
  }
});


app.get('/checklog',function(req, res){
  if(req.isAuthenticated()){
    User.findOne({username: req.user.username},function(err, user){
      if(err){
        console.log(err);
      }
      else{
        res.json({success: true, message:"Authenticated",usertype: user.type});
      }
    });
  }
  else{
    res.json({success: false, message:"Not Authenticated"});
  }
});

app.get('/profile/jobapplicant',function(req, res){
  if(req.isAuthenticated()){
    // console.log(req.user);
    User.findOne({username: req.user.username},function(err, user){
      if(err){
        console.log(err);
      }
      else if(!user){
        res.json({success: false,message: "Not Authenticated. No such User"});
      }
      else{
        if(user.type==="recruiter"){
            res.json({success: false, message:"Not Authenticated"});
        }
        else if(user.type==="jobapplicant"){
          Jobapplicant.findOne({mail:req.user.username},function(err, jobapplicant){
            if(err){
              console.log(err);
            }
            else{
              res.send(jobapplicant);
            }
          });
        }
      }
    });
  }
  else{
    res.json({success: false, message:"Not Authenticated"});
  }
});

app.get('/profile/recruiter',function(req, res){
  if(req.isAuthenticated()){
    // console.log(req.user);
    User.findOne({username: req.user.username},function(err, user){
      if(err){
        console.log(err);
      }
      else if(!user){
        res.json({success: false,message: "Not Authenticated. No such User"});
      }
      else{
        if(user.type==="recruiter"){
          Recruiter.findOne({mail:req.user.username},function(err, recruiter){
            if(err){
              console.log(err);
            }
            else{
              res.send(recruiter);
            }
          });
        }
        else if(user.type==="jobapplicant"){
          res.json({success: false, message:"Not Authenticated"});
        }
      }
    });
  }
  else{
    res.json({success: false, message:"Not Authenticated"});
  }
});

app.post('/profile/jobapplicant',function(req, res){
  if(req.isAuthenticated()){
    // console.log(req.body);

    User.findOne({username: req.user.username},function(err, user){
      if(err){
        console.log(err);
      }
      else if(!user){
        res.json({success: false,message: "Not Authenticated. No such User"});
      }
      else{
        if(user.type==="jobapplicant"){
          Jobapplicant.findOne({mail:req.user.username},function(err, jobapplicant){
            if(err){
              console.log(err);
            }
            else{
              if(req.query.profile==="true"){
                if(req.body.mail===jobapplicant.mail){
                  jobapplicant.fullname=req.body.fullname
                  jobapplicant.save();
                  res.json({success: true,message: "Updated Successfully"});
                }
                else{
                  User.findOne({username: req.body.mail}, function(err, puser){
                    if(err){console.log(err);}
                    else{
                      if(puser){ res.json({success:false, message:"Mail Already Exists!"});}
                      else{
                        jobapplicant.fullname=req.body.fullname
                        jobapplicant.mail = req.body.mail
                        jobapplicant.save();
                        user.username= req.body.mail
                        user.save();
                        res.json({success: true,message: "Updated Successfully"});
                      }
                    }
                  }); 
                }
              }
              else if(req.query.skill==="add"){
                skillList=jobapplicant.skill;
                if( skillList && skillList.includes(req.body.skill)){
                  res.json({success: false, message: "Skill Already Present!"});
                }
                else{
                  if(req.body.skill){
                    skillList.push(req.body.skill);
                    jobapplicant.skill=skillList;
                    jobapplicant.save();
                    res.json({success: true, message: "Successfully Added"});
                  }
                  else{
                    res.json({success: false, message: "No Skill Mentioned"});
                  }
                }
              }
              else if(req.query.skill==="delete"){
                skillList=jobapplicant.skill;
                if( skillList && skillList.includes(req.body.skill)){
                  for(var i=0;i< skillList.length;i++){
                    if( skillList[i]===req.body.skill){
                      skillList.splice(i,1);
                      break;
                    }
                  }
                  jobapplicant.skill=skillList;
                  jobapplicant.save();
                  res.json({success:true, message: "Successfully Deleted"});
                }
                else{
                  res.json({success:false, message: "No Such Skill Presesnt!"});
                }
              }
            }
          });
        }
        else if(user.type==="recruiter"){
          res.json({success: false, message:"Not Authenticated"});
        }
      }
    });
  }
  else{
    res.json({success: false, message:"Not Authenticated"});
  }
});

app.post('/profile/jobapplicant/education',function(req, res){
  if(!req.isAuthenticated()){
    res.json({success: false,message: "Not Authenticated"});
  }
  else{
    User.findOne({username: req.user.username},function(err, user){
      if(err){
        console.log(err);
      }
      else if(!user){
        res.json({success: false,message: "Not Authenticated. No such User"});
      }
      else{
        if(user.type==="recruiter"){
          res.json({success: false,message: "Not Authenticated"});
        }
        else{
          Jobapplicant.findOne({mail: req.user.username},function(err, jobapplicant){
            if(err){
              console.log(err);
            }
            else{
              educationList=jobapplicant.education;

              if(req.query.add==="true"){
                // console.log("adding");
                // console.log(req.body);
                var flag=false;
                for(var i=0;i<educationList.length;i++){
                  if((
                    educationList[i].institute===req.body.institute)
                    &&(educationList[i].startyear===req.body.start)
                    &&(educationList[i].endyear===req.body.end)){
                      flag=true;
                    }
                }
                if(flag===true){
                  res.json({success: false,message: "Entered education section already exist"});
                }
                else{
                  educationList.push({
                    institute: req.body.institute,
                    startyear: req.body.start,
                    endyear: req.body.end
                  });
                  jobapplicant.education=educationList;
                  jobapplicant.save();
                  res.json({success: true,message: "Successfully Added"});
                }
              }
              else if(req.query.delete==="true"){
                // console.log("deleting");
                // console.log(req.body);
                var flag=false;
                var index=-1;
                for(var i=0;i<educationList.length;i++){
                  if((
                    educationList[i].institute===req.body.old_institute)
                    &&(educationList[i].startyear===req.body.old_startyear)
                    &&(educationList[i].endyear===req.body.old_endyear)){
                      flag=true;
                      index=i;
                    }
                }
                if(flag===false){
                  res.json({success: false,message: "No such old data exists"});
                }
                else{
                  educationList.splice(index,1);
                  jobapplicant.education=educationList;
                  jobapplicant.save();
                  res.json({success: true, message: "Successfullly deleted"});
                }
              }
              else if(req.query.edit==="true"){
                // console.log("editting");
                // console.log(req.body);
                var flag=false;
                var index=-1;
                for(var i=0;i<educationList.length;i++){
                  if((
                    educationList[i].institute===req.body.old_institute)
                    &&(educationList[i].startyear===req.body.old_startyear)
                    &&(educationList[i].endyear===req.body.old_endyear)){
                      flag=true;
                      index=i;
                    }
                }
                if(flag===false){
                  res.json({success: false,message: "No such old data exists"});
                }
                else{
                  var new_flag=false;
                  if((
                    req.body.old_institute===req.body.institute)
                    &&(req.body.old_startyear===req.body.startyear)
                    &&(req.body.old_endyear===req.body.endyear)){
                      res.json({success: false, message:"No changes"});
                    }
                    else{
                  
                      for(var i=0;i<educationList.length;i++){
                        if((
                          educationList[i].institute===req.body.institute)
                          &&(educationList[i].startyear===req.body.startyear)
                          &&(educationList[i].endyear===req.body.endyear)){
                            new_flag=true;
                          }
                      }
                      if(new_flag===true){
                        res.json({success: false,message: "Please Don't create a copy!"});
                      }
                      else{
                        educationList[index].institute=req.body.institute;
                        educationList[index].startyear=req.body.startyear;
                        educationList[index].endyear=req.body.endyear;
                        jobapplicant.education = educationList;
                        jobapplicant.save();
                        res.json({success: true,message:"Successfully Editted"});
                      }
                    }
                }
              }
            }
          } );
        }
      }
    });
  }
});

app.post('/profile/recruiter',function(req, res){
  if(req.isAuthenticated()){
    User.findOne({username: req.user.username},function(err, user){
      if(err){
        console.log(err);
      }
      else if(!user){
        res.json({success: false,message: "Not Authenticated. No such User"});
      }
      else{
        if(user.type==="recruiter"){
          Recruiter.findOne({mail:req.user.username},function(err, recruiter){
            if(err){
              console.log(err);
            }
            else{
              if(req.query.profile==="true"){
                if(req.body.mail===recruiter.mail){
                  Job.find({recruitermail: recruiter.mail},function(err, foundjobs){
                    if(err){console.log(err);}
                    else{
                        foundjobs.forEach(currJob => {
                        currJob.recruitername=req.body.fullname;
                        currJob.save();
                      });
                    }
                  });
                  recruiter.fullname=req.body.fullname
                  recruiter.contact=req.body.contact
                  recruiter.bio=req.body.bio
                  recruiter.save();
                  res.json({success: true,message: "Updated Successfully"});
                }
                else{
                  User.findOne({username: req.body.mail}, function(err, puser){
                    if(err){console.log(err);}
                    else{
                      if(puser){ res.json({success:false, message:"Mail Already Exists!"});}
                      else{

                        Job.find({recruitermail: recruiter.mail},function(err, foundjobs){
                          if(err){console.log(err)}
                          else{
                              foundjobs.forEach(currJob => {
                              currJob.recruitername=req.body.fullname;
                              currJob.recruitermail=req.body.mail;
                              currJob.save();
                            });
                          }
                        });

                        recruiter.fullname=req.body.fullname
                        recruiter.contact=req.body.contact
                        recruiter.bio=req.body.bio
                        recruiter.mail = req.body.mail
                        recruiter.save();
                        user.username= req.body.mail
                        user.save();
                        res.json({success: true,message: "Updated Successfully"});
                      }
                    }
                  }); 
                }
              }
            }
          });
        }
        else if(user.type==="jobapplicant"){
          res.json({success: false, message:"Not Authenticated"});
        }
      }
    });
  }
  else{
    res.json({success: false, message:"Not Authenticated"});
  }
});





// Dashboard Routes


app.post("/addjob",function(req, res){
  if(!req.isAuthenticated()){
    res.json({success: false,message:"Not Authenticated"});
  }
  else{
    User.findOne({username: req.user.username},function(err, user){
      if(err){
        console.log(err);
      }
      else if(!user || user.type==="jobapplicant"){
        res.json({success: false,message:"Unknown user. Not Authorized"});
      }
      else{
        Recruiter.findOne({mail: user.username},function(err, recruiter){
          if(err){
            console.log(err);
          }
          else{
            Job.findOne({title:req.body.title,recruitermail: recruiter.mail,deleted: false},function(err,foundjob){
              if(err){
                console.log(err);
              }
              else if(foundjob){
                res.json({success: false,message:"Job of same \"title\" can't exist"});
              }
              else if((req.body.maxapplication <=0)||(req.body.position<=0)){
                res.json({
                  success: false,
                  message: "Expected maxapplication > 0 and position > 0"
                });
              }
              else{
                var newjob = new Job({
                    title: req.body.title,
                    recruitername: recruiter.fullname,
                    recruitermail: recruiter.mail,
                    maxapplication:req.body.maxapplication,
                    position:req.body.position,
                    postingdate: new Date().toLocaleString(),
                    ddate:req.body.ddate.toLocaleString(),
                    dtime:req.body.dtime.toLocaleString(),
                    requiredskill:req.body.requiredskill.split(/;/),
                    jobtype:req.body.jobtype,
                    duration:req.body.duration,
                    salarypermonth:req.body.salarypermonth
                });
                newjob.save();
                res.json({success: true,message:"Successfully Added"})
              }
            });
          }
        });
      }
    });
  }
})


app.get("/getjob",function(req, res){
  if(!req.isAuthenticated()){
    res.json({success: false,message:"Not Authenticated"});
  }
  else{
    User.findOne({username: req.user.username},function(err, user){
      if(err){
        console.log(err);
      }
      else if(!user || user.type==="jobapplicant"){
        res.json({success: false,message:"Unknown user. Not Authorized"});
      }
      else{
        Job.find({recruitermail: user.username,deleted: false, position: {$gt: 0}},function(err,foundjob){
            if(err){
              console.log(err);
            }
            else{
              res.json({success: true,message: foundjob});
            }
        });
      }
    });
  }
})


app.get("/getspecificjob",function(req, res){
  if(!req.isAuthenticated()){
    res.json({success: false,message:"Not Authenticated"});
  }
  else{
    User.findOne({username: req.user.username},function(err, user){
      if(err){
        console.log(err);
      }
      else if(!user || user.type==="jobapplicant"){
        res.json({success: false,message:"Unknown user. Not Authorized"});
      }
      else{
        Job.findOne({recruitermail: user.username,deleted: false, position: {$gt: 0},_id: req.query.jobID},function(err,foundjob){
            if(err){
              console.log(err);
            }
            else if(foundjob){
              var JIDLIST=[];
              foundjob.application.forEach(element => {
                JIDLIST.push(element.jobapplicantid);                
              });
              Jobapplicant.find({_id : { $in : JIDLIST}},function(err, applicantlist){
                if(err){
                  console.log(err);
                }
                else{
                  var sendmess = [];
                  for(var i=0;i<foundjob.application.length;i++){

                    var currJID = foundjob.application[i].jobapplicantid;
                    var currJIDindex=-1;
                    for(var j=0;j<applicantlist.length;j++){
                      if(applicantlist[j]._id==currJID){
                        currJIDindex=j;
                        break;
                      }
                    }
                    sendmess.push({
                      jobtitle: foundjob.title,
                      jobapplicantid: applicantlist[currJIDindex]._id,
                      fullname: applicantlist[currJIDindex].fullname,
                      skill: applicantlist[currJIDindex].skill,
                      education: applicantlist[currJIDindex].education,
                      applicationdate: foundjob.application[currJIDindex].applicationdate,
                      sop: foundjob.application[i].sop,
                      status: foundjob.application[i].status,
                      rating: null
                    });
                  }
                  res.json({success: true,message: sendmess});
                }
              })
            }
        });
      }
    });
  }
})



// app.get("/employees",function(req, res){
//   if(!req.isAuthenticated()){
//     res.json({success: false,message:"Not Authenticated"});
//   }
//   else{
//     User.findOne({username: req.user.username},function(err, user){
//       if(err){
//         console.log(err);
//       }
//       else if(!user || user.type==="jobapplicant"){
//         res.json({success: false,message:"Not Authenticated"});
//       }
//       else{
//         Job.find({recruitermail: user.username,deleted: false},function(err,allfoundjob){
//             if(err){
//               console.log(err);
//             }
//             else if(allfoundjob.length<=0){
//               res.json({success: false, message: "No such job found."});
//             }
//             else{
//               finalsendmessage=[]
//               for(var x=0;x<allfoundjob.length;x++){
//                 var foundjob = allfoundjob[x];

//                 var JIDLIST=[];
//                 foundjob.application.forEach(element => {
//                   if(element.status==="Accepted"){
//                   JIDLIST.push(element.jobapplicantid); 
//                   }  
//                 });
//                 Jobapplicant.find({_id : { $in : JIDLIST}},function(err, applicantlist){
//                   if(err){
//                     console.log(err);
//                   }
//                   else{
//                     // var sendmess = [];
//                     for(var i=0;i<foundjob.application.length;i++){
//                       if(foundjob.application[i].status==="Accepted"){
//                         var currJID = foundjob.application[i].jobapplicantid;
//                         var currJIDindex=-1;
//                         for(var j=0;j<applicantlist.length;j++){
//                           if(applicantlist[j]._id==currJID){
//                             currJIDindex=j;
//                             break;
//                           }
//                         }
//                         finalsendmessage.push({
//                           jobtitle: foundjob.title,
//                           jobtype: foundjob.jobtype,
//                           jobapplicantid: currJID,
//                           // fullname: applicantlist[currJIDindex].fullname,
//                           joiningdate: foundjob.application[currJIDindex].joiningdate,
//                           rating: null
//                         });
//                       }
//                     }
//                     console.log(finalsendmessage);
//                     if(x===allfoundjob.length-1){
//                       console.log("hhhehehe");
//                       res.json({success: true,message: finalsendmessage});
//                     }
//                   }
//                 })
                
//               }
//             }
//         });
//       }
//     });
//   }
// })


app.get("/getperson",function(req,res){
  Jobapplicant.findOne({_id:req.query.id},function(err, p){
    // console.log(req.query.id);
    res.send(p.fullname);
  });
})

app.get("/myapp",function(req,res){
  if(!req.isAuthenticated())
  {
    return;
  }
  var person = req.user.username;
  Jobapplicant.findOne({mail:person},function(err,p){
    if(err){console.log(err);}
    else{
      var PID = String(p._id);
      Job.find({deleted: false},function(e,alljob){
        if(e){console.log(e);}
        else{
          var sendmess=[]
          for(var i=0;i<alljob.length;i++){

            var currjob=alljob[i];
            // console.log("Top");
            // console.log(currjob.title);

            for(var j=0;j<currjob.application.length;j++){

              var banda = currjob.application[j];
              // console.log(currjob.title);
              // console.log(banda);

              if(banda){
                

                if(banda.jobapplicantid===PID){
                  sendmess.push({
                    title: currjob.title,
                    joiningdate: banda.joiningdate,
                    salary: currjob.salarypermonth,
                    recruitername: currjob.recruitername,
                    status: banda.status
                  });
                }
              }

            }
          }
          // console.log(sendmess);
          res.json({success: true,messsage: sendmess});
        }
      });
    }
  });
});

app.get("/employees",function(req, res){
  if(!req.isAuthenticated()){
    res.json({success: false,message:"Not Authenticated"});
  }
  else{
    User.findOne({username: req.user.username},function(err, user){
      if(err){
        console.log(err);
      }
      else if(!user || user.type==="jobapplicant"){
        res.json({success: false,message:"Not Authenticated"});
      }
      else{
        Job.find({recruitermail: user.username,deleted: false},function(err,allfoundjob){
          if(err){
            console.log(err);
          }
          else if(allfoundjob.length<=0){
            res.json({success: false, message: "No such job found."});
          }
          else{
            var sendmess=[];
            for(var i=0;i<allfoundjob.length;i++){
              var foundjob = allfoundjob[i];
              for(var j=0;j<foundjob.application.length;j++){
                var person = foundjob.application[j];
                if(person.status==="Accepted"){
                  sendmess.push({
                    jobtitle: foundjob.title,
                    jobtype: foundjob.jobtype,
                    jobapplicantid: person.jobapplicantid,
                    joiningdate: person.joiningdate,
                    rating: null
                  });
                }
              }
            }
            // console.log(sendmess);
            res.json({success: true,message: sendmess});
          }
        });
      }
    });
  }
})



app.post("/updatejob",function(req, res){
  if(!req.isAuthenticated()){
    res.json({success: false,message:"Not Authenticated"});
  }
  else{
    User.findOne({username: req.user.username},function(err, user){
      if(err){
        console.log(err);
      }
      else if(!user || user.type==="jobapplicant"){
        res.json({success: false,message:"Unknown user. Not Authorized"});
      }
      else{
        Recruiter.findOne({mail: user.username},function(err, recruiter){
          if(err){
            console.log(err);
          }
          else if(recruiter){
            Job.findOne({title:req.body.title,recruitermail: recruiter.mail, deleted: false},function(err,foundjob){
              if(err){
                console.log(err);
              }
              else if(!foundjob){
                res.json({success: false,message:"No such job exist!"});
              }
              else if((req.body.maxapplication!==foundjob.maxapplication)&&(req.body.maxapplication<=foundjob.currentapplication)){
                res.json({
                  success: false,
                  message:"Total current applications are "+foundjob.currentapplication+", So you can't minimize maxapplication below that."
                });
              }
              else if(req.body.position<0){
                res.json({
                  success: false,
                  message: "Negetive position is not applicable."
                });
              }
              else{
                // console.log(req.body);
                foundjob.maxapplication=req.body.maxapplication;
                foundjob.position=req.body.position;
                foundjob.ddate=req.body.ddate.toLocaleString();
                foundjob.dtime=req.body.dtime.toLocaleString();
                foundjob.save();

                res.json({success: true,message:"Successfully Updated"})
              }
            });
          }
        });
      }
    });
  }
})



app.post("/deletejob",function(req, res){
  if(!req.isAuthenticated()){
    res.json({success: false,message:"Not Authenticated"});
  }
  else{
    User.findOne({username: req.user.username},function(err, user){
      if(err){
        console.log(err);
      }
      else if(!user || user.type==="jobapplicant"){
        res.json({success: false,message:"Unknown user. Not Authorized"});
      }
      else{
        Recruiter.findOne({mail: user.username},function(err, recruiter){
          if(err){
            console.log(err);
          }
          else if(recruiter){
            Job.findOne({title:req.body.title,recruitermail: recruiter.mail, deleted: false},function(err,foundjob){
              if(err){
                console.log(err);
              }
              else if(!foundjob){
                res.json({success: false,message:"No such job exist!"});
              }
              else{
                // Job.deleteOne(foundjob,function(err){
                //   if(err){console.log(err);}
                // });
                foundjob.deleted=true;
                foundjob.save();
                res.json({success: true,message:"Successfully Deleted"})
              }
            });
          }
          else{
            res.json({success: false,message: "No such recruiter found."});
          }
        });
      }
    });
  }
})



app.get("/getalljob",function(req, res){
  if(!req.isAuthenticated()){
    res.json({successs: false,message:"Not Authenticated"});
  }
  else{
    User.findOne({username: req.user.username},function(err,user){
      if(err){
        console.log(err);
      }
      else if(!user || user.type==="recruiter"){
        res.json({success: false,message:"Not Authenticated"});
      }
      else{
        Job.find({deleted: false},function(err, alljob){
          if(err){
            console.log(err);
          }
          else{
            res.json({success: true,message: alljob});
          }
        });
      }
    });
  }
});

function checkdeadline(ddate, dtime){


  var today = new Date();
  var aajkadin = today.getDate();
  var aajkamahina = today.getMonth();
  var aajkasaal = today.getFullYear();
  var abhighanta = today.getHours();
  var abhiminute = today.getMinutes();
  
  var dkadin = new Date(ddate).getDate();
  var dkamahina = new Date(ddate).getMonth();
  var dkasaal = new Date(ddate).getFullYear();

  var dghanta = Number(dtime.substr(0,2));
  var dminute = Number(dtime.substr(3,5));


  var flag=true;
      
  if(aajkasaal>dkasaal){flag=false;} 
  else if(aajkasaal===dkasaal){
    if(aajkamahina>dkamahina){ flag=false; }
    if(aajkamahina===dkamahina){
      if(aajkadin>dkadin){ flag=false;}
      else if(aajkadin===dkadin){
        if(abhighanta>dghanta){ flag=false;}
        else if(abhighanta === dghanta){
          if(abhiminute>=dminute){flag=false;}
        }
      }
    }
  }

  return flag;// if returned true then job is within deadline else false.
}

app.post("/getalljobfusy",function(req, res){ // with fusy search
  if(!req.isAuthenticated()){
    res.json({successs: false,message:"Not Authenticated"});
  }
  else{
    User.findOne({username: req.user.username},function(err,user){
      if(err){
        console.log(err);
      }
      else if(!user || user.type==="recruiter"){
        res.json({success: false,message:"Not Authenticated"});
      }
      else{
        Jobapplicant.findOne({mail: req.user.username},function(err, jobapplicant){
          if(err){
            console.log(err);
          }
          else{
            Job.find({deleted: false},function(err, alljob){
              if(err){
                console.log(err);
              }
              else{
                if(req.body.jobname===''){
                  finalresult=[];
                  alljob.forEach(element => {
                    if(checkdeadline(element.ddate,element.dtime)){
                      finalresult.push(element);  
                    }              
                  });
                  res.json({success: true,message: finalresult, currJA: jobapplicant._id});
                }
                else{    
                  const options = {
                    keys: ['title']
                  }
                  
                  const fuse = new Fuse(alljob, options)
                  
                  const result = fuse.search(req.body.jobname)
                  finalresult=[];
                  result.forEach(element => {
                    if(checkdeadline(element.item.ddate,element.item.dtime)){
                      finalresult.push(element.item);  
                    }              
                  });
                  
                  // console.log(finalresult);
                  res.json({succes: true,message: finalresult, currJA: jobapplicant._id});              
                }
              }
            });
          }
        });
      }
    });
  }
});

// function checkinjob(applicantid){
//   Job.find({
//     'application.jobapplicantid':applicantid,
//     'application.status':"Accepted"
//   }).then( jobss => {
//     if(jobss){ return true}
//     else{ return false; }
//   } )
// }

app.post("/addjobapplicant",function(req, res){
  if(!req.isAuthenticated()){
    res.json({success: false, message: "Not Authenticated"});
  }
  else{
    User.findOne({username:  req.user.username},function(err, user){
      if(err){
        console.log(err);
      }
      else if(user.type==="recruiter"){
        res.json({success: false, messsage: "Not Authenticated"});
      }
      else{
        Jobapplicant.findOne({mail: user.username},function(err, jobapplicant){
          if(err){
            console.log(err);
          }
          else{
            // if(checkinjob(jobapplicant._id)){
            //   res.json({succes: false,message: "You already have a Job.Why being Greedy?"});
            //   return;
            // }
            // console.log(jobapplicant._id);
            Job.findOne({_id:req.body.jobid, deleted: false},function(err, foundjob){
              if(err){
                console.log(err);
              }
              else if(!foundjob){
                res.json({success: false, message: "No such job found"});
              }
              else{
                // console.log(jobapplicant._id);
                // console.log(foundjob);
                var filteredjob = foundjob.application.filter( item => item.jobapplicantid===String(jobapplicant._id) );
                // console.log("filteredjob");
                // console.log(filteredjob.length);
                if(filteredjob.length===1){
                  if(filteredjob[0].status==="Applied"){ res.json({success: false, message: "Already applied"}); return; }
                  if(filteredjob[0].status==="Shortlisted"){res.json({success: false, message: "Already applied and shortlisted but not accepted"}); return; }
                  if(filteredjob[0].status==="Accepted"){ res.json({success: false, message:"Already applied and accepted"});return; }
                  if(filteredjob[0].status==="Rejected"){ res.json({success: false, message:"Already applied but rejected."});return; }
                }
                else if(filteredjob.length===0){
                  Job.find({deleted: false,'application.status':{ $eq : "Accepted"}},function(err,allacceptedjobs){
                    if(err){
                      console.log(err);
                    }
                    else{
                      var ff = true;
                      allacceptedjobs.forEach(element => {
                        element.application.forEach(element1 => {
                          if((element1.jobapplicantid===String(jobapplicant._id))&&(element1.status==="Accepted")){
                            console.log("HE");
                            ff = false;
                            res.json({success: false, message: "You are working at "+allacceptedjobs[0].recruitername + " with Job Title "+ allacceptedjobs[0].title+".Why being Greedy?"});
                            return;
                          }                          
                        });                                                
                      });           
                      // console.log("hi");

                      if(ff){
                        Job.find({'application.jobapplicantid':jobapplicant._id, deleted: false,$or:[{'application.status':"Applied"},{'application.status':"Shortlisted"}]},function(err,allopenjobs){
                          if(err){
                            console.log(err);
                          }
                          else{
                            if(allopenjobs.length>=10){
                              res.json({succes: false, message:"You can have atmax 10 open application"});
                            }
                            else{
                              if(foundjob.maxapplication===foundjob.currentapplication){
                                res.json({succes: false,messsage:"All applications are filled"});
                              }
                              else if(foundjob.position<=0){
                                res.json({success: false, message: "All positions for the job are filled"});
                              }
                              else{
                                
                                if(checkdeadline(foundjob.ddate, foundjob.dtime)){
      
                                  foundjob.application.push({
                                    jobapplicantid: jobapplicant._id,
                                    status: "Applied",
                                    sop:req.body.sop,
                                    applicationdate: new Date().toLocaleString()
                                  });
                                  foundjob.currentapplication=foundjob.currentapplication+1;
                                  
                                  foundjob.save();
                                  res.json({success: true, messsage: "Successfully Applied to the job"});
                                }
                                else{
                                  res.json({succes: false,message: "Deadline Passed.No applications will be accepted now"});
                                }
                              }
                            }
                          }
                        });
                      }
                      
                    }
                  });
                  
                }
                else{console.log("Here is an unknown problem with Add Job");}
              }
            });
          }
        });
      }
    });
  }
});


app.get("/statapp",function(req,res){
  if(!req.isAuthenticated()){
    res.json({success: false, message: "Not Authenticated"});
  }
  else{
    User.findOne({username: req.user.username},function(err, user){
      if(err){
        console.log(err);
      }
      else{
        if(user.type==='jobapplicant'){
          res.json({success: false, message: "Not Authenticated"});
        }
        else{
          if(!req.query.jobapplicantid || !req.query.jobid){
            res.json({success: false, message:"Provide jobid and jobapplicantid"});
          }
          else if(req.query.action!=="shortlist" && req.query.action!=="accept" && req.query.action!=="reject"){
            res.json({success: false, message: "Action should be either shortlist or accept or reject"});
          }
          else{
            Jobapplicant.findOne({_id:req.query.jobapplicantid},function(err, jobapplicant){
              if(err){
                console.log(err);
              }
              else{
                Job.find({deleted: false},function(err,alljob){
                  if(err){
                    console.log(err);
                  }
                  else{
                    var flag= true;
                    alljob.forEach(currjob => {             
                      currjob.application.forEach( applic => {
                        // console.log(typeof(applic.jobapplicantid),typeof(String(jobapplicant._id)),typeof(applic.status));
                        // console.log(applic.jobapplicantid,jobapplicant._id,applic.status);
                        if( (applic.jobapplicantid === String(jobapplicant._id)) && ( applic.status==="Accepted" ) ){
                          // console.log("Now");
                          flag=false;
                          res.json({success: false,message: "The jobapplicant has got job alreay. Reject Him/Her."});
                        }
                      } );         
                    });

                    if(flag===true){

                      Job.find({deleted: false},function(err, allfoundjob){
                        if(err){
                          console.log(err);
                        }
                        else if(req.query.action==="accept"){

                          for(var i=0;i<allfoundjob.length;i++){
                            for(var j=0;j<allfoundjob[i].application.length;j++){
                              // console.log(allfoundjob[i].application[j].jobapplicantid,req.query.jobapplicantid);
                              if(allfoundjob[i].application[j].jobapplicantid===req.query.jobapplicantid){
                                allfoundjob[i].application[j].status="Rejected";
                                allfoundjob[i].save();
                              }
                            }                            
                          }
                        }
                      });



                      Job.findOne({_id: req.query.jobid, deleted: false},function(err, foundjob){
                        if(err){
                          console.log(err);
                        }
                        else if(!foundjob){
                          res.json({success: false,message: "No such job exists."});
                        }
                        else{
                          foundjob.application.forEach(element => {
                            if(element.jobapplicantid===req.query.jobapplicantid){

                              if(req.query.action==="accept"){

                                element.status="Accepted";
                                foundjob.position=foundjob.position-1;
                                element.joiningdate= new Date().toLocaleString();
                                foundjob.save();
                                res.json({success: true,message: "Successfully Accepted"});
                              }
                              else if(req.query.action==="shortlist"){
                                element.status="Shortlisted";
                                foundjob.save();
                              }
                              else if(req.query.action==="reject"){
                                element.status="Rejected";
                                element.joiningdate=null;
                                // element.currentapplication=element.currentapplication+1;
                                foundjob.save();
                              }
                              return;
                            }                
                          });
                        }
                      });

                      
                    }
                  }
                });
              }
            });
          }
        }
      }
    });
  }
});

// Server listen at port 5000.
app.listen(5000,function(){
    console.log("SERVER IS RUNNING...");
})
