const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

//! Models
const LogAssignModel = require("../models/LogAssignModel");

exports.createLogAssign = asyncHandler(async (req, res, next) => {
    try {
        const newLogAssign = new LogAssignModel(req.body);
        const savedLogAssign = await newLogAssign.save();
        if (savedLogAssign == null) {
            res.status(400).json({ success: false, message: err.message });
        } else {
            res.status(200).json({
                success: true
            });
        }
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

exports.getAllLogAssign = asyncHandler(async (req, res, next) => {
    try {
        const LogAssign = await LogAssignModel.find();
        res.status(200).json({
            success: true,
            data: LogAssign
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

exports.deleteLogAssign = asyncHandler(async (req, res, next) => {
    try {
        await res.LogAssign.remove();
        res.json({ success: true, message: 'Deleted user' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

exports.getLogAssign = asyncHandler(async (req, res, next) => {
    res.status(200).json({ success: true, data: res.LogAssigns });
});



exports.updateLogAssign = asyncHandler(async (req, res, next) => {
    const updateFields = {};
    for (const [key, value] of Object.entries(req.body)) {
        updateFields[key] = value;
    }
    try {
        await LogAssignModel.updateOne({ _id: res.LogAssign._id }, { $set: updateFields });
        const updatedLogAssign = await LogAssignModel.findById(res.LogAssign._id);
        res.status(200).json({ success: true, data: updatedLogAssign });
    } catch (err) {
        res.status(400).json({ success: false, data: err.message });
    }
});

// Middleware function to get a single user by ID
exports.getLogAssignMdw = asyncHandler(async (req, res, next) => {
    let LogAssign;
    try {
        LogAssign = await LogAssignModel.findOne({user: req.params.id}).exec();
        if (LogAssign == null) {
            return res.status(404).json({ success: false, message: 'cannot find user' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'cannot find user *' });
    }
    res.LogAssigns = LogAssign;
    next();
});


