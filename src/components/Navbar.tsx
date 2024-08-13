import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css';

export const Navbar: React.FC = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Inicio</Link>
                </li>
                <li>
                    <Link to="/libro">Gestión de Libros</Link>
                </li>
                <li>
                    <Link to="/autor">Gestión de Autores</Link>
                </li>
            </ul>
        </nav>
    );
}