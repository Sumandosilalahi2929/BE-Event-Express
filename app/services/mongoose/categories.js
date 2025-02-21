const Categories = require("../../api/v1/categories/model");

const { BadRequestError } = require("../../errors");

const getAllCategories = async () => {
  const result = await Categories.find();
  return result;
};

const createCategories = async (req) => {
  const { name } = req.body;

  //cari categories dengan field name
  const check = await Categories.findOne({ name });

  //apabila check true/ data categories sudah ada maka kita tampilkan error bad request
  if (check) throw new BadRequestError("kategori nama duplikat");

  const result = await Categories.create({ name });

  return result;
};

const getOneCategories = async (req) => {
  const { id } = req.params;

  const result = await Categories.findOne({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada Kategori dengan id : ${id}`);

  return result;
};

module.exports = { getAllCategories, createCategories };
