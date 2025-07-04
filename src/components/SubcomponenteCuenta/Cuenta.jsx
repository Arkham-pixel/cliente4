import React, { useState } from "react";
import EditarCuentas from "./EditarCuenta";
import AgregarCuenta from "./AgregarCuenta";

// Puedes mover esto a su propio archivo si luego creces
function EliminarCuenta() {
  return <div>Eliminar cuenta aquí</div>;
}
function SeguridadCuenta() {
  return <div>Seguridad de la cuenta aquí</div>;
}

// Simulación de usuario actual (puedes reemplazarlo con props, context o Firebase)
const user = {
  nombre: "Daniel",
  rol: "admin", // Cambia a "admin" o "soporte" para ver las pestañas adicionales
};

const Cuenta = () => {
  const [pestana, setPestana] = useState("editar");

  // Control de roles permitidos
  const esAdminOSoporte = user.rol === "admin" || user.rol === "soporte";

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Cuenta</h2>

      <div className="flex space-x-2 mb-6">
        <button
          className={`px-4 py-2 rounded ${pestana === "editar" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setPestana("editar")}
        >
          Editar cuentas
        </button>

        {esAdminOSoporte && (
          <button
            className={`px-4 py-2 rounded ${pestana === "agregar" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setPestana("agregar")}
          >
            Agregar cuenta
          </button>
        )}

        {esAdminOSoporte && (
          <button
            className={`px-4 py-2 rounded ${pestana === "eliminar" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setPestana("eliminar")}
          >
            Eliminar cuenta
          </button>
        )}

        <button
          className={`px-4 py-2 rounded ${pestana === "seguridad" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setPestana("seguridad")}
        >
          Seguridad de la cuenta
        </button>
      </div>

      <div>
        {pestana === "editar" && <EditarCuentas />}
        {pestana === "agregar" && esAdminOSoporte && <AgregarCuenta />}
        {pestana === "eliminar" && esAdminOSoporte && <EliminarCuenta />}
        {pestana === "seguridad" && <SeguridadCuenta />}
      </div>
    </div>
  );
};

export default Cuenta;
