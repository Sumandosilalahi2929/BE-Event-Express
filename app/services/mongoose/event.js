// import model Events
const Events = require("../../api/v1/events/model");
const { checkingImage } = require("./images");
const { checkingCategories } = require("./categories");
const { checkingTalents } = require("./talents");

// import custom error not found dan bad request
const { NotFoundError, BadRequestError } = require("../../errors");

const getAllEvents = async (req) => {
  const { keyword, category, talent, status } = req.query;
  let condition = { organizer: req.user.organizer };

  if (keyword) {
    condition = { ...condition, title: { $regex: keyword, $options: "i" } };
  }

  if (category) {
    condition = { ...condition, category: category };
  }

  if (talent) {
    condition = { ...condition, talent: talent };
  }

  if (["Draft", "Published"].includes(status)) {
    condition = {
      ...condition,
      statusEvent: status,
    };
  }

  const result = await Events.find(condition)
    .populate({ path: "image", select: "_id name" })
    .populate({
      path: "category",
      select: "_id name",
    })
    .populate({
      path: "talent",
      select: "_id name role image",
      populate: { path: "image", select: "_id  name" },
    });

  return result;
};

const createEvents = async (req) => {
  try {
    console.log("createEvents - Start");

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

    console.log("createEvents - After destructuring");

    const imageId =
      typeof image === "object" && image !== null && image._id
        ? image._id
        : image;

    console.log("createEvents - imageId:", imageId);

    // Debug: Check if functions exist
    console.log("checkingImage function:", typeof checkingImage);
    console.log("checkingCategories function:", typeof checkingCategories);
    console.log("checkingTalents function:", typeof checkingTalents);

    // cari image, category dan talent dengan field id
    console.log("createEvents - Before checkingImage");
    await checkingImage(imageId);
    console.log("createEvents - After checkingImage");

    console.log("createEvents - Before checkingCategories");
    await checkingCategories(category);
    console.log("createEvents - After checkingCategories");

    console.log("createEvents - Before checkingTalents");
    await checkingTalents(talent, req.user.organizer);
    console.log("createEvents - After checkingTalents");

    // cari Events dengan field name
    console.log("createEvents - Before checking existing event");
    const check = await Events.findOne({
      title,
      organizer: req.user.organizer,
    });

    // apa bila check true / data Events sudah ada maka kita tampilkan error bad request dengan message judul acara sudah terdaftar
    if (check) throw new BadRequestError("judul acara sudah terdaftar");

    console.log("createEvents - Before creating event");
    const result = await Events.create({
      title,
      date,
      about,
      tagline,
      venueName,
      keyPoint,
      statusEvent: statusEvent || "Draft",
      tickets: tickets || [],
      image: imageId,
      category,
      talent,
      organizer: req.user.organizer,
    });

    console.log("createEvents - Event created successfully");
    return result;
  } catch (error) {
    console.error("Error in createEvents:", error);
    console.error("Error stack:", error.stack);
    throw error;
  }
};

const getOneEvents = async (req) => {
  const { id } = req.params;

  const result = await Events.findOne({
    _id: id,
    organizer: req.user.organizer,
  })
    .populate({ path: "image", select: "_id name" })
    .populate({
      path: "category",
      select: "_id name",
    })
    .populate({
      path: "talent",
      select: "_id name role image",
      populate: { path: "image", select: "_id  name" },
    });

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

  return result;
};

const updateEvents = async (req) => {
  const { id } = req.params;
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

  const imageId =
    typeof image === "object" && image !== null && image._id
      ? image._id
      : image;

  // cari image, category dan talent dengan field id
  await checkingImage(imageId);
  await checkingCategories(category);
  await checkingTalents(talent, req.user.organizer);

  // cari event berdasarkan field id
  const checkEvent = await Events.findOne({
    _id: id,
    organizer: req.user.organizer,
  });

  // jika id result false / null maka akan menampilkan error `Tidak ada acara dengan id` yang dikirim client
  if (!checkEvent)
    throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

  // cari Events dengan field name dan id selain dari yang dikirim dari params
  const check = await Events.findOne({
    title,
    organizer: req.user.organizer,
    _id: { $ne: id },
  });

  // apa bila check true / data Events sudah ada maka kita tampilkan error bad request dengan message pembicara duplikat
  if (check) throw new BadRequestError("judul acara sudah terdaftar");

  const result = await Events.findOneAndUpdate(
    { _id: id, organizer: req.user.organizer },
    {
      title,
      date,
      about,
      tagline,
      venueName,
      keyPoint,
      statusEvent,
      tickets,
      image: imageId,
      category,
      talent,
      organizer: req.user.organizer,
    },
    { new: true, runValidators: true }
  );

  return result;
};

const deleteEvents = async (req) => {
  const { id } = req.params;

  const result = await Events.findOne({
    _id: id,
    organizer: req.user.organizer,
  });

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

  await Events.findOneAndDelete({ _id: id, organizer: req.user.organizer });

  return result;
};

const changeStatusEvents = async (req) => {
  const { id } = req.params;
  const { statusEvent } = req.body;

  if (!["Draft", "Published"].includes(statusEvent)) {
    throw new BadRequestError("Status harus Draft atau Published");
  }

  // cari event berdasarkan field id
  const checkEvent = await Events.findOne({
    _id: id,
    organizer: req.user.organizer,
  });

  // jika id result false / null maka akan menampilkan error `Tidak ada acara dengan id` yang dikirim client
  if (!checkEvent)
    throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

  checkEvent.statusEvent = statusEvent;

  await checkEvent.save();

  return checkEvent;
};

module.exports = {
  getAllEvents,
  createEvents,
  getOneEvents,
  updateEvents,
  deleteEvents,
  changeStatusEvents,
};
