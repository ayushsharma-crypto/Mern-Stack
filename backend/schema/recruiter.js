const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create recruiter Schema
const recruiterSchema = new Schema({
	fullname: {
		type: String,
		required: true
	},
	mail: {
		type: String,
		required: true
	},
    contact: {
        type: Number,
        required: true,
    },
    bio:{
        type: String,
        required: true
    },
    // Rating:{}
});

module.exports = mongoose.model("recruiters", recruiterSchema);