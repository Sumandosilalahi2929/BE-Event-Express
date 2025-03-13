const express = require("express");
const router = express();

const {
  signup,
  activeParticipant,
  signin,
  getAllLandingPage,
  getDetailLandingPage,
} = require("./controller");

router.post("/auth/signup", signup);
router.post("/auth/signin", signin);
router.get("/events", getAllLandingPage);
router.get("/events/:id", getDetailLandingPage);
router.put("/active", activeParticipant);

module.exports = router;
