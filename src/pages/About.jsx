import React, { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Data } from '../data/Data';

const About = () => {

    const [currentData] = useState(Data);

    return (
        <div>
            <Header></Header>
            <div className="article_view-container">
                <div className="article_view">
                    <h2 className="article_view-title">{currentData[0].title}</h2>
                    <h3 className="article_view-subtitle">{currentData[0].date}</h3>
                    <p id="message" className="article_view-content">{currentData[0].infos}</p>
                    <a id="link_cv" target="_blank" rel="noopener noreferrer" href="https://romaindoyen.vercel.app/"><p id="cv" className="link_cv">{currentData[0].link}</p></a>
                </div>
		    </div>
            <Footer></Footer>
        </div>
    );
};

export default About;