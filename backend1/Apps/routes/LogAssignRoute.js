const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middlewares/auth");

const {
    createLogAssign,
    getAllLogAssign,
    deleteLogAssign,
    getLogAssign,
    updateLogAssign,
    getLogAssignMdw
} = require("../controllers/LogAssignController");

router.route("/").post(createLogAssign).get(getAllLogAssign);
router.post('/create',createLogAssign);
router.get('/:id', getLogAssignMdw, getLogAssign)
router.delete('/:id', getLogAssignMdw, deleteLogAssign)
router.put('/update/:id', getLogAssignMdw, updateLogAssign);

module.exports = router;