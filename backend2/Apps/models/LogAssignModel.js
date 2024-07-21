var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LogAssignModel = new Schema({
    user: { 
		type: String, 
		required: true,
        unique: true
	},
    logs: [{
        type: Object,
    }],
	
}, { timestamps: true });

module.exports = mongoose.model("LogAssignModel", LogAssignModel);