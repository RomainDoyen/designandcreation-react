import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
        <div className="header_navbar--menu">
            <NavLink to="/" className="header_navbar--menu-link active">
                <li><i className="fas fa-home"></i>&nbsp;Accueil</li>
            </NavLink>
            <NavLink to="/about" className="header_navbar--menu-link active">
                <li><i className="fas fa-newspaper"></i>&nbsp;A propos</li>
            </NavLink>
            <NavLink to="/contact" className="header_navbar--menu-link active">
                <li><i className="fas fa-phone"></i>&nbsp;Contact</li>
            </NavLink>
        </div>
    );
};

export default Navigation;