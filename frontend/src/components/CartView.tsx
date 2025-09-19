"use client"

import { useState } from "react"
import type { CartItem } from "../types/cart"
import { Plus, Minus, Trash } from "lucide-react"

const notFoundImage =
  "https://www.webempresa.com/foro/wp-content/uploads/wpforo/attachments/3200/318277=80538-Sin_imagen_disponible.jpg"

export function CartView({ item, onUpdate }: { item: CartItem; onUpdate: () => void }) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [loading, setLoading] = useState(false)

  const handleQuantityChange = async (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity < 1 || newQuantity > item.product.stock) return

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/cart/update/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })
      if (!response.ok) throw new Error("Error al actualizar cantidad")
      setQuantity(newQuantity)
      onUpdate() // refrescar resumen o lista del carrito
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/cart/remove/${item.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) throw new Error("Error al eliminar producto")
      onUpdate()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-card border border-border rounded-xl p-4 md:items-center shadow-sm">
      <div className="flex justify-center md:justify-start">
        <img
          src={item.product.image || notFoundImage}
          alt={item.product.name}
          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-base md:text-lg font-bold text-center md:text-left">{item.product.name}</h3>
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">Precio unitario: ${Number(item.unit_price).toFixed(2)   }</p>
          <p className="text-sm text-muted-foreground">Total: ${Number(item.total_price).toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-center md:justify-start gap-2 mt-3 md:mt-2">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1 || loading}
            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted disabled:opacity-50"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="px-2 font-medium">{quantity}</span>

          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= item.product.stock || loading}
            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={handleRemove}
            className="ml-2 md:ml-4 text-red-500 flex items-center gap-1 text-sm"
            disabled={loading}
          >
            <Trash className="w-4 h-4" />
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
