import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';

const Header = () => {
	const { pathname } = useLocation();

	const [isActive, setActive] = useState(false);

	const toggleClass = (e) => {
		e.preventDefault();
		setActive(!isActive);
	};

	const title = [
		"A propos",
		"Mon portfolio de dessins",
		"Me contacter",
		"Mon portfolio de logo"
	];

	const handleContextMenu = (event) => {
		event.preventDefault(); // Empêche l'affichage du menu contextuel
	};

    return (
        <div className='header header_article'>
			{
				pathname === '/' ? <div className="header_texture header_article"></div> : '' ||
				pathname === '/about' ? <div className="header_texture4 header_article"></div> : '' ||
				pathname === '/contact' ? <div className="header_texture3 header_article"></div> : '' ||
				pathname === '/draw' ? <div className="header_texture2 header_article"></div> : '' ||
				pathname === '/logo' ? <div className="header_texture3 header_article"></div> : ''
			}
			<div className="header_mask">
				<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
					<path d="M0 100 L 0 0 C 25 100 75 100 100 0 L 100 100" fill="#333"></path>
				</svg>
			</div>
			<div className="container">
				<div className={isActive ? "header_navbar is-open" : "header_navbar"} onClick={toggleClass}>
					<div className="header_navbar--logo">
						<img src="./assets/images/profile1.png" className="header_navbar--logo-profile" width="45" alt='logo' onContextMenu={handleContextMenu}/><h1 className="header_navbar--logo-title">Design And Creation</h1>
					</div>
                    <Navigation></Navigation>
					<div className="header_navbar--toggle">
						<span className="header_navbar--toggle-icons"></span>
					</div>
				</div>
				<div className="header_slogan">
					{
						pathname === '/about' ? <h1 className="header_slogan--title">{title[0]}</h1> : '' ||
						pathname === '/contact' ? <h1 className="header_slogan--title">{title[2]}</h1> : '' || 
						pathname === '/draw' ? <h1 className="header_slogan--title">{title[1]}</h1> : '' ||
						pathname === '/logo' ? <h1 className="header_slogan--title">{title[3]}</h1> : ''
					}
				</div>
			</div>
        </div>
    );
};

export default Header;