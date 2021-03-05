const express = require("express");

const router = express.Router();
const auth = require("../middlewares/auth");
const allowed = require("../middlewares/allowed");
const test = require("../middlewares/test");
const multer = require("../middlewares/multer-image");
const gagsCtrl = require("../controllers/gags");

router.post("/", auth, multer, gagsCtrl.addGag);

router.put("/:id", auth, allowed, multer, gagsCtrl.updateGag);

router.delete("/:id", auth, allowed, gagsCtrl.deleteGag);

router.post("/:id/like", auth, gagsCtrl.likeGag);

router.post("/:id/comment", auth, gagsCtrl.commentGag);

router.put("/:id/comment/:comid", auth, allowed, gagsCtrl.updateCommGag);

router.delete("/:id/comment/:comid", auth, allowed, gagsCtrl.deleteCommGag);

router.get("/:id", auth, gagsCtrl.getTheGag);

router.get("/", auth, gagsCtrl.getAllGags);

module.exports = router;
