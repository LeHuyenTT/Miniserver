const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

//! Models
const StudentModel = require("../models/StudentModel");

exports.createUser = asyncHandler(async (req, res, next) => {
    try {
        const newUser = new StudentModel(req.body);
        const savedUser = await newUser.save();
        res.status(201).json({
            success: true
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

exports.getAllUser = asyncHandler(async (req, res, next) => {
    try {
        const users = await StudentModel.find();
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    try {
        await res.user.remove();
        res.json({ success: true, message: 'Deleted user' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

exports.getUser = asyncHandler(async (req, res, next) => {
    res.status(200).json({ success: true, data: res.user });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
    const updateFields = {};
    for (const [key, value] of Object.entries(req.body)) {
        updateFields[key] = value;
    }
    try {
        await StudentModel.updateOne({ _id: res.user._id }, { $set: updateFields });
        const updatedUser = await StudentModel.findById(res.user._id);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (err) {
        res.status(400).json({ success: false, data: err.message });
    }
});

// Middleware function to get a single user by ID
exports.getUserMdw = asyncHandler(async (req, res, next) => {
    let user;
    try {
        user = await StudentModel.findOne({ username: req.params.id });
        if (user == null) {
            return res.status(404).json({ success: false, message: 'Cannot find user' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Cannot find user' });
    }
    res.user = user;
    next();
});
exports.updateAllStudentsStatusToOffline = asyncHandler(async (req, res, next) => {
    try {
        // Cập nhật toàn bộ sinh viên về trạng thái "offline"
        const result = await StudentModel.updateMany({}, { status: "offline" });
        
        // Trả về kết quả thành công với thông tin cập nhật
        res.status(200).json({
            success: true,
            message: `students were updated to offline status.`,
            data: result
        });
    } catch (err) {
        // Trả về lỗi nếu có bất kỳ vấn đề nào trong quá trình cập nhật
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
