const Images = require("../../api/v1/images/model");

// ada 2 cara generate gambar
// 1.kita gunain cara ini
const generateUrlImage = async (req) => {
  const result = `uploads/${req.file.filename}`;

  return result;
};

/**2 generate dengan cara ini  */

const createImages = async (req) => {
  const result = await Images.create({
    name: req.file
      ? `uploads/${req.file.filename}`
      : "uploads/avatar/default.png",
  });

  return result;
};

module.exports = { createImages, generateUrlImage };
