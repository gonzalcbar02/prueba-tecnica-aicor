import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"
import { useState } from "react"
import { Home, Menu, X, ShoppingCart, History, LogOut } from "lucide-react"

export default function Navbar() {
  const { logout, isLoading } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    const success = await logout()
    if (success) {
      window.location.href = "/" 
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <span className="font-bold text-xl text-slate-800 hidden sm:block">TechStore</span>
            </Link>
          </div>

          
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="home flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              <Home className="w-4 h-4" />
              <span>Inicio</span>
            </Link>

            <Link
              to="/cart"
              className="cart flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Carrito</span>
            </Link>
            <Link
              to="/history"
              className="history flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              <History className="w-4 h-4" />
              <span>Histórico</span>
            </Link>
          </nav>


          <div className="hidden md:flex items-center">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoading ? "Cerrando..." : "Cerrar sesión"}</span>
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/cart"
                className="home flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                
              >
                <Home className="w-5 h-5" />
                <span>Inicio</span>
              </Link>

              <Link
                to="/cart"
                className="cart flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Carrito</span>
              </Link>
              <Link
                to="/history"
                className="history flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <History className="w-5 h-5" />
                <span>Histórico</span>
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-5 h-5" />
                <span>{isLoading ? "Cerrando sesión..." : "Cerrar sesión"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
