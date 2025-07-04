import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes, FaUserCircle, FaFileAlt, FaChartBar, FaSignOutAlt, FaHome, FaUserShield, FaChevronDown } from 'react-icons/fa';
import proserLogo from '../img/PROSER_FIRMA_BLANCA_V2 (3).gif';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);

  const handleDropdown = (name) => setDropdown(dropdown === name ? null : name);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-md px-4 py-2 flex items-center justify-between relative z-50">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src={proserLogo}
            alt="Logo PROSER"
            className="h-10 md:h-19 max-w-[120px] md:max-w-[160px] object-contain"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center space-x-6 items-center">
          <Link to="/inicio" className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium transition">
            <FaHome /> Inicio
          </Link>

          {/* Complex Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleDropdown('complex')}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium transition focus:outline-none"
            >
              <FaFileAlt /> Complex
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdown === 'complex' && (
              <div
                onMouseLeave={() => setDropdown(null)}
                className="absolute left-0 mt-2 w-48 bg-white rounded shadow-lg py-2 animate-fade-in"
              >
                <Link to="/complex/agregar" className="block px-4 py-2 hover:bg-blue-50">Agregar Casos</Link>
                <Link to="/complex/dashboard" className="block px-4 py-2 hover:bg-blue-50">Dashboard</Link>
                <Link to="/complex/excel" className="block px-4 py-2 hover:bg-blue-50">Ver Excel</Link>
              </div>
            )}
          </div>

          {/* Riesgos Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleDropdown('riesgos')}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium transition focus:outline-none"
            >
              <FaChartBar /> Riesgos
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdown === 'riesgos' && (
              <div
                onMouseLeave={() => setDropdown(null)}
                className="absolute left-0 mt-2 w-56 bg-white rounded shadow-lg py-2 animate-fade-in"
              >
                <Link to="/riesgos/agregar" className="block px-4 py-2 hover:bg-blue-50">Agregar Casos</Link>
                <Link to="/riesgos/dashboard" className="block px-4 py-2 hover:bg-blue-50">Dashboard</Link>
                <Link to="/riesgos/exportar" className="block px-4 py-2 hover:bg-blue-50">Exportar Excel</Link>
              </div>
            )}
          </div>

          {/* Formulario Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleDropdown('formularios')}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium transition focus:outline-none"
            >
              <FaFileAlt /> Formularios <FaChevronDown className="ml-1" />
            </button>
            {dropdown === 'formularios' && (
              <div
                onMouseLeave={() => setDropdown(null)}
                className="absolute left-0 mt-2 w-64 bg-white rounded shadow-lg py-2 animate-fade-in"
              >
                <Link to="/formularioinspeccion" className="block px-4 py-2 hover:bg-blue-50">
                  Formulario de riesgo
                </Link>
                <Link to="/formulario-maquinaria" className="block px-4 py-2 hover:bg-blue-50">
                  Formulario de maquinaria <span className="text-xs text-gray-400">(Próximamente)</span>
                </Link>
                <Link to="/formulario-inspeccion-general" className="block px-4 py-2 hover:bg-blue-50">
                  Formulario de inspección <span className="text-xs text-gray-400">(Próximamente)</span>
                </Link>
              </div>
            )}
          </div>

          <Link to="/cuenta" className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium transition">
            <FaUserShield /> Cuenta
          </Link>
        </div>

        {/* User & Logout */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/micuenta" className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium transition">
            <FaUserCircle /> Mi cuenta
          </Link>
          <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium transition">
            <FaSignOutAlt /> Cerrar sesión
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg py-4 flex flex-col space-y-2 z-50 animate-fade-in">
            <Link to="/inicio" className="px-6 py-2 hover:bg-blue-50" onClick={() => setMenuOpen(false)}>Inicio</Link>
            <div>
              <button
                className="w-full text-left px-6 py-2 hover:bg-blue-50 font-medium"
                onClick={() => handleDropdown('complex')}
              >
                Complex
              </button>
              {dropdown === 'complex' && (
                <div className="pl-8">
                  <Link to="/complex/agregar" className="block py-1 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Agregar Casos</Link>
                  <Link to="/complex/dashboard" className="block py-1 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link to="/complex/excel" className="block py-1 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Ver Excel</Link>
                </div>
              )}
            </div>
            <div>
              <button
                className="w-full text-left px-6 py-2 hover:bg-blue-50 font-medium"
                onClick={() => handleDropdown('riesgos')}
              >
                Riesgos
              </button>
              {dropdown === 'riesgos' && (
                <div className="pl-8">
                  <Link to="/riesgos/agregar" className="block py-1 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Agregar Casos</Link>
                  <Link to="/riesgos/dashboard" className="block py-1 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link to="/riesgos/exportar" className="block py-1 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Exportar Excel</Link>
                </div>
              )}
            </div>
            <div>
              <button
                className="w-full text-left px-6 py-2 hover:bg-blue-50 font-medium"
                onClick={() => handleDropdown('formularios')}
              >
                Formularios
              </button>
              {dropdown === 'formularios' && (
                <div className="pl-8">
                  <Link to="/formularioinspeccion" className="block py-1 hover:text-blue-700" onClick={() => setMenuOpen(false)}>
                    Formulario de riesgo
                  </Link>
                  <Link to="/formulario-maquinaria" className="block py-1 hover:text-blue-700" onClick={() => setMenuOpen(false)}>
                    Formulario de maquinaria <span className="text-xs text-gray-400">(Próximamente)</span>
                  </Link>
                  <Link to="/formulario-inspeccion-general" className="block py-1 hover:text-blue-700" onClick={() => setMenuOpen(false)}>
                    Formulario de inspección <span className="text-xs text-gray-400">(Próximamente)</span>
                  </Link>
                </div>
              )}
            </div>
            <Link to="/cuenta" className="px-6 py-2 hover:bg-blue-50" onClick={() => setMenuOpen(false)}>Cuenta</Link>
            <Link to="/login" className="px-6 py-2 hover:bg-red-50 text-red-600" onClick={() => setMenuOpen(false)}>Cerrar sesión</Link>
          </div>
        )}
      </nav>

      {/* Contenido dinámico */}
      <main className="flex-1 bg-gray-100 p-4">
        <Outlet />
      </main>
    </div>
  );
}
