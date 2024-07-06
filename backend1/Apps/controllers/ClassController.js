const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

//! Models
const ClassModel = require("../models/ClassModel");
const StudentModel = require("../models/StudentModel");

exports.updateClasses = asyncHandler(async (req, res, next) => {
    try {
        // Lấy thông tin lớp học cần cập nhật từ request body
        const classIdToUpdate = "6676a117a2b6a013fc70b772"; 

        // Kiểm tra lớp học tồn tại hay không
        const existingClass = await ClassModel.findById(classIdToUpdate);
        if (!existingClass) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        // Lấy danh sách sinh viên từ StudentModel (ví dụ lấy tất cả sinh viên)
        const students = await StudentModel.find();

        // Cập nhật thông tin lớp học
        existingClass.nameClass = req.body.nameClass;
        existingClass.startTime = req.body.startTime;
        existingClass.endTime = req.body.endTime;
        existingClass.teacher = req.body.teacher;
        existingClass.room = req.body.room;
        // existingClass.subject = req.body.subject;
        existingClass.members = students.map(student => student._id);

        // Lưu lại thông tin lớp học đã cập nhật vào cơ sở dữ liệu
        const updatedClass = await existingClass.save();

        // Trả về kết quả thành công
        res.status(200).json({ success: true, data: updatedClass });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

exports.createClass = asyncHandler(async (req, res, next) => {
    try {
        const newClass = new ClassModel(req.body);
        const savedClass = await newClass.save();
        if (savedClass == null ){
            res.status(400).json({ success: false, message: err.message });
        }else{
            res.status(200).json({
                success: true
            });
        }
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

exports.getAllClass = asyncHandler(async (req, res, next) => {
    try {
        const classes = await ClassModel.find();
        res.status(200).json({
            success: true,
            data: classes
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

exports.deleteClass = asyncHandler(async (req, res, next) => {
    try {
        await res.classes.remove();
        res.json({ success: true, message: 'Deleted user' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

exports.getClass = asyncHandler(async (req, res, next) => {
    res.status(200).json({ success: true, data: res.classes });
});

exports.getAllMemberClass = asyncHandler(async (req, res, next) => {
    classId = req.params.id;
    ret = await ClassModel.findOne({classID:classId}).populate("members");
    data = []
    temp = {}
    for (let i = 0; i < ret.members.length; i++) {
        temp["userID"] = ret.members[i].username;
        temp["fullname"] = ret.members[i].fullname;
        temp["email"] = ret.members[i].email;
        temp["status"] = ret.members[i].status;
        temp["inClass"] = ret.members[i].inClass;
        data.push(temp);
        temp = {};
    }

    res.status(200).json({ success: true, data: data });
});

exports.updateClass = asyncHandler(async (req, res, next) => {
    const updateFields = {};
    for (const [key, value] of Object.entries(req.body)) {
        updateFields[key] = value;
    }
    try {
        await ClassModel.updateOne({ _id: res.classes._id }, { $set: updateFields });
        const updatedClass = await ClassModel.findById(res.classes._id);
        res.status(200).json({ success: true, data: updatedClass });
    } catch (err) {
        res.status(400).json({ success: false, data: err.message });
    }
});

exports.customClassFrontend = asyncHandler(async (req, res, next) => {
    data = [
        {
            "classID": "IT001MTCL",
            "nameClass": "IT001.MTCL",
            "desClass": "Nhập môn lập trình chất lượng cao năm học 2021-2022",
            "imgClass": "https://mui.com/static/images/cards/contemplative-reptile.jpg"
        },
        {
            "classID": "MA003MTCL",
            "nameClass": "MA003.MTCL",
            "desClass": "Đại số tuyến tính chất lượng cao năm học 2021-2022",
            "imgClass": "https://mui.com/static/images/cards/contemplative-reptile.jpg"
        },
        {
            "classID": "CE212MTCL",
            "nameClass": "CE212.MTCL",
            "desClass": "Lý thuyết mạch điện chất lượng cao năm học 2021-2022",
            "imgClass": "https://mui.com/static/images/cards/contemplative-reptile.jpg"
        }
    ]
    res.status(200).json({ success: true, data: data });
});

// Middleware function to get a single user by ID
exports.getClassMdw = asyncHandler(async (req, res, next) => {
    let classes;
    try {
        classes = await ClassModel.findById(req.params.id);
        if (classes == null) {
            return res.status(404).json({ success: false, message: 'Cannot find user' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Cannot find user' });
    }
    res.classes = classes;
    next();
});

exports.getAllStudentClass = asyncHandler(async (req, res, next) => {
    classID = req.params.id
    try {
        ret = await ClassModel.findOne({classID}).populate("members");
        data = []
        temp = {}
        for (let i = 0; i < ret.members.length; i++) {
            if(ret.members[i].role == "student"){
                temp["userID"] = ret.members[i].username;
                temp["fullname"] = ret.members[i].fullname;
                temp["email"] = ret.members[i].email;
                temp["statusLogin"] = ret.members[i].deviceLogin;
                temp["statusJoinClass"] = ret.members[i].inClass
                data.push(temp);
                temp = {};
            }
        }
        if (data == null) {
            return res.status(404).json({ success: false, message: 'Cannot find user' });
        } else {
            return res.status(200).json({ success: true, data: data });
        }
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});


