const express = require("express");
const router = express.Router();

const {
    getAllFiles,
    getFile,
    uploadFile,
    deleteFile,
    updateFile
} = require("../controllers/FileController");

router.post('/upload', uploadFile); // Hàm uploadFile
router.get('/', getAllFiles); // Hàm getAllFiles
router.delete('/delete', deleteFile); // Hàm deleteFile
router.get('/:fileId', getFile); // Hàm getFile
router.put('/update', updateFile);

module.exports = router;