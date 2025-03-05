const express = require("express");
const router = express();
const { signinCms } = require("../auth/controller");

router.post("/auth/signin", signinCms);

module.exports = router;
