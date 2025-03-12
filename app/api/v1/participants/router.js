const express = require("express");
const router = express();

const { signup } = require("./controller");

router.post("/auth/signup", signup);

module.exports = router;
