const Images = require("../../api/v1/images/model");
const { NotFoundError } = require("../../errors");

// ada 2 cara generate gambar
// 1.kita gunain cara ini
// const generateUrlImage = async (req) => {
//   const result = `uploads/${req.file.filename}`;

//   return result;
// };

/**2 generate dengan cara ini  */

const createImages = async (req) => {
  const result = await Images.create({
    name: req.file
      ? `uploads/${req.file.filename}`
      : "uploads/avatar/default.png",
  });

  return result;
};

//tambahkan function checking Image
const checkingImage = async (id) => {
  const result = await Images.findOne({ _id: id });
  console.log(result);

  if (!result) throw new NotFoundError(`Tidak ada gambar dengan id : ${id}`);
  return result;
};

module.exports = { createImages, checkingImage };
