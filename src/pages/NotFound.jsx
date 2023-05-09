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
                    <NavLink to="/">Retour à l'accueil <i className='fas fa-home'></i></NavLink>
                    <img src='./assets/images/404-error.png' alt='Page non trouvée'></img>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default NotFound;