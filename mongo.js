const mongoose = require("mongoose");

async function connectMongo() {
  try {
    await mongoose.connect("mongodb://mongodb:27017/votacao");
    console.log("✅ Conectado ao MongoDB");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error);
  }
}

module.exports = connectMongo;
