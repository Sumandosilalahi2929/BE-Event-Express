// import model Events

const Events = require("../../api/v1/events/model");
const { checkingImage } = require("./images");
const { checkingCategories } = require("./categories");
const { checkingTalents } = require("./talents");

//import custom error not found dan bad request
const { NotFoundError, BadRequestError } = require("../../errors");

const getAllEvents = async (req) => {
  const { keyword, category, talent } = req.query;
  let condition = {};
  if (keyword) {
    condition = { ...condition, title: { $regex: keyword, $options: "i" } };
  }
  if (category) {
    condition = { ...condition, category: category };
  }
  if (talent) {
    condition = { ...condition, talent: talent };
  }

  const result = await Events.find(condition)
    .populate({
      path: "image",
      select: "_id name",
    })
    .populate({
      path: "category",
      select: "id_name",
    })
    .populate({
      path: "talent",
      select: "_id name role image",
      populate: { path: "image", select: "id_name" },
    });
  return result;
};

const createEvents = async (req) => {
  const {
    title,
    date,
    about,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
  } = req.body;

  //cari image, category dan talent dengan field id
  await checkingImage(image);
  await checkingCategories(category);
  await checkingTalents(talent);

  //cari event dengan field name
  const check = await Events.findOne({ title });

  //apabila check true / data events sudah ada maka kita tampilkan error bad request dengan massage pembicara duplikat
  if (check) throw new BadRequestError("Judul Acara Sudah terdaftar");

  const result = await Events.create({
    title,
    date,
    about,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
  });

  return result;
};

const getOneEvents = async (req) => {
  const { id } = req.params;
  const result = await Events.findOne({ _id: id })
    .populate({
      path: "image",
      select: "_id name",
    })
    .populate({
      path: "category",
      select: "id_name",
    })
    .populate({
      path: "talent",
      select: "_id name role image",
      populate: { path: "image", select: "id_name" },
    });
  return result;
};
