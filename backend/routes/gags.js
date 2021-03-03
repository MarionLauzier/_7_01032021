const express = require("express");

const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-image");
const gagsCtrl = require("../controllers/gags");

router.post("/", auth, multer, gagsCtrl.addGag);

router.put("/:id", auth, multer, gagsCtrl.updateGag);

router.delete("/:id", auth, gagsCtrl.deleteGag);

router.post("/:id/like", auth, gagsCtrl.likeGag);

router.post("/:id/comment", auth, gagsCtrl.commentGag);

router.put("/:id/comment/:comid", auth, gagsCtrl.updateCommGag);

router.delete("/:id/comment/:comid", auth, gagsCtrl.deleteCommGag);

router.get("/:id", auth, gagsCtrl.getTheGag);

router.get("/", auth, gagsCtrl.getAllGags);

module.exports = router;
