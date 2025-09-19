"use client"

import Header from "../components/Header"
import { CartView } from "../components/CartView.tsx"
import type { CartItem } from "../types/cart"
import { useEffect, useState } from "react"

export default function Cart() {
  const [carts, setCarts] = useState<CartItem[]>([])
  const [, setLoading] = useState(true)
  const [isClearing, setIsClearing] = useState(false)
  const token = localStorage.getItem("token")

  useEffect(() => {
    const elements = document.querySelectorAll(".cart")
    elements.forEach((el) => {
      const element = el as HTMLElement
      element.style.setProperty("color", "blue", "important") // Les ponemos color azul
    })
  }, [])

  const fetchCarts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/cart/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      const result = await response.json()

      setCarts(Array.isArray(result.data.cart_items) ? result.data.cart_items : [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    if (!token) {
      console.error("No token found")
      return
    }

    setIsClearing(true)
    try {
      const response = await fetch("http://localhost:8000/api/cart/clear", {
        method: "DELETE", // or POST depending on your backend route
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (result.status === "success") {
        // Clear the local state immediately
        setCarts([])
        console.log(`Successfully cleared ${result.data.deleted_items_count} items from cart`)
      } else {
        console.error("Failed to clear cart:", result.message)
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
    } finally {
      setIsClearing(false)
    }
  }

  useEffect(() => {
    fetchCarts()
  }, [])

  return (
    <>
      <Header />

      <div className="container mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Carrito</h1>
          {carts.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full sm:w-auto">
              <button className="bg-green-500 hover:bg-green-600 text-white border rounded-lg p-3 sm:p-2 text-sm sm:text-base font-medium transition-colors">
                Comprar
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white border rounded-lg p-3 sm:p-2 text-sm sm:text-base font-medium transition-colors disabled:opacity-50"
                onClick={clearCart}
                disabled={isClearing}
              >
                {isClearing ? "Vaciando..." : "Vaciar Carrito"}
              </button>
            </div>
          )}
        </div>

        {carts.length === 0 ? (
          <div className="text-center py-12 sm:py-8">
            <p className="text-muted-foreground text-base sm:text-lg">Tu carrito está vacío</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {carts.map((cart: CartItem) => (
              <CartView key={cart.id} item={cart} onUpdate={fetchCarts} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
