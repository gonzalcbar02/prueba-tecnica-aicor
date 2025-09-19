import Header from "../components/Header"
import { useEffect, useState } from "react"
import type { Product } from "../types/product";
import ProductCart from "../components/productCart";


export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [, setLoading] = useState(true);

    useEffect(() => {
        const elements = document.querySelectorAll(".home");
        elements.forEach((el) => {
            const element = el as HTMLElement;
            element.style.setProperty("color", "blue", "important"); 
        });
    }, []);


    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/products"); 
            const data = await response.json();
            setProducts(data); 
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>
            < Header />

            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Lista de Productos</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product: Product) => (
                        <ProductCart 
                            key= {product.id}
                            product={product}
                         />
                    ))}
                </div>
            </div>


        </>
    )
}

