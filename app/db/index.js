// 1 Import package mongose
const mongoose = require("mongoose");

// 2 kita import konfigurasi terkait mongoDB dari app/config/index.js
const { urlDb } = require("../config");

// 3 conect ke mongoDB menggunakan konfigurasi yang telah kita import
mongoose.connect(urlDb);

// 4 simpan koneksi dalam constant db
const db = mongoose.connection;

// 5 export db supaya bisa digunakan file lain yang membutuhkan
module.exports = db;
