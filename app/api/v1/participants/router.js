const express = require("express");
const router = express();

const { signup, activeParticipant, signin } = require("./controller");

router.post("/auth/signup", signup);
router.post("/auth/signin", signin);
router.put("/active", activeParticipant);

module.exports = router;
