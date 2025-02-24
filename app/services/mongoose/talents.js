const Talents = require("../../api/v1/talents/model");
const { checkImage } = require("./images");

//import custom error not found and bad request
const { NotFoundError } = require("../../errors");
const BadRequest = require("../../errors/bad-request");
const { populate } = require("dotenv");

const getAllTalents = async (req) => {
  const { keyword } = req.query;
  let condition = {};

  if (keyword) {
    condition = { ...condition, name: { $regex: keyword, $options: "i" } };
  }

  const result = await Talents.find(condition)
    .populate({
      path: "image",
      select: "_id name",
    })
    .select("_id name role image");
  return result;
};

const createTalents = async (req) => {
  const { name, role, image } = req.body;

  //cari image dengan field image
  await checkImage(image);

  //cari telents dengan field name
  const check = await Talents.findOne({ name });

  //apabila check true/ data talents sudah ada maka kita tampilkan error bad request dengan message pembicara duplikat
  if (check) throw new BadRequest("pembicara sudah terdaftar");

  const result = await Talents.create({ name, image, role });
  return result;
};

const getOneTalents = async (req) => {
  const { id } = req.params;

  const result = await Talents.findOne({ _id: id });
  populate({
    path: "image",
    select: "_id name",
  }).select("_id name role image");

  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id : ${id}`);

  return result;
};

const updateTalents = async (req) => {
  const { id } = req.params;
  const { name, image, role } = req.body;

  //cari image dengan field name
  await checkingImage(image);

  //cari talents dengan field name = id selain dari yang dikirim dari params
  const check = await Talents.findOne({
    name,
    _id: { $ne: id },
  });

  //apabila check true/ data talents sudah ada maka kita tampilkan error bad request dengan messaage pembicara nama duplikat
  if (check) throw new BadRequest("pembicara nama duplikat");

  const result = await Talents.findOneAndUpdate(
    { _id: id },
    { name, image, role },
    { new: true, runvalidators: true }
  );

  //jika id result false/null maka menampilkan error `Tidak ada pembicara dengan id` yang dikirim ke client
  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id : ${id}`);
  return result;
};

const deleteTalents = async (req) => {
  const { id } = req.params;
  const result = await Talents.findOne({
    _id: id,
  });

  if (!result) throw new NotFoundError(`Tidak ad pembicara dengan id: ${id}`);
  await result.remove();
  return result;
};

const checkingTalents = async (id) => {
  const result = await Talents.findOne({ _id: id });
  if (!result) throw new NotFoundError(`Tidak ad pembicara dengan id: ${id}`);

  return result;
};

module.exports = {
  getAllTalents,
  createTalents,
  getOneTalents,
  updateTalents,
  deleteTalents,
  checkingTalents,
};
