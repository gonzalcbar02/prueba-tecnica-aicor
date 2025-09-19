import Header from "../components/Header"
import { useEffect } from "react"

export default function Cart() {
    useEffect(() => {
        // Seleccionamos todos los elementos con la clase 'home'
        const elements = document.querySelectorAll(".cart");
        elements.forEach((el) => {
            const element = el as HTMLElement;
            element.style.setProperty("color", "blue", "important"); // Les ponemos color azul
        });
    }, []);
    return (
        <>
            < Header />
        </>
    )
}
