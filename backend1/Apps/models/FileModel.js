var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FileSchema = new Schema({
    nameFile: { type: String, required: true },
    data: { type: String, required: true } // Chuỗi base64 của dữ liệu file
});

var SubmissionSchema = new Schema({
    id: { type: String, required: true, unique: true },
    uploaded: { type: [FileSchema], required: true }
});

module.exports = mongoose.model("FileModel", SubmissionSchema);
