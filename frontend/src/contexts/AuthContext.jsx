import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const loginWithGoogle = async (credential) => {
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
      })
      const data = await res.json()
      if (res.ok) {
        setToken(data.data.access_token)
        setUser(data.data.user)
        localStorage.setItem("token", data.data.access_token)
        localStorage.setItem("user", JSON.stringify(data.data.user))
        return true
      } else {
        setError(data.message || "Error en login con Google")
        return false
      }
    } catch (err) {
      console.error(err)
      setError("Error de conexión con el servidor")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Enviamos el token actual en la cabecera Authorization
          "Authorization": `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (res.ok) {
        // Limpiar state y localStorage
        setToken(null)
        setUser(null)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        return true
      } else {
        setError(data.message || "Error al cerrar sesión")
        return false
      }
    } catch (err) {
      console.error(err)
      setError("Error de conexión con el servidor")
      return false
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <AuthContext.Provider value={{ user, token, isLoading, error, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
