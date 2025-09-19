import { useState } from "react"
import type { Product } from "../types/product"
import { ShoppingCart, Package, Plus, Minus, CheckCircle } from "lucide-react"

const notFoundImage =
  "https://www.webempresa.com/foro/wp-content/uploads/wpforo/attachments/3200/318277=80538-Sin_imagen_disponible.jpg"

export default function ProductCart({ product }: {  product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [showNotification, setShowNotification] = useState(false)
  

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }


  const handleAddToCart = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}` 
      },
      body: JSON.stringify({
        product_id: product.id,
        quantity: quantity,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error al agregar al carrito:", data);
      return;
    }

    console.log("Producto agregado:", data);

    // Mostrar notificación de éxito
    
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);

    setQuantity(1); // Reset quantity to 1 after adding to cart

  } catch (error) {
    console.error("Error en la petición:", error);
  }
};

  
  return (
    <div
      key={product.id}
      className="group bg-card border border-border rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
    >
      {showNotification && (
        <div className="absolute top-0 left-0 right-0 bg-green-500 text-white px-4 py-3 rounded-t-xl flex items-center gap-2 z-10 animate-in slide-in-from-top duration-300">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">
            ¡{product.name} agregado al carrito! Cantidad: {quantity}
          </span>
        </div>
      )}

      <div className="relative aspect-[1/1] overflow-hidden bg-muted">
        {product.image ? (
          <img
            src={product.image || notFoundImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Package className="w-16 h-16 text-muted-foreground" />
          </div>
        )}

        <div className="absolute top-3 right-3">
          {product.stock > 0 ? (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              En Stock
            </span>
          ) : (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Agotado
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{product.description}</p>
        </div>

        {product.stock > 0 && (
          <div className="flex items-center justify-center gap-3 py-2">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="text-lg font-semibold min-w-[2rem] text-center">{quantity}</span>

            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.stock}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">${product.price}</span>
            <span className="text-xs text-muted-foreground">{product.stock} disponibles</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock > 0 ? "Agregar" : "Agotado"}
          </button>
        </div>
      </div>
    </div>
  )
}
