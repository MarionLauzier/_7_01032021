const express = require("express");

const router = express.Router();

const userCtrl = require("../controllers/user");
const auth = require("../middlewares/auth");

router.get("/profile/:userid", auth, userCtrl.getProfile);
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.delete("/unsuscribe/:userid", auth, userCtrl.unsuscribe);

module.exports = router;
