import mongoose from "mongoose";

const SECONDARY_DB_URI = process.env.SECONDARY_DB_URI;

if (!SECONDARY_DB_URI) {
  throw new Error("No está definida la variable SECONDARY_DB_URI en el .env");
}

const secondaryConnection = mongoose.createConnection(SECONDARY_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "GrupoProser",
});

secondaryConnection.on("connected", () => {
  console.log("✅ Conectado a la base de datos secundaria (GrupoProser)");
});

secondaryConnection.on("error", (err) => {
  console.error("❌ Error en la conexión secundaria:", err);
});

export default secondaryConnection;
