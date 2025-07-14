import mongoose from "mongoose";

const SECONDARY_DB_URI = process.env.SECONDARY_DB_URI; // Pon la URI de la nueva base de datos en tu .env

const secondaryConnection = mongoose.createConnection(SECONDARY_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

secondaryConnection.on("connected", () => {
  console.log("Conectado a la base de datos secundaria");
});

secondaryConnection.on("error", (err) => {
  console.error("Error en la conexión secundaria:", err);
});

export default secondaryConnection;
