import Header from "../components/Header"
import { useEffect } from "react"


export default function History() {
    useEffect(() => {
        // Seleccionamos todos los elementos con la clase 'home'
        const elements = document.querySelectorAll(".history");
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
