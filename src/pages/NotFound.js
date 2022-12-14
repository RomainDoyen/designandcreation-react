import React from 'react';
import { NavLink } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

const NotFound = () => {
    return (
        <div>
            <Header></Header>
            <div className="notFound">
                <div className="notFound-content">
                    <h2>Erreur 404</h2>
                    <NavLink to="/">Retour à l'accueil <i className='fas fa-home'></i></NavLink>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default NotFound;