import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        {/* Logo a la izquierda */}
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="Logo PROSER" className="h-8" />
        </div>

        {/* Menú centrado */}
        <div className="flex-1 flex justify-center space-x-8 text-sm">
          <Link to="/inicio" className="hover:underline">Inicio</Link>

          <div className="relative group">
            <button className="hover:underline">Complex</button>
            <div className="absolute hidden group-hover:block bg-white text-black mt-1 p-2 shadow z-50">
              <Link to="/complex/agregar" className="block px-4 py-2 hover:bg-gray-100">Agregar Casos</Link>
              <Link to="/complex/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
              <Link to="/complex/excel" className="block px-4 py-2 hover:bg-gray-100">Ver Excel</Link>
            </div>
          </div>

          <div className="relative group">
            <button className="hover:underline">Riesgos</button>
            <div className="absolute hidden group-hover:block bg-white text-black mt-1 p-2 shadow z-50">
              <Link to="/riesgos/agregar" className="block px-4 py-2 hover:bg-gray-100">Agregar Casos</Link>
              <Link to="/riesgos/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
              <Link to="/riesgos/exportar" className="block px-4 py-2 hover:bg-gray-100">Exportar Excel</Link>
            </div>
          </div>

          <Link to="/formularioinspeccion" className="hover:underline">Formulario</Link>
          <Link to="/cuenta" className="hover:underline">Cuenta</Link>
        </div>

        {/* Cierre de sesión a la derecha */}
        <div>
          <Link to="/login" className="hover:underline">Cerrar sesión</Link>
        </div>
      </nav>

      {/* Contenido dinámico */}
      <main className="flex-1 bg-gray-100 p-4">
        <Outlet />
      </main>
    </div>
  );
}
