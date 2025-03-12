const {
  signupParticipant,
} = require("../../../services/mongoose/participants");
const { StatusCodes } = require("http-status-codes");

const signup = async (req, res, next) => {
  try {
    const result = await signupParticipant(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup };
