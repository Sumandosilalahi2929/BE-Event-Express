const Talents = require("../../api/v1/talents/model");
const { checkingImage } = require("./images");

//import custom error not found and bad request
const { NotFoundError, BadRequestError } = require("../../errors");
const { populate } = require("dotenv");

const getAllTalents = async (req) => {
  const { keyword } = req.query;
  let condition = { organizer: req.user.organizer };

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
  await checkingImage(image);

  //cari telents dengan field name
  const check = await Talents.findOne({ name, organizer: req.user.organizer });

  //apabila check true/ data talents sudah ada maka kita tampilkan error bad request dengan message pembicara duplikat
  if (check) throw new BadRequestError("pembicara sudah terdaftar");

  const result = await Talents.create({
    name,
    image,
    role,
    organizer: req.user.organizer,
  });
  return result;
};

const getOneTalents = async (req) => {
  const { id } = req.params;

  const result = await Talents.findOne({
    _id: id,
    organizer: req.user.organizer,
  })
    .populate({
      path: "image",
      select: "_id name",
    })
    .select("_id name role image");

  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id : ${id}`);

  return result;
};

const updateTalents = async (req) => {
  const { id } = req.params;
  const { name, image, role } = req.body;

  // Cek apakah image tersedia, jika ada baru diperiksa
  if (image) {
    await checkingImage(image);
  }

  // Cek apakah nama pembicara sudah ada selain ID yang sedang diupdate
  const check = await Talents.findOne({
    name,
    _id: { $ne: id },
    organizer: req.user.organizer,
  });

  if (check)
    throw new BadRequestError("Pembicara dengan nama tersebut sudah ada.");

  // Update data pembicara
  const result = await Talents.findByIdAndUpdate(
    id,
    { name, image, role, organizer: req.user.organizer },
    { new: true, runValidators: true }
  ).select("_id name role image");

  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id: ${id}`);

  return result;
};

const deleteTalents = async (req) => {
  const { id } = req.params;

  const result = await Talents.findByIdAndDelete(id);

  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id: ${id}`);

  return result;
};

// PERBAIKAN: Tambahkan parameter organizer
const checkingTalents = async (id, organizer) => {
  const result = await Talents.findOne({
    _id: id,
    organizer: organizer, // ✅ Gunakan parameter organizer
  });
  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan id: ${id}`);

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
