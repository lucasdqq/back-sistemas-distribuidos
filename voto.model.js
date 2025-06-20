const mongoose = require("mongoose");

const VotoSchema = new mongoose.Schema({
  type: String,
  object: String,
  valor: Number,
  datetime: Date
});

const Voto = mongoose.model("Voto", VotoSchema);
module.exports = Voto;