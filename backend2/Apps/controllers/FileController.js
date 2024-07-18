const asyncHandler = require('express-async-handler');
const multer = require('multer');
const Submission = require('../models/FileModel');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Hàm upload file
exports.uploadFile = [
    upload.single('file'),
    asyncHandler(async (req, res, next) => {
        try {
            const { id } = req.body;
            const { originalname, buffer } = req.file;

            if (!id) {
                return res.status(400).json({ success: false, message: 'ID is required' });
            }
            
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'File is required' });
            }

            let submission = await Submission.findOne({ id });
            if (!submission) {
                submission = new Submission({ id, uploaded: [] });
            }

            submission.uploaded.push({
                nameFile: originalname,
                data: buffer.toString('base64')
            });

            const savedSubmission = await submission.save();

            if (!savedSubmission) {
                return res.status(400).json({ 
                    success: false,
                    message: 'File upload failed.'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'File uploaded successfully!',
                    submissionId: savedSubmission._id
                });
            }
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    })
];

exports.getAllFiles = asyncHandler(async (req, res, next) => {
    try {
        const submissions = await Submission.find();
        res.status(200).json({
            success: true,
            data: submissions
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

exports.deleteFile = asyncHandler(async (req, res, next) => {
    try {
        const { id, filename } = req.body;
        const submission = await Submission.findOne({ id });

        if (!submission) {
            return res.status(404).json({ success: false, message: 'Submission not found' });
        }

        submission.uploaded = submission.uploaded.filter(file => file.nameFile !== filename);

        await submission.save();

        res.status(200).json({ success: true, message: 'File deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

exports.getFile = asyncHandler(async (req, res, next) => {
    try {
        const submission = await Submission.findOne({ 'uploaded._id': req.params.fileId });
        if (!submission) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        const file = submission.uploaded.id(req.params.fileId);
        const buffer = Buffer.from(file.data, 'base64');

        res.set('Content-Disposition', `attachment; filename="${file.nameFile}"`);
        res.send(buffer);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

exports.updateFile = asyncHandler(async (req, res, next) => {
    const { id, filename, newFilename } = req.body;

    try {
        const submission = await Submission.findOne({ id });

        if (!submission) {
            return res.status(404).json({ success: false, message: 'Submission not found' });
        }

        const file = submission.uploaded.find(file => file.nameFile === filename);

        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        file.nameFile = newFilename;

        await submission.save();

        res.status(200).json({ success: true, data: file });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});
