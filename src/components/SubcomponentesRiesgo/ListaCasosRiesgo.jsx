import React, { useState } from "react";
import { useCasosRiesgo } from "../../context/CasosRiesgoContext";

const ListaCasosRiesgo = ({ onEditarCaso }) => {
  const { casos } = useCasosRiesgo();
  const [pagina, setPagina] = useState(1);
  const casosPorPagina = 10;

  const totalPaginas = Math.ceil(casos.length / casosPorPagina) || 1;
  const casosPagina = casos.slice((pagina - 1) * casosPorPagina, pagina * casosPorPagina);

  return (
    <div className="mt-8 flex flex-col items-center">
      <table className="w-3/4 border mb-4 text-center">
        <thead>
          <tr>
            <th className="border px-2 py-1 font-bold">Asegurado</th>
            <th className="border px-2 py-1 font-bold">Ciudad</th>
            <th className="border px-2 py-1 font-bold">Estado</th>
            <th className="border px-2 py-1 font-bold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {casos.length === 0 ? (
            <tr>
              <td colSpan={4} className="border px-2 py-4 text-gray-400">No hay casos registrados</td>
            </tr>
          ) : (
            casosPagina.map((caso, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{caso.asegurado}</td>
                <td className="border px-2 py-1">{caso.ciudad}</td>
                <td className="border px-2 py-1">{caso.estado}</td>
                <td className="border px-2 py-1">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => onEditarCaso && onEditarCaso(caso, idx)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex items-center space-x-2 justify-center">
        <button onClick={() => setPagina(1)} disabled={pagina === 1}>{'<<'}</button>
        <button onClick={() => setPagina(pagina - 1)} disabled={pagina === 1}>{'<'}</button>
        {[...Array(totalPaginas)].map((_, i) => (
          <button
            key={i}
            className={pagina === i + 1 ? "bg-orange-400 text-white px-2 rounded" : ""}
            onClick={() => setPagina(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={() => setPagina(pagina + 1)} disabled={pagina === totalPaginas}>{'>'}</button>
        <button onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas}>{'>>'}</button>
        <span className="ml-2 text-xs text-gray-500">[{casos.length === 0 ? 0 : pagina} de {totalPaginas}]</span>
      </div>
    </div>
  );
};

export default ListaCasosRiesgo;