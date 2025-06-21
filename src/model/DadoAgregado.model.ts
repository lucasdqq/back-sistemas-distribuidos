import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  objectIdentifier: String,
  media: Number,
  mediana: Number,
  somatorio: Number,
  contagem: Number,
  porcentagem: Number,
});

const DadoAgregadoSchema = new mongoose.Schema({
  type: { type: String, unique: true },
  lista: [ItemSchema],
});

export const DadoAgregadoModel = mongoose.model(
  "DadoAgregado",
  DadoAgregadoSchema
);
