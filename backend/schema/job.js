const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Job Schema
const jobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    recruitername:{
        type: String,
        required: true
    },
    recruitermail: {
        type: String,
        required: true
    },
    maxapplication:{    // max applications set by the recruiter
        type: Number,
        required: true
    },
    currentapplication: {   // current number of applications
        type: Number,
        required: true,
        default: 0
    },
    position: {             // remaining number of positions
        type: Number,
        required: true
    },
    postingdate: {
        type: Date,
        required: true
    },
    ddate: {
        type: Date,
        required: true
    },
    dtime: {
        type: String,
        required: true
    },
    requiredskill: [{
        type: String,
        required: false
    }],
    jobtype: {
        type: String,
        enum: ['Full-time','Part-time','Work from Home'],
        required: true
    },
    duration: {
        type: Number,
        enum:[0,1,2,3,4,5,6], //months (0 (indefinite) - 6 months)
        required: true
    },
    salarypermonth:{
        type: Number,
        required: true
    },
    deleted:{
        type: Boolean,
        required: true,
        default: false
    },
    application: [{
        jobapplicantid:{
            type: String,
            required: true
        },
        status:{
            type: String,
            enum: ["Applied", "Shortlisted","Accepted","Rejected"],  // Possible stages of an apllication
            default: "Applied"
        },
        joiningdate:{
            type: Date,
            // required:function() { return this.status === 'Accepted'; }
        },
        applicationdate:{
            type: Date,
            // required:function() { return this.status === 'Accepted'; }
        },
        ratingtojobbyjobapplicant:{
            type: Number,
            default: null
            // required:function() { return this.status === 'Accepted'; }
        },
        ratingtojobapplicantbyrecruiter:{
            type: Number,
            default: null
            // required:function() { return this.status === 'Accepted'; }
        },
        sop:{
            type: String,
            required: true
        }
    },]

});

module.exports = job = mongoose.model("jobs", jobSchema);

