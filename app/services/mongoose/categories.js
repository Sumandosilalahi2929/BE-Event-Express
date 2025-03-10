const Categories = require("../../api/v1/categories/model");

const { BadRequestError, NotFoundError } = require("../../errors");

const getAllCategories = async (req) => {
  const result = await Categories.find({ organizer: req.user.organizer });
  return result;
};

const createCategories = async (req) => {
  const { name } = req.body;

  //cari categories dengan field name
  const check = await Categories.findOne({
    name,
    organizer: req.user.organizer,
  });

  //apabila check true/ data categories sudah ada maka kita tampilkan error bad request
  if (check) throw new BadRequestError("kategori nama duplikat");

  const result = await Categories.create({
    name,
    organizer: req.user.organizer,
  });

  return result;
};

const getOneCategories = async (req) => {
  const { id } = req.params;

  const result = await Categories.findOne({
    _id: id,
    organizer: req.user.organizer,
  });

  if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id : ${id}`);

  return result;
};

const updateCategories = async (req) => {
  const { id } = req.params;
  const { name } = req.body;

  //cari categories field namedan id selain dari yang dikirim dari params\
  const check = await Categories.findOne({
    name,
    organizer: req.user.organizer,
    _id: { $ne: id }, //$ne => mencari semua kategoris di bagian id kecuai di ID yang dicari
  });

  //apabila check true / data categories sudah ada maka kita tampilkan error bad request dengan

  if (check) throw new BadRequestError("kategori nama duplikat");
  const result = await Categories.findOneAndUpdate(
    { _id: id },
    { name },
    { new: true, runValidators: true }
  );

  //jika id result false / null maka menampilkan error ' Tidak ada kategori dengan id yang sama
  if (!result) throw new NotFoundError(`Tidak ada ketegori dengan id : ${id}`);

  return result;
};

const deleteCategories = async (req) => {
  const { id } = req.params;
  const result = await Categories.findOne({
    _id: id,
    organizer: req.user.organizer,
  });

  if (!result) throw new NotFoundError(`Tidak ada kategori dengan id : ${id}`);

  await Categories.findByIdAndDelete(id);

  return result;
};

const checkingCategories = async (id) => {
  const result = await Categories.findOne({ _id: id });
  if (!result) throw new NotFoundError(`Tidak ada kategori dengan id : ${id}`);
  return result;
};

module.exports = {
  getAllCategories,
  createCategories,
  getOneCategories,
  updateCategories,
  checkingCategories,
  deleteCategories,
};
